/**
 * data preprocessing 
 * 
 * MADRID TREE PROJECT
 * 
 */

window.ixmaps = window.ixmaps || {};

(function() {
	
	
	/**
	 * __cleanData - remove double entries with same SERIALNUM
	 * @param {Object} data the data table object to clean
	 * @param {Object} JSON options object given by caller
	 * @return {Object} cleaned data object
	 * @private
	 */
	
    var __cleanData = function(data,options) { 

		// detect double serial number
		
		var sernum = [];
		data.addColumn({
			source: "SERIALNUM",
			destination: "double"
		}, function (value) {
			if ( value == "" ){
				return 0;
			}
			if (sernum[String(value)]){
				return 1;
			}
			sernum[String(value)] = 1;
			return 0;
		});

		// clean data by removing double sernum, far to big PERIMETRO and DIAMETRO_COPA
		
		data = data.select('WHERE "double" <= "0"');
		data = data.select('WHERE "PERIMETRO" < "5"');
		data = data.select('WHERE "DIAMETRO_COPA" < "50"');
		
		data.column("double").remove();

		return data;
     };   

	/**
	 * __enrichData - create new columns on base of present data
	 *
	 * @param {Object} data the data table object to clean
	 * @param {Object} JSON options object given by caller
	 * @return {Object} enriched data object
	 * @private
	 */
	
    var __enrichData = function(data,options) { 

		var index_nombre = data.column("NOMBRE_COMUN").index;
		var index_altura = data.column("ALTURA").index;
		var index_perimetro = data.column("PERIMETRO").index;
		var index_copa = data.column("DIAMETRO_COPA").index;

		data.addColumn({
			destination: "classe"
		}, function (row) {
			if ( row[index_nombre].match(/Pino/i) ){
				return "conifere";
			}
			if ( row[index_nombre].match(/Ciprés/i) ){
				return "conifere";
			}
			if ( row[index_nombre].match(/Cedro/i) ){
				return "conifere";
			}
			return "latifoglie";
		});
		var index_classe = data.column("classe").index;

		data.addColumn({
			destination: "allergenico"
		}, function (row) {
			if ( row[index_nombre].match(/Plátano/i) ){
				return true;
			}
			if ( row[index_nombre].match(/Fresno/i) ){
				return true;
			}
			if ( row[index_nombre].match(/Abedul/i) ){
				return true;
			}
			if ( row[index_nombre].match(/Ciprés/i) ){
				return true;
			}
			if ( row[index_nombre].match(/Arizónica/i) ){
				return true;
			}
			if ( row[index_nombre].match(/Encina /i) ){
				return true;
			}
			if ( row[index_nombre].match(/OLivo /i) ){
				return true;
			}
			return false;
		});
		
		data.addColumn({
			destination: "crown"
		}, function (row) {
			return Number(row[index_copa]) * Number(row[index_copa]);
		});
		
		var p;	
		data.addColumn({
			destination: "weight (estimated)"
		}, function (row) {
			if ( row[index_nombre].match(/Pino/i) ){
				p = Math.exp(-2.5356+2.4349*Math.log(Number(row[index_perimetro])*100 / Math.PI));
			}else
			if ( row[index_classe] == "conifere" ){
				p = Math.exp(-2.0336+2.2592*Math.log(Number(row[index_perimetro])*100 / Math.PI));
			}else{
				p = Math.exp(-2.4800+2.4835*Math.log(Number(row[index_perimetro])*100 / Math.PI));
			}
 			return (p*1.2*0.725).toFixed(2);
		});
		
		// use mean growth factor 4.5 
		// from most relevant species: Olmo:4, Platano: 4, Alce:5, Pino: 5
		data.addColumn({
			destination: "age (estimated)"
		}, function (row) {
			var d = Number(row[index_perimetro]) / Math.PI * 39.3701;
 			return (d*4.5).toFixed(2);
		});
		
		data.addColumn({
			source: "weight (estimated)",
			destination: "CO2 (estimated)"
		}, function (value) {
 			return (value*0.5*3.6663).toFixed(2);
		});
		
		var index_co2  = data.column("CO2 (estimated)").index;
		var index_age = data.column("age (estimated)").index;
		
		data.addColumn({
			destination: "CO2/year (estimated)"
		}, function (row) {
			return (Number(row[index_co2]) / (Number(row[index_age])||1)).toFixed(2);
		});

		/**
		data.addColumn({
			destination: "weight"
		}, function (row) {
			var d = Number(row[index_perimetro]) / Math.PI * 39.3701;
			var h = Number(row[index_altura]) * 3.28084;
			var p =  (d<11?0.25:0.15) * d*d * h;

 			return (p*0.453592*1.2*0.725).toFixed(2);
		});
		**/
		
		return data;
     };   

	__theme = null;
	
	/**
	 * __boundData - create a coordinate bound filter in actual theme
	 *               clip the theme data to the actual map bounds
	 *
	 * @param {Object} data the data table object to clean
	 * @param {Object} JSON options object given by caller
	 * @return {Object} data object
	 * @private
	 */

	var __boundData = function(data,options) { 
		
		return data;
		
		// create bounding filter to fasten aggregating and rendering
		var bounds = ixmaps.getBoundingBox();
		var zoom = ixmaps.getZoom();
		
		var szFilter = "WHERE \"x\" BETWEEN "+bounds[0].lng+" AND "+bounds[1].lng+" AND \"y\" BETWEEN "+bounds[0].lat+" AND "+bounds[1].lat;
		
		if( options.theme.szFilter && options.theme.szFilter.length ){
			var filterPartsA = __getFilterPartsA(options.theme.szFilter);
			for ( var i = 2; i<filterPartsA.length; i++ ){
				szFilter += " AND " + filterPartsA[i];
			}
		}
		
		if ( zoom > 15 ){	
			options.theme.szFilter = szFilter;
		}
		
		__theme = options.theme;
		
		return data;
     };   

	
    ixmaps.MADRID_TREES_RAW = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};

    ixmaps.MADRID_TREES_CLEAN = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata = __cleanData(mydata,options);
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};

    ixmaps.MADRID_TREES_CLEAN_ENRICHED = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata = __cleanData(mydata,options);
			mydata = __enrichData(mydata,options);
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};
	
    ixmaps.MADRID_TREES_CLEAN_ENRICHED_BOUNDED = function (theme,options) {
		
		var szUrlA = ixmaps.szUrlA || [
			"https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid_distrito/trees_madrid_distrito_01.csv.gz"
		];
		
		if (ixmaps.parentApi.parentApi.tempValue){
			var szUrlA = ["https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid_barrios/trees_madrid_barrio_"+ixmaps.parentApi.parentApi.tempValue+".csv.gz"];
		}

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker();
		
		for ( i in szUrlA ){
			broker.addSource(szUrlA[i], "csv");
		}
		
		broker.realize(	function (dataA) {
				
			var mydata = dataA[0];
			for ( var i=1; i<dataA.length; i++){
				mydata.append(dataA[i]);
			}
			
			var lastDate = new Date();
			var x = null;
			
			mydata = __cleanData(mydata,options);
			
			x = new Date();
			console.log("clean: "+(x-lastDate));
			lastDate = x;
			
			mydata = __enrichData(mydata,options);
			
			x = new Date();
			console.log("enrich: "+(x-lastDate));
			lastDate = x;
			
			mydata = __boundData(mydata,options);
			
			
			x = new Date();
			console.log("bounds: "+(x-lastDate));
			lastDate = x;
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});
		});
	};

    ixmaps.MADRID_TREES_CLEAN_ENRICHED_BARRIOS = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var lastDate = new Date();
			var x = null;
			
			mydata = __cleanData(mydata,options);
			
			x = new Date();
			console.log("clean: "+(x-lastDate));
			lastDate = x;
			
			mydata = __enrichData(mydata,options);
			
			x = new Date();
			console.log("enrich: "+(x-lastDate));
			lastDate = x;
			
			mydata = __boundData(mydata,options);
			
			
			x = new Date();
			console.log("bounds: "+(x-lastDate));
			lastDate = x;
			
			console.log(mydata);
			mydata = mydata.aggregate("weight","MINTBARRIO|NOMBRE_BARRIO");
			console.log(mydata);
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};

	
	// -----------------------------------------------------------------------------------------------               
	// -----------------------------------------------------------------------------------------------               
	// user defined color schemes
	// ----------------------------------------------------------------------------------------------- 
	// ----------------------------------------------------------------------------------------------- 
	
	ixmaps.htmlgui_colorScheme = function(objTheme){
		if ( objTheme.colorScheme == "user" ){
			for ( i=0; i<objTheme.szLabelA.length; i++){
				if ( objTheme.szLabelA[i].match(/Plátano/i) ){
					objTheme.colorScheme[i] = "rgb(74, 170, 44)";
				}else
				if ( objTheme.szLabelA[i].match(/Amor/i) ){
					objTheme.colorScheme[i] = "rgb(202, 0, 60)";
				}else
				if ( objTheme.szLabelA[i].match(/Acacia del Japón/i) ){
					objTheme.colorScheme[i] = "rgb(108, 192, 147)";
				}else
				if ( objTheme.szLabelA[i].match(/Acacia/i) ){
					objTheme.colorScheme[i] = "rgb(198, 206, 9)";
				}else
				if ( objTheme.szLabelA[i].match(/Olmo/i) ){
					objTheme.colorScheme[i] = "rgb(0, 128, 95)";
				}else
				if ( objTheme.szLabelA[i].match(/Pino/i) ){
					objTheme.colorScheme[i] = "rgb(150, 165, 108)";
				}else
				if ( objTheme.szLabelA[i].match(/Aligustre/i) ){
					objTheme.colorScheme[i] = "rgb(152, 100, 112)";
				}else
				if ( objTheme.szLabelA[i].match(/Ciruelo/i) ){
					objTheme.colorScheme[i] = "rgb(180, 45, 111)";
				}else
				if ( objTheme.szLabelA[i].match(/Falsa acacia/i) ){
					objTheme.colorScheme[i] = "rgb(139, 124, 21)";
				}else
				if ( objTheme.szLabelA[i].match(/Almez/i) ){
					objTheme.colorScheme[i] = "rgb(44, 66, 0)";
				}else
				if ( objTheme.szLabelA[i].match(/Castaño/i) ){
					objTheme.colorScheme[i] = "rgb(20, 100, 41)";
				}else
				if ( objTheme.szLabelA[i].match(/Cedro del Atlas/i) ){
					objTheme.colorScheme[i] = "rgb(135, 153, 167)";
				}else
				if ( objTheme.szLabelA[i].match(/Cedro/i) ){
					objTheme.colorScheme[i] = "rgb(121, 80, 34)";
				}else
				if ( objTheme.szLabelA[i].match(/Arce/i) ){
					objTheme.colorScheme[i] = "rgb(244, 165, 0)";
				}else
				if ( objTheme.szLabelA[i].match(/Ciprés/i) ){
					objTheme.colorScheme[i] = "rgb(71, 101, 24)";
				}else
				if ( objTheme.szLabelA[i].match(/Aligustre/i) ){
					objTheme.colorScheme[i] = "rgb(213, 208, 229)";
				}else
				if ( objTheme.szLabelA[i].match(/Aligustre/i) ){
					objTheme.colorScheme[i] = "rgb(213, 208, 229)";
				}else{
					console.log(objTheme.szLabelA[i]);
					var rr = Math.floor(Math.random()*255);
					var bb = Math.floor(Math.random()*155);
					var gg = 200;
					objTheme.colorScheme[i] = "RGB("+rr+","+gg+","+bb+")";
				}
			}
		}else
		if ( objTheme.colorScheme == "user_allergenici" ){
			for ( i=0; i<objTheme.szLabelA.length; i++){
				if ( objTheme.szLabelA[i].match(/Plátano/i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/Fresno/i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/Abedul/i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/Ciprés/i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/Arizónica/i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/Encina /i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else
				if ( objTheme.szLabelA[i].match(/OLivo /i) ){
					objTheme.colorScheme[i] = "rgb(255,255,0)";
				}else{
					objTheme.colorScheme[i] = "RGB(0,128,0)";
				}
			}
		}
	};
	
	// -----------------------------------------------
	// -----------------------------------------------
	// check barrios on zoom and pan
	// to see if we need new tree data
	// if yes, refresh trees theme
	// -----------------------------------------------
	// -----------------------------------------------
	
	var last_tree_dataA = null;
	var maxBarrios = 10;
	/**
	 * intercept selection done to get the barrios actually visibile 
 	 * @parameter szId id of the selection 
	 * @type void
	 */	
	var old_onSelection = ixmaps.htmlgui_onSelection;
	ixmaps.htmlgui_onSelection = function(szId){ 
		
		var selection = ixmaps.getThemeObj(szId);
		var szUrlA = [];
		
		if ( selection.szTitle != "get_visible_barrios" ){
			return old_onSelection(szId);
		}
		// get the selected barrios, make tree source file from barrios id (example "barrio::11")
		for ( i in selection.itemA ){
			var no = i.split("::")[1];
			no = ((no.length == 1) ? "0":"") + no;
			var file = "trees_madrid_barrio_" + no + ".csv.gz";
			szUrlA.push(
				"//s3.eu-west-1.amazonaws.com/data.ixmaps.com/Madrid/trees_madrid_barrios/"+file);
		}
		// free the selection
		ixmaps.removeTheme(szId);
		
		// if we have already data loaded by previous call
		// check if new data is needed
		
		if ( last_tree_dataA ){
			// test if data request changed 
			var fReload = false;
			for ( i in szUrlA ){
				var fFound = false;
				for ( ii in last_tree_dataA ){
					if ( szUrlA[i] == last_tree_dataA[ii] ){
						fFound = true;
					}
				}
				if ( !fFound ){
					fReload = true;
				}
			}
			// if not, do nothing
			if ( !fReload ){
				return true;
			}
		}
		if ( szUrlA && szUrlA.length ){
			last_tree_dataA = szUrlA.slice();
		}
		
		// ok, we need to load more data 
		// store the url array and refresh the 'trees' theme 
		// the theme will then call the tree data provider to load the new data
		
		ixmaps.szUrlA = szUrlA;
		if (ixmaps.szUrlA.length && ixmaps.szUrlA.length < 15){
			ixmaps.setTitle("");
			ixmaps.refreshTheme("trees");
		}else{
			ixmaps.setTitle("<span style='font-family:arial;color:#666;background:rgba(255,255,255,0.7);padding:0.5em;border:solid #888 1px;border-radius:0.2em'>for tree level, please zoom in</span>");
			setTimeout('ixmaps.setTitle("")',4000);
			last_tree_dataA = null;
		}
		
		return true;
		
	}
	
	/**
	 * check if theme is to refresh by doing a selection of barrios by actual map bounds
	 * @type void
	 */	
	ixmaps.checkRefreshTheme = function(){
		
		var themeObj = ixmaps.getThemeObj("trees");
		if (themeObj.fVisible){
			ixmaps.newSelection("barrios","mapbounds","type:square","get_visible_barrios");
		}
	}

	/**
	 * intercept zoom and pan to check barrios visibility and trigger tree data loading 
 	 * @parameter nZoom 
	 * @type void
	 */	
	var old_onZoomAndPan = ixmaps.htmlgui_onZoomAndPan;
	ixmaps.htmlgui_onZoomAndPan = function(nZoom){
		
		if (old_onZoomAndPan){
			old_onZoomAndPan(nZoom);
		}
		
		setTimeout("ixmaps.checkRefreshTheme()",1000); 
	};


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
