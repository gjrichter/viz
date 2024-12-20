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

(function() {
    
 	ixmaps.themeDataObj.process = function(dbtable) {
		dbtable = dbtable.pivot({  
								"lead":	'CODICE ISTAT',
								"cols":	'cogn',
								"keep":	'COMUNE',
								"value": 'voti', 
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
