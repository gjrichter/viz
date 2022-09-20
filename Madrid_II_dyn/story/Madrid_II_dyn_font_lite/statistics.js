/** 
 * @fileoverview This file provides functions for facet filtering
 *
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 * @copyright CC BY SA
 * @license MIT
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.data = window.ixmaps.data || {};

(function () {

	// ===========================================
	//
	// h e l p e r
	//
	// ===========================================

	/**
	 * Create a distribution of data values for histograms  
	 * @param szMapDiv the id of the div, where to create the SVG map
	 * @param options javascript object with the creation options
	 * @type object
	 * @return the new ixmaps object
	 */
	var __getScatterArray = function (data, nMin, nMax, nTicks, szFlag) {

		var nValuePos = 0;
		var nCountMax = 0;
		var dValue = 0;
		var a;
        
		if (szFlag.match(/LOG/)) {
			dValue = nMin ? 0 : 0.1;
			nMin = Math.log(nMin + dValue);
			nMax = Math.log(nMax + dValue);
		}

		var nPop = (nMax - nMin ) / (nTicks-1);

		var nPopA = [];
		var nTickA = [];
		var nTickVal = nMin;
		for (var i = 0; i < nTicks + 1; i++) {
			nPopA[i] = 0;
			nTickA[i] = Math.floor(szFlag.match(/LOG/) ? (Math.exp(nTickVal)) : nTickVal);
			nTickVal += nPop

		}
		data.forEach(function (value) {
			var xValue = value;
			if (typeof (xValue) == 'number') {
				if (szFlag.match(/LOG/)) {
					xValue = Math.log(xValue + dValue);
				}
				nPos = Math.max(0, Math.min(nTicks - 1, Math.floor((xValue - nMin) / nPop)));
				nPopA[nPos]++;
				nCountMax = Math.max(nCountMax, nPopA[nPos]);
			}
		});

		return { min: nTickA, count: nPopA };
	};

	// get unique values array via filter
	var __onlyUnique = function (value, index, self) {
		return self.indexOf(value) === index;
	};

	// get unique values array via named array
	var __getUniqueValues = function(a) {
		var u = [];
		for ( var i in a ){
			u[String(a[i])] = 1;
		}
		var retA = [];
		for ( var v in u ){
			retA.push(v);
		}
		return retA;
	};

	// get numbers from formatted values like 235 678.98 or 235.678,98
	var __scanValue = function (nValue) {
		if (String(nValue).match(/:/)){
			return "date";
		} else
		// strips blanks inside numbers (e.g. 1 234 456 --> 1234456)
		if (String(nValue).match(/,/)) {
			return parseFloat(String(nValue).replace(/\./gi, "").replace(/,/gi, "."));
		} else {
			return parseFloat(String(nValue).replace(/ /gi, ""));
		}
	};

	// ===========================================
	//
	// facet filter handling 
	//
	// ===========================================

	var __facetFilterA = [];
	var __rangesA = [];

	// -----------------------------------------------
	// set the selected facet filter
	// if this filter is already active, clear filter
	// -----------------------------------------------
	__setFacetFilter = function (szFilter) {

		// if new filter given, add to filter array (delete existent filter of the same data column)
		if (szFilter.length) {

			// get filter without WHERE 
			szFilter = szFilter.split(/WHERE /)[1];

			// add, or remove filter, if exists  
			__facetFilterA.filter(function (value, index, self) {
				return !(szFilter.split(/"/)[1] == value.split(/"/)[1]);
			});

			__facetFilterA.push(szFilter);
		}

		// make final filter from actual parts stored in __facetFilterA
		szFilter = __facetFilterA.length ? ("WHERE " + __facetFilterA.join(" AND ")) : null;

		// show filter in input field
		$("#query").val(szFilter);

		// filter items on map
		var objTheme = ixmaps.getThemeObj();
		var objThemesA = ixmaps.getThemes();
		for ( a in objThemesA ){
			objTheme = objThemesA[a];
			if ( !objTheme.szFlag.match(/FEATURE/) ){
                if ( szFilter ){
                    ixmaps.changeThemeStyle(null,objTheme.szId, "filter:" + (szFilter || " "), "set");
                }else{
                    ixmaps.changeThemeStyle(null,objTheme.szId, "filter", "remove");
                }
            }
		}
		/**
		if ( szFilter ){
			if ( !objTheme.szFlag.match(/CATEGORICAL/) ){
				ixmaps.changeThemeStyle(null,objTheme.szId,"type:RANGES","add");
			}
			ixmaps.changeThemeStyle(objTheme.szId, "filter:" + (szFilter || " "), "set");
		}else{
			ixmaps.changeThemeStyle(objTheme.szId, "filter", "remove");
		}
		**/
		// make new facets
		//__redrawFacets(szFilter);

	};

	var __redrawFacets = function (szFilter) { 

		$("#facets").html('<h2 style="padding:0.2em 0.5em;background:#dddddd;border-radius:5px;color:white">refresh facets ...<img src="resources/images/bg-spinner.gif" style="display:block;margin:1em auto;height:32px"></h2>');
		ixmaps.data.szFilter = szFilter;
		//setTimeout("ixmaps.data.makeFacets('"+szFilter+"','facetDiv')",1000);
	};
	
	/**
	var old_onDrawTheme = ixmaps.htmlgui_onDrawTheme;
	// intercept theme creation done, and make the legend
	//
	ixmaps.htmlgui_onDrawTheme = function(szId){
		ixmaps.data.makeFacets(ixmaps.data.szFilter,'facetDiv');
		old_onDrawTheme(szId);
	}
	ixmaps.htmlgui_onHideStoryTool = function(){
		ixmaps.htmlgui_onDrawTheme = old_onDrawTheme;
	}
	**/
	
	// -------------------------------------------------------------------------
	// set a range filter for a data field
	// if a range is already active on this data field, remove this range before
	// --------------------------------------------------------------------------
	__setRangeFilter = function (szField, szRange, min, max) {
		rangeA = szRange.split(",");
		szFilter = "WHERE \"" + szField + "\" BETWEEN " + rangeA[0] + " AND " + rangeA[1];
		// delete filter with same field
		__facetFilterA = __facetFilterA.filter(function (value, index, self) {
			return !(value.split("\"")[1] == szField);
		});
		__setFacetFilter(szFilter);
	};

	// -------------------------------------------------------------------------
	// set a input field filter
	// --------------------------------------------------------------------------
	__setFilter = function (szField, szFilter) {
		szQuery = "WHERE \"" + szField + "\" like \"" + szFilter + "\"";
		// delete filter with same field
		__facetFilterA = __facetFilterA.filter(function (value, index, self) {
			return !(value.split("\"")[1] == szField);
		});
		__setFacetFilter(szFilter.length?szQuery:"");
	};

	// -----------------------------------------------
	// remove all filter of one data field
	// -----------------------------------------------
	__removeFacets = function (szField) {
		__facetFilterA = __facetFilterA.filter(function (value, index, self) {
			return !(value.split("\"")[1] == szField);
		});
		__setFacetFilter("");
	};

	var __makeHistogram = function (id, szRange) {

		var rangeA = szRange.split(",");

		var facet = null;

		for (i in facetsA) {
			if (facetsA[i].id == id) {
				facet = facetsA[i];
			}
		}

		if (facet && facet.data) {

			var objThemeDefinition = ixmaps.getThemeDefinitionObj();
			var objTheme = ixmaps.getThemeObj();

			var fOnMap = false;
			if ((objThemeDefinition.field == facet.id)) {
				fOnMap = true;
			}

			var min = __rangesA[facet.id].min;
			var max = __rangesA[facet.id].max;
			var sliderId = facet.id;
			var nTicks = Math.min(40, (max - min + 1));
			nTicks = (nTicks >= 5) ? nTicks : 40;
            var nStep = pop = (max - min) / nTicks;
            if ( nStep > 1 && nStep < 2 ) {
                nTicks = max - min +1;                     
            }

			var szScale = ((max - min) < 40) ? "" : "LOG";
			var fDiscret = (nTicks == max-min);

			var barA = __getScatterArray(__rangesA[facet.id].data, min, max, nTicks, szScale);
			var maxHeight = 0;
			barA.count.forEach(function (height) {
				maxHeight = Math.max(maxHeight, height);
			});
			var scale = 75 / maxHeight;
			var width = 210 / nTicks;
			szHtml = "";

			for (b = 0; b < barA.count.length - 1; b++) {
				var height = barA.count[b];
				var bMin = barA.min[b];
				var bMax = fDiscret?barA.min[b]:barA.min[b + 1];
				var color = ((bMax >= rangeA[0]) && (bMin <= rangeA[1])) ? "#888" : "#ddd";

				if (fOnMap) {
					//color = objTheme.partsA[0].color;
					objTheme.partsA.forEach(function (part) {
						if (bMin >= part.min) {
							color = part.color;
						}
					});
				}
				var szFilter = "ixmaps.filterThemeItems(null, null, '', { field: '"+facet.id+"', min: "+bMin+", max: "+bMax+" }";
				var szHighlight = "$(this).css('background','#880000');"+szFilter;
				var szClearHighlight = "$(this).css('background','');ixmaps.filterThemeItems(null,null,'','remove');"
                bMin = ixmaps.__formatValue(bMin, 2, "BLANK");
			    bMax = ixmaps.__formatValue(bMax, 2, "BLANK");
 				szHtml += "<div style='display:inline-block;width:" + width + "px;background-color:" + color + ";height:" + (1 + (height * scale)) + "px;' data-toggle='tooltip' title='" + (bMin + ' - ' + bMax) + " onmouseover='" + szHighlight + "' onmouseout='" + szClearHighlight + "'></div>";
			}
			szHtml += "</div>";

			$("#" + sliderId + "histogram").html(szHtml);
		}
	};

	__oldFilter = "";

	// ---------------------------------------------------
	// highlight map theme items by query
	// select data by query and create list of theme items 
	// highlight this item on the map
	// ---------------------------------------------------

	__HighlightFacetItems = function (szField, szValue) { 
		var objTheme = ixmaps.getThemeObj();
		__oldFilter = objTheme.szFilter;
		if ( objTheme && ( objTheme.szFlag.match(/AGGREGATE/) || objTheme.szFlag.match(/MULTI/)) ){
			if ( __oldFilter.match(/WHERE/) ){
				ixmaps.filterThemeItems(null, null, __oldFilter + ' AND "'+szField+'" = "'+szValue+'"', 'set');
			}else{
				ixmaps.filterThemeItems(null, null, 'WHERE "'+szField+'" = "'+szValue+'"', 'set');
			}
		}else{
			ixmaps.filterThemeItems(null, null, "", { field: szField, txt: szValue });
		}
		return;

		// theme
		// ------------------------------------
		var objThemeDefinition = ixmaps.getThemeDefinitionObj();
		var objTheme = ixmaps.getThemeObj();

		// theme data
		// ------------------------------------
		var szData = objThemeDefinition.style.dbtable || objThemeDefinition.data.name;
		var dataObj = eval("ixmaps.embeddedSVG.window." + (szData || "themeDataObj"));

		// create data object from theme data
		// ------------------------------------
		var mydata = new Data.Table(dataObj);

		// create highlight item list
		// -----------------------------------
		var layer = null;
		for (item in objTheme.itemA) {
			layer = item.split("::")[0];
		}

		var valuesA = [];
		var x = mydata.select(szQuery);
		var lookupA = objThemeDefinition.style.lookupfield.split("|");
		lookupA.forEach(function (id) {
			valuesA.push(x.column(id).values());
		});

		var itemA = [];
		for (k = 0; k < valuesA[0].length; k++) {
			var itemJ = [];
			for (kk = 0; kk < valuesA.length; kk++) {
				itemJ.push(valuesA[kk][k]);
			}
			itemA.push(layer + "::" + itemJ.join(','));
		}

		ixmaps.highlightThemeItems(null, itemA.join("|"), '|');
	};

	// ===========================================
	//
	// create the html facet list
	//
	// ===========================================

	ixmaps.data.showFacets = function (szFilter,szDiv,facetsA) {

		var fTest = true;
		var sliderA = [];

		var objThemeDefinition = ixmaps.data.objThemeDefinition;
		var objTheme = ixmaps.data.objTheme;

		var szHtml = "";
		szHtml += "<div id='list-facets' class='list-group' style='width:100%;margin-bottom:5em;'>";

		$("#"+(szDiv||"facets")).html(szHtml);

		// create an array of the filter to pass them to the executing function
		// to avoid problems with special characters " and '
		__queryA = [];

		// check if we have already a filter defined
		// and facets are elements of the filter
		var nSelectA = [];
		for (var i = 0; i < facetsA.length; i++) {
			__facetFilterA.forEach(function (szFilter) {
				if (szFilter.split("\"")[1] == facetsA[i].id) {
					nSelectA.push(i);
				}
			});
		}
		/**
		// if yes, get the selected facet to the top of the list
		nSelectA.forEach(function (nSelect) {
			var toTop = facetsA.slice(nSelect, nSelect + 1);
			facetsA.splice(nSelect, 1);
			facetsA.splice(0, 0, toTop[0]);
		});
		**/
		
		for (var i = 0; i < facetsA.length; i++) {
			
			if ( facetsA[i].id == "crown" ){
				szHtml += "<br>";
				if (facetsA[i].type == "list" ){
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					for ( v in facetsA[i].values ){
						szHtml += "<div>value: "+ixmaps.__formatValue(facetsA[i].values[v], 2, "BLANK")+" &#x33A1;</div>";
					}
				}else{
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "BLANK")+" &#x33A1;</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "BLANK")+" &#x33A1;</div>";
					szHtml += "<div>sum: "+ixmaps.__formatValue(facetsA[i].sum, 2, "BLANK")+" &#x33A1;</div>";
				}
			}else
			if ( facetsA[i].id == "weight (estimated)" ){
				szHtml += "<br>";
				if (facetsA[i].type == "list" ){
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					for ( v in facetsA[i].values ){
						szHtml += "<div>value: "+ixmaps.__formatValue(facetsA[i].values[v], 2, "BLANK")+" kg;</div>";
					}
				}else{
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "BLANK")+" kg</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "BLANK")+" kg</div>";
					szHtml += "<div>sum: "+ixmaps.__formatValue(facetsA[i].sum, 2, "BLANK")+" kg</div>";
					szHtml += "<div>co2: "+ixmaps.__formatValue(facetsA[i].sum*0.5*3.6663, 2, "BLANK")+" kg</div>";
				}
			}else
			if ( facetsA[i].id == "CO2/year (estimated)" ){
				szHtml += "<br>";
				if (facetsA[i].type == "list" ){
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					for ( v in facetsA[i].values ){
						szHtml += "<div>value: "+ixmaps.__formatValue(facetsA[i].values[v], 2, "BLANK")+" kg;</div>";
					}
				}else{
					szHtml += "<div class='facet-title'>"+facetsA[i].id+"</div>";
					szHtml += "<div>min: "+ixmaps.__formatValue(facetsA[i].min, 2, "BLANK")+" kg</div>";
					szHtml += "<div>max: "+ixmaps.__formatValue(facetsA[i].max, 2, "BLANK")+" kg</div>";
					szHtml += "<div>sum: "+ixmaps.__formatValue(facetsA[i].sum, 2, "BLANK")+" kg</div>";
				}
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

		sliderA.forEach(function (x) {

			$("#" + x.id + "histogram").css("margin-left", ($("#" + x.id).prev().offset().left + $("#" + x.id).prev().width()) + "px");

			var nStep = ((x.max - x.min) == x.ticks)?1:Math.min(1, Math.pow(10, Math.floor(Math.log((x.max - x.min) / 100))));
			var mySlider = $("#" + x.id).slider({
				step: nStep,
				tooltip_split: true,
				tooltip_position: "bottom",
				scale: (x.scale == "LOG") ? 'logarithmic' : 'linear'
			}).on("slideStop", function () {
				__setRangeFilter(x.field, $(this).attr("value"), $(this).attr("data-slider-min"), $(this).attr("data-slider-max"));
			}).on("slide", function () {
				__makeHistogram($(this).attr("id"), $(this).attr("value"));
			});
		});

		$('[data-toggle="tooltip"]').tooltip();
	};

	// ===========================================
	//
	// create filter facets from theme data
	//
	// ===========================================

	ixmaps.data.getFacets = function (szFilter,szDiv,szFieldsA,szId) {

		facetsA = [];

		var fTest = true;
		var sliderA = [];

		console.log("=== make statistic facets ===");
		
		var szThemeId = ixmaps.filterThemeId = szId;
	
 		if ( ixmaps.legend.legendA[ixmaps.legend.activeLegendId] ){
			szThemeId = ixmaps.filterThemeId = ixmaps.legend.legendA[ixmaps.legend.activeLegendId].szId || null;
		}
        if ( !szThemeId ){
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
        }

		// theme
		// ------------------------------------
		var objThemeDefinition = ixmaps.data.objThemeDefinition = ixmaps.getThemeDefinitionObj(szThemeId);
		var objTheme = ixmaps.data.objTheme = ixmaps.getThemeObj(szThemeId);

		// theme data
		// ------------------------------------
		var szData = objThemeDefinition.style.dbtable || objThemeDefinition.data.name;
		var dataObj = eval("ixmaps.embeddedSVG.window." + (szData || "themeDataObj"));

		// create data object from theme data
		// ------------------------------------
		var mydata = new Data.Table(dataObj);

		// GR 23.02.2018 take only rows which are on the map
		// -------------------------------------------------
		records = [];
		try	{
			for ( i in objTheme.indexA ){
				if ( objTheme.itemA[objTheme.indexA[i]].dbIndex ){
					records.push(dataObj.records[objTheme.itemA[objTheme.indexA[i]].dbIndex]);
				}
				if ( objTheme.itemA[objTheme.indexA[i]].dbIndexA ){
					for ( a in objTheme.itemA[objTheme.indexA[i]].dbIndexA ) {
						records.push(dataObj.records[objTheme.itemA[objTheme.indexA[i]].dbIndexA[a]]);
					}
				}
			}
		}
		// maybe the data is not ready, then we repeat
		catch (e){
			setTimeout("ixmaps.data.makeFacets('"+szFilter+"','"+szDiv+"')",1000);
			return;
		}

		mydata.records = records;

		// if we have already a filter on the map,
		// filter data before creating facets
		// ------------------------------------
		if (szFilter && szFilter.match(/WHERE/)) {
			mydata = mydata.select(szFilter);

			// get filter parts
			// ----------------
			var szPartsA = szFilter.split('WHERE ')[1].split('AND');
			// test if BETWEEN x AND y and join two parts around AND
			for ( i=0; i<szPartsA.length; i++ ){
				if ( szPartsA[i].match(/BETWEEN/) ){
					szPartsA[i] = szPartsA[i] + "AND" + szPartsA[i+1];
					szPartsA.splice(i+1,1);
				}
			}
			// set filter parts
			// ----------------
			__facetFilterA = [];
			szPartsA.forEach(function(x){
				__facetFilterA.push(x);
			});
		}

		// make facets from data fields
		// ----------------------------

		var a, u;
		var fields = mydata.columnNames();

		for (var i = 0; i < fields.length; i++) {
			
			if ( szFieldsA && szFieldsA.length ){
				var fDoField = false;
				for (x in szFieldsA ) {
					if (fields[i] == szFieldsA[x]){
						fDoField = true;
					}
				}
				if ( !fDoField ){
					continue;
				}
			}
			
			/**
			if (fields[i] != "crown" 		&& 
				fields[i] != "weight_ln"	&&
				fields[i] != "SENESCENCIA"	&&
				fields[i] != "NOMBRE_BARRIO"&&
				fields[i] != "allergenico"	&&
				fields[i] != "classe"
			   ){
				continue;
			}
			**/
			
			a = mydata.column(fields[i]).values();

			// test for only numeric values
			// ----------------------------
			fNumeric = true;
			a.every(function (x) {
				if (x.length && (x != "NaN") && isNaN(__scanValue(x))) {
					fNumeric = false;
				}
				return fNumeric;
			});

			// test if field already part of the active query 
			// ------------------------------------------
			var fActiveFacet = false;
			__facetFilterA.forEach(function (szFilter, index) {
				if ((szFilter.split("\"")[1] == fields[i]) && ((szFilter.split("\"")[2] == " is ")||(szFilter.split("\"")[2] == " = "))) {
					fActiveFacet = true;
				}
			});

			// test for unique values 
			// -----------------------

			// first test maximal 250 values at the beginning 

			a.length = Math.min(a.length, 250);
			u = a.filter(__onlyUnique);

			// if we have many unique values and they are numbers,
			// make a numerique facet, if they are texts, skip field
			// -----------------------------------------------------
			if ((a.length >= 250) && (u.length >= (a.length / 5))) {

				if (fNumeric) {

					a = mydata.column(fields[i]).values();
					var sum = 0;
					a = a.map(function (x) {
						x = __scanValue(x);
						sum += x||0;
						return (x);
					});
					a.sort(function (a, b) {
						return (a-b);
					});
					var facet = {};
					facet.id = fields[i];
					facet.min = a[0];
					facet.max = a[a.length - 1];
					facet.sum = sum;
					facet.values = a;
					facet.data = a;
					facetsA.push(facet);

				} else {
					// make input field to define filter 
					// ------------------------------------------
					var facet = {};
					facet.id = fields[i];
					facet.type = "search";
					facet.example = a[0];

					if (fActiveFacet) {

						// add value list in any case 
						// ---------------------------
						facet.values = a;
						// count values
						var valuesCount = {};
						var nCount = {};
						a.forEach(function (x) {
							valuesCount[x] = (valuesCount[x] || 0) + 1;
                            nCount++;
						});
						facet.nCount = nCount;
						facet.valuesCount = valuesCount;
						facet.uniqueValues = a.length;
					}

					facetsA.push(facet);
				}
				continue;
			};

			// ok, data with many different values done
			// lets get all! unique values
			// -----------------------------------------

			a = mydata.column(fields[i]).values();

			// get unique values array
			u = __getUniqueValues(a);

			// if less than 50 unique values, make text or number facet
			// --------------------------------------------------------

			if (u.length < 50 && !__rangesA[fields[i]] && !fNumeric) {

				// count values
				var valuesCount = {};
				var nCount = 0;
				a.forEach(function (x) {
					valuesCount[x] = (valuesCount[x] || 0) + 1;
                    nCount++;
				});

				if (fNumeric) {
					u = u.map(function (x) {
						return Number(x);
					});
					u.sort(function (a, b) {
						return ((a > b) ? 1 : -1);
					});
				} else {
					u.sort();
					u.sort(function (a, b) {
						return ((valuesCount[a] < valuesCount[b]) ? 1 : -1);
					});
				}

				var facet = {};
				facet.id = fields[i];
				facet.values = u;
				facet.nCount = nCount;
				facet.valuesCount = valuesCount;
				facet.uniqueValues = u.length;

				if ((u.length >= 1) || fActiveFacet) {
					facet.type = "search";
				}

				facetsA.push(facet);

			}
			else {

				// more than 50 unique values

				if ( fNumeric ) {
					if ( u.length > 3 ) {

						// if more than 3 values, make min/max range filter
						// ------------------------------------------
						a = mydata.column(fields[i]).values();
						var min = Number.MAX_VALUE;
						var max = (-Number.MAX_VALUE);
						var fNaN = false;
						var sum = 0;
						a = a.map(function (x) {
							x = __scanValue(x);
							min = Math.min(min, x||min);
							max = Math.max(max, x||max);
							sum += x||0;
							return (x);
						});
						var facet = {};
						facet.id = fields[i];
						facet.min = min; //a[0];
						facet.max = max; //a[a.length-1];
						facet.sum = sum;
						facet.data = a;
						facet.uniqueValues = u.length;
						facet.type = "numeric";
						facetsA.push(facet);
						
					}else{
						
						// make input field to define filter 
						// ------------------------------------------
						var facet = {};
						facet.id = fields[i];
						facet.type = "list";
						if (u.length < 200) {
							// add value list
							// ---------------
							facet.values = u;
							var valuesCount = {};
							var nCount = 0;
							a.forEach(function (x) {
								valuesCount[x] = (valuesCount[x] || 0) + 1;
								nCount++;
							});
							u.sort(function (a, b) {
								return ((valuesCount[a] < valuesCount[b]) ? 1 : -1);
							});
							facet.nCount = nCount;
							facet.valuesCount = valuesCount;
							facet.uniqueValues = u.length;
						}
						facetsA.push(facet);
						
					}

				} else {

					// if not numeric, make input field to define filter 
					// ------------------------------------------
					var facet = {};
					facet.id = fields[i];
					facet.type = "search";
					if (u.length < 200) {
						// add value list
						// ---------------
						facet.values = u;
						var valuesCount = {};
						var nCount = 0;
						a.forEach(function (x) {
							valuesCount[x] = (valuesCount[x] || 0) + 1;
                            nCount++;
						});
						u.sort(function (a, b) {
							return ((valuesCount[a] < valuesCount[b]) ? 1 : -1);
						});
						facet.nCount = nCount;
						facet.valuesCount = valuesCount;
						facet.uniqueValues = u.length;
					}
					facetsA.push(facet);
				}
			}
		}
		return facetsA;
	};

	ixmaps.data.makeFacets = function (szFilter,szDiv) { 
		var szFieldsA = ["crown","weight (estimated)","CO2/year (estimated)","Número Habitantes"];
		var facetsA = ixmaps.data.getFacets(szFilter,szDiv,szFieldsA);
		ixmaps.data.showFacets(szFilter,szDiv,facetsA);
	}

	/**
	 * end of namespace
	 */

})();

// -----------------------------
// EOF
// -----------------------------

