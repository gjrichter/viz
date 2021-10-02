/**********************************************************************
chart.js

$Comment: user chart drawing plugin
$Source : chart.js,v $

$InitialAuthor: guenter richter $
$InitialDate: 2020/04/16 $
$Author: guenter richter $
$Id:chart.js 1 2020-04-16 00:00:00Z Guenter Richter $

Copyright (c) Guenter Richter
$Log:chart.js,v $
**********************************************************************/

/** 
 * @fileoverview This file is a user chart draw plugin for ixmaps
 *
 * @author Guenter Richter guenter.richter@ixmaps.com
 * @version 0.9
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {
	
	// --------------------------------
	// user generated chart 
	// --------------------------------

	var __myGradientId = null;

	// --------------------------------------------------
	// init is called once before draw  
	// here we define the gradient for filling the peeks
	// --------------------------------------------------
	
	ixmaps.pinnacleChart_init = function(SVGDocument,args){ 
		
		__myGradientId = "myGradient"+Math.random();
		
		var szColor = args.theme.colorScheme[0];
		
		// use d3 to draw the circle
		// -------------------------
		var svg = d3.select(args.target);
		
		// Create the svg:defs element and the main gradient definition.
		var svgDefs = svg.append('defs');
		
		var mainGradient = svgDefs.append('linearGradient')
			.attr('id', __myGradientId)
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%");

		// Create the stops of the main gradient. Each stop will be assigned
		// a class to style the stop using CSS.
		mainGradient.append('stop')
			.attr('style', 'stop-color:'+szColor+'')
			.attr('offset', '0');

		mainGradient.append('stop')
			.attr('style', 'stop-color:white')
			.attr('offset', '1');
	};
	
	// --------------------------------------------------
	// called for every chart of the theme to draw   
	// draw a peak with outline color and gradient filling
	// chart type inspired by NYT pinackle maps
	// --------------------------------------------------
	
	ixmaps.pinnacleChart = function(SVGDocument,args){
		
		var szColor = (args.theme.colorScheme[0]);

		var nValue = args.values[(args.theme.nActualFrame||0)];
		var nMax = Math.max(args.theme.nMax,Math.abs(args.theme.nMin));
		if ( args.theme.nMinValue && (nValue < args.theme.nMinValue) ){
			return false;
		}
		var rad = args.item?nValue/nMax*args.maxSize*20:args.maxSize/2*20;
		if ( args.theme.nNormalSizeValue ){
			rad = args.item?nValue/args.theme.nNormalSizeValue*args.maxSize*20:args.maxSize/2*20;
		}	

		var szOpacity = 1;
		var szFillOpacity = 0.7;

		if (rad == 0){
			return false;
		}

		// use d3 to draw the circle
		// -------------------------
		var svg = d3.select(args.target);

		svg.append("path")
			.attr("d", "M0,0 l100,"+(-rad)+" l100,"+(rad)+"")
			.attr("style","fill:url(#"+__myGradientId+");stroke:"+szColor+";stroke-width:20;fill-opacity:"+szFillOpacity+";opacity:"+szOpacity+";");

		if ( args.flag.match(/VALUES/) && (rad > 100) ){

			var nFontSize = Math.sqrt(rad)*10;

			// show only if fontsize is reasonable (fontsize is n * 20)
			if ( 1 || nFontSize > 150 ){
				var szText = nValue.toFixed(args.theme.nValueDecimals||0) + (args.theme.szUnit || "");
				var szTextOpacity = 1; // 0.2 + nValue/nMax;

				// show the value on top of the peek
				svg.append("text")
					.attr("x", 0)
					.attr("y", -rad-nFontSize*0.4)
					.attr("style","font-family:arial;font-size:"+nFontSize+"px;text-anchor:middle;fill:none;fill-opacity:"+szTextOpacity+";stroke:white;stroke-width:20px;opacity:"+szOpacity+";pointer-events:none")
					.text(szText);
				svg.append("text")
					.attr("x", 0)
					.attr("y", -rad-nFontSize*0.4)
					.attr("style","font-family:arial;font-size:"+nFontSize+"px;text-anchor:middle;fill:#bb0000;fill-opacity:"+szTextOpacity+";stroke:none;opacity:"+szOpacity+";pointer-events:none")
					.text(szText);

				// is there is a chart title defined, show it below the value
				if (args.item.szTitle){
					nFontSize /= 3;
					svg.append("text")
						.attr("x", 0)
						.attr("y", -rad-nFontSize*0.3)
						.attr("style","font-family:arial;font-size:"+nFontSize+"px;text-anchor:middle;fill:none;fill-opacity:"+szTextOpacity+";stroke:white;stroke-width:20px;opacity:"+szOpacity+";pointer-events:none")
						.text(args.item.szTitle);
					svg.append("text")
						.attr("x", 0)
						.attr("y", -rad-nFontSize*0.3)
						.attr("style","font-family:arial;font-size:"+nFontSize+"px;text-anchor:middle;fill:#444444;fill-opacity:"+szTextOpacity+";stroke:none;opacity:"+szOpacity+";pointer-events:none")
						.text(args.item.szTitle);
				}
			}
		}
		return {x:0,y:args.item?0:(rad+2*20)};
	};

/**
 * end of namespace
 */

})();

// -----------------------------
// EOF
// -----------------------------
