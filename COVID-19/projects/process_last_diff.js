/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};

(function() {
        
    ixmaps.themeDataObj.process = function(data,options) { 
		var columns = data.columnNames();
 		options.theme.szFields = columns.pop();													  
		options.theme.szField100 = columns.pop();													  
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
