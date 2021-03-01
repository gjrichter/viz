/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from GitHub
 * map area to NUTS
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.VACCINI_SOMMINISTRAZIONI_LAST = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.sort('data_somministrazione');

			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			mydata.condense('area',{keep:"area"});
			
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
	
    ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE = function (theme,options,valueColumnName) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.sort('data_somministrazione');

			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			var pivot = mydata.pivot(
				{lead:"codice_NUTS2",
				 keep:"nome_area",
				 columns:"data_somministrazione",
				 value:valueColumnName}
			);
			
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			// make curve xaxis 
			var xAxis = [];
			for ( i in columns ){
				xAxis.push(" ");
			}
			xAxis[columns.length-1]=columns[columns.length-1];
			xAxis[0]=columns[0];
			options.theme.szXaxisA = xAxis; 
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.VACCINI_SOMMINISTRAZIONI_OSS_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"categoria_operatori_sanitari_sociosanitari");
	};

    ixmaps.VACCINI_SOMMINISTRAZIONI_PNS_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"categoria_personale_non_sanitario");
	};

    ixmaps.VACCINI_SOMMINISTRAZIONI_RSA_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"categoria_ospiti_rsa");
	};
	
    ixmaps.VACCINI_SOMMINISTRAZIONI_O80_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"categoria_over80");
	};
	
    ixmaps.VACCINI_SOMMINISTRAZIONI_FIRST_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"prima_dose");
	};

    ixmaps.VACCINI_SOMMINISTRAZIONI_SECOND_SEQUENCE = function (theme,options) {
		return ixmaps.VACCINI_SOMMINISTRAZIONI_XXX_SEQUENCE(theme,options,"seconda_dose");
	};
	
	
	ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_LAST = function (theme,options,column) {
		
		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var mydata = dataA[0];
				
			mydata.sort('data_somministrazione');

			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			mydata.condense('area',{keep:"area"});
			
			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Emilia-Romagna") {
					return "Emilia Romagna";
				} 
				return value;
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			var iName  = mydata.column("nome_area").index;
			var iValue = mydata.column("prima_dose").index;
			mydata.addColumn({destination:"prima_dose_pop"},function(row){
				return (Number(row[iValue]) / pop[row[iName].replace(/\-/," ")]*100).toFixed(2);	
			});

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		});
	};
	
	ixmaps.VACCINI_FIRST_PERCENTUALI_POPOLAZIONE_LAST = function(theme,options) {
		return ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_LAST(theme,options,"prima_dose_pop");
	};
	
	ixmaps.VACCINI_SECOND_PERCENTUALI_POPOLAZIONE_LAST = function(theme,options) {
		return ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_LAST(theme,options,"seconda_dose_pop");
	};	

    var __mean_3 = function(table) { 
		
		// make mean of 3 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=4; c--){
				records[r][c] = ((Number(records[r][c])+Number(records[r][c-1])+Number(records[r][c-2]))/3).toFixed(2);
			}
		}
		return table;
     }; 

	 ixmaps.VACCINI_COLUMNS_SEQUENCE = function (theme, options, columns, flag) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			data.sort('data_somministrazione');

			var dateA = data.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
				
			var cat = [];
			for ( var i in columns ){	
				cat.push(columns[i]);
			}

			var nCat = cat.length;
			var pivot = [];	
			for ( i=0; i<nCat; i++ ){	
				pivot[i] = data.pivot(
					{lead:"codice_NUTS2",
					 keep:"nome_area",
					 columns:"data_somministrazione",
					 value:cat[i]}
				);
				pivot[i].column("Total").remove();
				if ( flag && flag.match(/mean3/) ){
					pivot[i] = __mean_3(pivot[i]);
				}
			}
				
			var columnsA = pivot[0].columnNames();

			var merger = new Data.Merger();
			for ( i=0; i<nCat; i++ ){	
				merger.addSource(pivot[i], {
					lookup: "codice_NUTS2",
					columns: columnsA	
				});
			}
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					for ( var x=1; x<=nCat; x++){
						fieldsA.push(columnsA[i]+"."+x);
					}
				}

				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = nCat;

				options.theme.szItemField = "codice_NUTS2.1";
				options.theme.szSelectionField = "codice_NUTS2.1";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dte = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dte.toLocaleDateString());
				var dte = new Date(columnsA[0]);
				xAxis[0]=(dte.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(dbTable, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	

	
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_SEQUENCE = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80"]);
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80",
															    "categoria_forze_armate",
															    "categoria_personale_scolastico"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_SEQUENCE_REVERS = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari"]);
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["categoria_personale_scolastico",
																"categoria_forze_armate",
																"categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari"],"mean3");
	};

	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_SEQUENCE = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["prima_dose","seconda_dose"], "");
	};
		
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["prima_dose","seconda_dose"], "mean3");
	};
		
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_SEQUENCE_REVERS = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["seconda_dose","prima_dose"], "");
	};
		
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_COLUMNS_SEQUENCE(theme, options, ["seconda_dose","prima_dose"], "mean3");
	};

	
    ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_CLIP = function (theme,options,valueColumnName) {
		
		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
			valueColumnName = valueColumnName || "prima_dose";
			var mydata = dataA[0];
			mydata.sort('data_somministrazione');

			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");

			var pivot = mydata.pivot(
				{lead:"codice_NUTS2",
				 keep:"nome_area",
				 columns:"data_somministrazione",
				 value:valueColumnName}
			);

			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Emilia-Romagna") {
					return "Emilia Romagna";
				} 
				return value;
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			pivot.column("Total").remove();
			var indexName = pivot.column("nome_area").index;

			var records = pivot.records;
			var sumA = [];
			for ( var r=0; r<records.length; r++ ){
				sumA[r] = 0;
			}
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length; c++ ){
					sumA[r] += Number(records[r][c]);
					records[r][c] = (sumA[r] / pop[records[r][indexName].replace(/\-/," ")]*100).toFixed(6);
				}
			}

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();

			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();

			// and set the label (for difference 1 less)
			theme.szLabelA = columns.slice();

			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();

			theme.szXaxisA = columns.slice();

			theme.nClipFrames = columns.length;

			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
	
	
		
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
