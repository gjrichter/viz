/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};

(function() {
        
    ixmaps.themeDataObj.process = function(data,options) { 
		var lastDataColumnName = data.columnNames().pop();
 		options.theme.szSizeField = lastDataColumnName;													  
		options.theme.szValueField = lastDataColumnName;	
		
		options.theme.szDescription = "aggiornato: "+lastDataColumnName;
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
