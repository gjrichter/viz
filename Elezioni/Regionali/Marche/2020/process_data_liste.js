/** 
 * @fileoverview This file provides processing functions for ixmaps 
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};
window.ixmaps.themeDataObj_liste = window.ixmaps.themeDataObj_liste || {};

(function() {
    
 	ixmaps.themeDataObj.process = function(dbtable) { 
		dbtable.column("COMUNE").rename("comune");
		dbtable = dbtable.pivot({  
								"lead":	'CODICE ISTAT',
								"cols":	'desc_lis_c',
								"keep": 'comune',
								"value": 'voti' 
                                });
		return dbtable;
 	};
	
 	ixmaps.themeDataObj_liste.process = function(dbtable) { 
		dbtable.column("COMUNE").rename("comune");
		dbtable = dbtable.pivot({  
								"lead":	'CODICE ISTAT',
								"cols":	'desc_lis_c',
								"keep": 'comune',
								"value": 'voti' 
                                });
		return dbtable;
 	};

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
