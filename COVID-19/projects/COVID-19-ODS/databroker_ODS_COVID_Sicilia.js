/**
 * data broker for COVID-19 Maps
 * loads data from Google Doc Sheet maintained by OpenDataSicilia
 * parses into iXMaps data table format and param themes
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __process_totale = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"totale_casi",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    var __get_recovered = function(data,options) { 

		// make pivot table with columns per day

		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"dimessi_guariti",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    var __get_hospitalized = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"totale_ospedalizzati",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

	var __get_symptoms = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"ricoverati_con_sintomi",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    var __get_intensive = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"terapia_intensiva",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    var __get_deaths = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"deceduti",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
    };   
	
    var __get_home = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"isolamento_domiciliare",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    var __get_active = function(data,options) { 

		// make pivot table with columns per day
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"totale_positivi",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

	
    var __get_deaths_active_recovered = function(data,options) { 

		var activeTab = __get_active(data);
		var recoveredTab = __get_recovered(data);
		var deathsTab = __get_deaths(data);
		
		var records = activeTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(recoveredTab.records[r][c]);
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return activeTab;
     };   

    var __get_deaths_active = function(data,options) { 

		var activeTab = __get_active(data);
		var deathsTab = __get_deaths(data);
		
		var records = activeTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return activeTab;
     };   

    var __get_deaths_home_hospital_intensive_recovered = function(data,options) { 

		var deathsTab = __get_deaths(data);
		var homeTab = __get_home(data);
		var symptomsTab = __get_symptoms(data);
		var intensiveTab = __get_intensive(data);
		var recoveredTab = __get_recovered(data);
		
		var records = recoveredTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(intensiveTab.records[r][c]);
				records[r][c] += Number(symptomsTab.records[r][c]);
				records[r][c] += Number(homeTab.records[r][c]);
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return recoveredTab;
     };   
	
    var __get_deaths_home_hospital_intensive = function(data,options) { 

		var deathsTab = __get_deaths(data);
		var homeTab = __get_home(data);
		var symptomsTab = __get_symptoms(data);
		var intensiveTab = __get_intensive(data);
		
		var records = intensiveTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(symptomsTab.records[r][c]);
				records[r][c] += Number(homeTab.records[r][c]);
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return intensiveTab;
     };   
	
    var __get_deaths_home_hospital = function(data,options) { 

		var deathsTab = __get_deaths(data);
		var homeTab = __get_home(data);
		var symptomsTab = __get_symptoms(data);
		
		var records = symptomsTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(homeTab.records[r][c]);
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return symptomsTab;
     };   
	
    var __get_deaths_home = function(data,options) { 

		var deathsTab = __get_deaths(data);
		var homeTab = __get_home(data);
		
		var records = homeTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(deathsTab.records[r][c]);
			}
		}
	
		return homeTab;
     };   

    var __mean_3 = function(table) { 
		
		// make mean of 3 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] = (records[r][c]+records[r][c+1]+records[r][c+2])/3;
			}
		}
		var columns = table.columnNames();
		table.column(columns.pop()).remove();
		table.column(columns.pop()).remove();
		
		return table;
     };   
	
 	/**
	 * ODS_SICILIA_COVID_LAST_ACTIVE
	 *
	 * make a pivot table with one row per provincia
	 *
	 * columns: one column for each day 
	 * types are: active named like 2020-02-24, 2020-02-25, 2020-02-26 
	 * set actual date in calling theme 
	 *
	 * @param theme ixmaps theme object
	 * @options varie options passed by ixmaps
	 * @void
	 */
	
   ixmaps.ODS_SICILIA_COVID_LAST_ACTIVE = function (theme,options) {


		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_active(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];
			theme.szSizeField = columns[last];
			theme.szValueField = columns[last];

			var dte = new Date(columns[last]);
			ixmaps.setTitle("<span style='background:rgba(255,255,255,0.9);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al "+dte.toLocaleDateString()+"</span>","right");

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};

 	/**
	 * ODS_SICILIA_COVID_LAST_ACTIVE_DIFF
	 *
	 * make a pivot table with one row per provincia
	 *
	 * columns: one column for each day 
	 * types are: active named like 2020-02-24, 2020-02-25, 2020-02-26 
	 * set actual date in calling theme 
	 *
	 * @param theme ixmaps theme object
	 * @options varie options passed by ixmaps
	 * @void
	 */
	
   ixmaps.ODS_SICILIA_COVID_LAST_ACTIVE_DIFF = function (theme,options) {


		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_active(mydata,options);
			pivot.column("Total").remove();
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
			var last = columns.length-1;

			var dte = new Date(columns[last]);
			ixmaps.setTitle("<span style='background:rgba(255,255,255,0.9);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al "+dte.toLocaleDateString()+"</span>","right");
			
			var iLast   = pivot.fields.length-1;
			var iBefore = pivot.fields.length-2;
			
			pivot.addColumn({
				destination: "active_before"
			}, function (row) {
				return (Number(row[iBefore]));
			});
			
			pivot.addColumn({
				destination: "diff"
			}, function (row) {
				return (Number(row[iLast]) - Number(row[iBefore]));
			});

			var iDiff = pivot.column("diff").index;
			pivot.addColumn({
				destination: "diff_percent"
			}, function (row) {
				if (Number(row[iDiff]) && (Number(row[iBefore]) > 100)) {
					return (Number(row[iDiff]) / Number(row[iBefore]) * 100);
				}
				return 0;
			});
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};

	/**
	 * ODS_SICILIA_COVID_SEQUENCE_ACTIVE
	 *
	 * make pivot table with one row per provincia
	 *
	 * columns: one column for each day and type 
	 * types are: active named like 2020-02-24, 2020-02-25, 2020-02-26 
	 *
	 * @param theme ixmaps theme object
	 * @options varie options passed by ixmaps
	 * @void
	 */
	
	ixmaps.ODS_SICILIA_COVID_SEQUENCE_ACTIVE = function (theme, options) {


		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			var pivot = __get_active(data,options);
			pivot.column("Total").remove();
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					records[r][c] = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
 				}
			}
			columns.shift();
			columns.shift();
		
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				theme.szXaxisA[i] = " ";
			}
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};

	/**
	 * ODS_SICILIA_COVID_SEQUENCE_ACTIVE
	 *
	 * make pivot table with one row per provincia
	 *
	 * columns: one column for each day and type 
	 * types are: active named like 2020-02-24, 2020-02-25, 2020-02-26 
	 *
	 * @param theme ixmaps theme object
	 * @options varie options passed by ixmaps
	 * @void
	 */
	
	ixmaps.ODS_SICILIA_COVID_SEQUENCE_ACTIVE_MARKER = function (theme, options) {


		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			var pivot = __get_active(data,options);
			pivot.column("Total").remove();
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					records[r][c] = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
 				}
			}
			columns.shift();
			columns.shift();
		
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				console.log(theme.szXaxisA[i]);
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx22/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "5/4/2020" ){
					theme.szXaxisA[i] = "b+14";
				}else{
					theme.szXaxisA[i] = " ";
				}
			}
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};

	/**
	 * ODS_SICILIA_COVID_SEQUENCE_DAR
	 *
	 * make merged pivot table with one row per sicilia province
	 *
	 * columns: one column for each day and type 
	 * types are: deaths, active, recovered named like 2020-02-24.1, 2020-02-24.2, 2020-02-24.3 
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */
	
	ixmaps.ODS_SICILIA_COVID_SEQUENCE_DAR = function (theme, options) {


		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			var data_Active 	= __get_active(data);
			var data_Recovered 	= __get_recovered(data);
			var data_Deaths 	= __get_deaths(data);
			
			data_Active.column("Total").remove();
			data_Recovered.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Active.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Deaths, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.addSource(data_Active, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+".3");
					fieldsA.push(columnsA[i]+".1");
					fieldsA.push(columnsA[i]+".2");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 3;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";
				console.log(options.theme);

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					var dte = new Date(columnsA[i]);
					xAxis.push(dte.toLocaleDateString());
				}
				//options.theme.szXaxisA = xAxis; 

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
	
	/**
	 * ODS_SICILIA_COVID_SEQUENCE_DAR_PREVALENCE
	 *
	 * make merged pivot table with one row per sicilia province 
	 *
	 * columns: one column for each day and type 
	 * types are: deaths, active, recovered named like 2020-02-24.1, 2020-02-24.2, 2020-02-24.3 
	 * the values are cases for 10.000 habitants
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */
	
	ixmaps.ODS_SICILIA_COVID_SEQUENCE_DAR_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var dataPop = dataA[1];
			// make lookupArray: COD_PROV ==> population
			var pop = dataPop.lookupArray("Value", "COD_PROV");
				
			var indexProCod = data.column("codice_provincia").index;

			data.column('totale_positivi').map(function (value,row) {
					return value/pop[Number(row[indexProCod])]*10000;
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return value/pop[Number(row[indexProCod])]*10000;
			});
			data.column('deceduti').map(function (value,row) {
					return value/pop[Number(row[indexProCod])]*10000;
			});
				
			var data_Active 	= __get_active(data);
			var data_Recovered 	= __get_recovered(data);
			var data_Deaths 	= __get_deaths(data);
			
			data_Active.column("Total").remove();
			data_Recovered.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Active.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Active, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+".3");
					fieldsA.push(columnsA[i]+".1");
					fieldsA.push(columnsA[i]+".2");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 3;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dte = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dte.toLocaleDateString());
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
	
	/**
	 * ODS_SICILIA_COVID_SEQUENCE_DHHIR
	 *
	 * make merged pivot table with one row per sicilia province 
	 *
	 * columns: one column for each day and type 
	 * types are: deaths, quarantene, hospitalized, intensive care, recovered named like 2020-02-24.1, 2020-02-24.2, 2020-02-24.3 
	 * note: intensive care is actually not present in data
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */

	ixmaps.ODS_SICILIA_COVID_SEQUENCE_DHHIR = function (theme, options) {

		var szUrl1 = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var data_Deaths 	= __get_deaths(data);
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_hospitalized(data);
			var data_Intensive	= __get_intensive(data);
			var data_Recovered 	= __get_recovered(data);
				
			data_Deaths.column("Total").remove();
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Recovered.column("Total").remove();

			var columnsA = data_Recovered.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Deaths, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.addSource(data_Home, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+".1");
					fieldsA.push(columnsA[i]+".2");
					fieldsA.push(columnsA[i]+".3");
					fieldsA.push(columnsA[i]+".4");
					fieldsA.push(columnsA[i]+".5");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 5;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dateStart = new Date(columnsA[0]);
				xAxis[0]=(dateStart.toLocaleDateString());
				var dateEnd = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dateEnd.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

				options.theme.szDescription = "dal "+dateStart.toLocaleDateString()+" al "+dateEnd.toLocaleDateString();
				
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

	/**
	 * ODS_SICILIA_COVID_SEQUENCE_DHHIR_PREVALENCE
	 *
	 * make merged pivot table with one row per sicilia province 
	 *
	 * columns: one column for each day and type 
	 * types are: deaths, quarantene, hospitalized, intensive care, recovered named like 2020-02-24.1, 2020-02-24.2, 2020-02-24.3 
	 * note: intensive care is actually not present in data
	 * the values are cases for 10.000 habitants
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */

	ixmaps.ODS_SICILIA_COVID_SEQUENCE_DHHIR_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var dataPop = dataA[1];
			// make lookupArray: COD_PROV ==> population
			var pop = dataPop.lookupArray("Value", "COD_PROV");
				
			var indexCode = data.column("codice_provincia").index;

			data.column('deceduti').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('isolamento_domiciliare').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('totale_ospedalizzati').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('terapia_intensiva').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			
			var data_Deaths 	= __get_deaths(data);
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_hospitalized(data);
			var data_Intensive	= __get_intensive(data);
			var data_Recovered 	= __get_recovered(data);
				
			data_Deaths.column("Total").remove();
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Recovered.column("Total").remove();

			var columnsA = data_Recovered.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Deaths, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.addSource(data_Home, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+".1");
					fieldsA.push(columnsA[i]+".2");
					fieldsA.push(columnsA[i]+".3");
					fieldsA.push(columnsA[i]+".4");
					fieldsA.push(columnsA[i]+".5");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 5;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dateStart = new Date(columnsA[0]);
				xAxis[0]=(dateStart.toLocaleDateString());
				var dateEnd = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dateEnd.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

				options.theme.szDescription = "dal "+dateStart.toLocaleDateString()+" al "+dateEnd.toLocaleDateString();
				
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

	/**
	 * ODS_SICILIA_COVID_SEQUENCE_HHIRD_PREVALENCE
	 *
	 * make merged pivot table with one row per sicilia province 
	 *
	 * columns: one column for each day and type 
	 * types are: deaths, quarantene, hospitalized, intensive care, recovered named like 2020-02-24.1, 2020-02-24.2, 2020-02-24.3 
	 * note: intensive care is actually not present in data
	 * the values are cases for 10.000 habitants
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */

	ixmaps.ODS_SICILIA_COVID_SEQUENCE_HHIRD_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var dataPop = dataA[1];
			// make lookupArray: COD_PROV ==> population
			var pop = dataPop.lookupArray("Value", "COD_PROV");
				
			var indexCode = data.column("codice_provincia").index;

			data.column('deceduti').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('isolamento_domiciliare').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('totale_ospedalizzati').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('terapia_intensiva').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return value/pop[Number(row[indexCode])]*10000;
			});
			
			var data_Deaths 	= __get_deaths(data);
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_hospitalized(data);
			var data_Intensive	= __get_intensive(data);
			var data_Recovered 	= __get_recovered(data);
				
			data_Deaths.column("Total").remove();
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Recovered.column("Total").remove();

			var columnsA = data_Recovered.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Home, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_provincia",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_provincia",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+".1");
					fieldsA.push(columnsA[i]+".2");
					fieldsA.push(columnsA[i]+".3");
					fieldsA.push(columnsA[i]+".4");
					fieldsA.push(columnsA[i]+".5");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 5;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dateStart = new Date(columnsA[0]);
				xAxis[0]=(dateStart.toLocaleDateString());
				var dateEnd = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dateEnd.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

				options.theme.szDescription = "dal "+dateStart.toLocaleDateString()+" al "+dateEnd.toLocaleDateString();
				
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

	/**
	 * ODS_COVID_ACTUAL
	 *
	 * lod data from Google Doc
	 * and set filter in theme to the latest date
	 *
	 * @param theme ixmaps theme object
	 * @options vaie options passed by ixmaps
	 * @void
	 */

	ixmaps.ODS_COVID_ACTUAL = function (theme,options) {

		var szUrl = "https://corsme.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRsbOOrQCv72t6fH4ktl7VtafxvU1RECTqSBpC3wc91C0hLxFLCFRNZc7os5Pbcmvq-Qh4B3aIO50L8/pub?gid=2065250495&single=true&output=csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var data = mydata.column("data").values();
			var last = data.pop();

			theme.szSnippet = "aggiornato al "+last;
			theme.szFilter = "WHERE data = \""+last+"\"";
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 
			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
