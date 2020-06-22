/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	var __process = function (data, options) {

		// make pivot table with columns per day
		data.column("data").map(function (value) {
			return value.split(" ")[0];
		});

		var pivot = data.pivot({
			lead: "codice_provincia",
			columns: "data",
			value: "totale_casi",
			keep: ["lat", "long", "denominazione_provincia"]
		});

		return pivot;
	};

	ixmaps.PCM_DPC_COVID = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				theme.szSizeField = columns[last];
				theme.szValueField = columns[last];
				theme.szFields = columns[last];
				theme.szFieldsA = [columns[last]];

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST_2 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				theme.szSizeField = columns[last];
				theme.szValueField = columns[last];

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST_24H = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				theme.szFields = columns[last];
				theme.szFieldsA = [columns[last]];
				theme.szField100 = columns[last - 1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
						name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};
	ixmaps.PCM_DPC_COVID_LAST_24H_ALT = function (theme, options) {
		ixmaps.PCM_DPC_COVID_LAST_24H(theme, options);
	}
	

	ixmaps.PCM_DPC_COVID_LAST_24H_MEAN_3 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
				pivot.column("Total").remove();

				// difference values (mean of 3 days)
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=4; c<records[r].length-2;c++){
						records[r][c] = (Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2]))/3;
					}
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();
				columns.pop();

				var last = columns.length - 1;

				theme.szFields = columns[last];
				theme.szFieldsA = [columns[last]];
				theme.szField100 = columns[last - 1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
						name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST_24H_MEAN_3_ALT = function (theme, options) {
		ixmaps.PCM_DPC_COVID_LAST_24H_MEAN_3(theme, options);
	};

		
	ixmaps.PCM_DPC_COVID_LAST_DIFF = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					pivot.addColumn({destination:"diff"},function(row){
						var last   = (Number(row[lastColumn]  )+Number(row[lastColumn-1])+Number(row[lastColumn-2]))/3;
						var before = (Number(row[lastColumn-1])+Number(row[lastColumn-2])+Number(row[lastColumn-3]))/3;
						var diff = last-before;
						return diff;
				    });
					
					// set theme data source 
					//
					theme.szFields = "diff";
					theme.szFieldsA = ["diff"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.PCM_DPC_COVID_LAST_PERCENT = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					pivot.addColumn({destination:"diff_percent"},function(row){
						var last   = (Number(row[lastColumn]  ));
						var before = (Number(row[lastColumn-1]));
						var diff = last-before;
						return before > 100 ? (diff / before * 100).toFixed(2) : 0;
				    });
					
					// set theme data source 
					//
					theme.szFields = "diff_percent";
					theme.szFieldsA = ["diff_percent"];
					
					theme.szSnippet = "aggiornato al " + pivot.columnNames()[lastColumn].split("T")[0];

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.PCM_DPC_COVID_LAST_PERCENT_ALT = function (theme, options) {
		ixmaps.PCM_DPC_COVID_LAST_PERCENT(theme, options);		
	};
	
	ixmaps.PCM_DPC_COVID_LAST_INCID = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"incidenza"},function(row){
						var last   = (Number(row[lastColumn]  )+Number(row[lastColumn-1])+Number(row[lastColumn-2]))/3;
						var before = (Number(row[lastColumn-1])+Number(row[lastColumn-2])+Number(row[lastColumn-3]))/3;
						return (Number(last-before)/popA[Number(row[0])]*10000).toFixed(2);
				    });
					
					// set theme data source 
					//
					theme.szFields = "incidenza";
					theme.szFieldsA = ["incidenza"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};
	ixmaps.PCM_DPC_COVID_LAST_INCID_ALT = function (theme, options) {
			ixmaps.PCM_DPC_COVID_LAST_INCID(theme, options);
	};

	ixmaps.PCM_DPC_COVID_LAST_PREVAL = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"lastperpop"},function(row){
						return (Number(row[lastColumn])/popA[Number(row[0])]*10000).toFixed(2);
				    });
					
					// set theme data source 
					//
					theme.szFields = "lastperpop";
					theme.szFieldsA = ["lastperpop"];
	
					theme.szTitle = pivot.columnNames()[lastColumn];
					
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};
	
	ixmaps.PCM_DPC_COVID_LAST_PREVAL_ALT = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"lastperpop"},function(row){
						return (Number(row[lastColumn])/popA[Number(row[0])]*10000).toFixed(2);
				    });
					
					// set theme data source 
					//
					theme.szFields = "lastperpop";
					theme.szFieldsA = ["lastperpop"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.PCM_DPC_COVID_BEFORE = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 2;

				theme.szSizeField = columns[last];
				theme.szValueField = columns[last];
				theme.szFields = columns[last];
				theme.szFieldsA = [columns[last]];

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_BEFORE_INCID = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"incidenza"},function(row){
						var last   = (Number(row[lastColumn-1])+Number(row[lastColumn-2])+Number(row[lastColumn-3]))/3;
						var before = (Number(row[lastColumn-2])+Number(row[lastColumn-3])+Number(row[lastColumn-4]))/3;
						return (Number(last-before)/popA[Number(row[0])]*10000).toFixed(2);
				    });
					
					// set theme data source 
					//
					theme.szFields = "incidenza";
					theme.szFieldsA = ["incidenza"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
					name: options.name
					});

				});

	};
	
	ixmaps.PCM_DPC_COVID_BEFORE_PREVAL = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var lastColumn = pivot.columnNames().length - 2;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"beforepreval"},function(row){
						return (Number(row[lastColumn-1])/popA[Number(row[0])]*10000).toFixed(2);
				    });
					
					// set theme data source 
					//
					theme.szFields = "beforepreval";
					theme.szFieldsA = ["beforepreval"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
					name: options.name
					});

				});

	};
	

	ixmaps.PCM_DPC_COVID_SEQUENCE = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					szXaxisA.push(" ");
				}
				szXaxisA[0] = columns[0];
				szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;

				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_7 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 7 days
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=records[r].length-1; c>=10;c--){
						records[r][c] = (Number(records[r][c])+
										 Number(records[r][c-1])+
										 Number(records[r][c-2])+
										 Number(records[r][c-3])+
										 Number(records[r][c-4])+
										 Number(records[r][c-5])+
										 Number(records[r][c-6])
										)/7;
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
				columns.shift();

				var last = columns.length - 1;

				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					szXaxisA.push(" ");
				}
				szXaxisA[0] = columns[0];
				szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];


			
			// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_28 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 28 days
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=records[r].length-1; c>=10;c--){
						mean = 0;
						for (m=0; m<28; m++){
							mean += Number(records[r][c-m]);
						}
						records[r][c] = mean/28;
					}
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				for (m=0; m<28-1; m++){
					columns.shift();
				}

				var last = columns.length - 1;
			
				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					szXaxisA.push(" ");
				}
				szXaxisA[0] = columns[0];
				szXaxisA[last - 1] = columns[last - 1];
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST_MEAN_28 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// make moving average of 28 days
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=records[r].length-1; c>=31;c--){
						mean = 0;
						for (m=0; m<28; m++){
							mean += Number(records[r][c-m]);
						}
						records[r][c] = mean/28;
					}
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
			
				for (m=0; m<28-1; m++){
					columns.shift();
				}

				var last = columns.length - 1;
			
				for ( var i=0; i<columns.length; i++ ){
					pivot.column(columns[i]).rename(new Date(columns[i]).toLocaleDateString());
					columns[i] = new Date(columns[i]).toLocaleDateString();	
				}

				// and configure the theme
				theme.szFields = columns[last];
				theme.szField100 = columns[last-1];

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_FREE_DAYS = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();
			
				pivot.addColumn({destination:"free_days"},function(row){
					var free = 0;
					for ( c=row.length-1;(row[c] <= row[c-1]) && (c>=4);c--){
						free++
					}
					return free;
				})

				// get the columns with date 
				var columns = pivot.columnNames();
				var last = columns.length - 2;
			
				// and configure the theme
				theme.szFields = "free_days";

				theme.szSnippet = "aggiornato al " + columns[last];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_MEAN_3 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);
			
				pivot.column("Total").remove();

				// difference values (mean of 3 days)
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=records[r].length-1; c>=7;c--){
						records[r][c] = (Number(records[r][c])+Number(records[r][c-1])+Number(records[r][c-2]))/3;
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

				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

				var szXaxisA = [];
				for ( var i =0; i<columns.length; i++ ){
					szXaxisA.push(" ");
				}
			
				columns[0] = new Date(columns[0]).toLocaleDateString();
				columns[last - 1] = new Date(columns[last - 1]).toLocaleDateString();
			
				szXaxisA[0] = columns[0];
				szXaxisA[last - 1] = columns[last - 1];
			
				theme.szXaxisA = szXaxisA;
			
				theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];


			
			// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.PCM_DPC_COVID_LAST_3 = function (theme, options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			}).load(function (mydata) {

				var pivot = __process(mydata, options);

				// get the columns with date 
				var columns = pivot.columnNames();

				// get the columns with date 
				var columns = pivot.columnNames();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();

				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice(-4).join('|');
				theme.szFieldsA = columns.slice(-4);

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice(-4);

				theme.szSnippet = "dal " + columns[last - 5] + " al " + columns[last - 1];
			
				ixmaps.setTitle("<f2 class='btn btn-default btn-lg'>aggiornato: "+new Date(columns[last - 1]).toLocaleDateString()+"</f2>");

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};
		ixmaps.PCM_DPC_COVID_SEQUENCE_PREVALENZA_MEAN_3 = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					pivot.column("Total").remove();
					
					var lastColumn = pivot.columnNames().length - 1;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=lastColumn; c>=4; c-- ){
							var last   = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2]))/3;
							records[r][c] = ((last)/popA[Number(records[r][0])]*10000).toFixed(2);
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

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label (for difference 1 less)
					theme.szLabelA = columns.slice();

					theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

	};

	ixmaps.PCM_DPC_COVID_SEQUENCE_INCIDENZA_MEAN_3 = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					pivot.column("Total").remove();
					
					var columns = pivot.columnNames();
					for ( var i =4; i<columns.length; i++ ){
						var date = new Date(columns[i]).toLocaleDateString();
						pivot.column(columns[i]).rename(date);
					}
					
					var lastColumn = pivot.columnNames().length - 1;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=lastColumn; c>=7; c-- ){
							var last   = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2]))/3;
							var before = (Number(records[r][c-1])+Number(records[r][c-2])+Number(records[r][c-3]))/3;
							records[r][c] = ((last-before)/popA[Number(records[r][0])]*10000).toFixed(2);
						}
					}
					
					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					// drop first 3 for diff and  mean 3
					columns.shift();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
					
					theme.szXaxisA = columns.slice();
					for ( i=1; i<theme.szXaxisA.length-1; i++ ){
						if ( theme.szXaxisA[i] == "xx11/3/2020" ){
							theme.szXaxisA[i] = "a";
						}else
						if ( theme.szXaxisA[i] == "xx21/3/2020" ){
							theme.szXaxisA[i] = "b";
						}else
						if ( theme.szXaxisA[i] == "xx5/3/2020" ){
							theme.szXaxisA[i] = "scuola";
						}else
						if ( theme.szXaxisA[i] == "11/3/2020" ){
							theme.szXaxisA[i] = "Dpcm-1";
						}else
						if ( theme.szXaxisA[i] == "22/3/2020" ){
							theme.szXaxisA[i] = "Dpcm-2";
						}else{
							theme.szXaxisA[i] = " ";
						}
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_INCIDENZA_MEAN_3_CLIP = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					pivot.column("Total").remove();
					
					var columns = pivot.columnNames();
					for ( var i =4; i<columns.length; i++ ){
						var date = new Date(columns[i]).toLocaleDateString();
						pivot.column(columns[i]).rename(date);
					}
					
					var lastColumn = pivot.columnNames().length - 1;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=lastColumn; c>=7; c-- ){
							var last   = (Number(records[r][c]  )+Number(records[r][c-1])+Number(records[r][c-2]))/3;
							var before = (Number(records[r][c-1])+Number(records[r][c-2])+Number(records[r][c-3]))/3;
							records[r][c] = ((last-before)/popA[Number(records[r][0])]*10000).toFixed(2);
						}
					}
					
					// get the columns with date 
					var columns = pivot.columnNames();
					columns.shift();
					columns.shift();
					columns.shift();
					columns.shift();
					// drop first 3 for diff and  mean 3
					columns.shift();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
					
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

	ixmaps.PCM_DPC_COVID_SEQUENCE_INCIDENZA_MEAN_3_CLIP_2 = function (theme, options) {
		ixmaps.PCM_DPC_COVID_SEQUENCE_INCIDENZA_MEAN_3_CLIP(theme, options);
	}


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
