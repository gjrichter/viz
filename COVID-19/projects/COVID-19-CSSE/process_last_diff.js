/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.CSSE_COVID_CONFIRMED = window.ixmaps.CSSE_COVID_CONFIRMED || {};

(function() {
        
    ixmaps.CSSE_COVID_CONFIRMED.process = function(data,options) { 
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
