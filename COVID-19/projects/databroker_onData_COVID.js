/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var __process = function(data,options) { 

		// make pivot table with columns per day
		var pivot = data.pivot(
			{lead:"provincia",
			 columns:"datetime",
			 value:"numero",
			 keep:"codiceISTAT"}
		);
		
		return pivot;
     };   

	ixmaps.themeDataObj3 = function (theme,options) {


		var szUrl = "https://raw.githubusercontent.com/ondata/covid19italia/master/publication/provinceArchivioISTAT.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var pivot = __process(mydata,options);
	
			// get the columns with date 
			var columns = pivot.columnNames();
			
			// get only the cuve columns
			columns.shift();
			columns.shift();
			columns.pop();
			
			// and configure the theme
			theme.szFields = columns.reverse().slice().join('|');
			theme.szFieldsA = columns.reverse().slice();
			
			// and set the label (for difference 1 less)
			columns.pop();
			theme.szLabelA = columns.reverse().slice();

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: "themeDataObj3"
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
