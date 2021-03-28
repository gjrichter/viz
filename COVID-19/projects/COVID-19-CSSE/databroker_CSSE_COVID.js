/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.CSSE_COVID_LAST = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];

					var lastDataColumnName = data_Confirmed.columnNames().pop();
					theme.szSizeField = lastDataColumnName;
					theme.szValueField = lastDataColumnName;

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.CSSE_COVID_LAST_DIFF_CONFIRMED = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];

					var columnNamesA = data_Confirmed.columnNames();

					var records = data_Confirmed.records;
					for (var r = 0; r < records.length; r++) {
						for (var c = 4; c < records[r].length - 1; c++) {
							records[r][c] = records[r][c + 1] - records[r][c];
						}
					}

					columnNamesA.pop();
					var szLastColumn = columnNamesA.pop();

					theme.szDescription = "aggiornato: " + szLastColumn;

					theme.szFields = szLastColumn;
					theme.szFieldsA = [szLastColumn];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});
	};


	ixmaps.CSSE_COVID_LAST_DIFF_CONFIRMED_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);

					var columnNamesA = data_Confirmed.columnNames();

					var records = data_Confirmed.records;
					for (var r = 0; r < records.length; r++) {
						for (var c = 4; c < records[r].length - 1; c++) {
							records[r][c] = records[r][c + 1] - records[r][c];
						}
					}

					columnNamesA.pop();
					var szLastColumn = columnNamesA.pop();

					theme.szDescription = "aggiornato: " + szLastColumn;

					theme.szFields = szLastColumn;
					theme.szFieldsA = [szLastColumn];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});
	};



	ixmaps.CSSE_COVID_LAST_ACTIVE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];

					var columnsA = data_Confirmed.columnNames();
					var lastDataColumnName = data_Confirmed.columnNames().pop();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});

					merger.realize(function (dbTable) {

						var index_confirmed = dbTable.column(lastDataColumnName + ".1").index;
						var index_recovered = dbTable.column(lastDataColumnName + ".2").index;
						var index_deaths = dbTable.column(lastDataColumnName + ".3").index;

						dbTable.addColumn({
							destination: "active"
						}, function (row) {
							return (Number(row[index_confirmed]) - Number(row[index_recovered]) - Number(row[index_deaths]));
						})

						dbTable.column("Lat.1").rename("Lat");
						dbTable.column("Long.1").rename("Long");

						theme.szSizeField = "active";
						theme.szValueField = "active";

						theme.szDescription = "aggiornato: " + lastDataColumnName;

						ixmaps.setTitle("aggiornato al: " + lastDataColumnName);

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

	ixmaps.CSSE_COVID_LAST_ALL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					// create key for merger
					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: ["Country/Region", "Lat", "Long", lastDataColumnName]
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: ["Country/Region", "Lat", "Long", lastDataColumnName]
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: ["Country/Region", "Lat", "Long", lastDataColumnName]
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: ["Country/Region", "Lat", "Long", lastDataColumnName]
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column(lastDataColumnName + ".1").index;
						var index_recovered = dbTable.column(lastDataColumnName + ".2").index;
						var index_deaths = dbTable.column(lastDataColumnName + ".3").index;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var r = 0; r < records.length; r++) {
							records[r][index_active] -= records[r][index_recovered];
							records[r][index_active] -= records[r][index_deaths];
						}

						dbTable.column(lastDataColumnName + ".1").rename("Active");
						dbTable.column(lastDataColumnName + ".2").rename("Recovered");
						dbTable.column(lastDataColumnName + ".3").rename("Deaths");

						dbTable.column("Lat.1").rename("Lat");
						dbTable.column("Long.1").rename("Long");
						dbTable.column("Country/Region.1").rename("Country/Region");

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						fieldsA.push("Deaths");
						fieldsA.push("Active");
						fieldsA.push("Recovered");

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat|Long";
						options.theme.szSelectionField = "Lat|Long";

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


	ixmaps.CSSE_COVID_ALL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					var records = data_Active.records;
					for (var r = 0; r < records.length; r++) {
						for (var c = 4; c < records[r].length; c++) {
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({
						destination: "type"
					}, function () {
						return "Confirmed";
					});
					data_Recovered.addColumn({
						destination: "type"
					}, function () {
						return "Recovered";
					});
					data_Deaths.addColumn({
						destination: "type"
					}, function () {
						return "Deaths";
					});
					data_Active.addColumn({
						destination: "type"
					}, function () {
						return "Active";
					});

					data_Confirmed.append(data_Recovered);
					data_Confirmed.append(data_Deaths);
					data_Confirmed.append(data_Active);

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});

	};

	ixmaps.CSSE_COVID_ALL_28 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					var records = data_Active.records;
					for (var r = 0; r < records.length; r++) {
						for (var c = 4; c < records[r].length; c++) {
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({
						destination: "type"
					}, function () {
						return "Confirmed";
					});
					data_Recovered.addColumn({
						destination: "type"
					}, function () {
						return "Recovered";
					});
					data_Deaths.addColumn({
						destination: "type"
					}, function () {
						return "Deaths";
					});
					data_Active.addColumn({
						destination: "type"
					}, function () {
						return "Active";
					});

					data_Confirmed.append(data_Recovered);
					data_Confirmed.append(data_Deaths);
					data_Confirmed.append(data_Active);

					// get last 28 columns
					var last_28 = data_Confirmed.columnNames().slice(-56);

					// set as data fields in actual theme
					options.theme.szFields = last_28.slice().join("|");
					options.theme.szFieldsA = last_28.slice();

					// make label ! -1 because of DIFFERENC theme
					options.theme.szLabelA = last_28.slice(-27);
					options.theme.szXaxisA = last_28.slice(-27);
					for (var i = 1; i < options.theme.szXaxisA.length - 1; i++) {
						options.theme.szXaxisA[i] = " ";
					}

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});

	};

	ixmaps.CSSE_COVID_ALL_28_ALT = function (theme, options) {
		ixmaps.CSSE_COVID_ALL_28(theme, options);
	}

	ixmaps.CSSE_COVID_CONFIRMED_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					options.theme.szFields = columnsA.slice().join("|");
					options.theme.szFieldsA = columnsA;

					options.theme.nClipFrames = columnsA.length;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var xAxis = [];
					for (i in columnsA) {
						var dte = new Date(columnsA[i]);
						xAxis.push(dte.toLocaleDateString());
					}
					options.theme.szXaxisA = xAxis;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_DEATHS_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					var data_Deaths = dataA[0];

					var lastDataColumnName = data_Deaths.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Deaths.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					options.theme.szFields = columnsA.slice().join("|");
					options.theme.szFieldsA = columnsA;

					options.theme.nClipFrames = columnsA.length;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var xAxis = [];
					for (i in columnsA) {
						var dte = new Date(columnsA[i]);
						xAxis.push(dte.toLocaleDateString());
					}
					options.theme.szXaxisA = xAxis;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Deaths, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_DEATHS_CLIP_WEEKS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					var data_Deaths = dataA[0];

					var lastDataColumnName = data_Deaths.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Deaths.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						if ( i%5 ){
							data_Deaths.column(columnsA[i]).remove();
						}else{
							fieldsA.push(columnsA[i]);
							}
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					var szMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					// make label 
					var szXaxisA = [];
					for (i in fieldsA) {
						var dte = new Date(fieldsA[i]);
						szXaxisA.push(szMonth[dte.getMonth()]);
						dte.getMonth();
					}

					// set as data fields in actual theme

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = fieldsA.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Deaths, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_ALL_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.nClipFrames = columnsA.length;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
							var dte = new Date(columnsA[i].split(".")[0]);
							xAxis.push(dte.toLocaleDateString());
						}
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

	ixmaps.CSSE_COVID_ALL_CLIP_DIFF = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.nClipFrames = columnsA.length - 1;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
							var dte = new Date(columnsA[i].split(".")[0]);
							xAxis.push(dte.toLocaleDateString());
						}
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

	ixmaps.CSSE_COVID_ALL_MERGE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
							fieldsA.push(columnsA[i] + ".2");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;
						options.theme.nGridX = 2;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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


	ixmaps.CSSE_COVID_ALL_MERGE_28 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = columnsA.length - 28; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
							fieldsA.push(columnsA[i] + ".2");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;
						options.theme.nGridX = 2;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_ALL_MERGE_DRA = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".3");
							fieldsA.push(columnsA[i] + ".1");
							fieldsA.push(columnsA[i] + ".2");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;
						options.theme.nGridX = 3;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
							var dte = new Date(columnsA[i]);
							xAxis.push(dte.toLocaleDateString());
						}
						//options.theme.szXaxisA = xAxis; 

						var dte = new Date(lastDataColumnName);
						xAxis.push(dte.toLocaleDateString());
						theme.szAxisA = xAxis;
						theme.szDescription = "aggiornato: " + dte.toLocaleDateString();
						ixmaps.setTitle("<span style='background:rgba(255,255,255,0.9);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + dte.toLocaleDateString() + "</span>", "right");



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

	ixmaps.CSSE_COVID_ALL_MERGE_ARD = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
								records[r][index_active] -= records[r][index_deaths];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							dbTable.column(columnsA[i] + ".1").rename(columnsA[i] + " active")
							dbTable.column(columnsA[i] + ".2").rename(columnsA[i] + " recovered")
							dbTable.column(columnsA[i] + ".3").rename(columnsA[i] + " deaths")

							fieldsA.push(columnsA[i] + " active");
							fieldsA.push(columnsA[i] + " recovered");
							fieldsA.push(columnsA[i] + " deaths");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;
						options.theme.nGridX = 3;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
							xAxis.push(" ");
						}
						//options.theme.szXaxisA = xAxis; 

						var dte = new Date(columnsA[0]);
						xAxis[0] = (dte.toLocaleDateString());
						var dte = new Date(lastDataColumnName);
						xAxis[xAxis.length-1] = (dte.toLocaleDateString());
						options.theme.szXaxisA = xAxis;
						
						theme.szDescription = "aggiornato: " + dte.toLocaleDateString();
						ixmaps.setTitle("<span style='background:rgba(255,255,255,0.9);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + dte.toLocaleDateString() + "</span>", "right");



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

	ixmaps.CSSE_COVID_SEQUENCE_DEATHS_ACTIVE_RECOVERED = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_SEQUENCE_DEATHS_ACTIVE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_SEQUENCE_DEATHS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_recovered];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".3");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_SEQUENCE_ACTIVE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						var index_active = dbTable.column("1/22/20.1").index;
						var index_recovered = dbTable.column("1/22/20.2").index;
						var index_deaths = dbTable.column("1/22/20.3").index;
						var days = columnsA.length;

						var fields = dbTable.fields;
						var records = dbTable.records;
						for (var d = 4; d < days; d++) {
							for (var r = 0; r < records.length; r++) {
								records[r][index_active] -= records[r][index_deaths];
								records[r][index_active] -= records[r][index_recovered];
							}
							index_active++;
							index_recovered++;
							index_deaths++;
						}

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_SEQUENCE_CONFIRMED = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.addSource(szUrl4, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					data_Active = dataA[3];

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Active.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.realize(function (dbTable) {

						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();

						// set as data fields in actual theme

						fieldsA = [];
						for (var i = 0; i < columnsA.length; i++) {
							fieldsA.push(columnsA[i] + ".1");
						}

						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;

						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";

						// make label 
						var xAxis = [];
						for (i in columnsA) {
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

	ixmaps.CSSE_COVID_SEQUENCE_CONFIRMED_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var xAxis = [];
					for (i in columnsA) {
						xAxis.push(" ");
					}
					var dte = new Date(columnsA[0]);
					xAxis[0] = dte.toLocaleDateString();
					dte = new Date(columnsA[columnsA.length-1]);
					xAxis[columnsA.length-1] = dte.toLocaleDateString();

					options.theme.szXaxisA = xAxis; 
					
				    options.theme.nClipFrames = columnsA.length;
					
					// set colors = columns 
					theme.origColorScheme[0] = columnsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+xAxis[columnsA.length-1]+"</span");

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_CONFIRMED_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var szXaxisA = [];
					for ( var i =0; i<columnsA.length; i++ ){
                        if (columnsA[i] == "3/1/20"){
  						  szXaxisA.push("mar");
                        }else
                        if (columnsA[i] == "4/1/20"){
  						  szXaxisA.push("apr");
                        }else
                        if (columnsA[i] == "5/1/20"){
  						  szXaxisA.push("may");
                        }else
                        if (columnsA[i] == "6/1/20"){
  						  szXaxisA.push("jun");
                        }else
                        if (columnsA[i] == "7/1/20"){
  						  szXaxisA.push("jul");
                        }else
                        if (columnsA[i] == "8/1/20"){
  						  szXaxisA.push("aug");
                        }else
                        if (columnsA[i] == "9/1/20"){
  						  szXaxisA.push("sep");
                        }else
                        if (columnsA[i] == "10/1/20"){
  						  szXaxisA.push("oct");
                       }else
                        if (columnsA[i] == "11/1/20"){
  						  szXaxisA.push("nov");
                       }else
                        if (columnsA[i] == "12/1/20"){
  						  szXaxisA.push("dec");
                       }else
                        if (columnsA[i] == "1/1/21"){
  						  szXaxisA.push("jan");
                       }else
                        if (columnsA[i] == "2/1/21"){
  						  szXaxisA.push("feb");
                       }else{
						  szXaxisA.push(" ");
                        }
					}
					
					/**
					var dte = new Date(columnsA[0]);
					szXaxisA[0] = dte.toLocaleDateString();
					dte = new Date(columnsA[columnsA.length-1]);
					szXaxisA[columnsA.length-1] = dte.toLocaleDateString();
					**/
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = columnsA.length;
					
					// set colors = columns 
					theme.origColorScheme[0] = columnsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+szXaxisA[columnsA.length-1]+"</span");

					data_Confirmed.addColumn({"destination":"name/combined"},function(row){
						return row[0].length?(row[0]+" ("+row[1]+")"):row[1];
					});
					
					// -----------------------------------------------------------------------------------------------         // deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_CONFIRMED_MEAN_7_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var szXaxisA = [];
					for (i in columnsA) {
						var dte = new Date(columnsA[i]);
						szXaxisA.push(dte.toLocaleDateString());
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = columnsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+szXaxisA[columnsA.length-1]+"</span");

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_CONFIRMED_MEAN_7_CLIP_WEEKS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						if ( i%5 ){
							data_Confirmed.column(columnsA[i]).remove();
						}else{
							fieldsA.push(columnsA[i]);
							}
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					var szMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					// make label 
					var szXaxisA = [];
					for (i in fieldsA) {
						var dte = new Date(fieldsA[i]);
						szXaxisA.push(szMonth[dte.getMonth()]);
						dte.getMonth();
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = fieldsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};
	
	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_CONFIRMED_MEAN_7_CLIP_WEEKS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						if ( i%5 ){
							data_Confirmed.column(columnsA[i]).remove();
						}else{
							fieldsA.push(columnsA[i]);
							}
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					var szMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					// make label 
					var szXaxisA = [];
					for (i in fieldsA) {
						var dte = new Date(fieldsA[i]);
						szXaxisA.push(szMonth[dte.getMonth()]);
						dte.getMonth();
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = fieldsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DEATHS_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var xAxis = [];
					for (i in columnsA) {
						xAxis.push(" ");
					}
					var dte = new Date(columnsA[0]);
					xAxis[0] = dte.toLocaleDateString();
					dte = new Date(columnsA[columnsA.length-1]);
					xAxis[columnsA.length-1] = dte.toLocaleDateString();

					options.theme.szXaxisA = xAxis; 
					
					theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+xAxis[columnsA.length-1]+"</span");

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_DEATHS_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var szXaxisA = [];
					for ( var i =0; i<columnsA.length; i++ ){
                        if (columnsA[i] == "3/1/20"){
  						  szXaxisA.push("mar");
                        }else
                        if (columnsA[i] == "4/1/20"){
  						  szXaxisA.push("apr");
                        }else
                        if (columnsA[i] == "5/1/20"){
  						  szXaxisA.push("may");
                        }else
                        if (columnsA[i] == "6/1/20"){
  						  szXaxisA.push("jun");
                        }else
                        if (columnsA[i] == "7/1/20"){
  						  szXaxisA.push("jul");
                        }else
                        if (columnsA[i] == "8/1/20"){
  						  szXaxisA.push("aug");
                        }else
                        if (columnsA[i] == "9/1/20"){
  						  szXaxisA.push("sep");
                        }else
                        if (columnsA[i] == "10/1/20"){
  						  szXaxisA.push("oct");
                       }else
                        if (columnsA[i] == "11/1/20"){
  						  szXaxisA.push("nov");
                       }else
                        if (columnsA[i] == "12/1/20"){
  						  szXaxisA.push("dec");
                       }else
                        if (columnsA[i] == "1/1/21"){
  						  szXaxisA.push("jan");
                       }else
                        if (columnsA[i] == "2/1/21"){
  						  szXaxisA.push("feb");
                       }else{
						  szXaxisA.push(" ");
                        }
					}
					
					/**
					var dte = new Date(columnsA[0]);
					szXaxisA[0] = dte.toLocaleDateString();
					dte = new Date(columnsA[columnsA.length-1]);
					szXaxisA[columnsA.length-1] = dte.toLocaleDateString();
					**/
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = columnsA.length;
					
					// set colors = columns 
					theme.origColorScheme[0] = columnsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+szXaxisA[columnsA.length-1]+"</span");

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_DEATHS_MEAN_7_CLIP_WEEKS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Deaths = __mean_7(dataA[0]);
					data_Deaths = __difference(data_Deaths);

					var lastDataColumnName = data_Deaths.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Deaths.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						if ( i%5 ){
							data_Deaths.column(columnsA[i]).remove();
						}else{
							fieldsA.push(columnsA[i]);
							}
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					var szMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					// make label 
					var szXaxisA = [];
					for (i in fieldsA) {
						var dte = new Date(fieldsA[i]);
						szXaxisA.push(szMonth[dte.getMonth()]);
						dte.getMonth();
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = fieldsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Deaths, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_PERCENT_MEAN_7_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference_percent(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						fieldsA.push(columnsA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var szXaxisA = [];
					for (i in columnsA) {
						var dte = new Date(columnsA[i]);
						szXaxisA.push(dte.toLocaleDateString());
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = columnsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+columnsA[columnsA.length-1];
					ixmaps.setTitle("<span style='color:#888888'>"+szXaxisA[columnsA.length-1]+"</span");

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_SEQUENCE_DIFFERENCE_PERCENT_MEAN_7_CLIP_WEEKS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.realize(

				function (dataA) {

					data_Confirmed = __mean_7(dataA[0]);
					data_Confirmed = __difference_percent(data_Confirmed);

					var lastDataColumnName = data_Confirmed.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();

					fieldsA = [];
					for (var i = 0; i < columnsA.length; i++) {
						if ( i%5 ){
							data_Confirmed.column(columnsA[i]).remove();
						}else{
							fieldsA.push(columnsA[i]);
							}
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					var szMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					// make label 
					var szXaxisA = [];
					for (i in fieldsA) {
						var dte = new Date(fieldsA[i]);
						szXaxisA.push(dte.getDate() +" "+ szMonth[dte.getMonth()]);
						dte.getMonth();
					}
					
					options.theme.szXaxisA = szXaxisA; 
					
				    options.theme.nClipFrames = fieldsA.length;

                    theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 
					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.CSSE_COVID_LAST_DAILY = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					szDate = date.toISOString();
					dateA = szDate.split("T")[0].split("-");
					szDate = dateA[1] + "-" + dateA[2] + "-" + dateA[0];

					new Data.Broker()
						.addSource(szUrl2 + szDate + ".csv", "csv")
						.realize(
							function (dataA) {

								var data = dataA[0];

								var iConfirmed = data.column("Confirmed").index;
								var iDeaths = data.column("Deaths").index;
								var iRecovered = data.column("Recovered").index;

								data.addColumn({
									destination: "Active_calc"
								}, function (row) {
									return (Number(row[iConfirmed]) -
										Number(row[iDeaths]) -
										Number(row[iRecovered])
									);
								});

								// -----------------------------------------------------------------------------------------------             
								// deploy the data
								// ----------------------------------------------------------------------------------------------- 

								ixmaps.setExternalData(data, {
									type: "dbtable",
									name: options.name
								});

							});
				});

	};

	ixmaps.CSSE_COVID_LAST_DAILY_DIFF = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var columnNamesA = dataA[0].columnNames();

					var date = columnNamesA.pop();
					var dateA = date.split("/");
					var date2 = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);

					date = columnNamesA.pop();
					dateA = date.split("/");
					var date1 = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);

					var szDate1 = date1.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];

					var szDate2 = date2.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];

					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.realize(
							function (dataA) {

								var data = dataA[0];

								var iConfirmed = data.column("Confirmed").index;
								var iDeaths = data.column("Deaths").index;
								var iRecovered = data.column("Recovered").index;
								var iActive = data.column("Active").index;

								data.addColumn({
									destination: "Active_calc"
								}, function (row) {
									return (Number(row[iConfirmed]) -
										Number(row[iDeaths]) -
										Number(row[iRecovered])
									);
								});
								var iActiveCalc = data.column("Active_calc").index;

								var data = dataA[1];

								data.addColumn({
									destination: "Active_calc"
								}, function (row) {
									return (Number(row[iConfirmed]) -
										Number(row[iDeaths]) -
										Number(row[iRecovered])
									);
								});

								var columnsA = dataA[1].columnNames();

								dataA[0].addColumn({
									destination: "my_key"
								}, function (row) {
									return row[1] + "," + row[2] + "," + row[3];
								});
								dataA[1].addColumn({
									destination: "my_key"
								}, function (row) {
									return row[1] + "," + row[2] + "," + row[3];
								});

								var merger = new Data.Merger();
								merger.addSource(dataA[0], {
									lookup: "my_key",
									columns: columnsA
								});
								merger.addSource(dataA[1], {
									lookup: "my_key",
									columns: columnsA
								});

								merger.realize(function (dbTable) {

									var iConfirmed1 = dbTable.column("Confirmed.1").index;
									var iConfirmed2 = dbTable.column("Confirmed.2").index;

									dbTable.addColumn({
										destination: "diff"
									}, function (row) {
										return (Number(row[iConfirmed2]) - Number(row[iConfirmed1]));
									});
									var iDiff = dbTable.column("diff").index;
									dbTable.addColumn({
										destination: "diff_percent"
									}, function (row) {
										if (Number(row[iDiff]) && (Number(row[iConfirmed1]) > 100)) {
											return (Number(row[iDiff]) / Number(row[iConfirmed1]) * 100);
										}
										return 0;
									});

									// -----------------------------------------------------------------------------------------------            
									// deploy the data
									// ----------------------------------------------------------------------------------------------- 

									ixmaps.setExternalData(dbTable, {
										type: "dbtable",
										name: options.name
									});
								});

							});
				});

	};

	ixmaps.CSSE_COVID_LAST_DAILY_DIFF_GLOBAL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];

					var columnNamesA = data_Confirmed.columnNames();
					var szLastColumn = columnNamesA.pop();
					var szBeforeColumn = columnNamesA.pop();

					var iLast = data_Confirmed.column(szLastColumn).index;
					var iBefore = data_Confirmed.column(szBeforeColumn).index;

					theme.szDescription = "aggiornato: " + szLastColumn;

					data_Confirmed.addColumn({
						destination: "diff"
					}, function (row) {
						return (Number(row[iLast]) - Number(row[iBefore]));
					});
					var iDiff = data_Confirmed.column("diff").index;
					data_Confirmed.addColumn({
						destination: "diff_percent"
					}, function (row) {
						if (Number(row[iDiff]) && (Number(row[iBefore]) > 100)) {
							return (Number(row[iDiff]) / Number(row[iBefore]) * 100).toFixed(2);
						}
						return 0;
					});

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.CSSE_COVID_LAST_DAILY_DIFF_GLOBAL_MEAN_7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];
					
					data_Confirmed = __mean_7(data_Confirmed);

					var columnNamesA = data_Confirmed.columnNames();
					var szLastColumn = columnNamesA.pop();
					var szBeforeColumn = columnNamesA.pop();

					var iLast = data_Confirmed.column(szLastColumn).index;
					var iBefore = data_Confirmed.column(szBeforeColumn).index;

					theme.szDescription = "aggiornato: " + szLastColumn;

					data_Confirmed.addColumn({
						destination: "diff"
					}, function (row) {
						return (Number(row[iLast]) - Number(row[iBefore]));
					});
					var iDiff = data_Confirmed.column("diff").index;
					data_Confirmed.addColumn({
						destination: "diff_percent"
					}, function (row) {
						if (Number(row[iDiff]) && (Number(row[iBefore]) > 100)) {
							return (Number(row[iDiff]) / Number(row[iBefore]) * 100).toFixed(2);
						}
						return 0;
					});

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
						type: "dbtable",
						name: options.name
					});
				});
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
	 var __mean_5 = function(table) { 
		
		// make mean of 3 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=4; c<records[r].length; c++){
				records[r][c] = (Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2])+Number(records[r][c+3])+Number(records[r][c+4]))/5;
			}
		}
		var columns = table.columnNames();
		table.column(columns.pop()).remove();
		table.column(columns.pop()).remove();
		table.column(columns.pop()).remove();
		table.column(columns.pop()).remove();
		
		return table;
     };  
	 var __mean_7 = function(table) {
		
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
	
	 var __difference = function(table) {
		
		// make difference from day to day
        // remove first value column 
        // !! don't touch the first 4 columns 
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=4; c--){
				records[r][c] = (Number(records[r][c])-Number(records[r][c-1])).toFixed(2);
			}
		}
		var columns = table.columnNames();
		table.column(columns[4]).remove();
		
		return table;
     };  
 
	 var __difference_percent = function(table) {
		
		// make difference from day to day
        // remove first value column 
        // !! don't touch the first 4 columns 
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=4; c--){
				if ( (Number(records[r][c])-Number(records[r][c-1])) && (Number(records[r][c-1]) > 100) ) {
					records[r][c] = ((Number(records[r][c])-Number(records[r][c-1])) / (Number(records[r][c-1])) * 100).toFixed(2);
				}else{
					records[r][c] = 0;
				}
			}
		}
		var columns = table.columnNames();
		table.column(columns[4]).remove();
		
		return table;
     };  
    

    
	ixmaps.CSSE_COVID_LAST_ACTIVE_DIFF_GLOBAL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				function (dataA) {

					data_Confirmed 	= __mean_3(dataA[0]);
					data_Recovered 	= __mean_3(dataA[1]);
					data_Deaths 	= __mean_3(dataA[2]);
	
					var columnsA = data_Confirmed.columnNames();
					var lastDataColumnName = data_Confirmed.columnNames().pop();

					data_Confirmed.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Recovered.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});
					data_Deaths.addColumn({
						destination: "position"
					}, function (row) {
						return row[0] + row[1];
					});

					var merger = new Data.Merger();
					merger.addSource(data_Confirmed, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
						columns: columnsA
					});
					merger.addSource(data_Deaths, {
						lookup: "position",
						columns: columnsA
					});

					merger.realize(function (dbTable) {

						var index_confirmed = dbTable.column(lastDataColumnName + ".1").index;
						var index_recovered = dbTable.column(lastDataColumnName + ".2").index;
						var index_deaths = dbTable.column(lastDataColumnName + ".3").index;

						dbTable.addColumn({
							destination: "active"
						}, function (row) {
							return (Number(row[index_confirmed]) - Number(row[index_recovered]) - Number(row[index_deaths]));
						})
						dbTable.addColumn({
							destination: "active_before"
						}, function (row) {
							return (Number(row[index_confirmed - 1]) - Number(row[index_recovered - 1]) - Number(row[index_deaths - 1]));
						})

						var iLast = dbTable.column("active").index;
						var iBefore = dbTable.column("active_before").index;


						dbTable.addColumn({
							destination: "diff"
						}, function (row) {
							return (Number(row[iLast]) - Number(row[iBefore]));
						});

						var iDiff = dbTable.column("diff").index;
						dbTable.addColumn({
							destination: "diff_percent"
						}, function (row) {
							if (Number(row[iDiff]) && (Number(row[iBefore]) > 100)) {
								return (Number(row[iDiff]) / Number(row[iBefore]) * 100);
							}
							return 0;
						});
						
						dbTable.column("Lat.1").rename("Lat");
						dbTable.column("Long.1").rename("Long");
						dbTable.column("Country/Region.1").rename("Country/Region");


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

	ixmaps.CSSE_COVID_CONFIRMED_GROWTH_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data_Confirmed = dataA[0];

					var columnNamesA = data_Confirmed.columnNames();

					var records = data_Confirmed.records;
					for (var r = 0; r < records.length; r++) {
						for (var c = 4; c < records[r].length - 1; c++) {
							records[r][c] = (Number(records[r][c]) > 100) ? ((Number(records[r][c + 1]) - Number(records[r][c])) / Number(records[r][c]) * 100) : 0;
						}
					}
					columnNamesA.pop();
					var szLastColumn = columnNamesA.pop();

					theme.szDescription = "aggiornato: " + szLastColumn;

					columnNamesA.shift();
					columnNamesA.shift();
					columnNamesA.shift();
					columnNamesA.shift();

					// set as data fields in actual theme

					fieldsA = [];
					for (var i = 0; i < columnNamesA.length; i++) {
						fieldsA.push(columnNamesA[i]);
					}

					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					options.theme.nClipFrames = columnNamesA.length;

					options.theme.szItemField = "Lat|Long";
					options.theme.szSelectionField = "Lat|Long";

					// make label 
					var xAxis = [];
					for (i in columnNamesA) {
						var dte = new Date(columnNamesA[i].split(".")[0]);
						xAxis.push(dte.toLocaleDateString());
					}
					options.theme.szXaxisA = xAxis;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data_Confirmed, {
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
