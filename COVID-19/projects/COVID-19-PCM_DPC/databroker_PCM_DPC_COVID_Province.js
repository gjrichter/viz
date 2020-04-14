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
						var last   = (Number(row[lastColumn]  )+Number(row[lastColumn-1])+Number(row[lastColumn-2]))/3;
						var before = (Number(row[lastColumn-1])+Number(row[lastColumn-2])+Number(row[lastColumn-3]))/3;
						var diff = last-before;
						return before > 100 ? (diff / before * 100) : 0;
				    });
					
					// set theme data source 
					//
					theme.szFields = "diff_percent";
					theme.szFieldsA = ["diff_percent"];
	
					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(pivot, {
						type: "dbtable",
						name: options.name
					});

				});

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

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

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
				console.log("=================================================================================");
				console.log(pivot);
			
				pivot.column("Total").remove();

				// difference values (mean of 3 days)
				var records = pivot.records;
				for (r=0; r<records.length;r++){
					for (c=4; c<records[r].length-3;c++){
						records[r][c] = (Number(records[r][c])+Number(records[r][c+1])+Number(records[r][c+2]))/3;
					}
				}

				// get the columns with date 
				var columns = pivot.columnNames();
				console.log(columns);
				columns.shift();
				columns.shift();
				columns.shift();
				columns.shift();
				columns.pop();
				columns.pop();
				columns.pop();





				var last = columns.length - 1;

				// and configure the theme
				theme.szFields = columns.slice().join('|');
				theme.szFieldsA = columns.slice();

				// and set the label (for difference 1 less)
				columns.shift();
				theme.szLabelA = columns.slice();

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
					
					var lastColumn = pivot.columnNames().length - 1;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					records = pivot.records;
					for ( r=0; r<records.length; r++ ){
						for ( c=lastColumn; c>=4; c-- ){
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

					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label (for difference 1 less)
					theme.szLabelA = columns.slice();
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						columns[i] = new Date(columns[i]).toLocaleDateString();
						szXaxisA.push(" ");
					}

					theme.szSnippet = "dal " + columns[0] + " al " + columns[last - 1];
					
					szXaxisA[0] = columns[0];
					szXaxisA[last] = columns[last];
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
