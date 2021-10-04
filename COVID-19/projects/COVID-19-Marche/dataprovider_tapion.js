/**
 * data provider for COVID-19 Marche Map
 * loads data from various sources
  * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	var __formatDatePartString = function(date){
		date = String(date);
		while ( date.length < 2 ){
			date = "0"+date;
		}
		return date;
	};

	ixmaps.COVID_MARCHE_POSITIVI_LATEST = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read json from https://contagi-marche.tapion.it/contagi_marche.json 
		// see GitHub: https://github.com/tapionx/contagi-marche.tapion.it
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {

			var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
			$.get(szUrl,
				function(data){

				var dbtable = {fields:[],records:[],table:{}};

				dbtable.fields.push({id:"Comune"});  
				dbtable.fields.push({id:"data"});  
				dbtable.fields.push({id:"positivi"});  
				dbtable.fields.push({id:"quarantena"}); 

				for ( i in data ){
					for ( ii in data[i] ){
						var row = [];
						row.push(i);
						for ( iii in data[i][ii] ){
							row.push(data[i][ii][iii]);
						}
						dbtable.records.push(row);
					}
				}

				// process data
				// ============

				dbtable = new Data.Table(dbtable);

				var mydata = dbtable.pivot({ 
					lead:"Comune",
					columns:"data",
					value:"positivi"});
				// remove Total from pivot
				mydata.column("Total").remove();

				theme.szFields = mydata.columnNames().pop();
				
				// -----------------------------------------------------------------------------------------------             
				// -----------------------------------------------------------------------------------------------             
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_CLIP_28 = function (theme,options,szFlag) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read json from https://contagi-marche.tapion.it/contagi_marche.json 
		// see GitHub: https://github.com/tapionx/contagi-marche.tapion.it
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {

			var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
			$.get(szUrl,
				function(data){

				var dbtable = {fields:[],records:[],table:{}};

				dbtable.fields.push({id:"Comune"});  
				dbtable.fields.push({id:"data"});  
				dbtable.fields.push({id:"positivi"});  
				dbtable.fields.push({id:"quarantena"}); 

				for ( i in data ){
					for ( ii in data[i] ){
						var row = [];
						row.push(i);
						for ( iii in data[i][ii] ){
							row.push(data[i][ii][iii]);
						}
						dbtable.records.push(row);
					}
				}

				console.log(dbtable);

				// process data
				// ============

				dbtable = new Data.Table(dbtable);

				var mydata = dbtable.pivot({ 
					lead:"Comune",
					columns:"data",
					value:"positivi"});
				// remove Total from pivot
				mydata.column("Total").remove();

				var lastColumn = mydata.columnNames().length - 1;
				
				if ( szFlag && szFlag.match(/prevalenza/) ){
					var dataPop = dataA[0];	
					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Totale","Denominazione");

					var records = mydata.records;
						for ( var r=0; r<records.length; r++ ){
						for ( var c=lastColumn; c>=2; c-- ){
							records[r][c] = (Number(records[r][c])/popA[(records[r][0])]*100000).toFixed(2);
						}
					}
				}

				//  rolling mean of 7 days
				var records = mydata.records;
				for (var r=0; r<records.length;r++){
					for (var c=lastColumn; c>=8; c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6]))/7;
					}
				}
				
				if ( szFlag && szFlag.match(/differenza/) ){
					for (var r=0; r<records.length;r++){
						for (var c=lastColumn; c>=2; c--){
							records[r][c] = (Number(records[r][c])-Number(records[r][c-1]));
						}
					}
				}
				
				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				// get the columns with date 
				columns = mydata.columnNames();

				columns.shift();
				columns.shift();

				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				
				
				
				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label
				theme.szLabelA = columns.slice();

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					szXaxisA.push(columns[i]);
				}
				theme.szXaxisA = szXaxisA;

				theme.nClipFrames = columns.length;

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	ixmaps.COVID_MARCHE_POSITIVI_PREVALENZA_CLIP_28 = function (theme,options) {
		ixmaps.COVID_MARCHE_POSITIVI_CLIP_28(theme,options,"prevalenza");
	}
	ixmaps.COVID_MARCHE_POSITIVI_PREVALENZA_CLIP_28_DIFF = function (theme,options) {
		ixmaps.COVID_MARCHE_POSITIVI_CLIP_28(theme,options,"differenza");
	}
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_SEQUENCE_28 = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read json from https://contagi-marche.tapion.it/contagi_marche.json 
		// see GitHub: https://github.com/tapionx/contagi-marche.tapion.it
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {

			var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
			$.get(szUrl,
				function(data){

				var dbtable = {fields:[],records:[],table:{}};

				dbtable.fields.push({id:"Comune"});  
				dbtable.fields.push({id:"data"});  
				dbtable.fields.push({id:"positivi"});  
				dbtable.fields.push({id:"quarantena"}); 

				for ( i in data ){
					for ( ii in data[i] ){
						var row = [];
						row.push(i);
						for ( iii in data[i][ii] ){
							row.push(data[i][ii][iii]);
						}
						dbtable.records.push(row);
					}
				}

				console.log(dbtable);

				// process data
				// ============

				dbtable = new Data.Table(dbtable);

				var mydata = dbtable.pivot({ 
					lead:"Comune",
					columns:"data",
					value:"positivi"});
				// remove Total from pivot
				mydata.column("Total").remove();

				var dataPop = dataA[0];	
				// make lookupArray: COD_PROV ==> population
				var popA = dataPop.lookupArray("Totale","Denominazione");

				var records = mydata.records;
				var lastColumn = mydata.columnNames().length - 1;
				for ( var r=0; r<records.length; r++ ){
					for ( var c=lastColumn; c>=2; c-- ){
						records[r][c] = (Number(records[r][c])/popA[(records[r][0])]*100000).toFixed(2);
					}
				}

				// -----------------------------------------------------------------------------------------------             
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				// get the columns with date 
				columns = mydata.columnNames();
				columns.shift();
				columns.shift();


				columns = columns.slice(-28)	
				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label
				theme.szLabelA = columns.slice();

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];

				var szXaxisA = [];
				for ( var i =0; i<=last; i++ ){
					szXaxisA.push(" ");
				}
				szXaxisA[0] = columns[0];
				szXaxisA[last] = columns[last];
				theme.szXaxisA = szXaxisA;

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_PREVALENCE = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read json from https://contagi-marche.tapion.it/contagi_marche.json 
		// see GitHub: https://github.com/tapionx/contagi-marche.tapion.it
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {

			var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
			$.get(szUrl,
				function(data){

				var dbtable = {fields:[],records:[],table:{}};

				dbtable.fields.push({id:"Comune"});  
				dbtable.fields.push({id:"data"});  
				dbtable.fields.push({id:"positivi"});  
				dbtable.fields.push({id:"quarantena"}); 

				for ( i in data ){
					for ( ii in data[i] ){
						var row = [];
						row.push(i);
						for ( iii in data[i][ii] ){
							row.push(data[i][ii][iii]);
						}
						dbtable.records.push(row);
					}
				}

				console.log(dbtable);

				// process data
				// ============

				dbtable = new Data.Table(dbtable);

				var mydata = dbtable.pivot({ 
					lead:"Comune",
					columns:"data",
					value:"positivi"});
				// remove Total from pivot
				mydata.column("Total").remove();

				var dataPop = dataA[0];	
				// make lookupArray: COD_PROV ==> population
				var popA = dataPop.lookupArray("Totale","Denominazione");

				var records = mydata.records;
				var lastColumn = mydata.columnNames().length - 1;
				for ( var r=0; r<records.length; r++ ){
					for ( var c=lastColumn; c>=2; c-- ){
						records[r][c] = (Number(records[r][c])/popA[(records[r][0])]*100000).toFixed(2);
					}
				}
				
				theme.szFields = mydata.columnNames().pop();
				
			// -----------------------------------------------------------------------------------------------             
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_PREVALENCE_MEAN_7 = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read json from https://contagi-marche.tapion.it/contagi_marche.json 
		// see GitHub: https://github.com/tapionx/contagi-marche.tapion.it
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {

			var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
			$.get(szUrl,
				function(data){

				var dbtable = {fields:[],records:[],table:{}};

				dbtable.fields.push({id:"Comune"});  
				dbtable.fields.push({id:"data"});  
				dbtable.fields.push({id:"positivi"});  
				dbtable.fields.push({id:"quarantena"}); 

				for ( i in data ){
					for ( ii in data[i] ){
						var row = [];
						row.push(i);
						for ( iii in data[i][ii] ){
							row.push(data[i][ii][iii]);
						}
						dbtable.records.push(row);
					}
				}

				console.log(dbtable);

				// process data
				// ============

				dbtable = new Data.Table(dbtable);

				var mydata = dbtable.pivot({ 
					lead:"Comune",
					columns:"data",
					value:"positivi"});
				// remove Total from pivot
				mydata.column("Total").remove();

				var dataPop = dataA[0];	
				// make lookupArray: COD_PROV ==> population
				var popA = dataPop.lookupArray("Totale","Denominazione");

				var records = mydata.records;
				var lastColumn = mydata.columnNames().length - 1;
				for ( var r=0; r<records.length; r++ ){
					for ( var c=lastColumn; c>=2; c-- ){
						records[r][c] = (Number(records[r][c])/popA[(records[r][0])]*100000).toFixed(2);
					}
				}
				
				//  rolling mean of 7 days
				for (var r=0; r<records.length;r++){
					for (var c=lastColumn; c>=8; c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6]))/7;
					}
				}
				
				theme.szFields = mydata.columnNames().pop();
				
			// -----------------------------------------------------------------------------------------------             
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_BEFORE_PREVALENCE = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// get actual Date
		// ----------------------------------------------------------------------------------------------- 
		var date = new Date();
		var u = date.getTime();
		u -= (1000*60*60*24);
		date = new Date(u);
		var szDate = __formatDatePartString(date.getDate()) + "%2F" +
					 __formatDatePartString(date.getMonth()+1) + "%2F" +
			         __formatDatePartString(date.getFullYear());
		
		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://api.allorigins.win/raw?url=https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate+"&_=1615072154587";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "json")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
				
			var mydata = dataA[0];	
			var dataPop = dataA[1];	
			// make lookupArray: COD_PROV ==> population
			var popA = dataPop.lookupArray("Totale","Denominazione");
				
			mydata.column("3").map(function(value){
				if ( value == "Inferiori a 5" ){
					return 3;
				}else{
					return value;
				}
			});	
				
			var records = mydata.records;
			for ( var r=0; r<records.length; r++ ){
				if (popA[records[r][0]] >= 500){
					records[r][3] = (records[r][3]/popA[records[r][0]]*100000).toFixed(2);
				}else{
					records[r][3] = null;
				}
			}
				
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_DIFF = function (theme,options) {

		var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
		$.get(szUrl,
			function(data){

			var dbtable = {fields:[],records:[],table:{}};

			dbtable.fields.push({id:"Comune"});  
			dbtable.fields.push({id:"data"});  
			dbtable.fields.push({id:"positivi"});  
			dbtable.fields.push({id:"quarantena"}); 

			for ( i in data ){
				for ( ii in data[i] ){
					var row = [];
					row.push(i);
					for ( iii in data[i][ii] ){
						row.push(data[i][ii][iii]);
					}
					dbtable.records.push(row);
				}
			}

			console.log(dbtable);

			// process data
			// ============

			dbtable = new Data.Table(dbtable);

			var mydata = dbtable.pivot({ 
				lead:"Comune",
				columns:"data",
				value:"positivi"});
			// remove Total from pivot
			mydata.column("Total").remove();

			var columns = mydata.columnNames();
			theme.szFields = columns[columns.length-1];
			theme.szField100 = columns[columns.length-2];
			
			ixmaps.setTitle("<span class='btn-lg btn-default'>aggiornato al "+theme.szFields+"</span>");

			// -----------------------------------------------------------------------------------------------             
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_DIFF_7 = function (theme,options) {

		var szUrl = "https://api.allorigins.win/raw?url=https://contagi-marche.tapion.it/contagi_marche.json";		
		$.get(szUrl,
			function(data){

			var dbtable = {fields:[],records:[],table:{}};

			dbtable.fields.push({id:"Comune"});  
			dbtable.fields.push({id:"data"});  
			dbtable.fields.push({id:"positivi"});  
			dbtable.fields.push({id:"quarantena"}); 

			for ( i in data ){
				for ( ii in data[i] ){
					var row = [];
					row.push(i);
					for ( iii in data[i][ii] ){
						row.push(data[i][ii][iii]);
					}
					dbtable.records.push(row);
				}
			}

			console.log(dbtable);

			// process data
			// ============

			dbtable = new Data.Table(dbtable);

			var mydata = dbtable.pivot({ 
				lead:"Comune",
				columns:"data",
				value:"positivi"});
			// remove Total from pivot
			mydata.column("Total").remove();

			var columns = mydata.columnNames();
			theme.szFields = columns[columns.length-1];
			theme.szField100 = columns[columns.length-8];
			
			ixmaps.setTitle("<span class='btn-lg btn-default'>aggiornato al "+theme.szFields+"</span>");

			// -----------------------------------------------------------------------------------------------             
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_28 = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// get actual Date
		// ----------------------------------------------------------------------------------------------- 
		var date = new Date();
		
		var szDateA = [];
		
		for ( i=0; i<=28; i++ ){
			
			szDateA.push(	__formatDatePartString(date.getDate()) + "%2F" +
					  		__formatDatePartString(date.getMonth()+1) + "%2F" +
			          		__formatDatePartString(date.getFullYear()) 
						);
			
			var u = date.getTime();
			u -= (1000*60*60*24);
			date = new Date(u);
		}
		
		var szUrlA = [];
		for ( i in szDateA ){
			szUrlA.push("https://api.allorigins.win/raw?url=https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDateA[i]+"&_=1615072154587");
		}
		
		// -----------------------------------------------------------------------------------------------               
		// read the sources
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker();
		
		for ( i in szUrlA ){
			broker.addSource(szUrlA[i], "json")
		}
		
		broker.realize(
				
			function (dataA) {
				
			for ( i in szUrlA ){
				dataA[i].column("3").map(function(value){
					if ( value == "Inferiori a 5" ){
						return 3;
					}else{
						return value;
					}
				});	
			}
			var merger = new Data.Merger();
			for ( i in szUrlA ){
				merger.addSource(dataA[i], {
					lookup: "0",
					columns: ["0","1","2","3"]	
				});
			}
			merger.realize(function (dbTable) {
					
				console.log(dbTable);
			
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
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
