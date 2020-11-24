/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __process = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"totale_casi",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

    var __get_recovered = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"dimessi_guariti",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

    var __get_hospitalized = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"totale_ospedalizzati",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

	var __get_symptoms = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"ricoverati_con_sintomi",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

    var __get_intensive = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"terapia_intensiva",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

    var __get_deaths = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"deceduti",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
    };   
	
    var __get_home = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"isolamento_domiciliare",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   

    var __get_active = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"totale_positivi",
			 keep:["lat","long","denominazione_regione"]}
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
	
    var __get_home_hospital = function(data,options) { 

		var homeTab = __get_home(data);
		var symptomsTab = __get_symptoms(data);
		
		var records = symptomsTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] += Number(homeTab.records[r][c]);
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
				records[r][c] = (Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2]))/3;
			}
		}
		var columns = table.columnNames();
		table.column(columns.pop()).remove();
		table.column(columns.pop()).remove();
		
		return table;
     };   
	
	
    ixmaps.PCM_DPC_COVID_LAST = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szSizeField = columns[last];
			theme.szValueField = columns[last];

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
		
	ixmaps.PCM_DPC_INTENSIVE_CLIP = function (theme, options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data from GitHub and process 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_intensive(mydata,options);
			
				pivot.column("Total").remove();

				// get the columns with data 
				var columnA = pivot.columnNames();
				columnA.shift();
				columnA.shift();
				columnA.shift();
				columnA.shift();
			
				// and configure the theme
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				// make local date for clip
				var datesA = [];
				for (var day = 0; day<columnA.length; day++){
					datesA.push(new Date(columnA[day]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = datesA.length;

				theme.szSnippet = "aggiornato al " + datesA[datesA.length-1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl);
			});

	};


	ixmaps.PCM_DPC_HOSPITALIZED_CLIP = function (theme, options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data from GitHub and process 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_hospitalized(mydata,options);
			
				pivot.column("Total").remove();

				// get the columns with data 
				var columnA = pivot.columnNames();
				columnA.shift();
				columnA.shift();
				columnA.shift();
				columnA.shift();
			
				// and configure the theme
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				// make local date for clip
				var datesA = [];
				for (var day = 0; day<columnA.length; day++){
					datesA.push(new Date(columnA[day]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = datesA.length;

				theme.szSnippet = "aggiornato al " + datesA[datesA.length-1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl);
			});

	};

	ixmaps.PCM_DPC_HOME_CLIP = function (theme, options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data from GitHub and process 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_home(mydata,options);
			
				pivot.column("Total").remove();

				// get the columns with data 
				var columnA = pivot.columnNames();
				columnA.shift();
				columnA.shift();
				columnA.shift();
				columnA.shift();
			
				// and configure the theme
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				// make local date for clip
				var datesA = [];
				for (var day = 0; day<columnA.length; day++){
					datesA.push(new Date(columnA[day]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = datesA.length;

				theme.szSnippet = "aggiornato al " + datesA[datesA.length-1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl);
			});

	};

	ixmaps.PCM_DPC_COVID_ACTUAL_PREVALENCE_100000 = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
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
				
				// get popolation array
				var dataPop = dataA[1];
				// correct region names in population table
				dataPop.column("Territorio").map(function (value) {
					if (value == "Provincia Autonoma Bolzano / Bozen") {
						return "P.A. Bolzano";
					} else
					if (value == "Provincia Autonoma Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});
				var pop = [];
				var terrA = dataPop.column("Territorio").values();
				var popA = dataPop.column("Value").values();
				for (var i = 0; i < terrA.length; i++) {
					pop[terrA[i]] = popA[i];
				}
				var indexName = mydata.column("denominazione_regione").index;
				var indexValue = null;
				
				indexValue = mydata.column("totale_ospedalizzati").index;
				mydata.addColumn({destination:'totale_ospedalizzati_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("terapia_intensiva").index;
				mydata.addColumn({destination:'terapia_intensiva_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("totale_positivi").index;
				mydata.addColumn({destination:'totale_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("ricoverati_con_sintomi").index;
				mydata.addColumn({destination:'ricoverati_con_sintomi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("nuovi_positivi").index;
				mydata.addColumn({destination:'nuovi_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("variazione_totale_positivi").index;
				mydata.addColumn({destination:'variazione_totale_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("tamponi").index;
				mydata.addColumn({destination:'tamponi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("casi_testati").index;
				mydata.addColumn({destination:'casi_testati_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("deceduti").index;
				mydata.addColumn({destination:'deceduti_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
	
				var data = mydata.column("data").values();
				var last = data.pop();

				theme.szSnippet = "aggiornato al "+last;
				theme.szFilter = "WHERE data = \""+last+"\"";
				
				ixmaps.setTitle("<f2 style='color:#888888;font-family:arial'>aggiornato: "+last.split("T")[0]+"</f2>");

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
				
			});

	};

	ixmaps.PCM_DPC_COVID_PERIODS_28 = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
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
				
				// get popolation array
				var dataPop = dataA[1];
				// correct region names in population table
				dataPop.column("Territorio").map(function (value) {
					if (value == "Provincia Autonoma Bolzano / Bozen") {
						return "P.A. Bolzano";
					} else
					if (value == "Provincia Autonoma Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});
				var pop = [];
				var terrA = dataPop.column("Territorio").values();
				var popA = dataPop.column("Value").values();
				for (var i = 0; i < terrA.length; i++) {
					pop[terrA[i]] = popA[i];
				}
				var indexName = mydata.column("denominazione_regione").index;
				var indexValue = null;
				
				indexValue = mydata.column("totale_ospedalizzati").index;
				mydata.addColumn({destination:'totale_ospedalizzati_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("terapia_intensiva").index;
				mydata.addColumn({destination:'terapia_intensiva_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("totale_positivi").index;
				mydata.addColumn({destination:'totale_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("ricoverati_con_sintomi").index;
				mydata.addColumn({destination:'ricoverati_con_sintomi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("nuovi_positivi").index;
				mydata.addColumn({destination:'nuovi_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("variazione_totale_positivi").index;
				mydata.addColumn({destination:'variazione_totale_positivi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("tamponi").index;
				mydata.addColumn({destination:'tamponi_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("casi_testati").index;
				mydata.addColumn({destination:'casi_testati_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
				indexValue = mydata.column("deceduti").index;
				mydata.addColumn({destination:'deceduti_100000'}, function (row) {
						return (Number(row[indexValue])/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				
	
				var data = mydata.column("data").values();
				var last = data.pop();

				theme.szSnippet = "aggiornato al "+last;
				theme.szFilter = "WHERE data = \""+last+"\"";
				
				ixmaps.setTitle("<f2 style='color:#888888;font-family:arial'>aggiornato: "+last.split("T")[0]+"</f2>");

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(mydata, {
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
