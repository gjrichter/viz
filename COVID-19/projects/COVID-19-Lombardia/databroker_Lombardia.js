/**
 * data broker for COVID-19 Map
 * loads D3 and data 
 * parses data into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.TA_COVID19_RL = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/regioneLombardia/processing/TA_COVID19_RL.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	
	ixmaps.TA_COVID19_RL_D3 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/regioneLombardia/processing/TA_COVID19_RL.csv";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("http://d3js.org/d3.v3.min.js"),
			$.getScript("https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Lombardia/chart.js"),
			$.Deferred(function (deferred) {
				$(deferred.resolve);
			})
		).done(function () {

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
						type: "dbtable",
						name: options.name
					});
				});

		}).fail(function () {
			alert("script loading " + arguments[2].toString());
		});

	};

	
	ixmaps.TA_COVID19_RL_D3_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/regioneLombardia/processing/TA_COVID19_RL.csv";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("http://d3js.org/d3.v3.min.js"),
			$.getScript("../../projects/COVID-19-Lombardia/chart.js"),
			$.Deferred(function (deferred) {
				$(deferred.resolve);
			})
		).done(function () {

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					var pivot = data.pivot({
						lead: "CODICE_COMUNE",
						columns: "DATA_RICEVIMENTO_TAMPONE",
						keep: ["DESCRIZIONE_COMUNE"]
					});
					
					pivot.column("Total").remove();
					
					// difference values (mean of 3 days)
					var records = pivot.records;
					for (r=0; r<records.length;r++){
						for (c=2; c<records[r].length-2;c++){
							records[r][c] = ((Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2]))/3).toFixed(0);
						}
					}
					
					var columnNamesA = pivot.columnNames();
					columnNamesA.shift();
					columnNamesA.shift();
					columnNamesA.pop();
					columnNamesA.pop();

					fieldsA = [];
					for (var i = 0; i < columnNamesA.length; i++) {
						fieldsA.push(columnNamesA[i]);
					}
					options.theme.szFields = fieldsA.slice().join("|");
					options.theme.szFieldsA = fieldsA;

					// make label 
					var xAxis = [];
					for (var i = 0; i < columnNamesA.length; i++) {
						//var dte = new Date(columnNamesA[i].split(".")[0]);
						//xAxis.push(dte.toLocaleDateString());
						xAxis.push(columnNamesA[i]);
					}
					options.theme.szXaxisA = xAxis;
					options.theme.szLabelA = xAxis;

					options.theme.nClipFrames = columnNamesA.length;

					var lastDataColumnName = data.columnNames().pop();

					theme.szDescription = "aggiornato: " + lastDataColumnName;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});

		}).fail(function () {
			alert("script loading " + arguments[2].toString());
		});

	};

	
	
	
	

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
