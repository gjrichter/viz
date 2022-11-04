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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
			 keep:["lat","long","denominazione_regione","codice_nuts_2"]}
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
	
	__mean_7 = function(table) {
		
		// make mean of 7 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=10; c--){
				records[r][c] = ((Number(records[r][c])+
								 Number(records[r][c-1])+
								 Number(records[r][c-2])+
								 Number(records[r][c-3])+
								 Number(records[r][c-4])+
								 Number(records[r][c-5])+
								 Number(records[r][c-6]))/7).toFixed(2);
			}
		}
		var columns = table.columnNames();
		table.column(columns[4]).remove();
		table.column(columns[5]).remove();
		table.column(columns[6]).remove();
		table.column(columns[7]).remove();
		table.column(columns[8]).remove();
		table.column(columns[9]).remove();
		
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
	
   var __get_xaxis = function(columns) { 
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
			  szXaxisA.push("gen");
			}else
			if (columns[i] == "1/2/2021"){
			  szXaxisA.push("feb");
			}else
			if (columns[i] == "1/3/2021"){
			  szXaxisA.push("mar");
			}else
			if (columns[i] == "1/4/2021"){
			  szXaxisA.push("apr");
			}else
			if (columns[i] == "1/5/2021"){
			  szXaxisA.push("mag");
			}else
			if (columns[i] == "1/6/2021"){
			  szXaxisA.push("giu");
			}else
			if (columns[i] == "1/7/2021"){
			  szXaxisA.push("lug");
			}else
			if (columns[i] == "1/8/2021"){
			  szXaxisA.push("ago");
			}else
			if (columns[i] == "1/9/2021"){
			  szXaxisA.push("set");
			}else
			if (columns[i] == "1/10/2021"){
			  szXaxisA.push("ott");
			}else
			if (columns[i] == "1/11/2021"){
			  szXaxisA.push("nov");
			}else
			if (columns[i] == "1/12/2021"){
			  szXaxisA.push("dic");
			}else
			if (columns[i] == "1/1/2022"){
			  szXaxisA.push("gen");
			}else{
			  szXaxisA.push(" ");
			}
		}
	   	return szXaxisA;
    };
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;
				
				// get the columns with date 
				var columnsA = pivot.columnNames();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
			
				for ( var i=0; i<columnsA.length; i++ ){
					pivot.column(columnsA[i]).rename(new Date(columnsA[i]).toLocaleDateString());
					columnsA[i] = new Date(columnsA[i]).toLocaleDateString();	
				}
				
				columnsA = columnsA.slice(-56);
				var last = columnsA.length - 1;

				// and configure the theme
				theme.szFields = columnsA.slice().join('|');
				theme.szFieldsA = columnsA.slice();

				// and set the label (for difference 1 less)
				//columns.shift();
				theme.szLabelA = columnsA.slice();

				theme.szXaxisA = __get_xaxis(columnsA);
			
				theme.szSnippet = "dal " + columnsA[0] + " al " + columnsA[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columnsA[last - 1]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {

				// get population lookup for incidence
				// ----------------------------------
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

				// get COVID data
				var pivot = __process(dataA[0], options);
			
				pivot.column("Total").remove();
				var indexName = pivot.column("denominazione_regione").index;
				
				// make sum of 7 days
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
						records[r][c] = (Number(records[r][c])-
										 Number(records[r][c-1])
										)*7;
						records[r][c] =  (records[r][c]/pop[records[r][indexName].replace(/\-/," ")]*100000);
					}
				}
				
				// get the columns with date 
				var columnsA = pivot.columnNames();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
				columnsA.shift();
			
				for ( var i=0; i<columnsA.length; i++ ){
					pivot.column(columnsA[i]).rename(new Date(columnsA[i]).toLocaleDateString());
					columnsA[i] = new Date(columnsA[i]).toLocaleDateString();	
				}
				
				columnsA = columnsA.slice(-56);
				var last = columnsA.length - 1;

				// and configure the theme
				theme.szFields = columnsA.slice().join('|');
				theme.szFieldsA = columnsA.slice();

				// and set the label (for difference 1 less)
				//columns.shift();
				theme.szLabelA = columnsA.slice();

				theme.szXaxisA = __get_xaxis(columnsA);
			
				theme.szSnippet = "dal " + columnsA[0] + " al " + columnsA[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columnsA[last - 1]+"</span>");
		
				// ---------------------------------------------------------------------------------------------- 
				// deploy the data
				// ---------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE_FATALITIES_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_INTENSIVE_SEQUENCE_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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

				// make roling mean 7 days
				// pivot = __mean_7(pivot);
				// make incidences
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last - 1]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
   
	ixmaps.PCM_DPC_COVID_INTENSIVE_SEQUENCE_MEAN_7_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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

				// make roling mean 7 days
				pivot = __mean_7(pivot);
				// make incidences
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last - 1]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
   
	ixmaps.PCM_DPC_COVID_HOSPITALIZED_SEQUENCE_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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

				// make roling mean 7 days
				// pivot = __mean_7(pivot);
				// make incidences
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last - 1]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};
   
	ixmaps.PCM_DPC_COVID_HOSPITALIZED_SEQUENCE_MEAN_7_INCIDENCE_56 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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

				// make roling mean 7 days
				pivot = __mean_7(pivot);
				// make incidences
				var records = pivot.records;
				for (var r=0; r<records.length;r++){
					for (var c=records[r].length-1; c>=4;c--){
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
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last - 1]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	
	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE_28 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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
			
				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}
				
				columns = columns.slice(-28);
				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last]+"</span>");
		
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_CUMUL_7_INCIDENCE_FATALITIES_28 = function (theme, options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// ----------------------------------------------------------------------------------------------         
		// read the data
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
			
				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}
				
				columns = columns.slice(-28);
				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				//columns.shift();
				theme.szLabelA = columns.slice();

				theme.szXaxisA = __get_xaxis(columns);
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
				ixmaps.setTitle("<span style='color:#666666;font-family:courier new,Raleway,arial,helvetica;'> date:"+columns[last]+"</span>");
		
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
