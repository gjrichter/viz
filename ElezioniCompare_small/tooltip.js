/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

		var __fTooltipPin = false;
		var __fTooltipPinned = false;

		ixmaps.htmlgui_onTooltipDisplay = function(evt,szText) {
			
			console.log("hi")
			
			if (!window.document.getElementById("tooltip")){
				var div = document.createElement("div");
				div.setAttributeNS(null,"id","tooltip");
				document.activeElement.appendChild(div);
			}
			
			var szHtml = "";
			
			var width = Math.min(300,window.innerWidth/2);
			
			var xPos = evt.clientX;
			var yPos = evt.clientY;
			
			console.log(evt);

			if(evt.type == 'touchstart' || evt.type == 'touchmove' || evt.type == 'touchend' || evt.type == 'touchcancel'){
				var touch = evt.touches[0] || evt.changedTouches[0];
				xPos = touch.pageX;
				yPos = touch.pageY;
			} else if (evt.type == 'mousedown' || evt.type == 'mouseup' || evt.type == 'mousemove' || evt.type == 'mouseover'|| evt.type=='mouseout' || evt.type=='mouseenter' || evt.type=='mouseleave') {
				xPos = evt.clientX;
				yPos = evt.clientY;
			}			
			
			
			
			var fontsize = 22/1200*window.innerWidth;
			
			szHtml += "<div id='tooltipDiv' style='position:absolute;left:"+xPos+"px;top:"+yPos+"px;font-family: arial narrow, system;font-size:"+fontsize+"px;color: #444;background: white;border: 0.5px solid black;border-radius: 5px'>";
			
			szHtml += "<div id='tooltipTitle' style='font-size:22px;margin:0.5em 0.5em'>"+szText+"</div>";
			
			szHtml += "<div id='chartDiv' style='margin:0.5em 1em;width:"+width+"px;overflow:hidden'><svg width='300' height='300' viewBox='0 0 5000 5000'><g id='getchartmenutarget' onmousemove='javascript:ixmaps.onMouseOver();' onmouseout='javascript:ixmaps.onMouseOut();' style='pointer-events:all'></g></svg></div>";

			if (__fTooltipPin) {
				szHtml += "<div onclick='ixmaps.htmlgui_deleteItemPinned()' style='position:absolute;top:-0.5em;right:-0.5em;font-size:22px;color:white;background:#444444;padding:0 0.25em;border-radius:1em;cursor:pointer;'>&Cross;</div>"
				__fTooltipPinned = true;
			}
			
			szHtml += "</div>";
			
			console.log("hi-1")
			//ixmaps.setMapOverlayHTML(szHtml);
			
			window.document.getElementById("tooltip").innerHTML = szHtml;
			szId = evt.path[1].getAttributeNS(null,"id");
			var szIdA = szId.split(":");
			var szFlag = "VALUES|XAXIS|ZOOM|BOX|GRID";
			var themesA = ixmaps.getThemes();
			for ( var t=themesA.length-1; t<themesA.length; t++ ){
				var objTheme = themesA[t];
				if ( 1 || objTheme.szFlag.match(/PLOT/) ){
					console.log(objTheme);
					window.document.getElementById("tooltipTitle").innerHTML = objTheme.itemA[szIdA[0] + "::" + szIdA[2]].szTitle;
					objTheme.drawChart(window.document.getElementById("getchartmenutarget"), szIdA[0] + "::" + szIdA[2], 30, szFlag);
				}
			}
			console.log("hi-2")

			var SVGBox = window.document.getElementById("getchartmenutarget").getBBox();
			console.log(SVGBox);
			if (SVGBox && SVGBox.width && SVGBox.height) {
				var scale = Math.max(1, width / SVGBox.width);
				SVGBox.width *= scale;
				SVGBox.height *= scale;
				SVGBox.y -= 30;
				SVGBox.height += 60;

				var size = width;
				var width = size;
				var height = size / SVGBox.width * SVGBox.height;
				while (height > width) {
					height *= 0.9;
				}

				window.document.getElementById("getchartmenutarget").parentNode.setAttribute("width", width);
				window.document.getElementById("getchartmenutarget").parentNode.setAttribute("height", height);
				window.document.getElementById("getchartmenutarget").parentNode.setAttribute("viewBox", SVGBox.x + ' ' + SVGBox.y + ' ' + SVGBox.width + ' ' + SVGBox.height);
				
				xPos = xPos>window.innerWidth/2?(xPos-width-80):xPos+10;
				yPos = yPos>window.innerHeight/2?(yPos-height-80):(yPos+30);
				window.document.getElementById("tooltipDiv").style.left = xPos + "px";
				window.document.getElementById("tooltipDiv").style.top = yPos + "px";
				
				console.log("where is my tooltip");
				console.log(window.document.getElementById("tooltip"))

			} else {
				window.document.getElementById("chartDiv").remove();
			}
			
			console.log("hi-3")
			return true;
		}
	
		ixmaps.htmlgui_onTooltipDelete = function(){
			if (__fTooltipPinned){
				return false;
			}
			ixmaps.setMapOverlayHTML("");
			window.document.getElementById("tooltip").innerHTML = "";
		}
		
		ixmaps.htmlgui_onItemOver = function(evt,szId) {
			if (__fTooltipPinned){
				return true;
			}
			if (szId.match(/mapbackground/)){
				return true;
			}
			__themeObj = ixmaps.getThemeObj(szId.split(":")[0]);
			try{
				var data = ixmaps.getData(szId);
				var szTooltip = " &rarr; "+ data[0].Country +": "+ data[0].Total + " Mio €";
			} catch (e) {
				var szTooltip = szId.split("::")[1];
			}
			ixmaps.htmlgui_onTooltipDisplay(evt,szTooltip);
			return true;
		}
		
	ixmaps.htmlgui_onItemClick = function (evt,szId) {
		if (!evt){
			return;
		}
		__fTooltipPinned = false;
		__fTooltipPin = true;
		ixmaps.fOnItemClicked = true;
		return ixmaps.htmlgui_onItemOver(evt,szId);
	}
	ixmaps.htmlgui_deleteItemPinned = function () {
		__fTooltipPinned = false;
		__fTooltipPin = false;
		ixmaps.setMapOverlayHTML("");
		window.document.getElementById("tooltip").innerHTML = "";
		ixmaps.clearHighlight();
	}


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------

