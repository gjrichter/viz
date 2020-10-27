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
 * convert a number into a formatted string; if the number > 1000 it will be formatted like 1.023.234 
 * @param nValue the number to format
 * @param nPrecision the wanted decimal points 
 * @param szFlag "CEIL" or "FLOOR" (round either up or down)
 */
var __formatValue = function (nValue, nPrecision, szFlag) {

	nValue = Number(nValue);

	if (!isFinite(nValue) || !isFinite(nPrecision)) {
		return String(nValue);
	}
	if (nValue == 0) {
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

	var nClipDecimal = Math.pow(10, nPrecision);
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
				szReturn += __formatpart(nPart, szLeading);
				nValue = nValue % nClip;
				nClip /= 1000;
				if (nPart) {
					szLeading = "0";
					if (szFlag && szFlag.match(/BLANK/)) {
						szBreak = "&nbsp;";
					} else {
						szBreak = ".";
					}
				}
				szReturn += szBreak;
			}
		}

		szReturn += __formatpart(nValue, szLeading);

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
function __formatpart(nPart, szLeading) {
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
};

var hex2rgb = function(hex,opacity ){
	var rr, gg, bb, hh="0123456789abcdef";
    rr=parseInt(hex.substr(1,2),16);
    gg=parseInt(hex.substr(3,2),16);
    bb=parseInt(hex.substr(5,2),16);
	
	return "rgba("+rr+","+gg+","+bb+","+opacity+")";

};

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
		return (last == before) ? "black" : ((last < before) ? "green" : "red");
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
	
	getRegionNames = function () {
		
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {
				// get the regions
				
				mydata.sort("lat");

				countriesA = mydata.column("denominazione_regione").values().reverse();
				countriesMaxA = mydata.column("totale_casi").values().reverse();
				
				szHtml = "<span style='font-size:0.9em'>";
				szHtml += "<select onChange='makeItalyCards(this.value)'>";
 				szHtml += "<option selected='true' value='Italia'  style='font-size:1em;padding:0.5em 0'>&nbsp;Italia</option>";

				for (i in countriesA) {
					if (0 && (countriesA[i] == "Italy")) {
						szHtml += "<option selected='true' value='" + countriesA[i] + "'> " + countriesA[i] + "</option>";
					} else {
						szHtml += "<option style='font-size:0.6em' value=\"" + countriesA[i] + "\">&nbsp;" + countriesA[i] + "</option>";
					}
				}
	
				szHtml += "</select>";
				szHtml += "</span>";
				
				$("#select-country").html(szHtml);
			});
	};
	
	getRegionNames();	

	getRegionNames_II = function () {
		
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni-latest.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {
				// get the regions
				
				mydata.sort("lat");

				countriesA = mydata.column("denominazione_regione").values().reverse();
				countriesMaxA = mydata.column("totale_casi").values().reverse();
				
				szHtml = "<span style='font-size:0.9em'>";
				szHtml += "<select onChange='makeRegionCurves_actives(false,this.value)'>";
 				szHtml += "<option selected='true' value='Italia'  style='font-size:1em;padding:0.5em 0'>&nbsp;Italia</option>";

				for (i in countriesA) {
					if (0 && (countriesA[i] == "Italy")) {
						szHtml += "<option selected='true' value='" + countriesA[i] + "'> " + countriesA[i] + "</option>";
					} else {
						szHtml += "<option style='font-size:0.6em' value=\"" + countriesA[i] + "\">&nbsp;" + countriesA[i] + "</option>";
					}
				}
	
				szHtml += "</select>";
				szHtml += "</span>";
				
				$("#select-region").html(szHtml);
			});
	};
	
	getRegionNames_II();	
	
	
	
	// ..........................................................................
	//
	// make top trend cards 
	//
	// ..........................................................................

	makeItalyCards = function (filter) {
		
		var cardA = [
			"totale_casi",
			"totale_ospedalizzati",
			"terapia_intensiva",
			"dimessi_guariti"
		]
		var cardA_all = [
			"totale_casi",
			"dimessi_guariti",
			"deceduti",
			"totale_ospedalizzati",
			"terapia_intensiva",
			"tamponi"
		]
		var colorA = [
			"100, 160, 220",
			"155, 200, 100",
			"128,128,128",
			"34, 167, 240",
			"255, 180, 0",
			"220,220,220"
		]
		var colorClassA = [
			"red",
			"green",
			"black",
			"blue",
			"yellow",
			"gray"
		]

		var szHtml = "";
		var timeO = 0;

		cardA = cardA_all;

		for (i in cardA) {

			var feed = cardA[i];
			var idFeed = feed.replace(/\ /g, "").replace(/\'/g, "");
			var title = feed.replace(/\_/g, " ");
			
			szHtml +=
				"<div id=\"card-" + idFeed + "\" class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12\" style=\"margin-bottom:1em;float:left\">" +
				"<div class=\"card " + "" + " summary-inline\">" +
				"<div class=\"card-body\" style=\"margin-top:-1em\">" +
				"<i class=\"icon fa fa-none fa-4x\"></i><span style=\"font-size:1.5em;vertical-align:60%\">" + title + " </span>" +
				"<div class=\"content\">" +
				"<div id=\"dynamic-" + idFeed + "\" class=\"title data-dynamic\" data-path=\"data::albopop::" + idFeed + "\">--</div>";
			
			if ( feed != "xxtamponi") {
				szHtml += 
					"<div class=\"sub-title data-dynamic\" style=\"color:#888;margin-top:-1.5em\">variazioni (media di 3 giorni)</div>";
			}
			
			szHtml +=
				"</div>" +
				"<div class=\"clear-both\"></div>" +
				"</div>" +
				"</div>" +
				"</div>";
			
			setTimeout("addItalyCard(\"" + idFeed + "\",\"" + feed + "\",\"" + filter + "\",\"" + colorA[i] + "\")", timeO);
			timeO += 100;
		}

		$("#ItalyCards").html(szHtml);

		$("#loading").hide();
		
		if ( filter ){
			if ( filter == "Italia" ){
				filter = null;
				bar_chart_italia();			
			}
			$("#bar-chart-title").html("Giorno per giorno: " + filter);
			bar_chart_region(filter);			
			makeRegionCurves(true,filter);
			makeRegionCurves_actives(false,filter);
			makeRegionCurves_percentuali(false,filter);
		}

	};
			
	// ..........................................................................
	//
	// popolate one trend card 
	//
	// ..........................................................................
	
	addItalyCard = function (id, feed, filter, color) {
		
		if ( typeof(filter)=="undefined" || filter == "undefined" || filter.match(/italia/i) ){
			filter = null;
		}

		// get one rss AlboPop feed 
		// ------------------------------------
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv";
		if (filter){
			szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		}
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {

				$("#dataquery-splash").hide();

				// ..........................................................
				//
				// 1. loop over data request and set value into card templates
				//
				// ..........................................................

				var idCard = id;
				var title = feed.replace(/\_/g, " ");

				var records = mydata.table.records;

				mydata.column('data').map(function (value) {
					return value.split(' ')[0];
				});
				
				if (filter){
					mydata = mydata.select('WHERE denominazione_regione = "'+filter+'"');
				}

				var max = 5000;
				
				var values = mydata.column('totale_casi').values();
				var last_diff = values.pop() - values.pop();
				max = Math.ceil(Number(last_diff)/100)*2000;
				
				if (feed == "terapia_intensiva") {
					max = max/5;
				}
				if (feed == "deceduti") {
					max = max/2;
				}
				if (feed == "tamponi") {
					var values = mydata.column('tamponi').values();
					var last_diff = values.pop() - values.pop();
					max = Math.ceil(Number(last_diff)/500)*1000;
				}
				
				var recordsA = mydata.column(feed).values();
				recordsA = recordsA.map(function (value) {
					return Number(value);
				});
				var last = recordsA.length - 1;
				actvalue = recordsA[last];
				
				var fMean3 = true;		
				if (fMean3){
					//var mean3 = (recordsA[last-0] + recordsA[last-1] + recordsA[last-2]) / 3;
					//var mean2 = (recordsA[last-1] + recordsA[last-2] + recordsA[last-3]) / 3;
					//var mean1 = (recordsA[last-2] + recordsA[last-3] + recordsA[last-4]) / 3;
					var mean3 = (recordsA[last-0]);
					var mean2 = (recordsA[last-1]);
					var mean1 = (recordsA[last-2]);

					var lastdiff = mean3 - mean2;
					var beforediff = mean2 - mean1;

					if (1) {
						for (i = recordsA.length - 1; i >=7; i--) {
							recordsA[i] = (recordsA[i-0]+recordsA[i-1]+recordsA[i-2]+recordsA[i-3]+recordsA[i-4]+recordsA[i-5]+recordsA[i-6])/7 -
										  (recordsA[i-1]+recordsA[i-2]+recordsA[i-3]+recordsA[i-4]+recordsA[i-5]+recordsA[i-6]+recordsA[i-7])/7;
						}
					}
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					
					var dateA = mydata.column("data").values();
					dateA.shift();
					dateA.shift();
					dateA.shift();
				}else{
					var mean3 = (recordsA[last-0]);
					var mean2 = (recordsA[last-1]);
					var mean1 = (recordsA[last-2]);

					var lastdiff = mean3 - mean2;
					var beforediff = mean2 - mean1;

					if (1) {
						for (i = 0; i < recordsA.length - 1; i++) {
							recordsA[i] = (recordsA[i+1]) - (recordsA[i+0]);
						}
					}
					recordsA.pop();
					
					var dateA = mydata.column("data").values();
					dateA.pop();
				}
				
				if ( 0 ) {
					for (i = 0; i < recordsA.length; i++) {
						recordsA[i] = Math.log(recordsA[i]);
					}
					max = 10;
				}

				var small_curve_options = {
					animation:{
						duration: 100
					},
					responsive: true,
					legend: {
						position: 'bottom',
						display: false,
					},
					hover: {
						mode: 'index'
					},
					scales: {
						xAxes: [{
							display: false,
							scaleLabel: {
								display: false,
								labelString: 'Day'
							}
						}],
						yAxes: [{
							display: true,
							ticks: {
							},
							scaleLabel: {
								display: false,
								labelString: 'Value'
							}
						}]
					},
					title: {
						display: false,
						text: 'Chart.js Line Chart - Legend'
					}
				};

				// display sum, last 28, trend arrow 
				// -------------------------------------
				var szArrow = __getArrow(lastdiff, beforediff);
				var szArrowColor = __getArrowColor(lastdiff, beforediff);
				if (feed.match(/dimessi/)) {
					var szArrowColor = __getArrowColor(beforediff, lastdiff);
				}
				var nPercent = (lastdiff/beforediff*100-100).toFixed(1);
					nPercent = ((nPercent>0)?"+":"") + nPercent;
				var chart = "<div style='width:80%;margin-top:2px;margin-bottom:10px'><canvas id='" + idCard + "-line-chart'></canvas></div>";

				if (feed != "xxtamponi") {
					$("#dynamic-" + idCard).html(
					"<div><span class='pull-left' style='margin-top:0.2em;padding:0 0.3em;color:white;background:rgba(" + color + ",1);border-radius:0.1em')>" + __formatValue(actvalue, 0) + "</span><br><span class='pull-left' style='font-size:0.7em;padding-top:0em;'><span style='font-size:0.5em;color:#aaaaaa'>("+ (beforediff>0?"+":"") + __formatValue((beforediff), 0) + ")</span>  <span style='font-size:0.6em;color:rgba(" + color + ",1)'>"+ (lastdiff>0?"+":"") + __formatValue((lastdiff), 0) + "</span> <span><i class='icon fa " + szArrow + "' style='color:" + szArrowColor + ";font-size:0.5em'></i> <span style='font-size:0.5em'>"+nPercent+"%</span></div></div>" + ((feed != "xxtamponi") ? chart : ""));
				} else {
					$("#dynamic-" + idCard).html(
					"<span class='pull-left' >" + __formatValue(actvalue, 0) + " </span><br><span class='pull-right' style='font-size:0.7em;padding-top:0em;'><span style='font-size:0.5em;color:#aaaaaa'>("+ (beforediff>0?"+":"") + __formatValue((beforediff), 0) + ")</span>  <span style='color:rgba(" + color + ",1)'>"+ (lastdiff>0?"+":"") + __formatValue((lastdiff), 0) + " </span><i class='icon fa " + szArrow + "' style='color:#888888'></i></span> ");
				}


				$("#card-" + idCard).show();

				// make curve
				// -------------------------------------
				var canvas = $('#' + idCard + '-line-chart').get(0);
				if (canvas){
					var ctx = canvas.getContext('2d');

					var lineColor = "rgba(" + color + ",1)";
					var fillColor = "rgba(" + color + ",0.2)";

					myLineChart = new Chart(ctx, {
						type: 'line',
						data: {
							labels: dateA,
							datasets: [{
								label: title + " +",
								data: recordsA,
								fill: true,
								borderColor: lineColor,
								backgroundColor: fillColor,
								pointRadius: 1,
								lineTension: 0
							}]
						},
						options: small_curve_options
					});
					// ------------------------------
				}

			});

	}; 
	makeItalyCards();

});



