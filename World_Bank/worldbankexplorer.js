(function( ixmaps, $, undefined ) {

	var worldBankData = new Object();

		worldBankData.topics	= new Array();
		worldBankData.cache		= new Array();

		worldBankData.themesA	= new Array();
		worldBankData.bookmarksA= null;
		worldBankData.nTopics	= 0;

		worldBankData.szSelectedYear = '2014';
		worldBankData.szSelectedPeriod = '1';
		worldBankData.szIndicator    = null;
		worldBankData.szLastIndicator= null;
		worldBankData.szType         = 'single';
		worldBankData.szClasses		 = '7';

		worldBankData.szSingleType	 = 'shape';
		worldBankData.szTrendType	 = 'none';
		worldBankData.szMultiType	 = 'pie';

		worldBankData.szSingleColorScheme  = 'red';
		worldBankData.szTrendColorScheme   = 'red';
		worldBankData.szMultiColorScheme  = 'office';
		worldBankData.szDirectColorScheme  = null;

	var __actTheme	 = null;
	var __actThemeId = null;
	var __actSingleThemeId = null;
	var __actTrendThemeId = null;
	var __actMultiThemeId = null;

	var __actTopic   = 16;
	var __szIdicatorFilter = "";


	/****************************************************** 
	 *
	 * All world bank queries here
	 *
	 ******************************************************/

	/**
	 * getTopics
	 * @param szSelected the name of the preselected indicator 
	 * @return ---
	 */
	ixmaps.getTopics = function(szSelected){ 
		 $.ajax({ 
				url: 'http://api.worldbank.org/v2/topics?format=json', 
				jsonpCallback: 'jsonp1',
				dataType: 'json', 
			   success: function(data) { __processTopics(szSelected,data); }, 
			   error: function(data) { alert("error on loading topics!"); } 
		 }); 
	};
	__processTopics= function(szSelected,data){
		var topicsA = worldBankData.topics = data[1];
		var szTopics = "";
		var szTopicOptions = "";

		worldBankData.nTopics = 0;
		szTopics += "<ul>";
		for ( i=0; i<topicsA.length; i++ )	{
			szTopics += "<li><a href=\"javascript:ixmaps.getIndicatorsOfTopic("+(i+1)+")\">"+topicsA[i].value+"</a></li>";
			szTopicOptions += "<option value=\""+(i+1)+"\" "+ (topicsA[i].value.match(szSelected)?"selected=\"selected\"":"") +" >&nbsp;"+topicsA[i].value+" </option>";
			worldBankData.nTopics++;
		}

		// add special topic: all
		szTopics += "<li><a href=\"javascript:ixmaps.getIndicatorsOfTopic(99)\">all</a></li>";
		szTopicOptions += "<option value=\"99\" >&nbsp;all</option>";

		szTopics += "</ul>";
		$("#topic-selector").html(szTopics);
		$("#selectTopic-select").html(szTopicOptions);

	};

	/**
	 * getTopics
	 * @param szSelected the name of the preselected indicator 
	 * @return ---
	 */
	ixmaps.setTopicOfIndicator = function(szIndicator){
		 $.ajax({ 
				url: 'http://api.worldbank.org/v2/indicators/'+szIndicator+'/?per_page=1024&format=json', 
				dataType: 'json', 
				jsonpCallback: 'jsonp2',
			   success: function(data) { ixmaps.setSelectedTopic(data[1][0].topics[0].value);
										 ixmaps.getIndicatorsOfTopic(data[1][0].topics[0].id); }, 
			   error: function(data) { alert("error on loading indicator!"); } 
		 }); 
	};

	/**
	 * getIndicatorsOfTopic
	 * @param nTopic the number of the topic  (sequenze from getTopic)
	 * @return ---
	 */
	ixmaps.getIndicatorsOfTopic = function(nTopic,fAll){

		if ( nTopic == 99 ){
			ixmaps.getIndicatorsOfTopic(1,true);
			return;
		}

		if ( !fAll || (nTopic == 1) ){
			$("#indicator-list").empty();
		}

		__actTopic = nTopic;
			$("#indicator-selector").html("<br><span style=\"color:#aaaaaa;align:center;\">&nbsp&nbsp;loading indicators ...</span><br><img style=\"position:relative;top:50px;left:40%;\" alt=\"mill\" src=\"../../../ui/images/loading_round.gif\" height=\"44px\" />");
			$("#data-result").html(" ");
			$.ajax({ 
					url:		'http://api.worldbank.org/v2/topic/'+nTopic+'/indicator?format=json', 
					dataType:	'json', 
					jsonpCallback: 'jsonp3',
					success:	function(data) { __processIndicators(nTopic,data); }, 
					error:		function(data) { alert("error on loading indicators!"); } 
			}); 
	};
	__processIndicators= function(nTopic,data,fAll){
		var __IndicatorsA = data[1];
		if ( !$("#indicator-selector")[0] ){
			return;
		}
		var indicatorList = $("#indicator-list")[0];
		if ( !indicatorList ){
			indicatorList = document.createElement("ul");
			indicatorList.setAttribute("id","indicator-list");
			$("#indicator-selector").html("");
			$("#indicator-selector")[0].appendChild(indicatorList);
		}

		for ( i=0; i<__IndicatorsA.length; i++ ){
			if ( __szIdicatorFilter && __szIdicatorFilter.length && !eval("__IndicatorsA[i].name.match(\/"+__szIdicatorFilter+"\/i)") ){
				continue;
			}
			var listItem = document.createElement("li");
			listItem.innerHTML =  "";

			if ( worldBankData.szType == "multiple" ){
				listItem.setAttribute("class","indicator-multi");
				listItem.setAttribute("id",__IndicatorsA[i].id.replace(/\./g,'-'));
				listItem.innerHTML += "<input class=\"indicator-multi\" value=\""+__IndicatorsA[i].id.replace(/\./g,'-')+"\" type=\"checkbox\" >";
				listItem.innerHTML += "<a title=\""+__IndicatorsA[i].sourceNote+"\" href=\"javascript:ixmaps.createNewTheme('"+__IndicatorsA[i].id+"')\" style=\"position:relative;top:-5px;left:-3px;\" >"+__IndicatorsA[i].name+"</a>";
			}else{
				listItem.setAttribute("class","indicator");
				listItem.setAttribute("id",__IndicatorsA[i].id.replace(/\./g,'-'));
//				listItem.innerHTML += "<a href=\"javascript:ixmaps.createNewTheme('"+__IndicatorsA[i].id+"')\">"+__IndicatorsA[i].name+"</a>";
				listItem.innerHTML += "<a href=\"javascript:ixmaps.setIndicatorToMap('"+__IndicatorsA[i].id+"');\">"+__IndicatorsA[i].name+"</a>";
				listItem.innerHTML += "</li>";
			}
			indicatorList.appendChild(listItem);
		}
		if ( fAll && (nTopic < worldBankData.nTopics) ){
			ixmaps.getIndicatorsOfTopic(nTopic+1,fAll);	ixmaps.selectTopic = function(){
		var selectedTopic = $("#selectTopic-select").find("option:selected")[0].value;
		ixmaps.getIndicatorsOfTopic(selectedTopic);
	};

		}
	};

	ixmaps.getIndicatorsAll= function(){
		__actTopic = 99;
		if ( worldBankData.cache["topic99"] ){
			__processIndicators(nTopic,worldBankData.cache["topic99"]);
		}else{
			$("#indicator-selector").html(" ...");
			$("#data-result").html(" ");
			$.ajax({ 
					url:		'http://api.worldbank.org/v2/indicator', 
					dataType:	'json', 
					jsonpCallback: 'jsonp4',
					success:	function(data) { __processIndicators(99,data); }, 
					error:		function(obj,status,error) { alert("error on loading indicators! " + status +" "+ error); } 
			}); 
		}
	};

	ixmaps.setSelectedTopic = function(szName){
		setTimeout('$("#selectTopic-select option:contains('+szName+')").attr("selected", true)',1000);
	};

	ixmaps.selectTopic = function(){
		var selectedTopic = $("#selectTopic-select").find("option:selected")[0].value;
		ixmaps.getIndicatorsOfTopic(selectedTopic);
	};


}( window.ixmaps = window.ixmaps || {}, jQuery ));

// .............................................................................
// EOF
// .............................................................................

