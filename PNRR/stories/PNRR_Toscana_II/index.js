
// --------------------------------------------
// --------------------------------------------
//
//   H E L P E R 
//
// --------------------------------------------
// --------------------------------------------


// ---------------------------------------------------
// format number display 
// ---------------------------------------------------

/**
 * convert a number into a formatted string; if the number > 1000 it will be formatted like 1 023 234 
 * @param nValue the number to format
 * @param nPrecision the wanted decimal points 
 * @param szFlag "CEIL" or "FLOOR" (round either up or down)
 */
__formatValue = function (nValue, nPrecision, szFlag) {

	nValue = Number(nValue);

	if (!isFinite(nValue) || !isFinite(nPrecision)) {
		return String(nValue);
	}
	if (nValue == 0) {
		return String(nValue);
	}
	if (nValue > 1000000000000) {
		return String(nValue);
	}
	if (nValue < -1000000000000) {
		return String(nValue);
	}

	if (!nPrecision) {
		nPrecision = 0;
	}
	nPrecision = Math.max(0, nPrecision);

	// GR 02.12.2011 make that low values do not collapse to 0
	if ((nValue > 0.0000001) && (nPrecision > 0)) {
		while (nValue.toFixed(nPrecision - 1) == 0) {
			nPrecision++;
		}
	}

	// GR 11.03.2009 fix precision before CEIL or FLOOR to avoid JS errors eg. 0.0000000000003
	nValue = nValue.toFixed(nPrecision + 1);

	nClipDecimal = Math.pow(10, nPrecision);
	if (szFlag && szFlag.match(/CEIL/)) {
		nValue = Math.ceil(nValue * nClipDecimal) / nClipDecimal;
	} else
	if (szFlag && szFlag.match(/FLOOR/)) {
		nValue = Math.floor(nValue * nClipDecimal) / nClipDecimal;
	} else {
		nValue = Math.round(nValue * nClipDecimal) / nClipDecimal;
	}
	// format numbers > 1000
	if (0 && (nValue < 1000)) {
		return String(nValue);
	} else {
		var szDecimals = String(nValue);
		if (szDecimals.match(/\./)) {
			szDecimals = szDecimals.split(".")[1];
			while (szDecimals.length < nPrecision) {
				szDecimals += '0';
			}
		} else {
			szDecimals = "";
		}
		var szReturn = nValue < 0 ? "-" : "";
		var szLeading = "";

		nValue = Math.floor(Math.abs(nValue));

		// GR new flag
		if (!szFlag || !szFlag.match(/NOBREAKS/)) {
			var nClip = 1000;
			while (nValue > nClip) {
				nClip *= 1000;
			}
			nClip /= 1000;

			var nPart = 0;
			var szBreak = " ";
			while (nClip >= 1000) {
				nPart = Math.floor(nValue / nClip);
				szReturn += __maptheme_formatpart(nPart, szLeading);
				nValue = nValue % nClip;
				nClip /= 1000;
				if (nPart) {
					szLeading = "0";
					if (szFlag && szFlag.match(/SPACE/)) {
						szBreak = "<span style=\"font-size:0.5em;\">&nbsp;</span>";
					} else 
					if (szFlag && szFlag.match(/BLANK/)) {
						szBreak = "&nbsp;";
					} else {
						szBreak = ".";
					}
				}
				szReturn += szBreak;
			}
		}

		szReturn += __maptheme_formatpart(nValue, szLeading);

		if (!szReturn.length || (szReturn == "-")) {
			szReturn += "0";
		}

		if (szDecimals.length && szDecimals != "00") {
			szReturn += ((szFlag && szFlag.match(/BLANK/)) ? "." : ",") + szDecimals;
		}
	}
	return szReturn;
}

/**
 * helper to format a number from 0 to 999 into a string with leading character (sample 32 -> "032" )
 * @param nPart the number to format
 * @param szLeading the leading character to insert if necessary 
 */