// --------------------------------------------
// --------------------------------------------
//
//   B A R - C H A R T - Italia
//
// --------------------------------------------
// -------------------------------------------
	
$(function () {

	bar_chart_italia = function () {
		
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv";
		var mydata2 = Data.feed({
			"source": szUrl,
			"type": "csv"
		}).load(function (data) {

			data.column('data').map(function (value) {
					return value.split(' ')[0];
			});

			var set1 = data.column("dimessi_guariti").values();
			var set2 = data.column("isolamento_domiciliare").values();
			var set3 = data.column("ricoverati_con_sintomi").values();
			var set4 = data.column("terapia_intensiva").values();
			var set5 = data.column("deceduti").values();

			var last = set1.length - 1;
			var szHtml = 
				"<span style='background:rgba(164, 205, 232, 0.6);padding:0.5em;border-radius:0.2em' title='isolamento domiciliare'>" +
				set2[last] + "</span> " +
				"<span style='background:rgba(87,  127, 171, 0.6);padding:0.5em;border-radius:0.2em' title='ricoverati con sintomi'>" +
				set3[last] + "</span> " +
				"<span style='background:rgba(242, 147, 53,  0.6);padding:0.5em;border-radius:0.2em' title='terapia intensiva'>" +
				set4[last] + "</span> " +
				"<span style='background:rgba(95,  164, 86,  0.6);padding:0.5em;border-radius:0.2em' title='dimessi guariti'>" +
				set1[last] + "</span> " +
				"<span style='border:solid black 1px;padding:0.5em;border-radius:0.2em' title='deceduti'>" +
				set5[last] + "</span> " +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;totale: " +
				(Number(set1[last]) + Number(set2[last]) + Number(set3[last]) + Number(set4[last]) + Number(set5[last]));

			$("#text-situazione-Italia").html(szHtml);

			var ctx, data, myBarChart, option_bars;
			Chart.defaults.global.responsive = true;
			$('#bar-chart-situazione-regionale').parent().html('<canvas id="bar-chart-situazione-regionale" class="chart"></canvas>');
			ctx = $('#bar-chart-situazione-regionale').get(0).getContext('2d');

			options = {
				scaleBeginAtZero: true,
				scaleShowGridLines: true,
				scaleGridLineColor: "rgba(0,0,0,.05)",
				scaleGridLineWidth: 1,
				scaleShowHorizontalLines: true,
				scaleShowVerticalLines: false,
				barShowStroke: true,
				barStrokeWidth: 1,
				barValueSpacing: 5,
				barDatasetSpacing: 3,
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
			};
			options.type = "bar";
			options.data = {
				labels: data.column("data").values(),
					datasets: [
						{
							label: "isolamento domiciliare",
							backgroundColor: "rgba(164, 205, 232,0.6)",
							borderColor: "rgba(164, 205, 232,1)",
							borderWidth: 1,
							pointColor: "A4CDE8",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#afaf88",
							data: set2
			  }, {
							label: "ricoverati con sintomi",
							backgroundColor: "rgba(87, 127, 171,0.6)",
							borderColor: "rgba(87, 127, 171,1)",
							borderWidth: 1,
							pointColor: "#a2A7F0",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#a2A8F0",
							data: set3
			  }, {
							label: "terapia intensiva",
							backgroundColor: "rgba(242, 147, 53,0.6)",
							borderColor: "rgba(242, 147, 53,1)",
							borderWidth: 1,
							pointColor: "#22A7F0",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#afaf88",
							data: set4
			  }, {
							label: "dimessi guariti",
							backgroundColor: "rgba(95, 164, 86,0.5)",
							borderColor: "rgba(95, 164, 86,1)",
							borderWidth: 1,
							pointColor: "A4CDE8",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#afaf88",
							data: set1
			  }, {
							label: "deceduti",
							backgroundColor: "rgba(255, 255, 255,0.6)",
							borderColor: "#c287F0",
							borderWidth: 1,
							pointColor: "#22A7F0",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#afaf88",
							data: set5
			  }
			]
			};
			options.options = {
				animation:{
					duration: 1
				},
				scales: {
					xAxes: [{
						stacked: true
				}],
					yAxes: [{
						stacked: true,
				}]
				}
			};
			myBarChart = new Chart(ctx, options);
		});
	};

	
	/**
	 * do_situazione_region - create regional bar chart
	 * @param szName region name
	 * @void
	 */
	bar_chart_region = function (szName) {

		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var mydata2 = Data.feed({
			"source": szUrl,
			"type": "csv"
		}).load(function (data) {

			var idName = szName.replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");
			
			data = data.select("WHERE denominazione_regione = \"" + szName + "\"");

			data.column('data').map(function (value) {
					return value.split(' ')[0];
			});

			var set1 = data.column("dimessi_guariti").values();
			var set2 = data.column("isolamento_domiciliare").values();
			var set3 = data.column("ricoverati_con_sintomi").values();
			var set4 = data.column("terapia_intensiva").values();
			var set5 = data.column("deceduti").values();

			var fPrevalenza = false;
			if (fPrevalenza) {
				
				var pop = __regionPop[szName.replace(/\-/," ")];
				
				set1 = set1.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set2 = set2.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set3 = set3.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set4 = set4.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set5 = set5.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
			}
			
			var last = set5.length-1;
			//max = Math.max(max,Math.ceil(Number(set1[last])+Number(set2[last])+Number(set3[last])+Number(set4[last])+Number(set5[last])));

			var ctx, data, myBarChart, option_bars;
			Chart.defaults.global.responsive = true;
			$('#bar-chart-situazione-regionale').parent().html('<canvas id="bar-chart-situazione-regionale" class="chart"></canvas>');
			ctx = $('#bar-chart-situazione-regionale').get(0).getContext('2d');

			options = {
				scaleBeginAtZero: true,
				scaleShowGridLines: true,
				scaleGridLineColor: "rgba(0,0,0,.05)",
				scaleGridLineWidth: 1,
				scaleShowHorizontalLines: true,
				scaleShowVerticalLines: false,
 				barShowStroke: true,
				barStrokeWidth: 1,
				barValueSpacing: 5,
				barDatasetSpacing: 3,
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
			};
			options.type = "bar";
			options.data = {
				labels: data.column("data").values(),
				datasets: [
					{
						label: "isolamento domiciliare",
						backgroundColor: "rgba(164, 205, 232,0.6)",
						borderColor: "rgba(164, 205, 232,1)",
						borderWidth: 1,
						pointColor: "A4CDE8",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set2
		  }, {
						label: "ricoverati con sintomi",
						backgroundColor: "rgba(87, 127, 171,0.6)",
						borderColor: "rgba(87, 127, 171,1)",
						borderWidth: 1,
						pointColor: "#a2A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#a2A8F0",
						data: set3
		  }, {
						label: "terapia intensiva",
						backgroundColor: "rgba(242, 147, 53,0.6)",
						borderColor: "rgba(242, 147, 53,1)",
						borderWidth: 1,
						pointColor: "#22A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set4
		  }, {
						label: "dimessi guariti",
						backgroundColor: "rgba(95, 164, 86,0.5)",
						borderColor: "rgba(95, 164, 86,1)",
						borderWidth: 1,
						pointColor: "A4CDE8",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set1
		  }, {
						label: "deceduti",
						backgroundColor: "rgba(255, 255, 255,0.6)",
						borderColor: "#c287F0",
						borderWidth: 1,
						pointColor: "#22A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set5
		  }
		]
			};
			options.options = {
				animation:{
					duration: 10
				},
				scales: {
					xAxes: [{
					    gridLines : {
							display : false
						},
						display: true,
						stacked: true
			}],
					yAxes: [{
						ticks: {
							min: 0,
						},
						stacked: true
			}]
				}
			};
			myBarChart = new Chart(ctx, options);
		});
	};
	
	bar_chart_italia();

});


