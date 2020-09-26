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
		dbtable = dbtable.select("WHERE IDREGIONE is 16");
		dbtable = dbtable.pivot({  
								"lead":	'CODICE ISTAT',
								"cols":	'cogn',
								"value": 'voti' 
                                });
		return dbtable;
 	};
	console.log(ixmaps);
	ixmaps.parentApi.parentApi.htmlgui_onLegendFooter = function() {
	 	return ("<div class='map-legend-footer' style='margin-top:0.5em;'>"+
				"<a href=\"javascript:ixmaps.map().changeThemeStyle('polygon','dopacitypow:-0.1','add')\" class=\"button\" style=\"pointer-events:all\">"+
				"(-)</a>&nbsp;fondo&nbsp;"+
				"<a href=\"javascript:ixmaps.map().changeThemeStyle('polygon','dopacitypow:+0.1','add')\" class=\"button\" style=\"pointer-events:all\">"+
				"(+)</a>"+
			 	"</div>");
    };

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
