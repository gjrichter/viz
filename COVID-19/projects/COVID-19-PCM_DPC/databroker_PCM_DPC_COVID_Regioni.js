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

    var __get_tampon = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"tamponi",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   
	
    var __get_testati = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"casi_testati",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     };   
	
    var __get_nuovi = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"data",
			 value:"nuovi_positivi",
			 keep:["lat","long","denominazione_regione"]}
		);
	
		return pivot;
     }; 
	
    var __get_tamponratio = function(data,options) { 

		var tamponTab  = __get_tampon(data);
		var nuoviTab   = __get_nuovi(data);
		
		var records = tamponTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=records[r].length-1; c>=5; c--){
				var tests = (Number(tamponTab.records[r][c])-Number(tamponTab.records[r][c-1]));
				if ( tests > 100 ){
					records[r][c] = Number(nuoviTab.records[r][c]) / tests * 100;
					records[r][c] = isFinite(records[r][c])?records[r][c]:0;
				}else{
					records[r][c] = 0;
				}
			}
		}
		return tamponTab;
     };   

    var __get_testatiratio = function(data,options) { 

		var testatiTab = __get_testati(data);
		var nuoviTab   = __get_nuovi(data);
		
		var records = testatiTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=records[r].length-1; c>=5; c--){
				var tests = (Number(testatiTab.records[r][c])-Number(testatiTab.records[r][c-1]));
				if ( tests > 100 ){
					records[r][c] = Number(nuoviTab.records[r][c]) / tests * 100;
					records[r][c] = isFinite(records[r][c])?records[r][c]:0;
				}else{
					records[r][c] = 0;
				}
			}
		}
		return testatiTab;
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
	
    var __get_fatalityratio = function(data,options) { 

		var deathTab   = __get_deaths(data);
		var casiTab    = __process(data);
		console.log(deathTab);
		console.log(casiTab);
		var records = deathTab.records;
		for ( var r=0; r<records.length; r++){
			for ( var c=records[r].length-1; c>=5; c--){
				var deaths = (Number(records[r][c])-Number(records[r][c-1]));
				if ( deaths > 10 ){
					records[r][c] = Number(deaths/casiTab.records[r][c]) * 100;
					records[r][c] = isFinite(records[r][c])?records[r][c]:0;
				}else{
					records[r][c] = 0;
				}
			}
		}
		return deathTab;
     };   
	
	
    ixmaps.PCM_DPC_COVID_LAST = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
		
    ixmaps.PCM_DPC_COVID_LAST_NUOVI = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_nuovi(mydata,options);
	
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
		
    ixmaps.PCM_DPC_COVID_LAST_NUOVI_MEAN_7 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_nuovi(mydata,options);
	
			// make moving average of 7 days
			var records = pivot.records;
			for (var r=0; r<records.length;r++){
				for (var c=records[r].length-1; c>=10;c--){
					records[r][c] = (Number(records[r][c])+
									 Number(records[r][c-1])+
									 Number(records[r][c-2])+
									 Number(records[r][c-3])+
									 Number(records[r][c-4])+
									 Number(records[r][c-5])+
									 Number(records[r][c-6])
									)/7;
				}
			}


			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();

			columns.shift();
			columns.shift();
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
		
    ixmaps.PCM_DPC_COVID_LAST_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_recovered(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_ACTIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_INTENSIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_intensive(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};

     ixmaps.PCM_DPC_COVID_LAST_INTENSIVE_MAX = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/agenas/processing/postiletto-e-ricoverati-areaNonCritica.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get beds in intensive care
				var dataLetti = dataA[1];
				// correct region names
				dataLetti.column("Regioni").map(function (value) {
					if (value == "PA Bolzano") {
						return "P.A. Bolzano";
					} else
					if (value == "PA Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});

				var last_date = dataLetti.column("fonte").values().pop();
				dataLetti = dataLetti.select('WHERE fonte = "'+last_date+'"');
				var letti = dataLetti.lookupArray("PL in Terapia Intensiva","Regioni");

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				pivot.addColumn({
					destination: "posti_letti_ti"
				}, function (row) {
					return (letti[row[indexName].replace(/\-/," ")]);
				});
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				var last = columns.length-1;

				theme.szFields = columns[last-1];
				theme.szField100 = columns[last];

				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_DEATHS = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};

    ixmaps.PCM_DPC_COVID_LAST_QUARANTENA = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_home_hospital(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_TAMPONRATIO = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_tamponratio(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_TESTATIRATIO = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_testatiratio(mydata,options);
	
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.PCM_DPC_COVID_LAST_CUMUL_7_INCIDENCE = function (theme,options) {
		
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

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=11;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-7])
										);
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

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

			});

	};
				
    ixmaps.PCM_DPC_COVID_LAST_CUMUL_14_INCIDENCE = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=18;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-14])
										);
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

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

			});

	};
				
	
    ixmaps.PCM_DPC_COVID_SEQUENCE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

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
	
    ixmaps.PCM_DPC_COVID_SEQUENCE_LAST_15 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
			while ( last > 15 ){
				columns.shift();
				last--;
			}
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
			return pivot;
		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_RECOVERED = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_recovered(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_ACTIVE = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
			
			// make moving average of 3 days, last 2 remain original
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
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx21/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "4/4/2020" ){
					theme.szXaxisA[i] = "b+14";
				}else{
					theme.szXaxisA[i] = " ";
				}
			}

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_ACTIVE_PREVALENCE = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
			var pivot = __get_active(data,options);
				
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
			var indexName = pivot.column("denominazione_regione").index;
				
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					var value = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
					records[r][c] = (value/pop[records[r][indexName].replace(/\-/," ")]*10000).toFixed(2);
 				}
			}
			columns.pop();
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
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx21/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "4/4/2020" ){
					theme.szXaxisA[i] = "b+14";
				}else{
					theme.szXaxisA[i] = " ";
				}
			}

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

	
	
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_ACTIVE_CLIP = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
			
			// and set the label (for difference 1 less)
			//columns.shift();
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

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					records[r][c] = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
 				}
			}
			columns.pop();
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
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx21/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "4/4/2020" ){
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_QUARANTENA = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_home_hospital(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					records[r][c] = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
 				}
			}
			columns.pop();
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
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx21/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "4/4/2020" ){
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_QUARANTENA = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_home_hospital(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=4; c<records[r].length-3; c++ ){
					records[r][c] = Math.round((Number(records[r][c]) + Number(records[r][c+1]) + Number(records[r][c+2]))/3);
 				}
			}
			columns.pop();
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
			
			theme.szXaxisA = columns.slice();
			for ( i=1; i<theme.szXaxisA.length-1; i++ ){
				if ( theme.szXaxisA[i] == "xx11/3/2020" ){
					theme.szXaxisA[i] = "a";
				}else
				if ( theme.szXaxisA[i] == "xx21/3/2020" ){
					theme.szXaxisA[i] = "b";
				}else
				if ( theme.szXaxisA[i] == "19/3/2020" ){
					theme.szXaxisA[i] = "s+14";
				}else
				if ( theme.szXaxisA[i] == "25/3/2020" ){
					theme.szXaxisA[i] = "a+14";
				}else
				if ( theme.szXaxisA[i] == "4/4/2020" ){
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
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};


	
	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_ACTIVE_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_active_recovered(mydata,options);
			
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_ACTIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_active(mydata,options);

			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths(mydata,options);
			
			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL_INTENSIVE_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital_intensive_recovered(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL_INTENSIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital_intensive(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_HOSPITALIZED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_hospitalized(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_INTENSIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_intensive(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DAR = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
			merger.addSource(data_Active, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_DAR_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
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
				
			var indexName = data.column("denominazione_regione").index;

			data.column('totale_positivi').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toValue(2);
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toValue(2);
			});
			data.column('deceduti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toValue(2);
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
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_DHHIR = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var indexName = data.column("denominazione_regione").index;

			var data_Deaths 	= __get_deaths(data);
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
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
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();

				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" deceduti");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".4").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".5").rename(columnsA[i]+" guariti/dimessi");
				}

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" deceduti");
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" guariti/dimessi");
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_DHHIR_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
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
				
			var indexName = data.column("denominazione_regione").index;

			data.column('deceduti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('isolamento_domiciliare').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('ricoverati_con_sintomi').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('terapia_intensiva').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			
			var data_Deaths 	= __get_deaths(data);
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
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
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				// set label in column names of pivot table

				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" deceduti");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".4").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".5").rename(columnsA[i]+" guariti/dimessi");
				}

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" deceduti");
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" guariti/dimessi");
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_HHIRD = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
			var data_Intensive	= __get_intensive(data);
			var data_Deaths 	= __get_deaths(data);
			var data_Recovered 	= __get_recovered(data);
				
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Recovered.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Recovered.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".4").rename(columnsA[i]+" guariti/dimessi");
					dbTable.column(columnsA[i]+".5").rename(columnsA[i]+" deceduti");
				}
				

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" guariti/dimessi");
					fieldsA.push(columnsA[i]+" deceduti");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 5;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// set xaxis 
				
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
	
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_HHIRD_PREVALENCE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
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
				
			var indexName = data.column("denominazione_regione").index;

			data.column('isolamento_domiciliare').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('ricoverati_con_sintomi').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('terapia_intensiva').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('dimessi_guariti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			data.column('deceduti').map(function (value,row) {
					return (value/pop[row[indexName].replace(/\-/," ")]*10000).toFixed(2);
			});
			
			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
			var data_Intensive	= __get_intensive(data);
			var data_Deaths 	= __get_deaths(data);
			var data_Recovered 	= __get_recovered(data);
				
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Recovered.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Recovered.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Recovered, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".4").rename(columnsA[i]+" guariti/dimessi");
					dbTable.column(columnsA[i]+".5").rename(columnsA[i]+" deceduti");
				}
				

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" guariti/dimessi");
					fieldsA.push(columnsA[i]+" deceduti");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 5;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// set xaxis 
				
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

				ixmaps.setTitle("aggiornato al: " + xAxis[columnsA.length-1]);

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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_HHID = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			// make local dates
			/**
			data.column('data').map(function (value,row) {
					return (new Date(value).toLocaleDateString());
			});
			**/

			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
			var data_Intensive	= __get_intensive(data);
			var data_Deaths 	= __get_deaths(data);
				
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Symptoms.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".4").rename(columnsA[i]+" deceduti");
				}
				

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" deceduti");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 4;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// set xaxis 
				
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_HHI = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			// make local dates
			/**
			data.column('data').map(function (value,row) {
					return (new Date(value).toLocaleDateString());
			});
			**/

			var data_Home 		= __get_home(data);
			var data_Symptoms	= __get_symptoms(data);
			var data_Intensive	= __get_intensive(data);
				
			data_Home.column("Total").remove();
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();

			var columnsA = data_Symptoms.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Home, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" isolamento");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" terapia intens.");
				}
				

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" isolamento");
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 3;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// set xaxis 
				
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
	
 	ixmaps.PCM_DPC_COVID_SEQUENCE_HID = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			// make local dates
			/**
			data.column('data').map(function (value,row) {
					return (new Date(value).toLocaleDateString());
			});
			**/

			var data_Symptoms	= __get_symptoms(data);
			var data_Intensive	= __get_intensive(data);
			var data_Deaths 	= __get_deaths(data);
				
			data_Symptoms.column("Total").remove();
			data_Intensive.column("Total").remove();
			data_Deaths.column("Total").remove();

			var columnsA = data_Symptoms.columnNames();

			var merger = new Data.Merger();
			merger.addSource(data_Symptoms, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Intensive, {
				lookup: "denominazione_regione",
				columns: columnsA
			});
			merger.addSource(data_Deaths, {
				lookup: "denominazione_regione",
				columns: columnsA	
			});
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				
				for ( var i=0; i<columnsA.length; i++ ){
					dbTable.column(columnsA[i]+".1").rename(columnsA[i]+" osptitalizzati");
					dbTable.column(columnsA[i]+".2").rename(columnsA[i]+" terapia intens.");
					dbTable.column(columnsA[i]+".3").rename(columnsA[i]+" deceduti");
				}
				

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					fieldsA.push(columnsA[i]+" osptitalizzati");
					fieldsA.push(columnsA[i]+" terapia intens.");
					fieldsA.push(columnsA[i]+" deceduti");
				}
						
				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = 3;

				options.theme.szItemField = "lat.1|long.1";
				options.theme.szSelectionField = "lat.1|long.1";

				// set xaxis 
				
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
	
	
   ixmaps.PCM_DPC_COVID_LAST_ACTIVE_DIFF = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_active(mydata,options);
			pivot.column("Total").remove();
			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
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
	
   ixmaps.PCM_DPC_COVID_LAST_RECOVERED_DIFF = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_recovered(mydata,options);
			pivot.column("Total").remove();
			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
			var iLast   = pivot.fields.length-1;
			var iBefore = pivot.fields.length-2;

			pivot.addColumn({
				destination: "recovered_before"
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
	
   ixmaps.PCM_DPC_COVID_LAST_RECOVERED_DIFF_MEAN_7 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_recovered(mydata,options);
			pivot.column("Total").remove();
			pivot = __mean_3(pivot);
	
			// make moving average of 7 days
			var records = pivot.records;
			for (var r=0; r<records.length;r++){
				for (var c=records[r].length-1; c>=10;c--){
					records[r][c] = (Number(records[r][c])+
									 Number(records[r][c-1])+
									 Number(records[r][c-2])+
									 Number(records[r][c-3])+
									 Number(records[r][c-4])+
									 Number(records[r][c-5])+
									 Number(records[r][c-6])
									)/7;
				}
			}


			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();

			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			
			var iLast   = pivot.fields.length-1;
			var iBefore = pivot.fields.length-2;

			pivot.addColumn({
				destination: "recovered_before"
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
	
	
	
	ixmaps.PCM_DPC_COVID_ACTUAL = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

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

	
	ixmaps.PCM_DPC_COVID_ACTUAL_PREVALENCE = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
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
				
				mydata.column('totale_ospedalizzati').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('terapia_intensiva').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('totale_positivi').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('ricoverati_con_sintomi').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('nuovi_positivi').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('variazione_totale_positivi').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100000).toFixed(2);
				});
				mydata.column('tamponi').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100).toFixed(2);
				});
				mydata.column('casi_testati').map(function (value,row) {
						return (Number(value)/pop[row[indexName].replace(/\-/," ")]*100).toFixed(2);
				});
				
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
				
			});

	};
	
	
	
	
	
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_DEATHS = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_deaths(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_HOSPITALIZED = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_hospitalized(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_RECOVERED = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_recovered(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
	

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_INTENSIVE = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_intensive(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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

	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_INCIDENCE = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE = function (theme, options) {
		
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

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=11;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-7])
										);
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE_SMOOTH_2 = function (theme, options) {
		
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

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=11;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-7])
										);
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=11;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}
				
				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=11;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_14_INCIDENCE = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=18;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-14])
										);
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_RECOVERED_INCIDENCE = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __get_recovered(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_HOSPITALIZED_INCIDENCE = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __get_hospitalized(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_INTENSIVE_INCIDENCE = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_INTENSIVE_MAX = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/agenas/processing/postiletto-e-ricoverati-areaNonCritica.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get beds in intensive care
				var dataLetti = dataA[1];
				// correct region names
				dataLetti.column("Regioni").map(function (value) {
					if (value == "PA Bolzano") {
						return "P.A. Bolzano";
					} else
					if (value == "PA Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});

				var last_date = dataLetti.column("fonte").values().pop();
				dataLetti = dataLetti.select('WHERE fonte = "'+last_date+'"');
				var letti = dataLetti.lookupArray("PL in Terapia Intensiva","Regioni");

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				pivot.addColumn({
					destination: "posti_letti_ti"
				}, function (row) {
					return (letti[row[indexName].replace(/\-/," ")]);
				});
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("Mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("Apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("Mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("Giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("Lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("Aug");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("Sep");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("Okt");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("Nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("Dec");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_INTENSIVE_MAX = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/agenas/processing/postiletto-e-ricoverati-areaNonCritica.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get beds in intensive care
				var dataLetti = dataA[1];
				// correct region names
				dataLetti.column("Regioni").map(function (value) {
					if (value == "PA Bolzano") {
						return "P.A. Bolzano";
					} else
					if (value == "PA Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});

				var last_date = dataLetti.column("fonte").values().pop();
				dataLetti = dataLetti.select('WHERE fonte = "'+last_date+'"');
				var letti = dataLetti.lookupArray("PL in Terapia Intensiva","Regioni");

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						//records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				pivot.addColumn({
					destination: "posti_letti_ti"
				}, function (row) {
					return (letti[row[indexName].replace(/\-/," ")]);
				});
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				
				columns.pop();

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("Mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("Apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("Mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("Giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("Lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("Aug");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("Sep");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("Okt");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("Nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("Dec");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_INTENSIVE_PERCENT_MAX = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/agenas/processing/postiletto-e-ricoverati-areaNonCritica.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get beds in intensive care
				var dataLetti = dataA[1];
				// correct region names
				dataLetti.column("Regioni").map(function (value) {
					if (value == "PA Bolzano") {
						return "P.A. Bolzano";
					} else
					if (value == "PA Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});

				var last_date = dataLetti.column("fonte").values().pop();
				dataLetti = dataLetti.select('WHERE fonte = "'+last_date+'"');
				var letti = dataLetti.lookupArray("PL in Terapia Intensiva","Regioni");

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/letti[records[r][indexName].replace(/\-/," ")]*100);
					}
				}
				
				pivot.addColumn({
					destination: "posti_letti_ti"
				}, function (row) {
					return (letti[row[indexName].replace(/\-/," ")]);
				});
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				
				columns.pop();

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				columns = columns.slice(-100);
				
				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("Mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("Apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("Mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("Giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("Lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("Aug");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("Sep");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("Okt");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("Nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("Dec");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[columns.length - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_INTENSIVE_PERCENT_MAX = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/agenas/processing/postiletto-e-ricoverati-areaNonCritica.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get beds in intensive care
				var dataLetti = dataA[1];
				// correct region names
				dataLetti.column("Regioni").map(function (value) {
					if (value == "PA Bolzano") {
						return "P.A. Bolzano";
					} else
					if (value == "PA Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});

				var last_date = dataLetti.column("fonte").values().pop();
				dataLetti = dataLetti.select('WHERE fonte = "'+last_date+'"');
				var letti = dataLetti.lookupArray("PL in Terapia Intensiva","Regioni");

				var pivot = __get_intensive(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make percent of intensive care beds
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
						records[r][c] =  (records[r][c]/letti[records[r][indexName].replace(/\-/," ")]*100);
					}
				}
				
				pivot.addColumn({
					destination: "posti_letti_ti"
				}, function (row) {
					return (letti[row[indexName].replace(/\-/," ")]);
				});
				
				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				
				columns.pop();
			
				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				columns = columns.slice(-100);
				
				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("Mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("Apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("Mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("Giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("Lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("Aug");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("Sep");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("Okt");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("Nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("Dec");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[columns.length - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_DEATHS_INCIDENCE = function (theme, options) {
		
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

				// get population lookup for incidence
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

				var pivot = __get_deaths(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				// set colors = columns 
				theme.origColorScheme[0] = columns.length;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_TAMPONRATIO = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_tamponratio(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				for ( var i=0; i<90; i++){
					columns.shift();
				}

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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

				
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_TESTATIRATIO = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_testatiratio(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				for ( var i=0; i<90; i++){
					columns.shift();
				}

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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

				
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_FATALITYRATIO = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_fatalityratio(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				for ( var i=0; i<90; i++){
					columns.shift();
				}

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
				
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_FATALITYRATIO_56 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_fatalityratio(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}
				
				columns = columns.slice(-56);
			
				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[columns.length-1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[columns.length-1])+"</f2>");


			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_DEATHS_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
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

				var pivot = __get_deaths(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
					// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
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

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				columns = columns.slice(-56);

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else
					if (columns[i] == "1/1/2021"){
					  szXaxisA.push("jan");
					}else
					if (columns[i] == "1/2/2021"){
					  szXaxisA.push("feb");
					}else
					if (columns[i] == "1/3/2021"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2021"){
					  szXaxisA.push("apr");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");

		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_56 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				columns = columns.slice(-56);
				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = columns.slice();
				for ( var i=1; i < theme.szXaxisA.length-1; i++ ){
					theme.szXaxisA[i] = (theme.szXaxisA.length-i)%14?" ":new Date(theme.szXaxisA[i]).toLocaleDateString();
				}
				theme.szXaxisA[0] = new Date(theme.szXaxisA[0]).toLocaleDateString();
				theme.szXaxisA[theme.szXaxisA.length-1] = new Date(theme.szXaxisA[theme.szXaxisA.length-1]).toLocaleDateString();

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7_DEATHS_56 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the sources and generate the viz data table
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __get_deaths(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
					}
				}


				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				columns = columns.slice(-56);
				var last = columns.length - 1;
				
				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					if (columns[i] == "1/3/2020"){
					  szXaxisA.push("mar");
					}else
					if (columns[i] == "1/4/2020"){
					  szXaxisA.push("apr");
					}else
					if (columns[i] == "1/5/2020"){
					  szXaxisA.push("mag");
					}else
					if (columns[i] == "1/6/2020"){
					  szXaxisA.push("giu");
					}else
					if (columns[i] == "1/7/2020"){
					  szXaxisA.push("lug");
					}else
					if (columns[i] == "1/8/2020"){
					  szXaxisA.push("ago");
					}else
					if (columns[i] == "1/9/2020"){
					  szXaxisA.push("set");
					}else
					if (columns[i] == "1/10/2020"){
					  szXaxisA.push("ott");
					}else
					if (columns[i] == "1/11/2020"){
					  szXaxisA.push("nov");
					}else
					if (columns[i] == "1/12/2020"){
					  szXaxisA.push("dic");
					}else{
					  szXaxisA.push(" ");
					}
				}

				//szXaxisA[0] = columns[0];
				//szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+(columns[last - 1])+"</f2>");


			
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
   
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