// --------------------------------------------
// --------------------------------------------
//
//   R E G I O N I
//
// --------------------------------------------
// -------------------------------------------

// --------------------------------------------
// --------------------------------------------
//
//   Detailed Stacked Bar Chart
//
// --------------------------------------------
// -------------------------------------------

$(function () {

	var max = 0;
	__clearMax = function(){
		max = 0;
	}
	/**
	 * situazione_region - create region bar chart
	 * @param szName regiony name
	 * @void
	 */
	situazione_region = function (szName) {

		if ($("#bar-chart-situazione-italia-region-" + (szName.replace(/ /, "")))[0]) {
			return;
		}

		var idName = szName.replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");

		szHtml =

			"<div id=\"regional-card" + (idName) + "\" class=\"col-sm-12 col-xs-12\">" +
			"<h3>" + szName + " <a style='float:right' href=\"javascript:$('#regional-card" + (idName) + "').remove();__clearMax();\">X</a></h3>" +
			"<div class=\"card\">" +
			"<div class=\"card-body no-padding\">" +
			"<canvas id=\"bar-chart-situazione-italia-region-" + (idName) + "\" class=\"chart\" ></canvas>" +
			"</div>" +
			"</div>" +
			"</div>";

		$('#regional-cards').append(szHtml);
		// remake canvas to clear it
		//$('#bar-chart-situazione-italia-region').parent().html('<canvas id="bar-chart-situazione-italia-region" class="chart"></canvas>');
		setTimeout("do_situazione_region('" + szName + "')", 100);
	}

	/**
	 * do_situazione_region - create regional bar chart
	 * @param szName region name
	 * @void
	 */
	do_situazione_region = function (szName) {

		$('html,body').animate({
			scrollTop: ($('#regional-cards').offset().top - window.innerHeight / 2)
		}, 'fast');


		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var mydata2 = Data.feed({
			"source": szUrl,
			"type": "csv"
		}).load(function (data) {

			var idName = szName.replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");
			
			data = data.select("WHERE denominazione_regione = \"" + szName + "\"");

			data.column('data').map(function (value) {
					return value.split(' ')[0];
			});

			var set1 = data.column("dimessi_guariti").values();
			var set2 = data.column("isolamento_domiciliare").values();
			var set3 = data.column("ricoverati_con_sintomi").values();
			var set4 = data.column("terapia_intensiva").values();
			var set5 = data.column("deceduti").values();

			var fPrevalenza = false;
			if (fPrevalenza) {
				
				var pop = __regionPop[szName.replace(/\-/," ")];
				
				set1 = set1.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set2 = set2.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set3 = set3.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set4 = set4.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
				set5 = set5.map(function (value) {
					return (Number(value) * 10000 / pop).toFixed(2);
				});
			}
			
			var last = set5.length-1;
			max = 0;
			max = Math.max(max,Math.ceil(Number(set1[last])+Number(set2[last])+Number(set3[last])+Number(set4[last])+Number(set5[last])));

			var ctx, data, myBarChart, option_bars;
			Chart.defaults.global.responsive = true;
			ctx = $("#bar-chart-situazione-italia-region-" + (idName)).get(0).getContext("2d");

			options = {
				scaleBeginAtZero: true,
				scaleShowGridLines: true,
				scaleGridLineColor: "rgba(0,0,0,.05)",
				scaleGridLineWidth: 1,
				scaleShowHorizontalLines: true,
				scaleShowVerticalLines: false,
 				barShowStroke: true,
				barStrokeWidth: 1,
				barValueSpacing: 5,
				barDatasetSpacing: 3,
				legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
			};
			options.type = "bar";
			options.data = {
				labels: data.column("data").values(),
				datasets: [
					{
						label: "isolamento domiciliare",
						backgroundColor: "rgba(164, 205, 232,0.6)",
						borderColor: "rgba(164, 205, 232,1)",
						borderWidth: 1,
						pointColor: "A4CDE8",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set2
		  }, {
						label: "ricoverati con sintomi",
						backgroundColor: "rgba(87, 127, 171,0.6)",
						borderColor: "rgba(87, 127, 171,1)",
						borderWidth: 1,
						pointColor: "#a2A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#a2A8F0",
						data: set3
		  }, {
						label: "terapia intensiva",
						backgroundColor: "rgba(242, 147, 53,0.6)",
						borderColor: "rgba(242, 147, 53,1)",
						borderWidth: 1,
						pointColor: "#22A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set4
		  }, {
						label: "dimessi guariti",
						backgroundColor: "rgba(95, 164, 86,0.5)",
						borderColor: "rgba(95, 164, 86,1)",
						borderWidth: 1,
						pointColor: "A4CDE8",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set1
		  }, {
						label: "deceduti",
						backgroundColor: "rgba(255, 255, 255,0.6)",
						borderColor: "#666666",
						borderWidth: 0.5,
						pointColor: "#22A7F0",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "#afaf88",
						data: set5
		  }
		]
			};
			options.options = {
				scales: {
					xAxes: [{
					    gridLines : {
							display : false
						},
						display: true,
						stacked: true
			}],
					yAxes: [{
						ticks: {
							max: max,
							min: 0,
						},
						stacked: true
			}]
				}
			};
			myBarChart = new Chart(ctx, options);
		});
	};
});

// --------------------------------------------
// --------------------------------------------
//
//   small regional cards
//
// --------------------------------------------
// -------------------------------------------

