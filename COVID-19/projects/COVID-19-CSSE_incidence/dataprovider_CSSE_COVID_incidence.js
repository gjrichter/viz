/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {


	__cumul_7 = function(table) {
		
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
								 Number(records[r][c-6]))).toFixed(2);
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
	
	__every_7 = function(table) {
		
		// remove columns to get a table with data every 28 day
		var columnsA = table.columnNames();

		// skip first 4 columns 
		columnsA.shift();
		columnsA.shift();
		columnsA.shift();
		columnsA.shift();

		var len = columnsA.length;
		for (var i = 0; i < len; i++) {
		  if ( i%7 ){
			table.column(columnsA[len-1-i]).remove();
		  }
		}
	
		return table;
    };	
	
	
	
	ixmaps.CSSE_COVID_LAST_28_DAILY_INCIDENCE = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __cumul_7(dataA[0]);
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-27);
					var xaxis = columnsA.slice(-27);
					
					theme.szFields = columnsA.slice(-28).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	

	ixmaps.CSSE_COVID_LAST_28_DAILY_INCIDENCE_FATALITIES = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __cumul_7(dataA[0]);
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-27);
					var xaxis = columnsA.slice(-27);
					
					theme.szFields = columnsA.slice(-28).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_56_DAILY_INCIDENCE = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __cumul_7(dataA[0]);
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-55);
					var xaxis = columnsA.slice(-55);
					
					theme.szFields = columnsA.slice(-56).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	

	ixmaps.CSSE_COVID_LAST_56_DAILY_INCIDENCE_FATALITIES = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __cumul_7(dataA[0]);
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-55);
					var xaxis = columnsA.slice(-55);
					
					theme.szFields = columnsA.slice(-56).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_ALL_WEEKLY_INCIDENCE = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7((dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					var dataCols = columnsA.length-4;
					var label = columnsA.slice(-(dataCols-1));
					var xaxis = columnsA.slice(-(dataCols-1));
					
					theme.szFields = columnsA.slice(-dataCols).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_ALL_WEEKLY_INCIDENCE_FATALITIES = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7(__mean_7(dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					var dataCols = columnsA.length-4;
					var label = columnsA.slice(-(dataCols-1));
					var xaxis = columnsA.slice(-(dataCols-1));
					
					theme.szFields = columnsA.slice(-dataCols).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	
	ixmaps.CSSE_COVID_LAST_54_WEEKLY_INCIDENCE = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7((dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-55);
					var xaxis = columnsA.slice(-55);
					
					theme.szFields = columnsA.slice(-56).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_54_WEEKLY_INCIDENCE_FATALITIES = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7(__mean_7(dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-55);
					var xaxis = columnsA.slice(-55);
					
					theme.szFields = columnsA.slice(-56).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_20_WEEKLY_INCIDENCE = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7(__mean_7(dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-20);
					var xaxis = columnsA.slice(-20);
					
					theme.szFields = columnsA.slice(-21).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
						type: "dbtable",
						name: options.name
					});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_20_WEEKLY_INCIDENCE_FATALITIES = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		// get country populations 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
					var popA = dataA[1].lookupArray("2019","Country Name");
					
					popA["US"] = popA["United States"];
					popA["Russia"] = popA["Russian Federation"];
					popA["Czechia"] = popA["Czech Republic"];

					for (var i in popA){
						if (popA[i] < 1000000){
						  popA[i] = null;
						}
					}

					var confirmed_7 = __every_7(__mean_7(dataA[0]));
					columnsA = confirmed_7.columnNames();
					
					for (var i = 4; i<columnsA.length; i++){
						confirmed_7.column(columnsA[i]).map(function(value,row){
							return (Number(value)/Number(popA[row[1]])*100000).toFixed(2);
						})
					}
					
					console.log(confirmed_7);
					var label = columnsA.slice(-20);
					var xaxis = columnsA.slice(-20);
					
					theme.szFields = columnsA.slice(-21).join("|");
					
					var date = columnsA.pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					var lastDate = date.toLocaleDateString();
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
					
					// --------------------------------------
					// deploy the data
					// --------------------------------------
					console.log(theme);
					options.setData(confirmed_7, {
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
