/**
 * data broker for COVID-19 Map
 * loads D3 and data 
 * parses data into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.TA_COVID19_RL = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

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

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("https://d3js.org/d3.v3.min.js"),
			$.getScript("https://gjrichter.github.io/viz/COVID-19/projects/COVID-19-Lombardia/chart.js"),
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

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("https://d3js.org/d3.v3.min.js"),
			$.getScript("https://gjrichter.github.io/viz/COVID-19/projects/COVID-19-Lombardia/chart.js"),
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

	ixmaps.TA_COVID19_RL_D3_CLIP_SUM = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("https://d3js.org/d3.v3.min.js"),
			$.getScript("https://gjrichter.github.io/viz/COVID-19/projects/COVID-19-Lombardia/chart.js"),
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

					// sum values 
					var records = pivot.records;
					for (r=0; r<records.length;r++){
						var sum = 0;
						for (c=2; c<records[r].length-2;c++){
							sum += Number(records[r][c]);
							records[r][c] = sum;
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

	ixmaps.TA_COVID19_RL_SEQUENCE = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("https://d3js.org/d3.v3.min.js"),
			$.getScript("https://gjrichter.github.io/viz/COVID-19/projects/COVID-19-Lombardia/chart.js"),
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
						keep: ["DESCRIZIONE_COMUNE","PROVINCIA"]
					});
					
					pivot.column("Total").remove();
					
					var columns = pivot.columnNames();
					for ( var i =3; i<columns.length; i++ ){
						date = new Date(columns[i].substr(0,4), Number(columns[i].substr(4,2))-1, columns[i].substr(6,2));
						pivot.column(columns[i]).rename(date.toLocaleDateString());
					}

					
					// difference values (mean of 3 days)
					var records = pivot.records;
					for (r=0; r<records.length;r++){
						for (c=3; c<records[r].length-2;c++){
							records[r][c] = ((Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2]))/3).toFixed(0);
						}
					}
					
					var columnNamesA = pivot.columnNames();
					columnNamesA.shift();
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
					xAxis = columnNamesA.slice();
					for ( i=1; i<xAxis.length-1; i++ ){
						if ( xAxis[i] == "19/3/2020" ){
							xAxis[i] = "s+14";
						}else
						if ( xAxis[i] == "25/3/2020" ){
							xAxis[i] = "a+14";
						}else
						if ( xAxis[i] == "4/4/2020" ){
							xAxis[i] = "b+14";
						}else{
							xAxis[i] = " ";
						}
					}
					xAxis[0] = columnNamesA[0];
					xAxis[columnNamesA.length-1] = columnNamesA[columnNamesA.length-1];
					
					options.theme.szXaxisA = xAxis;
					options.theme.szLabelA = xAxis;

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
	
	ixmaps.TA_COVID19_RL_SEQUENCE_ALT = function (theme, options) {
			return ixmaps.TA_COVID19_RL_SEQUENCE(theme, options);
	};


	ixmaps.TA_COVID19_RL_VIVO_DECEDUTO = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		// load D3.js and USER chart script
		// load and parse data if script loaded
		// then calls .setExternalData() to define data and trigger continue of theme
		//
		$.when(
			$.getScript("https://d3js.org/d3.v3.min.js"),
			$.getScript("https://gjrichter.github.io/viz/COVID-19/projects/COVID-19-Lombardia/chart.js"),
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
						columns: "VIVO_O_DECEDUTO",
						keep: ["DESCRIZIONE_COMUNE","PROVINCIA"]
					});
					
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
