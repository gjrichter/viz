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

	__myGradientId = "myGradient"+Math.random();
	
	__defineGradient = function(target,szId,szColor){

		var mainGradient = target.append('linearGradient')
			.attr('id', szId)
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
		
		// ----------------------------------------------
		
		var mainGradient = target.append('linearGradient')
			.attr('id', szId+"R")
			.attr("x1", "0%")
			.attr("y1", "100%")
			.attr("x2", "0%")
			.attr("y2", "0%");

		// Create the stops of the main gradient. Each stop will be assigned
		// a class to style the stop using CSS.
		mainGradient.append('stop')
			.attr('style', 'stop-color:'+szColor+'')
			.attr('offset', '0');

		mainGradient.append('stop')
			.attr('style', 'stop-color:white')
			.attr('offset', '1');
	}
	

	// --------------------------------------------------
	// init is called once before draw  
	// here we define the gradient for filling the peeks
	// --------------------------------------------------
	
	ixmaps.pinnacleChart_init = function(SVGDocument,args){
		
		// use d3 to draw the chart
		// -------------------------
		var svg = d3.select(args.target);
		
		// Create the svg:defs element and the main gradient definition.
		var svgDefs = svg.append('defs');
		
		for (i in args.theme.colorScheme){
			__defineGradient(svgDefs,__myGradientId+i,args.theme.colorScheme[i]);
		}
	};
	
	// --------------------------------------------------
	// called for every chart of the theme to draw   
	// draw a peak with outline color and gradient filling
	// chart type inspired by NYT pinackle maps
	// --------------------------------------------------
	
	ixmaps.pinnacleChart = function(SVGDocument,args){
		
		console.log(args.theme);
		

		var nValue = args.values[(args.theme.nActualFrame||0)];
		var nMax = Math.max(args.theme.nMax,Math.abs(args.theme.nMin));
		if ( args.theme.nMinValue && (nValue < args.theme.nMinValue) ){
			return false;
		}
		var rad = args.item?nValue/nMax*args.maxSize*20:args.maxSize/2*20;
		if ( args.theme.nNormalSizeValue ){
			rad = args.item?nValue/args.theme.nNormalSizeValue*args.maxSize*20:args.maxSize/2*20;
		}	
		rad *= args.theme.nRangeScale||1;
		
		var nClass = 0;
		for ( p in args.theme.partsA ){
			if ( nValue <= args.theme.partsA[p].max ){
				break;
			}else{
				nClass++;
			}
		}
		
 		var szColor = (args.theme.colorScheme[nClass]);
		var szGradientId = __myGradientId+String(nClass);
		
		
		
		var szOpacity = 1;
		var szFillOpacity = 0.7;

		if (rad == 0){
			return false;
		}

		// use d3 to draw the circle0
		// -------------------------
		var svg = d3.select(args.target);
		
		if ( rad >=0 ){
			if ( rad > 100 && args.theme.szFlag.match(/3D/)){
				svg.append("path")
					.attr("d", "M0,0 l120,"+(-rad/2)+" l120,"+(rad/2)+"")
					.attr("style","fill:#888888;stroke:#222222;stroke-width:20;fill-opacity:"+szFillOpacity+";opacity:"+szOpacity+";")
					.attr("transform","rotate(170) translate(-200 -50) skewX(66) scale(1 0.5)");
			}
			svg.append("path")
				.attr("d", "M0,0 l100,"+(-rad)+" l100,"+(rad)+"")
				.attr("style","fill:url(#"+szGradientId+");stroke:"+szColor+";stroke-width:20;fill-opacity:"+szFillOpacity+";opacity:"+szOpacity+";");
		}else{
			svg.append("path")
				.attr("d", "M0,0 l100,"+(-rad)+" l100,"+(rad)+"")
				.attr("style","fill:url(#"+(szGradientId+"R")+");stroke:"+szColor+";stroke-width:20;stroke-opacity:0.3;fill-opacity:"+szFillOpacity+";opacity:"+szOpacity+";");
		}

		if ( args.flag.match(/VALUES/) ){

			var nFontSize = Math.sqrt(rad)*10;

			// show only if fontsize is reasonable (fontsize is n * 20)
			if ( nFontSize > (args.theme.nValueSizeMin||120) ){
				var szText = (nValue).toFixed(0) + (args.theme.szUnits||"");
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
