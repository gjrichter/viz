
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
		if ( themeObj.szFlag.match(/USERLEGEND/) ) {
		//	$.getScript("./statistics.js",function(){
				setTimeout("ixmaps.makeUserLegend('"+themeObj.szId+"')",10);
		//	});
			return;
		};
		
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
			szHtml += "<div style='max-height:"+legendHeight+"px;overflow:auto;margin-top:0.5em;margin-bottom:0em;padding-right:1em'>";
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
			ixmaps.setTitle(String(themeObj.szTitle+"<div style='font-size:0.5em;line-height:1em;'>"+(themeObj.szSnippet||"")+"</div>"));
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

	ixmaps.htmlgui_onItemClick = function(szId){

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

	ixmaps.makeUserLegend = function(szId){
		var themeObj = ixmaps.getThemeObj(szId);
		if ( !themeObj.szFlag.match(/CHART/) ) {
			return;
		}
		var szFieldsA = ["crown","weight (estimated)","CO2 (estimated)","CO2/year (estimated)","Número Habitantes","totale"];
		var facetsA = ixmaps.data.getFacets(null,'user_legend',szFieldsA,szId);
		ixmaps.showUserLegend(null,'user_legend',facetsA);
	};

	ixmaps.showUserLegend = function(szFilter,szDiv,facetsA){
		var szHtml = "";
		szHtml += "<div id='list-facets' class='list-group' style='width:100%;margin-bottom:5em;'>";
		for (var i = 0; i < facetsA.length; i++) {
			
			if ( facetsA[i].id == "totale" ){
				szHtml += "<div style='width:500px;background:rgba(255,255,255,0.5);padding:0.5em;margin-bottom:1em;'>";
				szHtml += "<h3>Population</h3>";
				if (facetsA[i].type == "list" ){
					facetsA[i].sum = 0;
					facetsA[i].min = null;
					facetsA[i].max = null;
					for ( v in facetsA[i].values ){
						facetsA[i].sum += Number(facetsA[i].values[v]);
						facetsA[i].min = Math.min(facetsA[i].min||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
						facetsA[i].max = Math.max(facetsA[i].max||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
					}
				}
				szHtml += "<h4>"+ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" &#x33A1;</h4>";
				if ( facetsA[i].min && (facetsA[i].min != facetsA[i].max) ){
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "SPACE")+" &#x33A1;</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "SPACE")+" &#x33A1;</div>";
				}
				szHtml += "</div>";
				
				$('.data-dynamic[data-path="data::population::number"]').html(ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" people");
			}
			if ( facetsA[i].id == "Número Habitantes" ){
				szHtml += "<div style='width:500px;background:rgba(255,255,255,0.5);padding:0.5em;margin-bottom:1em;'>";
				szHtml += "<h3>Population</h3>";
				if (facetsA[i].type == "list" ){
					facetsA[i].sum = 0;
					facetsA[i].min = null;
					facetsA[i].max = null;
					for ( v in facetsA[i].values ){
						facetsA[i].sum += Number(facetsA[i].values[v]);
						facetsA[i].min = Math.min(facetsA[i].min||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
						facetsA[i].max = Math.max(facetsA[i].max||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
					}
				}
				szHtml += "<h4>"+ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" &#x33A1;</h4>";
				if ( facetsA[i].min && (facetsA[i].min != facetsA[i].max) ){
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "SPACE")+" &#x33A1;</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "SPACE")+" &#x33A1;</div>";
				}
				szHtml += "</div>";
				
				$('.data-dynamic[data-path="data::population::number"]').html(ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" people");
			}

			if ( facetsA[i].id == "crown" ){
				szHtml += "<div style='width:500px;background:rgba(255,255,255,0.5);padding:0.5em;margin-bottom:1em;'>";
				szHtml += "<h3>Crown area</h3>";
				if (facetsA[i].type == "list" ){
					facetsA[i].sum = 0;
					facetsA[i].min = null;
					facetsA[i].max = null;
					for ( v in facetsA[i].values ){
						facetsA[i].sum += Number(facetsA[i].values[v]);
						facetsA[i].min = Math.min(facetsA[i].min||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
						facetsA[i].max = Math.max(facetsA[i].max||Number(facetsA[i].values[v]),Number(facetsA[i].values[v]));
					}
				}
				szHtml += "<h4>"+ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" &#x33A1;</h4>";
				if ( facetsA[i].min && (facetsA[i].min != facetsA[i].max) ){
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "SPACE")+" &#x33A1;</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "SPACE")+" &#x33A1;</div>";
				}
				szHtml += "</div>";
				
				$('.data-dynamic[data-path="data::trees::area"]').html(ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" &#x33A1;");
				
				$('.data-dynamic[data-path="data::trees::number"]').html(ixmaps.__formatValue(facetsA[i].data.length, 2, "SPACE")+" ");

			}else
			if ( facetsA[i].id == "weight (estimated)" ){
				szHtml += "<div style='width:500px;background:rgba(255,255,255,0.5);padding:0.5em;margin-bottom:1em;'>";
				szHtml += "<h3>Weight</h3>";
				if (facetsA[i].type == "list" ){
					facetsA[i].sum = 0;
					for ( v in facetsA[i].values ){
						facetsA[i].sum += Number(facetsA[i].values[v]);
					}
				}
				szHtml += "<h4>"+ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" kg</h4>";
				szHtml += "<div>co2: "+ixmaps.__formatValue(facetsA[i].sum*0.5*3.6663, 2, "SPACE")+" kg</div>";
				if ( facetsA[i].min && (facetsA[i].min != facetsA[i].max) ){
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "SPACE")+" kg</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "SPACE")+" kg</div>";
				}
				szHtml += "</div>";
				
				$('.data-dynamic[data-path="data::trees::weight"]').html(ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" kg");
				
				$('.data-dynamic[data-path="data::trees::co2"]').html(ixmaps.__formatValue(facetsA[i].sum*0.5*3.6663, 2, "SPACE")+" kg");
										
			}else
			if ( facetsA[i].id == "CO2/year (estimated)" ){
				szHtml += "<div style='width:500px;background:rgba(255,255,255,0.5);padding:0.5em;margin-bottom:1em;'>";
				szHtml += "<h3>Weight</h3>";
				if (facetsA[i].type == "list" ){
					facetsA[i].sum = 0;
					for ( v in facetsA[i].values ){
						facetsA[i].sum += Number(facetsA[i].values[v]);
					}
				}
				szHtml += "<h4>"+ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" kg</h4>";
				szHtml += "<div>co2: "+ixmaps.__formatValue(facetsA[i].sum*0.5*3.6663, 2, "SPACE")+" kg</div>";
				if ( facetsA[i].min && (facetsA[i].min != facetsA[i].max) ){
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "SPACE")+" kg</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "SPACE")+" kg</div>";
				}
				szHtml += "</div>";
				
	
				$('.data-dynamic[data-path="data::trees::co2/year"]').html(ixmaps.__formatValue(facetsA[i].sum, 2, "SPACE")+" kg");
										
			}else{
				/**
				szHtml += "<br>";
				szHtml += "<div>"+facetsA[i].id+"</div>";
				szHtml += "<div>"+facetsA[i].type+"</div>";
				szHtml += "<div>min: "+facetsA[i].min+"</div>";
				szHtml += "<div>max: "+facetsA[i].max+"</div>";
				szHtml += "<div>sum: "+facetsA[i].sum+"</div>";
				if (facetsA[i].values){
					szHtml += "<div>values: "+facetsA[i].values.length+"</div>";
				}
				if (facetsA[i].valuesCount){
					for ( ii in facetsA[i].valuesCount ){
						szHtml += "<div>type: "+ii+" count: "+facetsA[i].valuesCount[ii]+"</div>";
					}
				}
				if (facetsA[i].data){
					szHtml += "<div>data: "+facetsA[i].data.length+"</div>";
				}
				**/
			}
		}
		szHtml += "</div>";

		$("#"+(szDiv||"facets")).html(szHtml);

	};
	ixmaps.clearUserLegend = function(szId){
		$("#"+("user_legend"||"facets")).html("wait fo theme ...");
		$('.data-dynamic[data-path="data::trees::number"]').html("--");
		$('.data-dynamic[data-path="data::trees::area"]').html("--");
		$('.data-dynamic[data-path="data::trees::co2"]').html("--");
		$('.data-dynamic[data-path="data::trees::weight"]').html("--");
	};

	// intercept theme creation, to mark active themes
	ixmaps.htmlgui_onNewTheme = function(szId){

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
		
		__setThemeButtonStyle(lastClicked,true);
		var li = (lastClicked.parent());
		
		if ( themeObj.szFlag.match(/USERLEGEND/) ) {
			ixmaps.clearUserLegend(szId);
			return;
		};
		
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
		old_onZoomAndPan(nZoom);
		ixmaps.clearUserLegend();
		for ( i in ixmaps.themesDrawnA ){
			try	{
				ixmaps.htmlgui_onNewTheme(i);
			}catch (e){}
		}
		ixmaps.themesDrawnA = [];
		
		var zoom = ixmaps.getZoom();
		var themesA = ixmaps.getThemes();
		themesA.forEach(function(theme){
			if ( theme.szFlag.match(/CHART/) && String(theme.szId).match(/home/) ){
				if ( (zoom > 14) ){
					if ( ixmaps.getMapTypeId() == "white" ){ 
						ixmaps.map().setMapTypeId("OpenStreetMap - FR");
					}
				}else{
					ixmaps.map().setMapTypeId("white");
				}
			}
			
		});
		
	};

