/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from onData GitHub
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __get_somministrazioni = function(data,options) { 

	
		var pivot = data.pivot(
			{lead:"codice_regione",
			 columns:"dataAggiornamento",
			 value:"somministrazioni",
			 keep:["regione"]}
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
	

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
