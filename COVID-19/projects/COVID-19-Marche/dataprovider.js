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
		// get actual Date
		// ----------------------------------------------------------------------------------------------- 
		var date = new Date();
		var szDate = __formatDatePartString(date.getDate()) + "%2F" +
					 __formatDatePartString(date.getMonth()+1) + "%2F" +
			         __formatDatePartString(date.getFullYear());
		
		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl = "https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate+"&_=1615072154587";
		
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){
			
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
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_CLIP_28 = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "../../projects/COVID-19-Marche/positivi.csv";
		var szUrl2 = "../../projects/COVID-19-Marche/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var mydata = dataA[0];	
			var dataPop = dataA[1];	
			// make lookupArray: COD_PROV ==> population
			var popA = dataPop.lookupArray("Totale","Denominazione");
				
			var records = mydata.records;
			var lastColumn = mydata.columnNames().length - 1;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=lastColumn; c>=1; c-- ){
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
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_SEQUENCE_28 = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "../../projects/COVID-19-Marche/positivi.csv";
		var szUrl2 = "../../projects/COVID-19-Marche/popolazione_gennaio_2020_totale.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var mydata = dataA[0];	
			var dataPop = dataA[1];	
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
	};
	
	ixmaps.COVID_MARCHE_POSITIVI_LATEST_PREVALENCE = function (theme,options) {

		// -----------------------------------------------------------------------------------------------               
		// get actual Date
		// ----------------------------------------------------------------------------------------------- 
		var date = new Date();
		var szDate = __formatDatePartString(date.getDate()) + "%2F" +
					 __formatDatePartString(date.getMonth()+1) + "%2F" +
			         __formatDatePartString(date.getFullYear());
		
		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate+"&_=1615072154587";
		var szUrl2 = "../../projects/COVID-19-Marche/popolazione_gennaio_2020_totale.csv";

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
				
			if (!mydata.table.records){
				return ixmaps.COVID_MARCHE_POSITIVI_BEFORE_PREVALENCE(theme,options);
			}	
				
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
		var szUrl1 = "https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate+"&_=1615072154587";
		var szUrl2 = "../../projects/COVID-19-Marche/popolazione_gennaio_2020_totale.csv";

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

		// -----------------------------------------------------------------------------------------------               
		// get actual Date
		// ----------------------------------------------------------------------------------------------- 
		var date = new Date();
		var szDate1 = __formatDatePartString(date.getDate()) + "%2F" +
					  __formatDatePartString(date.getMonth()+1) + "%2F" +
			          __formatDatePartString(date.getFullYear());
		
		// -----------------------------------------------------------------------------------------------               
		// get past Date
		// ----------------------------------------------------------------------------------------------- 
		var u = new Date().getTime();
		u -= (1000*60*60*24);
		date = new Date(u);
		var szDate2 = __formatDatePartString(date.getDate()) + "%2F" +
					  __formatDatePartString(date.getMonth()+1) + "%2F" +
			          __formatDatePartString(date.getFullYear());
		

		// -----------------------------------------------------------------------------------------------               
		// read actual COVID data
		// ----------------------------------------------------------------------------------------------- 
		var szUrl1 = "https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate1+"&_=1615072154587";
		var szUrl2 = "https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDate2+"&_=1615072154587";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "json")
			.addSource(szUrl2, "json")
			.realize(
				
			function (dataA) {
				
			dataA[0].column("3").map(function(value){
				if ( value == "Inferiori a 5" ){
					return 3;
				}else{
					return value;
				}
			});	
			dataA[1].column("3").map(function(value){
				if ( value == "Inferiori a 5" ){
					return 3;
				}else{
					return value;
				}
			});	
			var merger = new Data.Merger();
				merger.addSource(dataA[0], {
					lookup: "0",
					columns: ["0","1","2","3"]	
				});
				merger.addSource(dataA[1], {
					lookup: "0",
					columns: ["0","1","2","3"]	
				});
				merger.realize(function (dbTable) {
					
				ixmaps.setTitle("aggiornato il "+dbTable.column("2.1").values()[0]);
			
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
			szUrlA.push("https://corsme.herokuapp.com/https://www.regione.marche.it/DesktopModules/Covid19Stat/WSGetStatComu.ashx/GetPersonData?giornoScelto="+szDateA[i]+"&_=1615072154587");
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
