/**
 * custom tooltip for election map
 */

window.ixmaps = window.ixmaps || {};
(function () {

	var __fTooltipPin = false;
	var __fTooltipPinned = false;

	ixmaps.htmlgui_onTooltipDisplay = function (evt, szText) {

		if (!szText || !szText.length) {
			return false;
		}

		if (!window.document.getElementById("tooltip")) {
			var div = document.createElement("div");
			div.setAttributeNS(null, "id", "tooltip");
			document.activeElement.appendChild(div);
		}

		var szHtml = "";

		var width = window.innerWidth / 4;

		var xPos = evt.clientX;
		var yPos = evt.clientY;

		var fontsize = Math.max(12,(12 / 1200 * window.innerWidth));

		szHtml += "<div id='tooltipDiv' style='position:absolute;left:" + xPos + "px;top:" + yPos + "px;font-family: arial narrow, system;font-size:" + fontsize + "px;color: #444;background: white;border: 0.5px solid black;border-radius: 5px'>";
		console.log(szText);
		szHtml += "<div style='margin:0.5em 0.5em'>" + szText + "</div>";

		szHtml += "<div id='chartDiv' style='margin:0.5em 1em;width:" + width + "px;overflow:hidden'><svg width='300' height='300' viewBox='0 0 5000 5000'><g id='getchartmenutarget' onmousemove='javascript:ixmaps.onMouseOver();' onmouseout='javascript:ixmaps.onMouseOut();' style='pointer-events:all'></g></svg></div>";

		if (__fTooltipPin) {
			szHtml += "<div onclick='ixmaps.htmlgui_deleteItemPinned()' style='position:absolute;top:-0.5em;right:-0.5em;font-size:1em;color:white;background:#444444;padding:0 0.25em;border-radius:1em;cursor:pointer;'>&Cross;</div>"
			__fTooltipPinned = true;
		}

		szHtml += "</div>";

		window.document.getElementById("tooltip").innerHTML = szHtml;

		szId = evt.path[1].getAttributeNS(null, "id");
		var szIdA = szId.split(":");
		var szFlag = "VALUES|XAXIS|ZOOM|BOX|GRID";
		var themesA = ixmaps.getThemes();
		for (var t = 0; t < themesA.length; t++) {
			var objTheme = themesA[t];
			if (objTheme.szFlag.match(/PLOT/)) {
				console.log(objTheme.szFlag);
				objTheme.drawChart(window.document.getElementById("getchartmenutarget"), szIdA[0] + "::" + szIdA[2], 30, szFlag);
			}
		}

		var SVGBox = window.document.getElementById("getchartmenutarget").getBBox();

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

			xPos = xPos > window.innerWidth / 2 ? (xPos - width - 100) : xPos + 30;
			yPos = yPos > window.innerHeight / 2 ? (yPos - width / 2) : (yPos + 150);
			window.document.getElementById("tooltipDiv").style.left = xPos + "px";
			window.document.getElementById("tooltipDiv").style.top = yPos + "px";

		} else {
			window.document.getElementById("chartDiv").remove();
			var width = window.document.getElementById("tooltipDiv").clientWidth;
			var height = window.document.getElementById("tooltipDiv").clientHeight;
			xPos = xPos > window.innerWidth / 2 ? (xPos - width - 30) : xPos + 30;
			yPos = yPos > window.innerHeight / 3 ? (yPos - height + 150) : (yPos + 20);
			window.document.getElementById("tooltipDiv").style.left = xPos + "px";
			window.document.getElementById("tooltipDiv").style.top = yPos + "px";
		}

		if (ixmaps.getMapTypeId().match(/dark/i)) {
			window.document.getElementById("tooltipDiv").style.setProperty("background-color", "#333");
		}

		return true;
	}

	ixmaps.htmlgui_onTooltipDelete = function () {
		if (__fTooltipPinned) {
			return false;
		}
		ixmaps.setMapOverlayHTML("");
		window.document.getElementById("tooltip").innerHTML = "";
		return true;
	}

	ixmaps.htmlgui_onItemOver = function (evt, szId) {

		if (__fTooltipPinned) {
			return true;
		}
		__themeObj = ixmaps.getThemeObj(szId.split(":")[0]);
		var data = ixmaps.getData(szId);
		var szHtml = "<div style='font-size:18px;max-width:400px'>";


		var normal = "#aaaaaa";
		var highLight = "#000000";
		var highLightBg = "#e8e8e8";

		if (ixmaps.getMapTypeId().match(/dark/i)) {
			//$("#container").css("background-color", "#333");
			//$("#container").css("color", "#ddd");
			normal = "#bbbbbb";
			highLight = "#ffffff";
			highLightBg = "#808080";
		}
		var suffix = "";


		if (!szId.match(/chart/i)) {

			var obj = ixmaps.embeddedSVG.window.SVGDocument.getElementById(szId);

			// get theme chart if present
			// --------------------------
			var szChartId = szId.match(/::/) ? szId : obj.parentNode.getAttribute("id");
			var szIdA = szChartId.split("#");
			if (szIdA.length > 1) {
				var szIdAA = szIdA[1].split(/\b::\b/);
				szChartId = szIdA[0] + "::" + szIdAA[1];
				szTitle = szIdAA[1];
			}
			szId = ixmaps.getThemes()[1].szId + ":" + szChartId + ":chartgroup";

		}

		var themeObj = ixmaps.getThemeObj(szId.split(":")[0]);

		var szHtml = "";

		var data = ixmaps.map().getData(szId);
		if (data) {

			var eta = 0;

			szHtml += "<section>";
			szHtml += "<div style='height:0.1em'></div>"
			szHtml += "<div style='margin:1em 1em 1em 1em;min-width:"+window.innerWidth+"'px'><h3>" + data[0]["Collegio o ripartizione"] + "</h3></div>"
			szHtml += "</section>";

			szHtml += "<section>";
			szHtml += "<table style='margin:1em 1em 1em 1em'>";

			for (a in data) {
				if (data[a].sesso == 'F') {
					szHtml += "<tr style='background:#fff8f8'><td style='width:80%;max-width:250px'>" + data[a]["Cognome e nome"] + "</td><td>" + data[a].eta + " anni</td></tr><tr><td style='font-size:0.8em;max-width:250px'>" + (data[a].Lista || data[a].Coalizione) + "</td><tr>";
					eta += data[a].eta;
				}
			}
			for (a in data) {
				if (data[a].sesso == 'M') {
					szHtml += "<tr style='background:#f8f8ff'><td style='width:80%;max-width:250px'>" + data[a]["Cognome e nome"] + "</td><td>" + data[a].eta + " anni</td></tr><tr><td style='font-size:0.8em;max-width:250px'>" + (data[a].Lista || data[a].Coalizione) + "</td><tr>";
					eta += data[a].eta;
				}
			}

			szHtml += "</table>";
			szHtml += "</section>";

		}

		ixmaps.htmlgui_onTooltipDisplay(evt, szHtml);
		return true;
	}

	ixmaps.htmlgui_onItemClick = function (evt, szId) {
		__fTooltipPinned = false;
		__fTooltipPin = true;
		ixmaps.fOnItemClicked = true;
		return ixmaps.htmlgui_onItemOver(evt, szId);
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
