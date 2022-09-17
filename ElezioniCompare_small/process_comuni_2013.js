/**********************************************************************
 process_comuni_2013.js

$Comment: provides JavaScript to preprocess data for 'Elezioni Politiche 2013'
$Source : databroker.js,v $

Copyright (c) Guenter Richter
$Log: process_comuni_2013.js,v $
**********************************************************************/

/** 
 * @fileoverview This file provides preprocessing functions for datasets of 'ISPRA Rifiuti'
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.scrutiniCIComuni_voti = window.ixmaps.scrutiniCIComuni_voti || {};
(function () {

	ixmaps.scrutiniCIComuni_voti.process = function (data) {
		
        data.column("Comune").map(function(value){
			value = value.split("&#x2f;")[0];
			switch(value){
				case "Lein&#xec;": return "Leini";
				case "Jonadi": return "Ionadi";
				case "Montebello Ionico": return "Montebello Jonico";
				case "Trentola-Ducenta": return "Trentola Ducenta";
				case "San Dorligo della Valle - Dolina": return "San Dorligo della Valle-Dolina";
				case "Lavena-Ponte Tresa": return "Lavena Ponte Tresa";
				case "Godiasco": return "Godiasco Salice Terme";
				case "Rivanazzano": return "Rivanazzano Terme";
				case "Campiglione-Fenile": return "Campiglione Fenile";
				case "Mal&#xe8;": return "Malé";
				case "Rasun Anterselva": return "Rasun-Anterselva";
				case "Santo Stino di Livenza": return "San Stino di Livenza";
			}
			return value;
		});
		
    };

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
