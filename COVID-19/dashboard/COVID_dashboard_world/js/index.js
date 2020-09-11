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
 				szHtml += "<option selected='true' value='Italia'  style='font-size:1em;padding:0.5em 0'>Italia</option>";

				for (i in countriesA) {
					if (0 && (countriesA[i] == "Italy")) {
						szHtml += "<option selected='true' value='" + countriesA[i] + "'>" + countriesA[i] + "</option>";
					} else {
						szHtml += "<option style='font-size:0.6em' value=\"" + countriesA[i] + "\">" + countriesA[i] + "</option>";
					}
				}
	
				szHtml += "</select>";
				szHtml += "</span>";
				
				$("#select-country").html(szHtml);
			});
	};
	
	getRegionNames();	
	
	
	
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
			"Active",
			"Recovered",
			"Deaths",
		]
		var colorA = [
			"100, 160, 220",
			"155, 200, 100",
			"128,128,128"
		]
		var colorClassA = [
			"red",
			"blue",
			"yellow",
			"green",
			"red",
			"black",
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
				"<i class=\"icon fa fa-none fa-4x\"></i><span style=\"font-size:1.5em;vertical-align:60%\">&nbsp;" + title + " </span>" +
				"<div class=\"content\">" +
				"<div id=\"dynamic-" + idFeed + "\" class=\"title data-dynamic\" data-path=\"data::albopop::" + idFeed + "\">--</div>";
			
			if (feed != "tamponi") {
				szHtml += 
					"<div class=\"sub-title data-dynamic\" style=\"color:#888;margin-top:-1.5em\">variazione giornaliera</div>";
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

	};
			
	// ..........................................................................
	//
	// popolate one trend card 
	//
	// ..........................................................................
	
	addItalyCard = function (id, feed, filter, color) {
		
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
		var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
		
		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				
				function (dataA) {

					var idCard = id;
					var title = feed.replace(/\_/g, " ");
					
					for ( i=0; i<3; i++ ){
						dataA[i].addColumn({destination:"key"},function(row){return "dummy";});
						dataA[i] = dataA[i].condense("key");
						dataA[i].column("key").remove();
					}
					
					data_Confirmed = dataA[0];
					data_Recovered = dataA[1];
					data_Deaths = dataA[2];
					
					// get data columns
					var columnsA = data_Confirmed.columnNames();
					
					var data = null;
					
					if ( feed == "Active" ){
						// avìctive are: confirmed - recovered - deaths
						data = data_Confirmed;	
						var records = data.records[0];
						for ( var c=4; c<records.length; c++ ){
							records[c] = Number(records[c]) - Number(data_Recovered.records[0][c]) - Number(data_Deaths.records[0][c]);
						}
					}else
					if ( feed == "Confirmed" ){
						data = data_Confirmed;	
					}else
					if ( feed == "Recovered" ){
						data = data_Recovered;			
					}else
					if ( feed == "Deaths" ){
						data = data_Deaths;			
					}
					
					var dateA = data.columnNames();
					dateA.shift();
					dateA.shift();
					dateA.shift();
					dateA.shift();
					
					var records = data.records;
				
					var max = 100000;
					if ( feed == "Deaths" ){
						max = 20000;
					}
					if ( feed == "Recovered" ){
						max = 500000;
					}
					var values = records[0].slice(); 
					var last = values.pop();
					var before = Number(values.pop());
					var bbefore = Number(values.pop());
					
					var last_diff = last-before;
					//max = Math.ceil(Number(last_diff)/700)*1000;
				
					var recordsA = records[0].slice();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					recordsA.shift();
					
					recordsA = recordsA.map(function (value) {
						return Number(value);
					});
					var last = recordsA.length - 1;
					actvalue = recordsA[last];
				
					var fMean3 = true;		
					if (fMean3){
						var mean3 = (recordsA[last-0] + recordsA[last-1] + recordsA[last-2]) / 3;
						var mean2 = (recordsA[last-1] + recordsA[last-2] + recordsA[last-3]) / 3;
						var mean1 = (recordsA[last-2] + recordsA[last-3] + recordsA[last-4]) / 3;

						var lastdiff = mean3 - mean2;
						var beforediff = mean2 - mean1;

						if (1) {
							for (i = 0; i < recordsA.length - 3; i++) {
								recordsA[i] = (recordsA[i+1]+recordsA[i+2]+recordsA[i+3])/3 -  (recordsA[i+0]+recordsA[i+1]+recordsA[i+2])/3;
							}
						}
						recordsA.pop();
						recordsA.pop();
						recordsA.pop();

						dateA.pop();
						dateA.pop();
						dateA.pop();
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
									max: max,
									min: -2,
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
					if (feed.match(/Recovered/)) {
						var szArrowColor = __getArrowColor(beforediff, lastdiff);
					}
					var nPercent = (lastdiff/beforediff*100-100).toFixed(1);
						nPercent = ((nPercent>0)?"+":"") + nPercent;
					var chart = "<div style='width:80%;margin-top:2px;margin-bottom:10px'><canvas id='" + idCard + "-line-chart'></canvas></div>";

					if (feed != "tamponi") {
						$("#dynamic-" + idCard).html(
						"<span class='pull-left' style='float:left;color:white;background:rgba(" + color + ",1);padding:0 0.3em;border-radius:0.1em')>" + __formatValue(actvalue, 0) + "</span><br><span class='pull-right' style='font-size:0.7em;padding-top:0em;'><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(Math.abs(beforediff), 0) + ")</span>  <span style='color:rgba(" + color + ",1)'>+" + __formatValue(Math.abs(lastdiff), 0) + "</span> <i class='icon fa " + szArrow + "' style='color:" + szArrowColor + ";font-size:0.6em'></i><span style='font-size:0.5em'><br>"+nPercent+"%</span></span>" + ((feed != "tamponi") ? chart : ""));
					} else {
						$("#dynamic-" + idCard).html(
						"<span class='pull-left' >" + __formatValue(actvalue, 0) + " </span><br><span class='pull-right' style='font-size:0.7em;padding-top:0em;'><span style='font-size:0.5em;color:#aaaaaa'>(+" + __formatValue(Math.abs(beforediff), 0) + ")</span>  <span style='color:rgba(" + color + ",1)'>+" + __formatValue(Math.abs(lastdiff), 0) + " </span><i class='icon fa " + szArrow + "' style='color:#888888'></i></span> ");
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

// ------------------------------------------
//
// graph 2 - barchart - situazione mondiale
//
// ------------------------------------------

$(function () {

	var data_Confirmed = null;
	var data_Recovered = null;
	var data_Deaths = null;

	var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
	var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
	var szUrl3 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

	var broker = new Data.Broker()
		.addSource(szUrl1, "csv")
		.addSource(szUrl2, "csv")
		.addSource(szUrl3, "csv")
		.realize(
			function (dataA) {

				data_Confirmed = dataA[0];
				data_Recovered = dataA[1];
				data_Deaths = dataA[2];

				// get the countries

				var countriesA = __getUniqueValues(data_Confirmed.column("Country/Region").values()).sort();

				szHtml = "<span style='font-size:0.8em'>";
				szHtml += "<select onChange='situazione_country(this.value)'>";
				for (i in countriesA) {
					if (0 && (countriesA[i] == "Italy")) {
						szHtml += "<option selected='true' value='" + countriesA[i] + "'>" + countriesA[i] + "</option>";
					} else {
						szHtml += "<option value='" + countriesA[i] + "'>" + countriesA[i] + "</option>";
					}
				}
				szHtml += "<option selected='true' value='*'>World</option>";

				szHtml += "</select>";
				$("#select-country").html(szHtml);
				szHtml += "/<span>";

				var row = data_Confirmed.columnNames();

				$("#data_mondo").html(new Date(row[row.length - 1]).toLocaleDateString());

				situazione_country("*");

				situazione_country("Italy", "bar-chart-situazione-italia");

			});


	/**
	 * situazione_country - create countruìy bar chart
	 * @param szName country name
	 * @void
	 */
	situazione_country = function (szName, szTarget) {

		szTarget = szTarget || "bar-chart-situazione-mondiale";

		// remake canvas to clear it	
		$('#bar-chart-situazione-mondiale').parent().html('<canvas id="bar-chart-situazione-mondiale" class="chart"></canvas>');
		setTimeout("do_situazione_country('" + szName + "','" + szTarget + "')", 100);
	}

	/**
	 * do_ssituazione_country - create countruìy bar chart
	 * @param szName country name
	 * @void
	 */
	do_situazione_country = function (szName, szTarget) {

		szTarget = szTarget || "bar-chart-situazione-mondiale";

		// get the label	

		var data = data_Confirmed;

		var columns = data.columnNames();

		columns.shift();
		columns.shift();
		columns.shift();
		columns.shift();

		// select country by szName	

		var dataA_0 = data_Confirmed.select('WHERE Country/Region = "' + szName + '"');
		var dataA_1 = data_Recovered.select('WHERE Country/Region = "' + szName + '"');
		var dataA_2 = data_Deaths.select('WHERE Country/Region = "' + szName + '"');

		// prepare data set confirmed	

		var records = dataA_0.records;
		var record = records[0].slice().map(Number);
		
		// make sure to only one data row; add records if we have selection like '*'
		if (1) {
			for (var r = 1; r < records.length; r++) {
				for (var c = 4; c < records[0].length; c++) {
					record[c] = Number(record[c]) + Number(records[r][c]);
				}
			}
		}
		record.shift();
		record.shift();
		record.shift();
		record.shift();

		var set1 = record;

		var max = set1[set1.length - 1];
		if (max < 20000) {
			max = 20000;
		}

		// prepare data set recovered	

		var records = dataA_1.records;
		var record = records[0].slice().map(Number);
		
		// make sure to only one data row; add records if we have selection like '*'
		if (1) {
			for (var r = 1; r < records.length; r++) {
				for (var c = 4; c < records[0].length; c++) {
					record[c] = Number(record[c]) + Number(records[r][c]);
				}
			}
		}
		record.shift();
		record.shift();
		record.shift();
		record.shift();

		var set2 = record;

		// prepare data set deaths	

		var records = dataA_2.records;
		var record = records[0].slice().map(Number);
		
		// make sure to only one data row; add records if we have selection like '*'
		if (1) {
			for (var r = 1; r < records.length; r++) {
				for (var c = 4; c < records[0].length; c++) {
					record[c] = Number(record[c]) + Number(records[r][c]);
				}
			}
		}
		record.shift();
		record.shift();
		record.shift();
		record.shift();

		var set3 = record;

		// make diff confirmed cases - recovered mto meet stacked bar 

		for (var i = 0; i < set2.length; i++) {
			set1[i] = set1[i] - set2[i] - set3[i];
		}

		// ok populate the graph

		var ctx, data, myBarChart, option_bars;
		Chart.defaults.global.responsive = true;
		ctx = $('#' + szTarget).get(0).getContext('2d');

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
			labels: columns,
			datasets: [
				{
					label: "decessi",
					backgroundColor: "rgba(95, 95, 95,0.7)",
					borderColor: "rgba(210,200,0,1)",
					borderWidth: 0,
					pointColor: "A4CDE8",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "#afaf88",
					data: set3
		  }, {
					label: "casi attivi",
					backgroundColor: "rgba(250, 42, 80,0.6)",
					borderColor: "rgba(210,200,0,1)",
					borderWidth: 0,
					pointColor: "A4CDE8",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "#afaf88",
					data: set1
		  }, {
					label: "dimessi guariti",
					backgroundColor: "rgba(95, 164, 86,0.8)",
					borderColor: "rgba(210,200,0,1)",
					borderWidth: 0,
					pointColor: "A4CDE8",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "#afaf88",
					data: set2
		  }
		]
		};
		options.options = {
			scales: {
				xAxes: [{
					stacked: true
			}],
				yAxes: [{
					stacked: true,
					ticks: {
						max: max,
						min: 0,
					},
			}]
			}
		};
		myBarChart = new Chart(ctx, options);

	};


});