function __maptheme_formatpart(nPart, szLeading) {
	if (!szLeading) {
		szLeading = "";
	}
	var szPart = "";
	if (nPart < 100) {
		szPart += szLeading;
	}
	if (nPart < 10) {
		szPart += szLeading;
	}
	if (nPart == 0) {
		szPart += szLeading;
	} else {
		szPart += String(nPart);
	}
	return szPart;
}


// get unique values array via named array

var __getUniqueValues = function (a) {
	var u = [];
	for (var i in a) {
		u[String(a[i])] = 1;
	}
	var retA = [];
	for (var v in u) {
		retA.push(v);
	}
	return retA;
};

var __regionPop = [];

/**
 * helper to format a number from 0 to 999 into a string with leading character (sample 32 -> "032" )
 * @param nPart the number to format
 * @param szLeading the leading character to insert if necessary 
 */

var findLineByLeastSquares = function(values_x, values_y) {
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    /*
     * The above is just for quick access, makes the program faster
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Above and below cover edge cases
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (let i = 0; i< values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;
    }

    /*
     * Calculate m and b for the line equation:
     * y = x * m + b
     */
    var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    var b = (y_sum/count) - (m*x_sum)/count;

    /*
     * We then return the x and y data points according to our fit
     */
    var result_values_x = [];
    var result_values_y = [];

    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [result_values_x, result_values_y];
}

// --------------------------------------------
// --------------------------------------------
//
//   T o p   T r e n d   C a r d s
//
// --------------------------------------------
// --------------------------------------------

