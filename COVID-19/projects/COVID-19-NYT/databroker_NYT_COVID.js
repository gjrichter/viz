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

	__get_pivot_corr_latest = function(column){
	
		var pivot = data.pivot(
			{lead:"geoid",
			 columns:"date",
			 value: column,
			 keep:["county"]}
		);

		pivot.column("Total").remove();
		
		pivot.column("geoid").map(function(value,row){
			
			value = value.split("-")[1];
			
			if (row[1] == "New York City"){
				return 36061;
			}else
			if (row[1] == "Kansas City"){
				return 20209;
			}else{
				return value;
			}
		});
		
		pivot.column("geoid").rename("fips");
		
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

	

	ixmaps.NYT_COVID_CLIP_WEEK = function (theme, options) {

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

					fieldsA = [];
					for (var i = 0; i < columns.length; i++) {
						if ( i%5 ){
							pivot.column(columns[i]).remove();
						}else{
							fieldsA.push(columns[i]);
							}
					}
				
					// and configure the theme
					theme.szFields = fieldsA.slice().join('|');
					theme.szFieldsA = fieldsA.slice();

					// and set the label
					theme.szLabelA = fieldsA.slice();
					
					theme.szSnippet = "dal " + fieldsA[0] + " al " + fieldsA[last];
					
					var szXaxisA = [];
					for ( var i =0; i<fieldsA.length; i++ ){
						szXaxisA.push(fieldsA[i]);
					}
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = fieldsA.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};
	
	ixmaps.NYT_COVID_DIFF_CLIP_WEEK = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("cases");
					var lastColumn = pivot.columnNames().length - 1;
					
					var records = pivot.records;
					for ( var r=0; r<records.length; r++ ){
						for ( var c=lastColumn; c>=7; c-- ){
							var last   = (Number(records[r][c]  )+
										  Number(records[r][c-1])+
										  Number(records[r][c-2])+
										  Number(records[r][c-3])+
										  Number(records[r][c-4])+
										  Number(records[r][c-5])+
										  Number(records[r][c-6]))/7;
							var before = (Number(records[r][c-1])+
										  Number(records[r][c-2])+
										  Number(records[r][c-3])+
										  Number(records[r][c-4])+
										  Number(records[r][c-5])+
										  Number(records[r][c-6])+
										  Number(records[r][c-7]))/7;
							records[r][c] = (last-before);
						}
					}

					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();
					
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					fieldsA = [];
					for (var i = 0; i < columns.length; i++) {
						if ( i%5 ){
							pivot.column(columns[i]).remove();
						}else{
							fieldsA.push(columns[i]);
							}
					}
				
					// and configure the theme
					theme.szFields = fieldsA.slice().join('|');
					theme.szFieldsA = fieldsA.slice();

					// and set the label
					theme.szLabelA = fieldsA.slice();
					
					theme.szSnippet = "dal " + fieldsA[0] + " al " + fieldsA[fieldsA.length-1];
					
					var szXaxisA = [];
					for ( var i =0; i<fieldsA.length; i++ ){
						szXaxisA.push(fieldsA[i]);
					}
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = fieldsA.length;

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
					last = columns.length - 1;
					
					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "from " + columns[0] + " to " + columns[last];
					ixmaps.setTitle("<span style='font-family:arial;color:#aaaaaa'>" + columns[0] + " to " + columns[last] +"</span>");
					
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
                        if (columns[i] == "2020-10-01"){
  						  szXaxisA.push("Okt");
                        }else
                        if (columns[i] == "2020-11-01"){
  						  szXaxisA.push("Nov");
                        }else
                        if (columns[i] == "2020-12-01"){
  						  szXaxisA.push("Dec");
                        }else{
						  szXaxisA.push(" ");
                        }
					}
					//szXaxisA[0] = (columns[0]);
					//szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
					
					// set colors = columns 
					theme.origColorScheme[0] = columns.length;
								 
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE_RM7_D = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					var pivot = __get_pivot_corr("deaths");
					
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
					last = columns.length - 1;
					
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
                        if (columns[i] == "2020-10-01"){
  						  szXaxisA.push("Okt");
                        }else
                        if (columns[i] == "2020-11-01"){
  						  szXaxisA.push("Nov");
                        }else
                        if (columns[i] == "2020-12-01"){
  						  szXaxisA.push("Dec");
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

	ixmaps.NYT_COVID_SEQUENCE_RM7_28 = function (theme, options) {

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
					last = columns.length - 1;
					
					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "from " + columns[0] + " to " + columns[last];
					ixmaps.setTitle("<span style='font-family:arial'>" + columns[0] + " to " + columns[last] +"</span>");
					
					// set colors = columns 
					theme.origColorScheme[0] = columns.length;

					// get last 28 columns
					var last_28 = pivot.columnNames().slice(-28);

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

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE_LAST_28 = function (theme, options, column) {

		var szUrl1 = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-counties-recent.csv";

		_LOG("start ------- >>>>>");
		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
					_LOG("loaded");
					
					var pivot = __get_pivot_corr_latest(column);
					
					_LOG("pivot");
					
					// get last 28 columns
					var last_28 = pivot.columnNames().slice(-28);
					var last = last_28.length - 1;

					// set as data fields in actual theme
					theme.setProperties({
						fields:last_28.slice().join("|")
					});
					
					// make label ! -1 because of DIFFERENC theme
					var szLabel = last_28.slice();
					var szXaxis = last_28.slice();
					for ( var i=1; i < szXaxis.length-1; i++ ){
						szXaxis[i] = " ";
					}
					
					theme.style.setProperties({
						"label":szLabel,
						"xaxis":szXaxis,
						"snippet" :"from " + last_28[0] + " to " + last_28[last]
					});
					
					_LOG("done");
					ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:24px;color:#444444'>" + last_28[0] + " to " + last_28[last] +"</span>");

					// ---------------------------------------------------------------------------------------   // deploy the data
					// ------------------------------------------------------------------------------------------
					
					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.NYT_COVID_SEQUENCE_LAST_28_CASES = function (theme, options) {
		return 	ixmaps.NYT_COVID_SEQUENCE_LAST_28(theme, options,"cases");
	}
	ixmaps.NYT_COVID_SEQUENCE_LAST_28_CASES_AVG = function (theme, options) {
		return 	ixmaps.NYT_COVID_SEQUENCE_LAST_28(theme, options,"cases_avg");
	}
	ixmaps.NYT_COVID_SEQUENCE_LAST_28_CASES_AVG_PER_100k = function (theme, options) {
		return 	ixmaps.NYT_COVID_SEQUENCE_LAST_28(theme, options,"cases_avg_per_100k");
	}





})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
