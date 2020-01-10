/**********************************************************************
 process_legend.js

$Comment: provides JavaScript to tune the theme legend with procom -> names
$Source : process.js,v $

$InitialAuthor: guenter richter $
$InitialDate: $
$Author: guenter richter $
$Id: process.js 8 2014-04-06 00:00:00Z Guenter Richter $

Copyright (c) Guenter Richter
$Log: process_legend.js,v $
**********************************************************************/

/** 
 * @fileoverview This file provides processing functions for ixmaps legend 
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.pendolari = window.ixmaps.pendolari || {};

(function () {

	ixmaps.pendolari.process = function (dbtable) {};

	// if this codeis loaded, it starts to get a lookup table for pro_com codes -> comune names
	//
	var nome_lookup = null;
	var broker = Data.broker()
		.addSource("https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/Istat/comuni_2011/comuni_2011.csv.gz", "csv")
		.realize(
			function (data) {
				nome_lookup = data[0].lookupArray("COMUNE", "PRO_COM");
			}
		);

	// define a hook for theme is drawn to relpace pro_com codes with comune names
	//
	var old_onDrawTheme = ixmaps.parentApi.parentApi.htmlgui_onDrawTheme;
	ixmaps.parentApi.parentApi.htmlgui_onDrawTheme = function (szId) {

		var themeObj = ixmaps.getThemeObj(szId);

		if ( themeObj && themeObj.szLabelA) {
			for (var i = 0; i < themeObj.szLabelA.length; i++) {
				themeObj.szLabelA[i] = nome_lookup[themeObj.szLabelA[i]] || themeObj.szLabelA[i];
			}
			// do this only once; remove the hook restoring the original function
			//
			//ixmaps.parentApi.parentApi.htmlgui_onDrawTheme = old_onDrawTheme;
		}
		
		old_onDrawTheme(szId);
	};

	ixmaps.parentApi.parentApi.htmlgui_onLegendFooter = function (szId) {
		if ( !szId.match(/flussi/) ){
			return "";
		}
		return ("<div class='map-legend-footer' style='margin-top:0.5em;margin-bottom:1.5em'>" +
			"<a href=\"javascript:ixmaps.changeThemeStyle('vector','sizepow:-0.1','add')\" class=\"button\" style=\"pointer-events:all\">" +
			"(+)</a>&nbsp;particolari&nbsp;" +
			"<a href=\"javascript:ixmaps.changeThemeStyle('vector','sizepow:0.1','add')\" class=\"button\" style=\"pointer-events:all\">" +
			"(-)</a>" +
			"</div>");
	};


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