$(function () {

	// --------------------------------------------
	//
	// small regional cards 
	//
	// --------------------------------------------

	__feedReadCount = 0;
	__feedFilterValue = "";

	makeSmallRegionalCards = function (szFilter) {

		__feedFilterValue = szFilter;
		__feedReadCount = 0;

		var timeO = 0;
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log(e)
			})
			.load(function (mydata) {

				// sort by latitude, get list of region names, and get northern regions firts
				var feedA = mydata.condense("denominazione_regione").sort("lat").column("denominazione_regione").values().reverse();

				var szHtml = "";

				$("#FeedCount").html(feedA.length);

				for (i in feedA) {

					var feed = feedA[i];
					var comuneA = feed.split("/");
					var comune = comuneA.pop();
					var idComune = comune.replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");

					szHtml +=
						"<div id=\"small-card-" + idComune + "\" class=\"col-lg-2 col-md-2 col-sm-3 col-xs-3\" style=\display:none\">" +
						"<a href=\"javascript:situazione_region('" + comune + "','" + feed + "');\">" +
						"<div class=\"card summary-inline\">" +
						"<div class=\"\" style=\"padding:0.5em\">" +
						"<div style=\"font-size:0.9em;line-height:0.9em;min-height:3em\">" + comune + " </div>" +
						"<div class=\"content\">" +
						"<div id=\"small-dynamic-" + idComune + "\" class=\"title data-dynamic\" data-path=\"data::albopop::" + idComune + "\">--</div>" +
						"</div>" +
						"<div class=\"clear-both\"></div>" +
						"</div>" +
						"</div>" +
						"</a>" +
						"</div>";
					setTimeout("addSmallRegionCard(\"" + idComune + "\",\"" + feed + "\",\"" + comune + "\")", timeO);
					timeO += 100;
				}

				$("#SmallRegionCards").html(szHtml);

				$("#loading").hide();

			});
	};

	// ..........................................................................
	//
	// make one small Regional dasboard card 
	//
	// ..........................................................................

	addSmallRegionCard = function (id, feed, name) {

		// correct wrong feed source for "Cerreto D'Esi", must be "Cerreto d'Esi"
		feed = feed.replace("Cerreto D", "Cerreto d");

		// get one rss AlboPop feed 
		// ------------------------------------
		szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {

				__feedReadCount++;
				$("#FeedReadCount").html(__feedReadCount);

				// filter records if filter is defined
				// ------------------------------------
				if (__feedFilterValue && __feedFilterValue.length) {
					var mydata = mydata.select("WHERE denominazione_regione like " + __feedFilterValue);
				}

				mydata = mydata.select("WHERE denominazione_regione = \"" + name + "\"");

				// ..........................................................
				//
				// 1. loop over data request and set value into card templates
				//
				// ..........................................................

				var idComune = id;


				var records = mydata.table.records;

				mydata.column('data').map(function (value) {
					return value.split(' ')[0];
				});

				var datasetA = [];	
				
				
				// deceduti 
				// --------------------------------------------------------------
				var daysA = mydata.column("deceduti").values();
				records = daysA[daysA.length - 1];
				//var max = Number(records);

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(160,160,160,1)",
						backgroundColor: "rgba(160,160,160,0.7)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				

				// positivi 
				// -----------------------------------------------------------
				var daysA = mydata.column("totale_positivi").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(120,160,250,1)",
						backgroundColor: "rgba(120,160,250,0.3)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				
				
				// dimessi_guariti 
				// ----------------------------------------------------------------
				var daysA = mydata.column("dimessi_guariti").values();
				records = daysA[daysA.length - 1];
				//var max = Number(records);

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(120,220,100,1)",
						backgroundColor: "rgba(120,220,100,0.2)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				

				var small_curve_options = {
					animation:{
						duration: 1
					},
					responsive: true,
					legend: {
						position: 'bottom',
						display: false,
					},
					hover: {
						mode: 'index'
					},
					scales: {
						xAxes: [{
							display: false,
							scaleLabel: {
								display: false,
								labelString: 'Day'
							}
						}],
						yAxes: [{
               				//stacked: true,
							display: false,
							ticks: {
								//max: max,
								min: 0,
							},
							scaleLabel: {
								display: false,
								labelString: 'Value'
							}
						}]
					},
					title: {
						display: false,
						text: 'Chart.js Line Chart - Legend'
					}
				};
				// display sum, last 28, trend arrow 
				// -------------------------------------
				var chart = "<div style='width:100%;margin-top:2px;'><canvas id='small-" + idComune + "-line-chart'></canvas></div>";
				$("#small-dynamic-" + idComune).html(chart);

				$("#small-card-" + idComune).show();

				// make curve
				// -------------------------------------
				var canvas = $('#small-' + idComune + '-line-chart').get(0);
				if (canvas){
					var ctx = canvas.getContext('2d');

					myLineChart = new Chart(ctx, {
						type: 'line',
						data: {
							labels: dateA,
							datasets: datasetA
						},
						options: small_curve_options
					});
					// ------------------------------
				}

			});

	};

	// --------------------------------------------
	// --------------------------------------------
	//
	//   Incidenza, Prevalenza, Percent Curves
	//
	// --------------------------------------------
	// -------------------------------------------

	// ..........................................................................
	//
	// regional curves (incidenza)  
	//
	// ..........................................................................

	makeRegionCurves = function (fRegression,filter) {
		
		var timeO = 0;
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					var dataPop = dataA[1];

					// make pivot table with columns per region
					data.column("data").map(function (value) {
						return value.split(" ")[0];
					});

					var pivot = data.pivot({
						lead: "data",
						columns: "denominazione_regione",
						value: "totale_casi"
					});
					pivot.column("Total").remove();
					
					// get the columns with data 
					var columns = pivot.columnNames();
					var label = pivot.column(columns[0]).values();

					// difference values
					var records = pivot.records;
					for (r = 0; r < records.length - 1; r++) {
						for (c = 1; c < records[r].length; c++) {
							var act = (Number(records[r][c]));
							var after = (Number(records[r + 1][c]));
							records[r][c] = Math.max(0.1, (after - act));
						}
					}
					records.pop();
					label.shift();
					
					// mean of 3 days
					for (r = 0; r < records.length - 2; r++) {
						for (c = 1; c < records[r].length; c++) {
							records[r][c] = (records[r][c]+records[r+1][c]+records[r+2][c])/3;
						}
					}
					records.pop();
					records.pop();
					label.shift();
					label.shift();

					// make cases per 1 000 000 habitants
					if (1){
						for (r = 0; r < records.length; r++) {
							for (c = 1; c < records[r].length; c++) {
								records[r][c] = (Number(records[r][c]) / __regionPop[columns[c]] * 10000).toFixed(2);;
							}
						}
					}

					// define gruppi
					var gruppi = [
						{
							id: "Aosta",
							color: "#44aa44",
							regioni: ["Valle d'Aosta", ]
						},
						{
							id: "Province autonome",
							color: "#aaddaa",
							regioni: ["P.A. Bolzano", "P.A. Trento", ]
						},
						{
							id: "Nord-Ovest",
							color: "#dd4488",
							regioni: ["Piemonte", "Liguria", "Lombardia"]
						},
						{
							id: "Nord-Est",
							color: "#aa8888",
							regioni: ["Veneto", "Friuli Venezia Giulia", "Emilia Romagna"]
						},
						{
							id: "Centro",
							color: "#dddd00",
							regioni: ["Toscana", "Umbria", "Marche", "Lazio"]
						},
						{
							id: "Sud",
							color: "#88aadd",
							regioni: ["Abruzzo", "Molise", "Campania", "Puglia", "Basilicata", "Calabria"]
						},
						{
							id: "Isole",
							color: "#0088dd",
							regioni: ["Sicilia", "Sardegna"]
						}
				];

					// define colors 
					var colorSchemeA = [
					"#4c78a8",
					"#9ecae9",
					"#f58518",
					"#ffbf79",
					"#54a24b",
					"#88d27a",
					"#b79a20",
					"#f2cf5b",
					"#439894",
					"#83bcb6",
					"#e45756",
					"#ff9d98",
					"#79706e",
					"#bab0ac",
					"#d67195",
					"#fcbfd2",
					"#b279a2",
					"#d6a5c9",
					"#9e765f",
					"#d8b5a5",
					"#dddddd"
				];

					var sorted = [];
					for (i in columns) {
						sorted.push({
							index: i,
							value: pivot.column(columns[i]).values().pop()
						})
					}
					sorted.sort(function (a, b) {
						return (b.value - a.value)
					});
					
					// create one dataset per region 
					var datasetA = [];
					for (var i = 1; i < columns.length; i++) {
						
						var index = sorted[i].index;
						var data = pivot.column(columns[index]).values();
						
						if (fRegression){
							var last5 = data.length-5
							var values_y = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_y.push(Number(data[ii]));
							}
							var values_x = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_x.push(ii-last5);
							}
							var curve = findLineByLeastSquares(values_x, values_y);

							for ( var ii=last5+1; ii<data.length; ii++ ){
								data[ii] = curve[1][ii-last5].toFixed(2);
							}
						}
	
						// get group color
						for (g in gruppi) {
							for (r in gruppi[g].regioni) {
								if (columns[index] == gruppi[g].regioni[r]) {
									color = gruppi[g].color;
								}
							}
						}
						if ( filter && (columns[index] != filter)) {
							color = hex2rgb(color,0.1);
						}
						
						datasetA.push({
							label: columns[index],
							backgroundColor: "rgba(188, 188, 188,0)",
							borderColor: color,
							borderWidth: 2,
							lineTension: 0.2,
							pointDot: false,
							pointRadius: "2",
							pointColor: "#9C9C9C",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#9C9C9C",
							data: data
						});
					}

					// make curve chart 
					var ctx, data, myBarChart, option_bars;
					Chart.defaults.global.responsive = true;
					ctx = $('#bar-chart-incidenza-regioni').get(0).getContext('2d');
					options = {
						showScale: false,
						scaleShowGridLines: false,
						scaleGridLineColor: "rgba(0,0,0,.05)",
						scaleGridLineWidth: 1,
						scaleShowHorizontalLines: true,
						scaleShowVerticalLines: true,
						bezierCurve: false,
						bezierCurveTension: 0.4,
						pointDot: false,
						pointDotRadius: 1,
						pointDotStrokeWidth: 1,
						pointHitDetectionRadius: 20,
						datasetStroke: true,
						datasetStrokeWidth: 1,
						datasetFill: true
					};
					options.type = "line";
					options.data = {
						labels: label,
						datasets: datasetA
					};
					options.options = {
						animation:{
							duration:0
						},
						legend: {
							position: 'right',
							display: false,
						},
						scales: {
							xAxes: [{
								scaleLabel: {
									display: false,
									labelString: 'Day'
								}
				}],
							yAxes: [{
								type: 'linear',
								ticks: {
									lineheight: 3,
									min: 0,
								},
								scaleLabel: {
									labelString: 'Value'
								}
				}]
						}
					};

					myBarChart = new Chart(ctx, options);


				});

	};

	makeRegionCurves_actives = function (fRegression,filter) {
		
		var timeO = 0;
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					var dataPop = dataA[1];

					// make pivot table with columns per region
					data.column("data").map(function (value) {
						return value.split(" ")[0];
					});

					var pivot = data.pivot({
						lead: "data",
						columns: "denominazione_regione",
						value: "totale_positivi"
					});
					pivot.column("Total").remove();

					// get the columns with data 
					var columns = pivot.columnNames();
					var label = pivot.column(columns[0]).values();

					// difference values (mean of 3 days)
					var records = pivot.records;
					
					// mean 
					if (1){
						for (r = 0; r < records.length - 6; r++) {
							for (c = 1; c < records[r].length; c++) {
								records[r][c] = (records[r][c]+
												 records[r+1][c]+
												 records[r+2][c]+
												 records[r+3][c]+
												 records[r+4][c]+
												 records[r+5][c]+
												 records[r+6][c])/7;
							}
						}
						records.pop();
						records.pop();
						records.pop();
						records.pop();
						records.pop();
						records.pop();
						label.shift();
						label.shift();
						label.shift();
						label.shift();
						label.shift();
						label.shift();
					}

					// make cases per 100 000 habitants
					var columns = pivot.columnNames();
					var records = pivot.records;
					if (1){
					for (r = 0; r < records.length; r++) {
						for (c = 1; c < records[r].length; c++) {
							records[r][c] = (Number(records[r][c]) / __regionPop[columns[c]] * 100000).toFixed(2);;
						}
					}
					}

					// define gruppi
					var gruppi = [
						{
							id: "Aosta",
							color: "#44aa44",
							regioni: ["Valle d'Aosta", ]
						},
						{
							id: "Province autonome",
							color: "#aaddaa",
							regioni: ["P.A. Bolzano", "P.A. Trento", ]
						},
						{
							id: "Nord-Ovest",
							color: "#dd4488",
							regioni: ["Piemonte", "Liguria", "Lombardia"]
						},
						{
							id: "Nord-Est",
							color: "#aa8888",
							regioni: ["Veneto", "Friuli Venezia Giulia", "Emilia Romagna"]
						},
						{
							id: "Centro",
							color: "#dddd00",
							regioni: ["Toscana", "Umbria", "Marche", "Lazio"]
						},
						{
							id: "Sud",
							color: "#88aadd",
							regioni: ["Abruzzo", "Molise", "Campania", "Puglia", "Basilicata", "Calabria"]
						},
						{
							id: "Isole",
							color: "#0088dd",
							regioni: ["Sicilia", "Sardegna"]
						}
				];

					// define colors 
					var colorSchemeA = [
					"#4c78a8",
					"#9ecae9",
					"#f58518",
					"#ffbf79",
					"#54a24b",
					"#88d27a",
					"#b79a20",
					"#f2cf5b",
					"#439894",
					"#83bcb6",
					"#e45756",
					"#ff9d98",
					"#79706e",
					"#bab0ac",
					"#d67195",
					"#fcbfd2",
					"#b279a2",
					"#d6a5c9",
					"#9e765f",
					"#d8b5a5",
					"#dddddd"
				];

					var sorted = [];
					for (i in columns) {
						sorted.push({
							index: i,
							value: pivot.column(columns[i]).values().pop()
						})
					}
					sorted.sort(function (a, b) {
						return (b.value - a.value)
					});

					// create one dataset per region 
					var datasetA = [];
					for (var i = 1; i < columns.length - 1; i++) {
						
						var index = sorted[i].index;

						var data = pivot.column(columns[index]).values();
						
						if (fRegression){
							var last5 = data.length-5
							var values_y = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_y.push(Number(data[ii]));
							}
							var values_x = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_x.push(ii-last5);
							}
							var curve = findLineByLeastSquares(values_x, values_y);

							for ( var ii=last5+1; ii<data.length; ii++ ){
								data[ii] = curve[1][ii-last5].toFixed(2);
							}
						}
	
						// get group color
						for (g in gruppi) {
							for (r in gruppi[g].regioni) {
								if (columns[index] == gruppi[g].regioni[r]) {
									color = gruppi[g].color;
								}
							}
						}
						
						var nPointRadius = "1.5";
						if ( filter && (filter != "Italia") && (columns[index] != filter) ){
							color = hex2rgb("#888888",0.2);
							nPointRadius ="0";
						}
						datasetA.push({
							label: columns[index],
							backgroundColor: "rgba(188, 188, 188,0)",
							borderColor: color,
							borderWidth: 2,
							lineTension: 0.2,
							pointDot: false,
							pointRadius: nPointRadius,
							pointColor: "#9C9C9C",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#9C9C9C",
							data: data
						});
					}

					// make curve chart 
					var ctx, data, myBarChart, option_bars;
					Chart.defaults.global.responsive = true;
					ctx = $('#bar-chart-prevalenza-positivi-regioni').get(0).getContext('2d');
					options = {
						showScale: false,
						scaleShowGridLines: false,
						scaleGridLineColor: "rgba(0,0,0,.05)",
						scaleGridLineWidth: 1,
						scaleShowHorizontalLines: true,
						scaleShowVerticalLines: true,
						bezierCurve: false,
						bezierCurveTension: 0.4,
						pointDot: false,
						pointDotRadius: 1,
						pointDotStrokeWidth: 1,
						pointHitDetectionRadius: 20,
						datasetStroke: true,
						datasetStrokeWidth: 4,
						datasetFill: true
					};
					options.type = "line";
					options.data = {
						labels: label,
						datasets: datasetA
					};
					options.options = {
						animation:{
							duration:0
						},
						legend: {
							position: 'right',
							display: false,
						},
						scales: {
							xAxes: [{
								scaleLabel: {
									display: false,
									labelString: 'Day'
								}
				}],
							yAxes: [{
								type: 'linear',
								ticks: {
									lineheight: 3,
									min: 0,
								},
								scaleLabel: {
									labelString: 'Value'
								}
				}]
						}
					};

					myBarChart = new Chart(ctx, options);


				});

	};
	
	makeRegionCurves_percentuali = function (fRegression,filter) {
		
		var timeO = 0;
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

					var data = dataA[0];
					var dataPop = dataA[1];

					// make pivot table with columns per region
					data.column("data").map(function (value) {
						return value.split(" ")[0];
					});

					var pivot = data.pivot({
						lead: "data",
						columns: "denominazione_regione",
						value: "totale_casi"
					});
					pivot.column("Total").remove();

					// get the columns with data 
					var columns = pivot.columnNames();
					var label = pivot.column(columns[0]).values();

					// mean 
					if (1){
						var records = pivot.records;
						for (r = 0; r < records.length - 2; r++) {
							for (c = 1; c < records[r].length; c++) {
								records[r][c] = (records[r][c]+records[r+1][c]+records[r+2][c])/3;
							}
						}
						records.pop();
						records.pop();
						label.shift();
						label.shift();
					}
					
					// make percentual increment
					var records = pivot.records;
					for (r = records.length-1; r >= 1; r--) {
						for (c = 0; c<records[r].length; c++) {
							var last   = (Number(records[r][c]  ));
							var before = (Number(records[r-1][c]));
							var diff = last-before;
							records[r][c] = (before > 100)?(diff / before * 100):0;
						}
					}
					records.shift();
					label.shift();
					for ( i=0; i<20; i++ ){
						//records.shift();
					}

					// define gruppi
					var gruppi = [
						{
							id: "Aosta",
							color: "#44aa44",
							regioni: ["Valle d'Aosta", ]
						},
						{
							id: "Province autonome",
							color: "#aaddaa",
							regioni: ["P.A. Bolzano", "P.A. Trento", ]
						},
						{
							id: "Nord-Ovest",
							color: "#dd4488",
							regioni: ["Piemonte", "Liguria", "Lombardia"]
						},
						{
							id: "Nord-Est",
							color: "#aa8888",
							regioni: ["Veneto", "Friuli Venezia Giulia", "Emilia Romagna"]
						},
						{
							id: "Centro",
							color: "#dddd00",
							regioni: ["Toscana", "Umbria", "Marche", "Lazio"]
						},
						{
							id: "Sud",
							color: "#88aadd",
							regioni: ["Abruzzo", "Molise", "Campania", "Puglia", "Basilicata", "Calabria"]
						},
						{
							id: "Isole",
							color: "#0088dd",
							regioni: ["Sicilia", "Sardegna"]
						}
				];

					// define colors 
					var colorSchemeA = [
					"#4c78a8",
					"#9ecae9",
					"#f58518",
					"#ffbf79",
					"#54a24b",
					"#88d27a",
					"#b79a20",
					"#f2cf5b",
					"#439894",
					"#83bcb6",
					"#e45756",
					"#ff9d98",
					"#79706e",
					"#bab0ac",
					"#d67195",
					"#fcbfd2",
					"#b279a2",
					"#d6a5c9",
					"#9e765f",
					"#d8b5a5",
					"#dddddd"
				];

					var sorted = [];
					for (i in columns) {
						sorted.push({
							index: i,
							value: pivot.column(columns[i]).values().pop()
						})
					}
					sorted.sort(function (a, b) {
						return (b.value - a.value)
					});

					// create one dataset per region 
					var datasetA = [];
					for (var i = 1; i < columns.length - 1; i++) {
						
						var index = sorted[i].index;

						var data = pivot.column(columns[index]).values();
						
						if (fRegression){
							var last5 = data.length-5
							var values_y = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_y.push(Number(data[ii]));
							}
							var values_x = [];
							for ( var ii=last5; ii<data.length; ii++ ){
								values_x.push(ii-last5);
							}
							var curve = findLineByLeastSquares(values_x, values_y);

							for ( var ii=last5+1; ii<data.length; ii++ ){
								data[ii] = curve[1][ii-last5].toFixed(2);
							}
						}
	
						// get group color
						for (g in gruppi) {
							for (r in gruppi[g].regioni) {
								if (columns[index] == gruppi[g].regioni[r]) {
									color = gruppi[g].color;
								}
							}
						}
						if ( filter && columns[index] != filter){
							color = hex2rgb(color,0.1);
						}
						datasetA.push({
							label: columns[index],
							backgroundColor: "rgba(188, 188, 188,0)",
							borderColor: color,
							borderWidth: 2,
							lineTension: 0.2,
							pointDot: false,
							pointRadius: "2",
							pointColor: "#9C9C9C",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "#9C9C9C",
							data: data
						});
					}

					// make curve chart 
					var ctx, data, myBarChart, option_bars;
					Chart.defaults.global.responsive = true;
					ctx = $('#bar-chart-percentuale-regioni').get(0).getContext('2d');
					options = {
						showScale: false,
						scaleShowGridLines: false,
						scaleGridLineColor: "rgba(0,0,0,.05)",
						scaleGridLineWidth: 1,
						scaleShowHorizontalLines: true,
						scaleShowVerticalLines: true,
						bezierCurve: false,
						bezierCurveTension: 0.4,
						pointDot: false,
						pointDotRadius: 1,
						pointDotStrokeWidth: 1,
						pointHitDetectionRadius: 20,
						datasetStroke: true,
						datasetStrokeWidth: 4,
						datasetFill: true
					};
					options.type = "line";
					options.data = {
						labels: label,
						datasets: datasetA
					};
					options.options = {
						animation:{
							duration:0
						},
						legend: {
							position: 'right',
							display: false,
						},
						scales: {
							xAxes: [{
								scaleLabel: {
									display: false,
									labelString: 'Day'
								}
				}],
							yAxes: [{
								type: 'linear',
								ticks: {
									lineheight: 3,
									min: 0,
								},
								scaleLabel: {
									labelString: 'Value'
								}
				}]
						}
					};

					myBarChart = new Chart(ctx, options);


				});

	};

	

