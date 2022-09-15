
	/**
		init sidebar	
	**/
	
	// intercept theme creation, to mark active themes
	ixmaps.htmlgui_onNewTheme = function(szId){
		__setThemeButtonStyle(lastClicked,true);
		var li = (lastClicked[0].parentNode);
		$(li).append("<div id='themeLegendDiv"+szId.replace(/\./g,'')+"' class='inline-legend' ></div>");
		clickA[szId] = lastClicked;
		if ( actThemeId ){
			ixmaps.removeTheme(actThemeId);
		}
	};
	
	
	var old_onDrawTheme = ixmaps.htmlgui_onDrawTheme;
	// intercept theme creation, to mark active themes
	ixmaps.htmlgui_onDrawTheme = function(szId){ 

		var themeObj = ixmaps.getThemeObj(szId);
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

		if ( ixmaps.legend.makeColorLegendHTML ){
			szHtml += "<div class='inline-legend-div'>";
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

			var id = szId.replace(/\./g,'');

			if (1){
				szHtml += 		"<div style='margin-top:0.75em;margin-bottom:0.25em;' >";
					
				szHtml += 		"<a id='highbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"amplify\",\"0.9\");' title='appiattire' >";
				szHtml += 			"<span class='icon icon-arrow-down' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='lowbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"amplify\",\"1.1\");' title='amplificare'>";
				szHtml += 			"<span class='icon icon-arrow-up' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='minusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"scale\",\"0.66\");' title='diminuire'>";
				szHtml += 			"<span class='icon icon-minus' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='plusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"scale\",\"1.5\");' title='ingrandire'>";
				szHtml += 			"<span class='icon icon-plus' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='valuebutton"+id+"' href='javascript:ixmaps.toggle_values(\""+szId+"\");' title='valore testuale -/+'>";
				szHtml += 			"<span class='icon icon-spell-check' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='opminusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"opacity\",\"0.66\");' title='più trasparenza'>";
				szHtml += 			"<span class='icon icon-checkbox-unchecked' style='font-size:14px; color:#bbbbbb;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='opplusbutton"+id+"' href='javascript:ixmaps.changeThemeDynamic(\""+szId+"\",\"opacity\",\"1.5\");' title='meno trasparenza'>";
				szHtml += 			"<span class='icon icon-checkbox-partial' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"<a id='lockbutton"+id+"' class='theme-tool-button'  href='javascript:ixmaps.changeThemeStyle(\""+szId+"\",\"type:LOCKED\",\"toggle\");' title='chart menu'>";
				if ( themeObj.szFlag.match(/LOCKED/) ) {
					szHtml += 			"<span class='icon icon-lock theme-tool-button' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
					szHtml += 			"</a>&nbsp;";
				}else{
					szHtml += 			"<span class='icon icon-unlocked theme-tool-button' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
					szHtml += 			"</a>&nbsp;";
				}

				szHtml += 		"<a id='deletebutton"+id+"' href='javascript:ixmaps.removeTheme(\""+szId+"\");' title='rimuovere'>";
				szHtml += 			"<span class='icon icon-remove' style='font-size:14px; color:#444444;background:#ffffff;padding:0.5em;'></span>";
				szHtml += 			"</a>&nbsp;";

				szHtml += 		"</ div>";
				}
		try	{
			ixmaps.setTitle(String(themeObj.szTitle+"<div style='font-size:0.5em;line-height:1em;'>"+(themeObj.szSnippet||"")+"</div>"));
		}catch (e){}

		$("#themeLegendDiv"+id).html(szHtml);

		$( "#lowbutton"+id ).button();
		$( "#highbutton"+id  ).button();
		$( "#minusbutton"+id  ).button();
		$( "#plusbutton"+id  ).button();
		$( "#valuebutton"+id  ).button();
		$( "#opminusbutton"+id  ).button();
		$( "#opplusbutton"+id  ).button();
		$( "#deletebutton"+id  ).button();

		try	{
			old_onDrawTheme(szId); 
		}catch (e){}

	};

	// intercept theme deletion, to remove active themes mark
	ixmaps.htmlgui_onRemoveTheme = function(szId){
		if ( clickA[szId] ){
			__setThemeButtonStyle(clickA[szId],false);
			clickA[szId] = null;
			lastClicked  = null;
		}
		$("#themeLegendDiv"+szId.replace(/\./g,'')).html("");
		$("#themeLegendDiv"+szId.replace(/\./g,'')).remove();

		try	{
			ixmaps.setTitle("");
		}catch (e){}
	};

	ixmaps.toggle_values = function(szThemeId){
		var szThemeStyle = ixmaps.getThemeStyleString();
		if ( szThemeStyle && szThemeStyle.match(/VALUES/) ){
			ixmaps.changeThemeStyle(szThemeId,'type:VALUES;','remove');
		}else{
			ixmaps.changeThemeStyle(szThemeId,'type:VALUES;','add');
			ixmaps.changeThemeStyle(szThemeId,'type:DTEXT;','add');
			ixmaps.changeThemeStyle(szThemeId,'type:VALUEBACKGROUND;','add');
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

	// --------------------------------------------------------------
	// call fist theme
	// --------------------------------------------------------------

	ixmaps.execBookmark("map.Api.setMapFeatures('maxThemeCharts:50000;popupalignment:BOTTOM;')");

	if ( !ixmaps.initialized ){
		$('#firstTheme').click();
		eval($('#firstTheme').attr("href"));
		ixmaps.initialized = true;
	}
