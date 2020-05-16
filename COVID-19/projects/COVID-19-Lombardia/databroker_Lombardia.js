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

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					var dateA = data.column("DATA_RICEVIMENTO_TAMPONE").values();
					var lastData = dateA.pop();
					date = new Date(lastData.substr(0,4), Number(lastData.substr(4,2))-1, lastData.substr(6,2));
					lastData = date.toLocaleDateString();

					ixmaps.setTitle("<span style='background:rgba(255,255,255,0.5);padding:0.25em 0.5em;border:#6666 solid 1px;border-radius:0.2em'>aggiornato al: " + lastData+"</span>");
					
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
						type: "dbtable",
						name: options.name
					});
				});

	};

	
	ixmaps.TA_COVID19_RL_D3_CLIP = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});
					
					data.sort("DATA_RICEVIMENTO_TAMPONE");
					
					data.column("DATA_RICEVIMENTO_TAMPONE").map(function(value){
						return (value.substr(6,2)+"/"+value.substr(4,2)+"/"+value.substr(0,4));
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
						for (c=2; c<records[r].length-4;c++){
							records[r][c] = ((Number(records[r][c])+
											  Number(records[r][c+1])+
											  Number(records[r][c+2])+
											  Number(records[r][c+3])+
											  Number(records[r][c+4])
											 )/5).toFixed(0);
						}
					}
					
					var columnNamesA = pivot.columnNames();
					columnNamesA.shift();
					columnNamesA.shift();
					columnNamesA.pop();
					columnNamesA.pop();
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

					theme.szDescription = "<b>media mobile di 5 giorni</b><br>dal <b>"+ columnNamesA[0] +"</b> al <b>"+columnNamesA[columnNamesA.length-1]+"</b>";

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});

	};

	ixmaps.TA_COVID19_RL_D3_CLIP_DECEDUTI = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});
					
					data.sort("DATA_RICEVIMENTO_TAMPONE");
					data = data.select("WHERE VIVO_O_DECEDUTO = DECEDUTO");
					
					data.column("DATA_RICEVIMENTO_TAMPONE").map(function(value){
						return (value.substr(6,2)+"/"+value.substr(4,2)+"/"+value.substr(0,4));
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
						for (c=2; c<records[r].length-4;c++){
							records[r][c] = ((Number(records[r][c])+
											  Number(records[r][c+1])+
											  Number(records[r][c+2])+
											  Number(records[r][c+3])+
											  Number(records[r][c+4])
											 )/5).toFixed(0);
						}
					}
					
					var columnNamesA = pivot.columnNames();
					columnNamesA.shift();
					columnNamesA.shift();
					columnNamesA.pop();
					columnNamesA.pop();
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

					theme.szDescription = "<b>media mobile di 5 giorni</b><br>dal <b>"+ columnNamesA[0] +"</b> al <b>"+columnNamesA[columnNamesA.length-1]+"</b>";

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});

	};

	ixmaps.TA_COVID19_RL_D3_CLIP_SUM = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					data.sort("DATA_RICEVIMENTO_TAMPONE");
					
					data.column("DATA_RICEVIMENTO_TAMPONE").map(function(value){
						return (value.substr(6,2)+"/"+value.substr(4,2)+"/"+value.substr(0,4));
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

	};

	ixmaps.TA_COVID19_RL_D3_CLIP_SUM_DECEDUTI = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					
					data.column("CODICE_COMUNE").map(function(value){
						return Number(value)-3000000;
					});

					data.sort("DATA_RICEVIMENTO_TAMPONE");
					data = data.select("WHERE VIVO_O_DECEDUTO = DECEDUTO");
					
					data.column("DATA_RICEVIMENTO_TAMPONE").map(function(value){
						return (value.substr(6,2)+"/"+value.substr(4,2)+"/"+value.substr(0,4));
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

	};

	ixmaps.TA_COVID19_RL_SEQUENCE = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

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

	};
	
	ixmaps.TA_COVID19_RL_SEQUENCE_ALT = function (theme, options) {
			return ixmaps.TA_COVID19_RL_SEQUENCE(theme, options);
	};


	ixmaps.TA_COVID19_RL_VIVO_DECEDUTO = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/TA_COVID19_RL_small.csv.gz";

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

	};
	

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