// ..........................................................................
//
// make one Regional dasboard card 
//
// ..........................................................................

addItalianCards = function (id, feed, name) {

	var __getArrow = function (last, before) {
		return (last == before) ? "fa-arrow-right" : ((last < before) ? "fa-arrow-down" : "fa-arrow-up");
	};
	var __getArrowColor = function (last, before) {
		return (last == before) ? "black" : ((last < before) ? "green" : "red");
	};

	var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv";
	var mydata2 = Data.feed({
		"source": szUrl,
		"type": "csv"
	}).load(function (data) {

		var set1 = data.column("dimessi_guariti").values();
		var set2 = data.column("isolamento_domiciliare").values();
		var set3 = data.column("ricoverati_con_sintomi").values();
		var set4 = data.column("terapia_intensiva").values();
		var set5 = data.column("deceduti").values();

		var last = set1.length - 1;
		var totale = (Number(set1[last]) + Number(set2[last]) + Number(set3[last]) + Number(set4[last]) + Number(set5[last]));
		var totale_1 = (Number(set1[last - 1]) + Number(set2[last - 1]) + Number(set3[last - 1]) + Number(set4[last - 1]) + Number(set5[last - 1]));
		var totale_2 = (Number(set1[last - 2]) + Number(set2[last - 2]) + Number(set3[last - 2]) + Number(set4[last - 2]) + Number(set5[last - 2]));
		var diff_1 = totale - totale_1;
		var diff_2 = totale_1 - totale_2;
		var szArrow = __getArrow(diff_1, diff_2);
		var szArrowColor = __getArrowColor(diff_1, diff_2);

		$("#dynamic-totale").html("<span class='pull-left'>" + __formatValue(totale,0) + " </span><span class='pull-right' style='font-size:0.7em;padding-top:0.5em;'><br><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(diff_2,0) + ")</span> +" + __formatValue(diff_1,0) + " <i class='icon fa " + szArrow + "' style='color:" + szArrowColor + "'></i></span> ");

		var totale = (Number(set3[last]));
		var totale_1 = (Number(set3[last - 1]));
		var totale_2 = (Number(set3[last - 2]));
		var diff_1 = totale - totale_1;
		var diff_2 = totale_1 - totale_2;
		var szArrow = __getArrow(diff_1, diff_2);
		var szArrowColor = __getArrowColor(diff_1, diff_2);

		$("#dynamic-ospitalizati").html("<span class='pull-left'>" + __formatValue(totale,0) + " </span><span class='pull-right' style='font-size:0.7em;padding-top:0.5em;'><br><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(diff_2,0) + ")</span> +" + __formatValue(diff_1,0) + " <i class='icon fa " + szArrow + "' style='color:" + szArrowColor + "'></i></span> ");

		var totale = (Number(set4[last]));
		var totale_1 = (Number(set4[last - 1]));
		var totale_2 = (Number(set4[last - 2]));
		var diff_1 = totale - totale_1;
		var diff_2 = totale_1 - totale_2;
		var szArrow = __getArrow(diff_1, diff_2);
		var szArrowColor = __getArrowColor(diff_1, diff_2);
		$("#dynamic-intensiva").html("<span class='pull-left'>" + __formatValue(totale,0) + " </span><span class='pull-right' style='font-size:0.7em;padding-top:0.5em;'><br><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(diff_2,0) + ")</span> +" + __formatValue(diff_1,0) + " <i class='icon fa " + szArrow + "' style='color:" + szArrowColor + "'></i></span> ");

		var totale = (Number(set1[last]));
		var totale_1 = (Number(set1[last - 1]));
		var totale_2 = (Number(set1[last - 2]));
		var diff_1 = totale - totale_1;
		var diff_2 = totale_1 - totale_2;
		var szArrow = __getArrow(diff_1, diff_2);
		var szArrowColor = __getArrowColor(diff_2, diff_1);

		$("#dynamic-dismessi").html("<span class='pull-left'>" + __formatValue(totale,0) + " </span><span class='pull-right' style='font-size:0.7em;padding-top:0.5em;'><br><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(diff_2,0) + ")</span> +" + __formatValue(diff_1,0) + " <i class='icon fa " + szArrow + "' style='color:" + szArrowColor + "'></i></span> ");


	});

};

