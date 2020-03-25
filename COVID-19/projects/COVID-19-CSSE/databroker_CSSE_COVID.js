/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.CSSE_COVID_LAST = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		
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
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
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

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		
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
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Confirmed.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
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

	ixmaps.CSSE_COVID_LAST_ALL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		
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
					
					theme.szSizeField = lastDataColumnName;													  
					//theme.szValueField = lastDataColumnName;	
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Active.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({destination:"type"},function(){return "Confirmed";});
					data_Recovered.addColumn({destination:"type"},function(){return "Recovered";});
					data_Deaths.addColumn({destination:"type"},function(){return "Deaths";});
					data_Active.addColumn({destination:"type"},function(){return "Active";});
					
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
	
		
	ixmaps.CSSE_COVID_ALL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		
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
					
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Active.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({destination:"type"},function(){return "Confirmed";});
					data_Recovered.addColumn({destination:"type"},function(){return "Recovered";});
					data_Deaths.addColumn({destination:"type"},function(){return "Deaths";});
					data_Active.addColumn({destination:"type"},function(){return "Active";});
					
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

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		
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
					
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Active.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({destination:"type"},function(){return "Confirmed";});
					data_Recovered.addColumn({destination:"type"},function(){return "Recovered";});
					data_Deaths.addColumn({destination:"type"},function(){return "Deaths";});
					data_Active.addColumn({destination:"type"},function(){return "Active";});
					
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
					for ( var i=1; i < options.theme.szXaxisA.length-1; i++ ){
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
	
	ixmaps.CSSE_COVID_ALL_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		
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
					
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Active.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}

					data_Confirmed.addColumn({destination:"type"},function(){return "Confirmed";});
					data_Recovered.addColumn({destination:"type"},function(){return "Recovered";});
					data_Deaths.addColumn({destination:"type"},function(){return "Deaths";});
					data_Active.addColumn({destination:"type"},function(){return "Active";});
					
					data_Confirmed.append(data_Recovered);
					data_Confirmed.append(data_Deaths);
					data_Confirmed.append(data_Active);
					
					// get data columns
					var columnsA = data_Confirmed.columnNames();

					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.shift();
					columnsA.pop();

					// set as data fields in actual theme
					options.theme.szFields = columnsA.slice().join("|");
					options.theme.szFieldsA = columnsA.slice();

					options.theme.nClipFrames = columnsA.length;

					// make label 
					var xAxis = [];
					for ( i in columnsA ){
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

	ixmaps.CSSE_COVID_ALL_MERGE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
		var szUrl4 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
		
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
					
					theme.szDescription = "aggiornato: "+lastDataColumnName;
					
					var records = data_Active.records;
					for ( var r=0; r<records.length; r++){
						for ( var c=4; c<records[r].length; c++){
							records[r][c] -= data_Recovered.records[r][c];
							records[r][c] -= data_Deaths.records[r][c];
						}
					}
					
					// get data columns
					var columnsA = data_Confirmed.columnNames();
					
					data_Confirmed.addColumn({destination:"position"},function(row){return row[2]+row[3];});
					data_Recovered.addColumn({destination:"position"},function(row){return row[2]+row[3];});
					data_Deaths.addColumn({destination:"position"},function(row){return row[2]+row[3];});
					data_Active.addColumn({destination:"position"},function(row){return row[2]+row[3];});

					console.log(data_Active);
					var merger = new Data.Merger();
					merger.addSource(data_Active, {
						lookup: "position",
                    	columns: columnsA
					});
					merger.addSource(data_Recovered, {
						lookup: "position",
                    	columns: columnsA	
					});
					merger.realize(function (dbTable) {
						console.log(dbTable);
						
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						columnsA.shift();
						
						// set as data fields in actual theme
						
						fieldsA = [];
						for ( var i=0; i<columnsA.length; i++ ){
							fieldsA.push(columnsA[i]+".1");
							fieldsA.push(columnsA[i]+".2");
						}
						
						options.theme.szFields = fieldsA.slice().join("|");
						options.theme.szFieldsA = fieldsA;
						
						options.theme.szItemField = "Lat.1|Long.1";
						options.theme.szSelectionField = "Lat.1|Long.1";
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
								
								var iConfirmed 	= data.column("Confirmed").index;
								var iDeaths 	= data.column("Deaths").index;
								var iRecovered 	= data.column("Recovered").index;
								var iActive 	= data.column("Active").index;
								
								data.addColumn({destination:"Active_calc"},function(row){
									return(Number(row[iConfirmed]) -
										   Number(row[iDeaths]) - 
										   Number(row[iRecovered])
									);
								});
								
								// -----------------------------------------------------------------------------------------------               
								// deploy the data
								// ----------------------------------------------------------------------------------------------- 

								ixmaps.setExternalData(dataA[0], {
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
