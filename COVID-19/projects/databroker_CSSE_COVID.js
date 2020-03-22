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
						name: "CSSE_COVID_LAST"
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
						name: "CSSE_COVID_LAST_ACTIVE"
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
						name: "CSSE_COVID_LAST_ALL"
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
