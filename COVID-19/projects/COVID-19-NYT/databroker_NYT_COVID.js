/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	__get_pivot_corr = function(column){
	
		var pivot = data.pivot(
			{lead:"fips",
			 columns:"date",
			 value: column,
			 keep:["county"]}
		);

		pivot.column("Total").remove();

		pivot.column("fips").map(function(value,row){
			if (row[1] == "New York City"){
				return 36061;
			}else
			if (row[1] == "Kansas City"){
				return 20209;
			}else{
				return value;
			}
		});
		
		return pivot;
			
	};


	ixmaps.NYT_COVID_LAST = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					var lastDataColumnName = pivot.columnNames().pop();
					theme.szSizeField = lastDataColumnName;
					theme.szValueField = lastDataColumnName;

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

	ixmaps.NYT_COVID_LAST_24H = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					var columnNames = pivot.columnNames();
					var lastDataColumnName = columnNames.pop();
					var beforeDataColumnName = columnNames.pop();
					theme.szFields = beforeDataColumnName+"|"+lastDataColumnName;
					theme.szFieldsA = [beforeDataColumnName,lastDataColumnName];

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

	ixmaps.NYT_COVID_CLIP = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(columns[i]);
					}
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_CLIP_DEATHS = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("deaths");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(columns[i]);
					}
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE_RM3 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					var last = columns.length - 1;
					columns.shift();
					columns.shift();

					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=last; c>=4; c-- ){
							var mean   = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2]))/3;
							records[r][c] = mean.toFixed(2);
						}
					}
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE_RM5 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					var last = columns.length - 1;
					columns.shift();
					columns.shift();

					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=last; c>=6; c-- ){
							var mean = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2])+Number(records[r][c-3])+Number(records[r][c-4]))/5;
							records[r][c] = mean.toFixed(2);
						}
					}
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "from " + columns[0] + " to " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};


	ixmaps.NYT_COVID_SEQUENCE_RM7 = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					
					// get the columns with date 
					var columns = pivot.columnNames();
					var last = columns.length - 1;
					columns.shift();
					columns.shift();

					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=last; c>=8; c-- ){
							var mean = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2])+Number(records[r][c-3])+Number(records[r][c-4])+Number(records[r][c-5])+Number(records[r][c-6]))/7;
							records[r][c] = mean.toFixed(2);
						}
					}
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// prepare label and xaxis for DIFFERENCE theme 
					columns.shift();
					var last = columns.length - 1;
					
					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "from " + columns[0] + " to " + columns[last];
					ixmaps.setTitle("<span style='font-family:arial'>" + columns[0] + " to " + columns[last] +"</span>");
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
                        if (columns[i] == "2020-03-01"){
  						  szXaxisA.push("March");
                        }else
                        if (columns[i] == "2020-04-01"){
  						  szXaxisA.push("April");
                        }else
                        if (columns[i] == "2020-05-01"){
  						  szXaxisA.push("May");
                        }else
                        if (columns[i] == "2020-06-01"){
  						  szXaxisA.push("June");
                        }else
                        if (columns[i] == "2020-07-01"){
  						  szXaxisA.push("July");
                        }else
                        if (columns[i] == "2020-08-01"){
  						  szXaxisA.push("Aug");
                        }else
                        if (columns[i] == "2020-09-01"){
  						  szXaxisA.push("Sept");
                        }else
                        if (columns[i] == "2020-010-01"){
  						  szXaxisA.push("Okt");
                        }else{
						  szXaxisA.push(" ");
                        }
					}
					//szXaxisA[0] = (columns[0]);
					//szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
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
