/**
 * data preprocessing 
 * 
 * get the last 28 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.CSSE_COVID_CONFIRMED_28 = window.ixmaps.CSSE_COVID_CONFIRMED_28 || {};

(function() {
        
    ixmaps.CSSE_COVID_CONFIRMED_28.process = function(data,options) { 
		
		// get last 28 columns
		var last_28 = data.columnNames().slice(-28);
		
		// set as data fields in actual theme
		options.theme.szFields = last_28.slice().join("|");
		options.theme.szFieldsA = last_28.slice();
		
		// make label ! -1 because of DIFFERENC theme
		options.theme.szLabelA = last_28.slice(-27);
		options.theme.szXaxisA = last_28.slice(-27);
		for ( var i=1; i < options.theme.szXaxisA.length-1; i++ ){
			options.theme.szXaxisA[i] = " ";
		}
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