$(function () {

	// ..........................................................
	//
	// helper
	//
	// ..........................................................

	var __getArrow = function (last, before) {
		return (last == before) ? "fa-arrow-right" : ((last < before) ? "fa-arrow-down" : "fa-arrow-up");
	};
	var __getArrowColor = function (last, before) {
		return (last == before) ? "black" : ((last < before) ? "#66aa44" : "red");
	};

	var __getIcon = function (labels) {
		if (labels.match(/form/i)) {
			return "fa-file-text-o";
		}
		if (labels.match(/facebook/i)) {
			return "fa-facebook";
		}
		if (labels.match(/twitter/i)) {
			return "fa-twitter";
		}
		if (labels.match(/telegram/i)) {
			return "fa-paper-plane-o";
		}
		return "fa-file-text-o";
	};

	var __getDataDefinition = function (element) {
		var txt = $(element).attr("data-path");
		if (txt) {
			var textA = txt.split("::");
			var x = {};
			x.type = textA[0];
			x.table = textA[1];
			x.column = textA[2].split('[')[0];
			x.selection = textA[2].split('[')[1] ? (textA[2].split('[')[1].split(']')[0]) : "";
			return x;
		}
		return null;
	};

	// needed for safari !
	var __normalizeTime = function (date) {
		return (date || "").replace(/\-/gi, '/');
	};

	// ..........................................................................
	//
	// get region names 
	//
	// ..........................................................................
	
	var countriesA = [];
	var countriesMaxA = [];
	var lastFilter = "";
	
	__setFilter = function (szFilter) {
		
		//ixmaps.setTitleBox("<span style='font-family:open sans;color:#888888;font-size:0.7em'>"+(szFilter||"")+"</span>");

		// make final filter
		if ( szFilter && (szFilter.length == 2) ){
			szFilter = "WHERE missione = \""+szFilter+"\"";
		}else
		if ( szFilter && szFilter.length ){
			szFilter = "WHERE misura_pnrr_estesa = \""+szFilter+"\"";
		}
		
		
		if ( typeof(szFilter) == 'undefined' && lastFilter == "" ){
			return;
		}
		szFilter = (typeof(szFilter) != 'undefined')?szFilter : lastFilter;
		lastFilter = szFilter;
		
		
		// get map API
		var map = ixmaps.map("map");
		// filter items on map
		var objThemesA = map.getThemes();
		for ( a in objThemesA ){
			var objTheme = objThemesA[a];
			if ( objTheme.szName == "pagamenti" ){
              	if ( szFilter ){
                	map.changeThemeStyle(objTheme.szId, "filter:" + (szFilter+" AND importo_pagamenti_siope > 0" || " "), "set");
				}else{
             		map.changeThemeStyle(objTheme.szId, "filter:" + ("WHERE importo_pagamenti_siope > 0" || " "), "set");
				}
 			}else
			if ( objTheme.szName == "finanziati" ){
              	if ( szFilter ){
                	map.changeThemeStyle(objTheme.szId, "filter:" + (szFilter+" AND finanziato_pnrr > 0" || " "), "set");
				}else{
             		map.changeThemeStyle(objTheme.szId, "filter:" + ("WHERE finanziato_pnrr > 0" || " "), "set");
				}
 			}else
			if ( objTheme.szName == "iniziato" ){
              	if ( szFilter ){
                	map.changeThemeStyle(objTheme.szId, "filter:" + (szFilter+" AND data_inizio != NULL" || " "), "set");
				}else{
             		map.changeThemeStyle(objTheme.szId, "filter:" + ("WHERE data_inizio != NULL" || " "), "set");
				}
 			}else
			if ( objTheme.szFlag.match(/CHART|CHOROPLETH/) ){
                if ( szFilter ){
                   map.changeThemeStyle(objTheme.szId, "filter:" + (szFilter || " "), "set");
                }else{
                    map.changeThemeStyle(objTheme.szId, "filter", "remove");
                }
            }
		}
	};
	
	ixmaps.htmlgui_onProjectLoaded = function(objProject){
		
		var objThemesA = objProject.themes;
		for ( i in objThemesA ){
			
			var objTheme = objThemesA[i];

			if ( objTheme.style.name == "pagamenti" ){
              	if ( lastFilter ){
                	objTheme.style.filter = (lastFilter+" AND importo_pagamenti_siope > 0");
				}else{
             		objTheme.style.filter = "WHERE importo_pagamenti_siope > 0";
				}
 			}else
			if ( objTheme.style.name == "finanziati" ){
              	if ( lastFilter ){
                	objTheme.style.filter = (lastFilter+" AND finanziato_pnrr > 0");
				}else{
             		objTheme.style.filter = "WHERE finanziato_pnrr > 0";
				}
 			}else
			if ( objTheme.style.name == "iniziato" ){
              	if ( lastFilter ){
                	objTheme.style.filter = (lastFilter+" AND data_inizio != NULL");
				}else{
             		objTheme.style.filter = "WHERE data_inizio != NULL";
				}
 			}else
			if ( objTheme.style.type.match(/CHART|CHOROPLETH/) ){
                if ( lastFilter && lastFilter.length ){
                   objTheme.style.filter = lastFilter;
                }
            }
		}
	};
	
	getMissions = function () {
		
		var missioniA = {
			"M1" : "M1 - Digitalizzazione, innovazione, competitività, cultura e turismo",
			"M2" : "M2 - Rivoluzione verde e transizione ecologica",
			"M3" : "M3 - Infrastrutture per una mobilità sostenibile",
			"M4" : "M4 - Istruzione e ricerca",
			"M5" : "M5 - Inclusione e coesione",
			"M6" : "M6 - Sanità territoriale, Innovazione del Servizio sanitario",
			"NU" : "PNC - Piano nazionale complementare"
		};
		
		var szUrl = "https://www301.regione.toscana.it/bancadati/pnrrPerSitoWeb/getOpenData_v4.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {
				// get the regions
				
				mydata.sort("misura_pnrr_estesa");

				countriesA = mydata.column("misura_pnrr_estesa").uniqueValues();
				
				szHtml = "<span style='font-size:0.9em'>";
				szHtml += "<select onChange='__setFilter(this.value)' style='width:100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;border-left:none;border-right:none;margin-top:0.5em;margin-left:0.1em'>";
 				szHtml += "<option selected='true' value=''  style='font-size:1em;padding:0.5em 0'>Tutte le missioni</option>";
				
				var missione = "";
				for (i in countriesA) {
					if (countriesA[i].substring(0,2) != missione ){
						missione = countriesA[i].substring(0,2);
						//szHtml += "<option disabled></option>"
						szHtml += "<option style='font-size:0.8em' value=\"" + missione + "\">" + missioniA[missione] + "</option>";
					}
					szHtml += "<option style='font-size:0.6em' value=\"" + countriesA[i] + "\"> - " + countriesA[i] + "</option>";
				}
	
				szHtml += "</select>";
				szHtml += "</span>";
				
				$("#select-misure").html(szHtml);
			});
	};
	
	getMissions();	
	
	ixmaps.statistics = function(szId){
		
		if( szId == "progetti" 		||
		    szId == "importi"  		||
		    szId == "finanziati"  	||
		    szId == "pagamenti"		||
		    szId == "monitoraggio"	||
		    szId == "data_inizio"
		  ){
			var szFieldsA = [ "misura_pnrr_estesa"
							 ,"importo_progetto"
							 ,"finanziato_pnrr"
							 ,"importo_pagamenti_siope"
							 ,"monitoraggio"
							 ,"tipo_data_inizio"
							];
			var facetsA = ixmaps.data.getFacets(lastFilter,'user_legend',szFieldsA,szId,"map");
			
			// main 4 numbers
			
			var projects = __formatValue(facetsA[1].data.length, 0, "BLANK");
			var importi  = __formatValue(facetsA[1].sum, 0, "BLANK");
			var finanziati  = __formatValue(facetsA[2].sum, 0, "BLANK");
			var pagamenti  = __formatValue(facetsA[3].sum, 0, "BLANK");
			
			$("#no_progetti").html(projects);
			$("#importi").html(importi+" €");
			$("#finanziati").html(finanziati+" €");
			$("#pagamenti").html(pagamenti+" €");
			
			// monitoraggio
			
			var monitoraggi = 0;
			var percent = 0;
			if (Number(facetsA[4].nCount) &&
				Number(facetsA[4].valuesCount["Avviato"]) &&
				Number(facetsA[4].valuesCount["Non previsto"]) 
			   ){
				monitoraggi = Number(facetsA[4].nCount) - Number(facetsA[4].valuesCount["Non previsto"]);
				percent = 100/monitoraggi*Number(facetsA[4].valuesCount["Avviato"]);
			}
			
			$("#no_monitoraggi").html(__formatValue(monitoraggi, 0, "BLANK"));
			$("#percent_monitoraggi").html(__formatValue(Math.ceil(percent), 0, "BLANK")+ " %");
		
			// data inizio
			
			var effettiva = 0;
			var effettiva_percent = 0;
			if (Number(facetsA[5].valuesCount["effettiva"])){
				effettiva = Number(facetsA[5].valuesCount["effettiva"]);
				effettiva_percent = 100/Number(facetsA[5].nCount)*Number(facetsA[5].valuesCount["effettiva"]);
			}
			
			$("#data_inizio_effettiva").html(__formatValue(effettiva), 0, "BLANK");
			$("#data_inizio_effettiva_percent").html(__formatValue(Math.ceil(effettiva_percent), 0, "BLANK")+ " %");

			console.log(ixmaps.getThemeObj(szId));
		}
	}
	/**
		init sidebar	
	**/

	// change 'button' style to show presence of theme
	var __lastButton = null;
	__setThemeButtonStyle = function(buttonObj,fFlag){
		if (__lastButton){
			__lastButton.children().first().css("display","inline");
			__lastButton = null;
		}
		if ( fFlag ){
			//$(".click-splash").hide();
			buttonObj.children().first().css("display","none");
			__lastButton = buttonObj;
			//buttonObj.children().last().css("display","inline");
		}else{
			buttonObj.children().first().css("display","inline");
			//buttonObj.children().last().css("display","none");
		}
	}; 

	__showFooter = function(buttonObj){
		$("#"+buttonObj.attr("id")+"_footer").show();
	};

	__hideFooter = function(buttonObj){
		$("#"+buttonObj.attr("id")+"_footer").hide();
	};

	var old_onDrawTheme = ixmaps.htmlgui_onDrawTheme;
	// intercept theme creation, to mark active themes
	ixmaps.htmlgui_onDrawTheme = function(szId){ 
		
		ixmaps.themesDrawnA = ixmaps.themesDrawnA||[];
		ixmaps.themesDrawnA[szId] = true;

		var themeObj = ixmaps.getThemeObj(szId);
		if ( themeObj.szFlag.match(/NOLEGEND/) ) {
			try	{
				old_onDrawTheme(szId); 
			}catch (e){}
			return;
		};

		ixmaps.statistics(szId);
		
		$(".click-splash").hide();
		if (!themeObj.fVisible){
			$("#themeLegendDiv"+szId.replace(/\./g,'')).html("theme not visible at this zoom level<h1>please zoom in !</h1>");
			return;
		}
		
		var colorA  = themeObj.colorScheme;
		var labelA  = themeObj.szLabelA;
		if ( !labelA ){
			labelA = new Array();
			var szUnit = themeObj.szUnit || "";
			for ( var i=0; i<colorA.length; i++){
				var szPart = parseFloat(themeObj.partsA[i].min).toFixed(2)+szUnit+" ... "+parseFloat(themeObj.partsA[i].max).toFixed(2)+szUnit;
				labelA.push(szPart);
			}
		}
		szHtml = "";
		szHtml += themeObj.szTitle;
		if ( themeObj.szSnippet && typeof(themeObj.szSnippet)!="undefined"){
			szHtml += "<br><span style=\"font-size:0.8em;\"><em>"+themeObj.szSnippet+"</em></span>";
		}
		var legendHeight = window.innerHeight/2;
		if ( ixmaps.legend.makeColorLegendHTML ){
			szHtml += "<div style='max-height:"+legendHeight+"px;overflow:hidden;margin-top:0.5em;margin-bottom:0em;padding-right:1em'>";
			szHtml += ixmaps.legend.makeColorLegendHTML(szId,null,"compact");
			szHtml += "</div>";
		}else{
			szHtml += "<table style='font-size:0.8em;line-height:1.1em;margin-top:0.3em;margin-bottom:0.3em;'>";
			var max = Math.min(100,colorA.length);
			for ( var i=0; i<labelA.length; i++){
				szHtml += "<tr valign='top'><td><span onclick='javascript:ixmaps.hideThemeClass(\""+szId+"\","+i+")' onmouseover='javascript:ixmaps.markThemeClass(\""+szId+"\","+i+")' onmouseout='javascript:ixmaps.unmarkThemeClass(\""+szId+"\","+i+")' style='background:"+colorA[i]+";font-size:0.7em;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td><span>"+ labelA[i] +"</span></td></tr>";
			}
			szHtml += "</table>";
		}

		szHtml += "<div id='map-legend-footer'>";
		if (themeObj.szDescription){
			szHtml += "<span style=\"font-size:0.9em;\"><em>"+themeObj.szDescription+"</em></span>";
		}
		szHtml += ixmaps.htmlgui_onLegendFooter ? ixmaps.htmlgui_onLegendFooter(szId,themeObj,ixmaps.embeddedApi.embeddedApi.getThemeDefinitionObj(szId)) : "";
		szHtml += "</div>";

			var id = szId.replace(/\./g,'');

			var bigger_icon = "icon icon-arrow-up";
			var smaller_icon = "icon icon-arrow-down";

			if ( themeObj.szFlag.match(/AGGREGATE/) ){
				bigger_icon = "icon icon-table2 inline-legend-tool-button";
				smaller_icon = "icon icon-table";
				bigger_icon = "glyphicon glyphicon-th-large";
				smaller_icon = "glyphicon glyphicon-th";
			}

			if (1){
				szHtml += 		"<div style='margin-left:-0.2em;margin-top:1em;margin-bottom:0;' >";
					
				szHtml += 		"<a id='highbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"amplify\",\"0.9\");' title='flatten' >";
				szHtml += 			"<span class='icon "+smaller_icon+" inline-legend-tool-button' ></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='lowbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"amplify\",\"1.1\");' title='amplify'>";
				szHtml += 			"<span class='icon "+bigger_icon+" inline-legend-tool-button' ></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='minusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"scale\",\"0.66\");' title='smaller charts'>";
				szHtml += 			"<span class='icon icon-minus inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='plusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"scale\",\"1.5\");' title='bigger charts'>";
				szHtml += 			"<span class='icon icon-plus inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='valuebutton"+id+"' href='javascript:ixmaps.toggle_values(\""+szId+"\");' title='text value -/+'>";
				szHtml += 			"<span class='icon icon-spell-check inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='opminusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"opacity\",\"0.66\");' title='more trasparency'>";
				szHtml += 			"<span class='icon icon-checkbox-unchecked inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='opplusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"opacity\",\"1.5\");' title='less trasparency'>";
				szHtml += 			"<span class='icon icon-checkbox-partial inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='deletebutton"+id+"' href='javascript:ixmaps.removeTheme(\""+szId+"\");' title='remove theme'>";
				szHtml += 			"<span class='icon icon-remove inline-legend-tool-button'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='lockbutton"+id+"' href='javascript:ixmaps.changeThemeStyle(\""+szId+"\",\"type:LOCKED\",\"toggle\");' title='chart menu'>";
				if ( themeObj.szFlag.match(/LOCKED/) ) {
					szHtml += 			"<span class='icon icon-lock inline-legend-tool-button'></span>";
					szHtml += 			"</a>&nbsp;";
				}else{
					szHtml += 			"<span class='icon icon-unlocked inline-legend-tool-button'></span>";
					szHtml += 			"</a>&nbsp;";
				}

				szHtml += 		"</ div>";
				}
		try	{
			//ixmaps.setTitle(String(themeObj.szTitle+"<div style='font-size:0.5em;line-height:1em;'>"+(themeObj.szSnippet||"")+"</div>"));
		}catch (e){}

		$("#themeLegendDiv"+id).html(szHtml);

		// GR 12.11.2016 keep mouse and touch events inside the legend div
		// ---------------------------------------------------------------
		$("#themeLegendDiv"+id).attr("onwheel","javascript:event.stopPropagation();");
		$("#themeLegendDiv"+id)[0].addEventListener("touchstart", function(event){event.stopPropagation();}, false);
		$("#themeLegendDiv"+id)[0].addEventListener("touchend", function(event){event.stopPropagation();}, false);
		$("#themeLegendDiv"+id)[0].addEventListener("touchmove", function(event){event.stopPropagation();}, false);
		// ---------------------------------------------------------------

		$( "#lowbutton"+id ).button();
		$( "#highbutton"+id  ).button();
		$( "#minusbutton"+id  ).button();
		$( "#plusbutton"+id  ).button();
		$( "#valuebutton"+id  ).button();
		$( "#opminusbutton"+id  ).button();
		$( "#opplusbutton"+id  ).button();
		$( "#deletebutton"+id  ).button();

		__showFooter(clickA[szId]);

		try	{
			old_onDrawTheme(szId); 
		}catch (e){}

		$.fn.fullpage.reBuild();
	};

	ixmaps.toggle_values = function(szThemeId){
		var szThemeStyle = ixmaps.getThemeStyleString();
		if ( szThemeStyle && szThemeStyle.match(/VALUES/) ){
			ixmaps.changeThemeStyle(szThemeId,'type:VALUES;','remove');
		}else{
			ixmaps.changeThemeStyle(szThemeId,'type:VALUES;','add');
			//ixmaps.changeThemeStyle(szThemeId,'type:DTEXT;','add');
			//ixmaps.changeThemeStyle(szThemeId,'type:VALUEBACKGROUND;','add');
		}
	};

	ixmaps.changeThemeDynamic = function(szThemeId,szParameter,szFactor){

		var szThemeStyle = ixmaps.getThemeStyleString();

		if ( szThemeStyle.match(/CHOROPLETHE/) ){
			switch (szParameter) {
				case "amplify":
					ixmaps.changeThemeStyle(szThemeId,'dopacitypow:'+String(1/Number(szFactor)),'factor');
					break;
				case "scale":
					ixmaps.changeThemeStyle(szThemeId,'dopacityscale:'+String(szFactor),'factor');
					break;
				case "opacity":
					ixmaps.changeThemeStyle(szThemeId,'opacity:'+String(szFactor),'factor');
					break;
			}
		}else
		if ( szThemeStyle.match(/GRIDSIZE/) || szThemeStyle.match(/AUTOSIZE/) ){
			switch (szParameter) {
				case "amplify":
					ixmaps.changeThemeStyle(szThemeId,'gridwidth:'+String(szFactor),'factor');
					break;
				case "scale":
					ixmaps.changeThemeStyle(szThemeId,'scale:'+String(szFactor),'factor');
					break;
				case "opacity":
					ixmaps.changeThemeStyle(szThemeId,'fillopacity:'+String(szFactor),'factor');
					break;
				case "aggregation":
					ixmaps.changeThemeStyle(szThemeId,'gridwidth:'+String(szFactor),'factor');
					break;
			}
		}else{
			switch (szParameter) {
				case "amplify":
					if ( szThemeStyle.match(/BAR/) || szThemeStyle.match(/PLOT/) || szThemeStyle.match(/STAR/) ){
						ixmaps.changeThemeStyle(szThemeId,'rangescale:'+String(szFactor),'factor');
					}else{
						ixmaps.changeThemeStyle(szThemeId,'normalsizevalue:'+String(1/Number(szFactor)),'factor');
					}
					break;
				case "scale":
					ixmaps.changeThemeStyle(szThemeId,'scale:'+String(szFactor),'factor');
					break;
				case "opacity":
					ixmaps.changeThemeStyle(szThemeId,'fillopacity:'+String(szFactor),'factor');
					break;
				case "aggregation":
					ixmaps.changeThemeStyle(szThemeId,'gridwidth:'+String(szFactor),'factor');
					break;
			}
		}
	};

	ixmaps.htmlgui_onItemClick = function(evt,szId){

		if ( 0 && szId.match(/barrios/)){
			var szThemeId = null;
			var themesA = ixmaps.getThemes();
			if (themesA.length > 1){
				for ( i in themesA ){
					if ( !themesA[i].szFlag.match(/POSITION|FEATURE/) &&
						  themesA[i].coTable.match(/MADRID_TREES/)	
					   ){
						szThemeId = themesA[i].szId;
						break;
					}
				}
			}
			if (szThemeId){
				ixmaps.changeThemeStyle(szThemeId,"filter:WHERE MINTBARRIOS like \""+(szId.split("::")[1])+"\"","set");
			}
			ixmaps.tempValue = (szId.split("::")[1]);
			ixmaps.zoomMapToItem(null,szId);
			ixmaps.refreshTheme("trees");
			return true;
		}

		if(szId.match(/theme/)){
			var data = ixmaps.getData('map',szId);
			var szTitle = data?data.title:"";
			ixmaps.szMapItemId = szId;
			ixmaps.loadStoryTool(ixmaps.loadedProject.map.item||'./item.html',{frame:true});
			return true;
		}
		else{
			if ( szId.match(/mapbackground/) ){
				ixmaps.hideStoryTool();
				return false;
			}
			ixmaps.szMapItemId = szId;
			ixmaps.loadStoryTool(ixmaps.loadedProject.map.item||'./item.html',{frame:true});
			//ixmaps.embeddedSVG.window.map.Api.highlightItem(szId);
			return true;
		}
		return true;
	};


	ixmaps.htmlgui_onSelection = function(szId){
		var szItemUrl = "./selection.html";
		if ( ixmaps.loadedProject.map.selection && (ixmaps.loadedProject.map.selection != "html") )  {
			szItemUrl = ixmaps.loadedProject.map.selection; 
		}

		if(szId.match(/theme/)){
			var data = ixmaps.getData('map',szId);
			var szTitle = data?data.title:"";
			ixmaps.szMapItemId = szId;
			ixmaps.loadStoryTool(szItemUrl);
			return true;
		}
		else{
			if ( szId.match(/mapbackground/) ){
				ixmaps.hideStoryTool();
				return false;
			}
			ixmaps.szMapItemId = szId;
			ixmaps.loadStoryTool(szItemUrl);
			//ixmaps.embeddedSVG.window.map.Api.highlightItem(szId);
			return true;
		}
		return false;
	}


	// intercept theme creation, to mark active themes
	ixmaps.htmlgui_onNewTheme = function(szId){ 
		
		ixmaps.htmlgui_onZoomAndPan();


		//ixmaps.showLoading(". . .",true);
		setTimeout("ixmaps.hideLoading()",1);

		// because ixmaps.htmlgui_onNewTheme can be triggered by a child theme in an other browser tab
		// we must recognize this; fortunately we can't get the theme object and detect it by comparing the theme id's
		// -------------------------------
		var themeObj = ixmaps.getThemeObj(szId);
		if ( szId != themeObj.szId ){
			return;
		}
		// -------------------------------
		
		var li = (lastClicked.parent());
		
		if (!li.hasClass("inline-legend")){
			$(".summary-theme-button").css("border-color","lightgray");
			li.css("border-color","#60ADD3");
			return;									   
		}
		
		if ( themeObj.szFlag.match(/USERLEGEND/) ) {
			ixmaps.clearUserLegend(szId);
			return;
		};
		
		__setThemeButtonStyle(lastClicked,true);
		
		var szLegendId = "themeLegendDiv"+szId.replace(/\./g,'');
		
		if ( !themeObj.szFlag.match(/NOLEGEND/) && !$("#"+szLegendId)[0] ) {
			szHtml = "";
			//szHtml += themeObj.szTitle;
			//if ( themeObj.szSnippet && typeof(themeObj.szSnippet)!="undefined"){
			//	szHtml += "<br><span style=\"font-size:0.8em;\"><em>"+themeObj.szSnippet+"</em></span>";
			//}
			szHtml += "<div>loading theme ...<img src='resources/images/loading_blue.gif' style='display:block;margin:1em auto;height:64px'></div>";
			$(li).append("<div id='"+szLegendId+"' class='inline-legend' style='min-height:2em'>"+szHtml+"</div>");
			
			ixmaps.lastLegendTheme = szId;
		}
		
		clickA[szId] = lastClicked;
		if ( actThemeId ){
			ixmaps.removeTheme(actThemeId);
		}
		
	};

	// intercept theme deletion, to remove active themes mark
	ixmaps.htmlgui_onRemoveTheme = function(szId){

		if ( clickA[szId] ){
			__setThemeButtonStyle(clickA[szId],false);
			__hideFooter(clickA[szId]);
			clickA[szId] = null;
		}
		$("#themeLegendDiv"+szId.replace(/\./g,'')).html("");
		$("#themeLegendDiv"+szId.replace(/\./g,'')).remove();

		try	{
			ixmaps.setTitle("");
		}catch (e){}
	};

	// do this on zoom and pan

	var old_onZoomAndPan = ixmaps.htmlgui_onZoomAndPan;
	ixmaps.htmlgui_onZoomAndPan = function(nZoom){
		
		var zoom = ixmaps.getZoom();
		
		if ( (zoom > 10) ){
			ixmaps.map().setMapTypeId("Stamen - toner-lite");
		}else{
			ixmaps.map().setMapTypeId("white");
		}
	};

});

