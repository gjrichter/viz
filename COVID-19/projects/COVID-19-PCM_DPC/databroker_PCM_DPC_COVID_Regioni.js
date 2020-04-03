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
		
    ixmaps.PCM_DPC_COVID_SEQUENCE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
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
	
    ixmaps.PCM_DPC_COVID_SEQUENCE_LAST_15 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
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
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_recovered(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_ACTIVE_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_active_recovered(mydata,options);
			
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_ACTIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_active(mydata,options);

			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
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
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths(mydata,options);
			
			pivot = __mean_3(pivot);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL_INTENSIVE_RECOVERED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital_intensive_recovered(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL_INTENSIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital_intensive(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME_HOSPITAL = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home_hospital(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_DEATHS_HOME = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths_home(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_HOSPITALIZED = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_hospitalized(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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
	
	ixmaps.PCM_DPC_COVID_SEQUENCE_INTENSIVE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_intensive(mydata,options);
	
			pivot = __mean_3(pivot);

			// get the columns with date 
			var columns = pivot.columnNames();
			
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

   
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