$(function () {
	
	// --------------------------------------------
	// --------------------------------------------
	//
	//   P r o v i n v e   -    L i s t
	//
	// --------------------------------------------
	// -------------------------------------------
	
	var data = null;
	var dataPop = null;
			
	// ..........................................................
	// local helper
	// ..........................................................

	var __getArrow = function (last, before) {
		return (last == before) ? "fa-arrow-right" : ((last < before) ? "fa-arrow-down" : "fa-arrow-up");
	};
	var __getArrowColor = function (last, before) {
		return (last == before) ? "black" : ((last < before) ? "green" : "red");
	};

	makeProvinceList = function (provinceFilterA) {

		var timeO = 0;
		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {

				data = dataA[0];
				dataPop = dataA[1];

				// clip time from date
				data.column("data").map(function (value) {
					return value.split(" ")[0];
				});

				// make pivot table with columns per day
				var pivot = data.pivot({
					lead: "codice_provincia",
					columns: "data",
					value: "totale_casi",
					keep: ["lat", "long", "denominazione_provincia"]
				});

				// remove 'Total' column
				pivot.column("Total").remove();

				// remove rows with 'In fase di definizione/aggiornamento'
				pivot = pivot.select("WHERE denominazione_provincia NOT \"In fase di definizione/aggiornamento\" AND denominazione_provincia NOT \"Fuori Regione / Provincia Autonoma\" ");

				// get the columns with data 
				var columns = pivot.columnNames();
				var nLastC = columns.length - 1;
				var szlast = columns[columns.length - 1];
				var szlast1 = columns[columns.length - 2];
				var szlast2 = columns[columns.length - 3];

				// make lookupArray: COD_PROV ==> population
				var popA = dataPop.lookupArray("Value", "COD_PROV");

				// make prevalenza :
				pivot.addColumn({
					destination: "prevalenza"
					}, function (row) {
						return (Number(row[nLastC]) / popA[Number(row[0])] * 100000).toFixed(1);
					});

				// make last diff :
				pivot.addColumn({
					destination: "diff24h"
					}, function (row) {
						return Number(row[nLastC]) - Number(row[nLastC - 1]);
					});

				pivot.addColumn({
					destination: "diff24hmean"
					}, function (row) {
						return (
						(Number(row[nLastC]) + Number(row[nLastC - 1]) + Number(row[nLastC - 2])) / 3 -
						(Number(row[nLastC - 1]) + Number(row[nLastC - 2]) + Number(row[nLastC - 3])) / 3
						);
					});

				pivot.addColumn({
					destination: "diff7gg"
					}, function (row) {
						return (
						Number(row[nLastC]) - Number(row[nLastC - 6])
						);
					});

				var diff24hIndex = pivot.column("diff24h").index;
				// make incidenza 
				pivot.addColumn({
					destination: "incidenza"
					}, function (row) {
						return (Number(row[diff24hIndex]) / popA[Number(row[0])] * 100000).toFixed(1);
					});

				var diff24hIndex = pivot.column("diff24hmean").index;
				// make incidenza 
				pivot.addColumn({
					destination: "incidenzamean"
					}, function (row) {
						return (Number(row[diff24hIndex]) / popA[Number(row[0])] * 100000).toFixed(2);
					});
					
				var diff7ggIndex = pivot.column("diff7gg").index;
				// make incidenza 
				pivot.addColumn({
					destination: "incidenza7gg"
					}, function (row) {
						return (Number(row[diff7ggIndex]) / popA[Number(row[0])] * 100000).toFixed(2);
					});

				var diff24hIndex = pivot.column("diff24hmean").index;
				// make incidenza 
				pivot.addColumn({
					destination: "incidenzasort"
					}, function (row) {
						return (Number(row[diff24hIndex]) / popA[Number(row[0])] * 10000).toFixed(2);
					});

				// sort by last value 
				pivot = pivot.sort("incidenzasort");
				var nIncidenzaA = pivot.column("incidenza7gg").values();
				var nPrevalenzaA = pivot.column("prevalenza").values();

				// get arrays with values 
				var provcodeA = pivot.column("codice_provincia").values();
				var provinceA = pivot.column("denominazione_provincia").values();
				var nCasiA = pivot.column(szlast).values();
				var nCasi1 = pivot.column(szlast1).values();
				var nCasi2A = pivot.column(szlast2).values();
                var nDiffA  = pivot.column("diff24h").values();

				var szHtml = "";
				szHtml += "<div style='line-height:1em'>";

				szHtml += "<table>";

				szHtml += "<thead>";
				szHtml += "<tr style='background:white;font-size:1.5em;line-height:2em'><td style='min-width:200px'>Provincia</td><td  style='min-width:200px'>casi</td><td style='min-width:200px'>prevalenza</td><td style='min-width:100px'>incidenza &darr;</td><td style='min-width:100px'>tendenza</td></tr>";
				szHtml += "</thead>";

				szHtml += "<tbody style='height:650px;overflow:auto'>";
					
				if (typeof(provinceFilterA)=="string"){
					provinceFilterA = provinceFilterA.split(",");
					provinceLookUpA = [];
					for ( i in provinceFilterA ){
						if (provinceFilterA[i].length){
							provinceLookUpA[provinceFilterA[i]] = true;
						}
					}
				}	

				for (var i = provinceA.length - 1; i >= 0; i--) {

					if ( (i < (provinceA.length-5)) && provinceLookUpA && Object.keys(provinceLookUpA).length && !provinceLookUpA[provinceA[i]]) {
						if ( i == (provinceA.length-6) ){
							szHtml += "<tr><td>...</td></tr>";
						}
						continue;
					}
					var szOnOver = "$(this).css(\"border-bottom\",\"solid black 1px\"); ixmaps.highlightThemeItems(null,null,\""+String(provcodeA[i])+"\",\",\")";
					var szOnOut  = "$(this).css(\"border-bottom\",\"solid #ddd 1px\");ixmaps.highlightThemeItems(null,null,\"\")";
					
					szHtml += "<tr style='font-size:1.3em;border-bottom:solid #ddd 1px' onmouseover='"+szOnOver+"' onmouseout='"+szOnOut+"'>";
					
					var szId = provinceA[i].replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");

					// make background color from prevalence
					var color = "#fff8f8";
					if (nPrevalenzaA[i] > 50) {
						color = "#fff8f8";
					}
					if (nPrevalenzaA[i] > 100) {
						color = "#ffeeee";
					}
					if (nPrevalenzaA[i] > 200) {
						color = "#ffdddd";
					}
					if (nPrevalenzaA[i] > 400) {
						color = "#ffcccc";
					}
					if (nPrevalenzaA[i] > 750) {
						color = "#ffbbbb";
					}
					if (nPrevalenzaA[i] > 1000) {
						color = "#ffaaaa";
					}

					szHtml += "<td style='background:" + color + "'>" + provinceA[i] + "</td>";
					szHtml += "<td style='background:" + color + "'>" + nCasiA[i] + " (+" + nDiffA[i] +")</td>";
					szHtml += "<td style='background:" + color + "'><b>" + nPrevalenzaA[i] + "</b> /<span style='color:#88s6666'>100.000</span></td>";
//					szHtml += "<td style='font-size:1.2em;color:#dd0088;padding-left:1em'><b>" + nIncidenzaA[i] + "</b> <span style='color:#dddddd'>/ 100.000</span></td>";

					szHtml += "<td style='font-size:1.3em;color:#dd0088;padding-left:1em'><b>" + nIncidenzaA[i] + "</b></td>";
					var szArrow = __getArrow(nCasiA[i] - nCasi1[i], nCasi1[i] - nCasi2A[i]);
					var szArrowColor = __getArrowColor(nCasiA[i] - nCasi1[i], nCasi1[i] - nCasi2A[i]);

					szHtml += "<td style='padding-left:1em'>&nbsp;<i class='icon fa " + szArrow + "' style='color:" + szArrowColor + "'></i></td>";

					szHtml +=
						"<td id=\"small-dynamic-province-" + szId + "\" class=\"title data-dynamic\" data-path=\"data::albopop::" + provinceA[i] + "\">--</td>";
					setTimeout("addSmallProvinceCurve(\"" + szId + "\",\"" +provcodeA[i] + "\",\"" + provinceA[i] + "\")", timeO);
					timeO += 10;
					
					
					
					szHtml += "</tr>";
				}
				szHtml += "</tbody>";
				szHtml += "</table>";
				szHtml += "</div>";

				$("#province-list").html(szHtml);

			});
	};
	
	
	// ..........................................................................
	// make one Province Curve 
	// ..........................................................................

	addSmallProvinceCurve = function (prov_id, prov_code, prov_name) { 

		// using tables loaded by the calling function
		//
		// data = dataA[0];
		// dataPop = dataA[1];

		// make lookupArray: COD_PROV ==> population
		var popA = dataPop.lookupArray("Value", "COD_PROV");

		// clip time from date
		data.column("data").map(function (value) {
			return value.split(" ")[0];
		});

		// make pivot table with columns per day
		var pivot = data.pivot({
			lead: "data",
			columns: "denominazione_provincia",
			value: "totale_casi",
			keep: []
		});

		// ..........................................................
		//
		// 1. loop over data request and set value into card templates
		//
		// ..........................................................

		var small_curve_options = {
			animation: {
				duration: 0
			},
			responsive: true,
			legend: {
				position: 'bottom',
				display: false,
			},
			hover: {
				mode: 'index'
			},
			scales: {
				xAxes: [{
					display: false,
					scaleLabel: {
						display: false,
						labelString: 'Day'
					}
				}],
				yAxes: [{
					display: false,
					ticks: {
						min: -1,
						max: 6
					},
					scaleLabel: {
						display: false,
						labelString: 'Value'
					}
				}]
			},
			title: {
				display: false,
				text: 'Chart.js Line Chart - Legend'
			}
		};

		var dateA = pivot.column("data").values();
		var daysA = pivot.column(prov_name).values();

		// make increments, mean of 3
		//	
		var last = 	daysA.length;
		for ( var i=0; i<last-1; i++ ){
			daysA[i] = (daysA[i+1]+daysA[i+2]+daysA[i+3])/3 - (daysA[i+0]+daysA[i+1]+daysA[i+2])/3;
			daysA[i] = daysA[i] / popA[Number(prov_code)] * 10000;
		}	
		daysA.pop();
		daysA.pop();
		daysA.pop();

		dateA.pop();
		dateA.pop();
		dateA.pop();

		daysA = daysA.slice(-28);	
		dateA = dateA.slice(-28);	

		// make curve	

		var chart = "<div style='max-width:60px;width:80%;margin-top:2px;'><canvas id='small-Province-" + prov_id + "-line-chart'></canvas></div>";
		$("#small-dynamic-province-" + prov_id).html(chart);

		// make curve
		// -------------------------------------
		var canvas = $('#small-Province-' + prov_id + '-line-chart').get(0);
		if (canvas){
			var ctx = canvas.getContext('2d');

			myLineChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: dateA,
					datasets: [{
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderWidth: 2,
						borderColor: "rgba(255,0,0,1)",
						backgroundColor: "rgba(160,160,160,0.2)",
						pointRadius: 0,
						lineTension: 1
					}]
				},
				options: small_curve_options
			});
		}

	};
	
});

