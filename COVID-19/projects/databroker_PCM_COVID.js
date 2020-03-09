/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __process = function(data,options) { 

		// make pivot table with columns per day
		data.column("data").map(function(value){
		             return value.split(" ")[0];
		});
		
		var pivot = data.pivot(
			{lead:"codice_provincia",
			 columns:"data",
			 value:"totale_casi",
			 keep:["lat","long","denominazione_provincia"]}
		);
	
		return pivot;
     };   

    ixmaps.PCM_COVID_LAST = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szSizeField = columns[last];
			theme.szValueField = columns[last];

			theme.szSnippet = "aggiornato al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: "PCM_COVID_LAST"
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
    ixmaps.PCM_COVID_LAST_2 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
		
			theme.szSizeField = columns[last];
			theme.szValueField = columns[last];
			
			theme.szSnippet = "aggiornato al "+columns[last];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: "PCM_COVID_LAST_2"
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
	
	
    ixmaps.PCM_COVID_SEQUENCE = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
			// get the columns with date 
			var columns = pivot.columnNames();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.shift();
			columns.pop();
			
			var last = columns.length-1;
			
			// and configure the theme
			theme.szFields = columns.slice().join('|');
			theme.szFieldsA = columns.slice();
			
			// and set the label (for difference 1 less)
			columns.shift();
			theme.szLabelA = columns.slice();
			
			theme.szSnippet = "dal "+columns[0]+" al "+columns[last-1];

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: "PCM_COVID_SEQUENCE"
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
