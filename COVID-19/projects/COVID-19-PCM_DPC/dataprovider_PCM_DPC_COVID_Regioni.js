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

				var days = pivot.columnNames().length-10;
				var startColumn = pivot.columnNames().length-1;
				for (var day = 1; day<=days; day++,startColumn--){
						pivot.addColumn({destination:"free_days_"+day},function(row){
						var free = row[startColumn];
							return free;
					});
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				var last = columns.length - 2;
			
				// and configure the theme
				var columnA = [];
				for (var day = 0; day<days; day++){
					columnA.push("free_days_"+(days-day));
				}
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				var dateColumnsA = pivot.columnNames();
				var datesA = [];
				for (var day = 0; day<days; day++){
					datesA.push(new Date(dateColumnsA[startColumn++]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = days;

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

				var days = pivot.columnNames().length-10;
				var startColumn = pivot.columnNames().length-1;
				for (var day = 1; day<=days; day++,startColumn--){
						pivot.addColumn({destination:"free_days_"+day},function(row){
						var free = row[startColumn];
							return free;
					});
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				var last = columns.length - 2;
			
				// and configure the theme
				var columnA = [];
				for (var day = 0; day<days; day++){
					columnA.push("free_days_"+(days-day));
				}
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				var dateColumnsA = pivot.columnNames();
				var datesA = [];
				for (var day = 0; day<days; day++){
					datesA.push(new Date(dateColumnsA[startColumn++]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = days;

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

				var days = pivot.columnNames().length-10;
				var startColumn = pivot.columnNames().length-1;
				for (var day = 1; day<=days; day++,startColumn--){
						pivot.addColumn({destination:"free_days_"+day},function(row){
						var free = row[startColumn];
							return free;
					});
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				var last = columns.length - 2;
			
				// and configure the theme
				var columnA = [];
				for (var day = 0; day<days; day++){
					columnA.push("free_days_"+(days-day));
				}
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				var dateColumnsA = pivot.columnNames();
				var datesA = [];
				for (var day = 0; day<days; day++){
					datesA.push(new Date(dateColumnsA[startColumn++]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = days;

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

	ixmaps.PCM_DPC_DEATHS_CLIP = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the data from GitHub and process 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_deaths(mydata,options);
			
				pivot.column("Total").remove();

				var days = pivot.columnNames().length-10;
				var startColumn = pivot.columnNames().length-1;
				for (var day = 1; day<=days; day++,startColumn--){
						pivot.addColumn({destination:"free_days_"+day},function(row){
						var free = row[startColumn];
							return free;
					});
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				var last = columns.length - 2;
			
				// and configure the theme
				var columnA = [];
				for (var day = 0; day<days; day++){
					columnA.push("free_days_"+(days-day));
				}
				theme.szFields = columnA.join("|");
				theme.szFieldsA = columnA;
			
				var dateColumnsA = pivot.columnNames();
				var datesA = [];
				for (var day = 0; day<days; day++){
					datesA.push(new Date(dateColumnsA[startColumn++]).toLocaleDateString());
				}
				theme.szXaxisA = datesA;
			
				theme.nClipFrames = days;

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

				
				
				
   
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