$(function () {

	// --------------------------------------------
	//
	// small regional cards 
	//
	// --------------------------------------------

	__feedReadCount = 0;
	__feedFilterValue = "";

	makeSmallRegionList = function (szFilter) { 

		__feedFilterValue = szFilter;
		__feedReadCount = 0;

		var timeO = 0;
		var szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log(e)
			})
			.load(function (mydata) {

				// sort by latitude, get list of region names, and get northern regions firts
				var feedA = mydata.condense("denominazione_regione").sort("variazione_totale_positivi").column("denominazione_regione").values().reverse();

				var szHtml = "<div style='overflow:auto' >";
				szHtml += "<table class='region-list' style='text-align:right' >";
				szHtml += "<tr style='text-align:left;'>";
				szHtml += "<th></th>";
				szHtml += "<th colspan='3'>positivi</th>";
				szHtml += "<th colspan='3'>ospedalizzati</th>";
				szHtml += "<th colspan='3'>terapia intensiva</th>";
				szHtml += "<th colspan='3'>decessi</th>";
				szHtml += "<th colspan='3'>tamponi</th>";
				szHtml += "</tr>";
				szHtml += "<tr style='text-align:left;'>";
				szHtml += "<th>Regione</th>";
				szHtml += "<th></th><th style='color:#ddd'>oggi</th><th style='color:#ddd'>ieri</th>";
				szHtml += "<th></th><th style='color:#ddd'>oggi</th><th style='color:#ddd'>ieri</th>";
				szHtml += "<th></th><th style='color:#ddd'>oggi</th><th style='color:#ddd'>ieri</th>";
				szHtml += "<th></th><th style='color:#ddd'>oggi</th><th style='color:#ddd'>ieri</th>";
				szHtml += "<th></th><th style='color:#ddd'>oggi</th><th style='color:#ddd'>ieri</th>";
				szHtml += "</tr>";
				
				$("#FeedCount").html(feedA.length);

				for (i in feedA) {

					var feed = feedA[i];
					var comuneA = feed.split("/");
					var comune = comuneA.pop();
					var idComune = comune.replace(/\ /g, "").replace(/\'/g, "").replace(/\./g, "");

					szHtml +=
						"<tr id=\"small-row-values-" + idComune + "\" >" +
						"</tr>" +
						"<span style='display:none'>"+setTimeout("addSmallRegionRow(\"" + idComune + "\",\"" + feed + "\",\"" + comune + "\")", timeO)+"</span>";
					timeO += 100;
				}

				szHtml += "</table>";
				szHtml += "</div>";
				
				$("#SmallRegionList").html(szHtml);

				$("#loading").hide();

			});
	};

	// ..........................................................................
	//
	// make one small Regional dasboard card 
	//
	// ..........................................................................

	addSmallRegionRow = function (id, feed, name) {

		// correct wrong feed source for "Cerreto D'Esi", must be "Cerreto d'Esi"
		feed = feed.replace("Cerreto D", "Cerreto d");

		// get one rss AlboPop feed 
		// ------------------------------------
		szUrl = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv";
		var myfeed = Data.feed({
				"source": szUrl,
				"type": "csv"
			})
			.error(function (e) {
				console.log("load error:" + e.status + " - " + szUrl)
			})
			.load(function (mydata) {

				__feedReadCount++;
				$("#FeedReadCount").html(__feedReadCount);

				// filter records if filter is defined
				// ------------------------------------
				if (__feedFilterValue && __feedFilterValue.length) {
					var mydata = mydata.select("WHERE denominazione_regione like " + __feedFilterValue);
				}

				mydata = mydata.select("WHERE denominazione_regione = \"" + name + "\"");

				// ..........................................................
				//
				// 1. loop over data request and set value into card templates
				//
				// ..........................................................

				var idComune = id;


				var records = mydata.table.records;

				mydata.column('data').map(function (value) {
					return value.split(' ')[0];
				});

				var datasetA = [];	
				
				
				// deceduti 
				// --------------------------------------------------------------
				var daysA = mydata.column("deceduti").values();
				records = daysA[daysA.length - 1];
				//var max = Number(records);

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(160,160,160,1)",
						backgroundColor: "rgba(160,160,160,0.7)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				

				// positivi 
				// -----------------------------------------------------------
				var daysA = mydata.column("totale_positivi").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(120,160,250,1)",
						backgroundColor: "rgba(120,160,250,0.3)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				
				
				// dimessi_guariti 
				// ----------------------------------------------------------------
				var daysA = mydata.column("dimessi_guariti").values();
				records = daysA[daysA.length - 1];
				//var max = Number(records);

				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2]
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				/**
				for (i = 0; i < daysA.length - 3; i++) {
					daysA[i] = (Number(daysA[i])+Number(daysA[i+1])+Number(daysA[i+2]))/3;
				}
				daysA.pop();
				daysA.pop();
				**/
				/**
				for (i = 0; i < daysA.length - 1; i++) {
					daysA[i] = Math.log(daysA[i]);
				}
				**/
				daysA.pop();

				var dateA = mydata.column("data").values();
				dateA.pop();

				datasetA.push({
						label: "My First dataset",
						data: daysA,
						fill: true,
						borderColor: "rgba(120,220,100,1)",
						backgroundColor: "rgba(120,220,100,0.2)",
						pointRadius: 0,
						lineTension: 0
				});
				// --------------------------------------------------------------
				

				var small_curve_options = {
					animation:{
						duration: 1
					},
					responsive: true,
					legend: {
						position: 'bottom',
						display: false,
					},
					hover: {
						mode: 'index'
					},
					scales: {
						xAxes: [{
							display: false,
							scaleLabel: {
								display: false,
								labelString: 'Day'
							}
						}],
						yAxes: [{
               				//stacked: true,
							display: false,
							ticks: {
								//max: max,
								min: 0,
							},
							scaleLabel: {
								display: false,
								labelString: 'Value'
							}
						}]
					},
					title: {
						display: false,
						text: 'Chart.js Line Chart - Legend'
					}
				};
				// display sum, last 28, trend arrow 
				// -------------------------------------
				var chart = "<div style='width:100%;margin-top:2px;'><canvas id='small-row-" + idComune + "-line-chart'></canvas></div>";
				$("#small-dynamic-row-" + idComune).html(chart);

				$("#small-row-" + idComune).show();

				// make curve
				// -------------------------------------
				var canvas = $('#small-row-' + idComune + '-line-chart').get(0);
				if (canvas){
					var ctx = canvas.getContext('2d');

					myLineChart = new Chart(ctx, {
						type: 'line',
						data: {
							labels: dateA,
							datasets: datasetA
						},
						options: small_curve_options
					});
					// ------------------------------
				}
				
				szHtml = "";
				szHtml += "<td style='text-align:left;font-size:1.2em'>";
				szHtml += id;
				szHtml += "</td>";

				// positivi 
				// -----------------------------------------------------------
				var daysA = mydata.column("totale_positivi").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var abs = daysA[daysA.length - 1];
				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2];
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];

				szHtml += "<td style='color:white;background-color:rgb(100,160,220)'title='positivi'>";
				szHtml += abs;
				szHtml += "</td><td style='font-weight:bold;color:rgb(100,160,220)'>";
				szHtml += (last>0?"+":"")+last;
				szHtml += "</td>";
				szHtml += "<td style='color:rgb(175,175,175)'>"
				szHtml += (before>0?"(+":"(")+ before +")";
				szHtml += "</td>";
				
				// ospedalizzati 
				// -----------------------------------------------------------
				var daysA = mydata.column("totale_ospedalizzati").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var abs = daysA[daysA.length - 1];
				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2];
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				szHtml += "<td style='color:white;background-color:rgb(34,167,240)'title='ospedalizzati'>";
				szHtml += abs;
				szHtml += "</td><td style='font-weight:bold;color:rgb(34,167,240)'>";
				szHtml += (last>0?"+":"")+last;
				szHtml += "</td>";
				szHtml += "<td style='color:rgb(175,175,175)'>"
				szHtml += (before>0?"(+":"(")+ before +")";
				szHtml += "</td>";

				// terapia_intensiva 
				// -----------------------------------------------------------
				var daysA = mydata.column("terapia_intensiva").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var abs = daysA[daysA.length - 1];
				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2];
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				szHtml += "<td style='color:white;background-color:rgb(255,180,0)' title='terapia_intensiva'>";
				szHtml += abs;
				szHtml += "</td><td style='font-weight:bold;color:rgb(255,180,0)'>";
				szHtml += (last>0?"+":"")+last;
				szHtml += "</td>";
				szHtml += "<td style='color:rgb(175,175,175)'>"
				szHtml += (before>0?"(+":"(")+ before +")";
				szHtml += "</td>";

				// deceduti 
				// -----------------------------------------------------------
				var daysA = mydata.column("deceduti").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var abs = daysA[daysA.length - 1];
				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2];
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				szHtml += "<td style='color:white;background-color:rgb(128,128,128)' title='deceduti'>";
				szHtml += abs;
				szHtml += "</td><td style='font-weight:bold;color:rgb(128,128,128)'>";
				szHtml += (last>0?"+":"")+last;
				szHtml += "</td>";
				szHtml += "<td style='color:rgb(175,175,175)'>"
				szHtml += (before>0?"(+":"(")+ before +")";
				szHtml += "</td>";

				// tamponi 
				// -----------------------------------------------------------
				var daysA = mydata.column("tamponi").values();
				records = daysA[daysA.length - 1];
				var max = Number(records)*1.4;

				var abs = daysA[daysA.length - 1];
				var last = daysA[daysA.length - 1] - daysA[daysA.length - 2];
				var before = daysA[daysA.length - 2] - daysA[daysA.length - 3];
				
				szHtml += "<td style='color:white;background-color:rgb(220,220,220)' title='tamponi'>";
				szHtml += abs;
				szHtml += "</td><td style='font-weight:bold;color:rgb(220,220,220)'>";
				szHtml += (last>0?"+":"")+last;
				szHtml += "</td>";
				szHtml += "<td style='color:rgb(175,175,175)'>"
				szHtml += (before>0?"(+":"(")+ before +")";
				szHtml += "</td>";

				console.log(szHtml);	
				$("#small-row-values-" + idComune).html(szHtml);
				

			});

	};
	
});
	
	// ==============================================================
	//
	// finally animate the dashboard and start loading data
	//
	// ==============================================================
	
	var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

	var broker = new Data.Broker()
		.addSource(szUrl1, "csv")
		.realize(
			function (dataA) {

				var dataPop = dataA[0];

					// correct region names in population table
				dataPop.column("Territorio").map(function (value) {
					if (value == "Provincia Autonoma Bolzano / Bozen") {
						return "P.A. Bolzano";
					} else
					if (value == "Provincia Autonoma Trento") {
						return "P.A. Trento";
					} else {
						return value.split(" /")[0].replace(/-/, " ");
					}
				});
				var pop = [];
				var terrA = dataPop.column("Territorio").values();
				var popA = dataPop.column("Value").values();
				for (var i = 0; i < terrA.length; i++) {
					pop[terrA[i]] = popA[i];
				}
				// export pop table	
				__regionPop = pop;
				
				makeSmallRegionalCards("");
				makeProvinceList("");
				makeSmallRegionList("");
				makeRegionCurves(true);
				makeRegionCurves_actives(false);
				makeRegionCurves_percentuali(false);
			
			});

});
