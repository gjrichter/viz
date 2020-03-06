/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj1 = window.ixmaps.themeDataObj1 || {};
window.ixmaps.themeDataObj2 = window.ixmaps.themeDataObj2 || {};
window.ixmaps.themeDataObj3 = window.ixmaps.themeDataObj3 || {};

(function() {
        
    var __process = function(data,options) { 

		// make pivot table with columns per day
		var pivot = data.pivot(
			{lead:"provincia",
			 columns:"datetime",
			 value:"numero",
			 keep:"codiceISTAT"}
		);
		
		// get the columns with date 
		var columns = pivot.columnNames();
		columns.shift();
		columns.shift();
		columns.pop();
		
		var last = columns.length-1;
		
		// get reverse data columns for curve 
		if ( options.theme.szId == "curve" ){
			var dateA = columns.slice().reverse();
			options.theme.szSnippet = "dal "+columns[last]+" al "+columns[0]+"";	
			options.theme.szValuesA = dateA;
		} else {
			options.theme.szFilter = "WHERE datetime = "+columns[0]+"";	
			options.theme.szSnippet = "aggiornato al "+columns[0]+"";	
		}
     };   
	
	// 3 themes must! have 3 different data objects, if not, we can't manipolate the theme
	// the processing function is the same!
	
    ixmaps.themeDataObj1.process = function(data,options) { 
		__process(data,options);
     };   
    ixmaps.themeDataObj2.process = function(data,options) { 
		__process(data,options);
     };   
    ixmaps.themeDataObj3.process = function(data,options) { 
		__process(data,options);
     };   

 	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
