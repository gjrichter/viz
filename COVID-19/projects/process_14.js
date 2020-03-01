/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};

(function() {
        
    ixmaps.themeDataObj.process = function(data,options) { 
		// get last 14 columns
		var last_14 = data.columnNames().slice(-14);
		// set as data fields 
		options.theme.szFields = last_14.slice().join("|");
		options.theme.szFieldsA = last_14.slice();
		// make label ! -1 because of DIFFERENC theme
		options.theme.szLabelA = last_14.slice(-13);
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
