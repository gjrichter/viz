/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from onData GitHub
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __get_somministrazioni = function(data,options) { 

		data.column("dataAggiornamento").map(function(value){
			return value.split(" ")[0];
		});
				
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"dataAggiornamento",
			 value:"somministrazioni",
			 keep:["regione"],
			 calc:"max"}
		);
	
		return pivot;
     };   

    var __get_percentuali = function(data,options) { 
	
		data.column("dataAggiornamento").map(function(value){
			return value.split(" ")[0];
		});
				
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"dataAggiornamento",
			 value:"percentuale",
			 keep:["regione"],
			 calc:"max"}
		);
	
		return pivot;
     };   

     var __get_consegnate = function(data,options) { 
	
		data.column("dataAggiornamento").map(function(value){
			return value.split(" ")[0];
		});
				
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"dataAggiornamento",
			 value:"dosiConsegnate",
			 keep:["regione"],
			 calc:"max"}
		);
	
		return pivot;
     };   

    ixmaps.VACCINI_SOMMINISTRAZIONI_LAST = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_somministrazioni(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
		
    ixmaps.VACCINI_CONSEGNATE_LAST = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_consegnate(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
		
	ixmaps.VACCINI_SOMMINISTRAZIONI_LAST_ALT = function (theme,options) {
	   return ixmaps.VACCINI_SOMMINISTRAZIONI_LAST(theme,options);
	};

				
    ixmaps.VACCINI_SOMMINISTRAZIONI_CLIP = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_somministrazioni(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			
			theme.nClipFrames = columns.length;
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.VACCINI_CONSEGNATE_CLIP = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __get_consegnate(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			
			theme.nClipFrames = columns.length;
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
    ixmaps.VACCINI_PERCENTUALI_LAST = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/consegnate.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);
			var conseg= dataA[1];
				
			var consegA = conseg.lookupArray("assegnati","codice_regione");	
			console.log(conseg);
			console.log(consegA);
			var indexCodice = pivot.column("codice_regione").index;	
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length-1; c++ ){
					records[r][c] = (Number(records[r][c]) / consegA[Number(records[r][indexCodice])]*100).toFixed(2);
 				}
			}
				
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
    ixmaps.VACCINI_PERCENTUALI_CLIP = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/consegnate.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);
			var conseg= dataA[1];
				
			var consegA = conseg.lookupArray("assegnati","codice_regione");	
			console.log(conseg);
			console.log(consegA);
			var indexCodice = pivot.column("codice_regione").index;	
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length-1; c++ ){
					records[r][c] = (Number(records[r][c]) / consegA[Number(records[r][indexCodice])]*100).toFixed(2);
 				}
			}
				
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			
			theme.nClipFrames = columns.length;
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
    ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_CLIP = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		if ( !ixmaps.tempMaxValue ){
			setTimeout(function(){ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_CLIP(theme,options)},100);
			return;
		}

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);

			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Provincia Autonoma Bolzano / Bozen") {
					return "P.A. Bolzano";
				} else
				if (value == "Provincia Autonoma Trento") {
					return "P.A. Trento";
				} else {
					return value.split(" /")[0].replace(/-/, " ");
				}
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			pivot.column("Total").remove();
			var indexName = pivot.column("regione").index;

			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length; c++ ){
					records[r][c] = (Number(records[r][c]) / pop[records[r][indexName].replace(/\-/," ")]*100).toFixed(2);
 				}
			}

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			var max = ixmaps.tempMaxValue || pivot.column(columns[last]).values().sort()[0];
			ixmaps.changeThemeStyle(theme.szId,"normalsizevalue:"+Math.ceil(max),"set")

			// and set the label (for difference 1 less)
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			theme.szXaxisA = columns.slice();
			
			theme.nClipFrames = columns.length;
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];
				
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};
	
    ixmaps.VACCINI_PERCENTUALI_CONSEGNATE_POPOLAZIONE_LAST = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_consegnate(data,options);

			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Provincia Autonoma Bolzano / Bozen") {
					return "P.A. Bolzano";
				} else
				if (value == "Provincia Autonoma Trento") {
					return "P.A. Trento";
				} else {
					return value.split(" /")[0].replace(/-/, " ");
				}
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			pivot.column("Total").remove();
			var indexName = pivot.column("regione").index;

			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length; c++ ){
					records[r][c] = (Number(records[r][c]) / pop[records[r][indexName].replace(/\-/," ")]*100).toFixed(2);
 				}
			}

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];

			// get value to normalize the flower size	
			var max = pivot.column(columns[last]).values().sort()[0];
			theme.nNormalSizeValue = Math.ceil(max);
			// store value to use by the clip flower	
			ixmaps.tempMaxValue = Math.ceil(max);
				
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		});
	};
    ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_LAST = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);

			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Provincia Autonoma Bolzano / Bozen") {
					return "P.A. Bolzano";
				} else
				if (value == "Provincia Autonoma Trento") {
					return "P.A. Trento";
				} else {
					return value.split(" /")[0].replace(/-/, " ");
				}
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			pivot.column("Total").remove();
			var indexName = pivot.column("regione").index;

			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length; c++ ){
					records[r][c] = (Number(records[r][c]) / pop[records[r][indexName].replace(/\-/," ")]*100).toFixed(2);
 				}
			}

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			
			var last = columns.length-1;
		
			theme.szFields = columns[last];
			theme.szFieldsA = [columns[last]];
				
			var max = pivot.column(columns[last]).values().sort()[0];
			theme.nNormalSizeValue = Math.ceil(max);	
				
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		});
	};
    ixmaps.VACCINI_PERCENTUALI_SEQUENCE = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/consegnate.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);
			var conseg= dataA[1];
				
			var consegA = conseg.lookupArray("assegnati","codice_regione");	
			console.log(conseg);
			console.log(consegA);
			var indexCodice = pivot.column("codice_regione").index;	
			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length-1; c++ ){
					records[r][c] = (Number(records[r][c]) / consegA[Number(records[r][indexCodice])]*100).toFixed(2);
 				}
			}
				
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			// make curve xaxis 
			var xAxis = [];
			for ( i in columns ){
				xAxis.push(" ");
			}
			xAxis[columns.length-1]=columns[columns.length-1];
			xAxis[0]=columns[0];
			options.theme.szXaxisA = xAxis; 
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};

   ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_SEQUENCE = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/ondata/covid19italia/master/webservices/vaccini/processing/somministrazioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var data = dataA[0];	
			var pivot = __get_somministrazioni(data,options);

			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Provincia Autonoma Bolzano / Bozen") {
					return "P.A. Bolzano";
				} else
				if (value == "Provincia Autonoma Trento") {
					return "P.A. Trento";
				} else {
					return value.split(" /")[0].replace(/-/, " ");
				}
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			pivot.column("Total").remove();
			var indexName = pivot.column("regione").index;

			var records = pivot.records;
			for ( var r=0; r<records.length; r++ ){
				for ( var c=2; c<records[r].length; c++ ){
					records[r][c] = (Number(records[r][c]) / pop[records[r][indexName].replace(/\-/," ")]*100).toFixed(2);
 				}
			}

			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			
			var last = columns.length-1;

			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			//columns.shift();
			theme.szLabelA = columns.slice();
			
			for ( var i=0; i<columns.length; i++ ){
				columns[i] = new Date(columns[i]).toLocaleDateString();
			}
			theme.szLabelA = columns.slice();
			
			// make curve xaxis 
			var xAxis = [];
			for ( i in columns ){
				xAxis.push(" ");
			}
			xAxis[columns.length-1]=columns[columns.length-1];
			xAxis[0]=columns[0];
			options.theme.szXaxisA = xAxis; 
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last];


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
