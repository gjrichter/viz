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

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
