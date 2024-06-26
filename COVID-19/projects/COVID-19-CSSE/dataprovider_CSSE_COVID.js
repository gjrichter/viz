/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.CSSE_COVID_LAST_DAILY = function (theme, options) {

		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					szDate = date.toISOString();
					dateA = szDate.split("T")[0].split("-");
					szDate = dateA[1] + "-" + dateA[2] + "-" + dateA[0];

					new Data.Broker()
						.addSource(szUrl2 + szDate + ".csv", "csv")
						.realize(
							function (dataA) {

								var data = dataA[0];

								var iConfirmed = data.column("Confirmed").index;
								var iDeaths = data.column("Deaths").index;
								var iRecovered = data.column("Recovered").index;

								data.addColumn({
									destination: "Active_calc"
								}, function (row) {
									return (Number(row[iConfirmed]) -
										Number(row[iDeaths]) -
										Number(row[iRecovered])
									);
								});

								// --------------------------------------
								// deploy the data
								// --------------------------------------
								
								ixmaps.setData(data, {
									type: "dbtable",
									name: options.name
								});

						});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_7_DAILY = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					
					var lastDate = date.toLocaleDateString();
					
					szDate1 = date.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*7);
					szDate2 = date.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.realize(
							function (dataA) {
								
							// merge the two data tables	
								
							var merger = new Data.Merger();
							merger.addSource(dataA[0], {
								lookup: "Combined_Key",
								columns: dataA[0].columnNames()
							});
							merger.addSource(dataA[1], {
								lookup: "Combined_Key",
								columns: dataA[1].columnNames()
							});

							merger.realize(function (data) {

									var iConfirmed = data.column("Confirmed.1").index;
									var iDeaths = data.column("Deaths.1").index;
									var iRecovered = data.column("Recovered.1").index;
									var iIncident = data.column("Incident_Rate.1").index;
								
									var iConfirmed_7 = data.column("Confirmed.2").index;
									var iDeaths_7 = data.column("Deaths.2").index;
									var iRecovered_7 = data.column("Recovered.2").index;
									var iIncident_7 = data.column("Incident_Rate.2").index;
								
									// get Confirmed of last 7 days

									data.addColumn({
										destination: "Confirmed_7"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_7]));
									});
								
									// get Deaths of last 7 days
								
									data.addColumn({
										destination: "Deaths_7"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_7]));
									});
								
									// get Incidence of last 7 days
								
									data.addColumn({
										destination: "Incident_7"
									}, function (row) {
										return (Number(row[iIncident]) - Number(row[iIncident_7]));
									});

									// get pop 
								
									data.addColumn({
										destination: "pop"
									}, function (row) {
										return (Number(row[iConfirmed])/Number(row[iIncident]) *100000 );
									});
								
									var iDeaths_7 = data.column("Deaths_7").index;
									var ipop = data.column("pop").index;
								
									// get Deaths of last 7 days
								
									data.addColumn({
										destination: "Deaths_7_Incident"
									}, function (row) {
										return (Number(row[iDeaths_7]) / Number(row[ipop]) *100000);
									});

									data.column("Lat.1").rename("Lat");
									data.column("Long_.1").rename("Long_");
									data.column("Country_Region.1").rename("Country_Region");
									data.column("Case_Fatality_Ratio.1").rename("Case-Fatality_Ratio");
								
									ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
									
									// --------------------------------------
									// deploy the data
									// --------------------------------------

									options.setData(data, {
										type: "dbtable",
										name: options.name
									});

							});
					});
			});
	};
	

	ixmaps.CSSE_COVID_LAST_28_DAILY = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					
					var lastDate = date.toLocaleDateString();
					
					szDate1 = date.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate2 = date.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					szDate3 = "08-01-2020";
					
					szDate4 = "01-01-2021";
					

					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.addSource(szUrl2 + szDate3 + ".csv", "csv")
						.addSource(szUrl2 + szDate4 + ".csv", "csv")
						.realize(
							function (dataA) {
								
							// merge the two data tables	
								
							var merger = new Data.Merger();
							merger.addSource(dataA[0], {
								lookup: "Combined_Key",
								columns: dataA[0].columnNames()
							});
							merger.addSource(dataA[1], {
								lookup: "Combined_Key",
								columns: dataA[1].columnNames()
							});
							merger.addSource(dataA[2], {
								lookup: "Combined_Key",
								columns: dataA[2].columnNames()
							});
							merger.addSource(dataA[3], {
								lookup: "Combined_Key",
								columns: dataA[3].columnNames()
							});

							merger.realize(function (data) {

									var iConfirmed = data.column("Confirmed.1").index;
									var iDeaths = data.column("Deaths.1").index;
									var iRecovered = data.column("Recovered.1").index;
								
									var iConfirmed_28 = data.column("Confirmed.2").index;
									var iDeaths_28 = data.column("Deaths.2").index;
									var iRecovered_28 = data.column("Recovered.2").index;
								
									var iConfirmed_ref = data.column("Confirmed.3").index;
									var iDeaths_ref = data.column("Deaths.3").index;
									var iRecovered_ref = data.column("Recovered.3").index;

									var iConfirmed_ref_2 = data.column("Confirmed.4").index;
									var iDeaths_ref_2 = data.column("Deaths.4").index;
									var iRecovered_ref_2 = data.column("Recovered.4").index;

									// get Confirmed of last 28 days

									data.addColumn({
										destination: "Confirmed_28"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_28]));
									});
								
									// get Deaths of last 28 days
								
									data.addColumn({
										destination: "Deaths_28"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_28]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed = data.column("Confirmed_28").index;
									var iDeaths = data.column("Deaths_28").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_28"
									}, function (row) {
										if (Number(row[iConfirmed])){
											return (Number(row[iDeaths]) / Number(row[iConfirmed]) * 100);
										}else{
											return 0;
										}
									});
								
									// calcolate Case-Fatality_Ratio before this

									data.addColumn({
										destination: "Case-Fatality_Ratio_before_28"
									}, function (row) {
										if (Number(row[iConfirmed_28])){
											return (Number(row[iDeaths_28]) / Number(row[iConfirmed_28]) * 100);
										}else{
											return 0;
										}
									});

									// calcolate Case-Fatality_Ratio at ref date 08-01-2020

									data.addColumn({
										destination: "Case-Fatality_Ratio_08-01-2020"
									}, function (row) {
										if (Number(row[iConfirmed_ref])){
											return (Number(row[iDeaths_ref]) / Number(row[iConfirmed_ref]) * 100);
										}else{
											return 0;
										}
									});

									// calcolate Case-Fatality_Ratio at ref date 08-01-2021

									data.addColumn({
										destination: "Case-Fatality_Ratio_01-01-2021"
									}, function (row) {
										if (Number(row[iConfirmed_ref])){
											return (Number(row[iDeaths_ref_2]) / Number(row[iConfirmed_ref_2]) * 100);
										}else{
											return 0;
										}
									});
								
									// get Confirmed of last year
								
									data.addColumn({
										destination: "Confirmed_2021"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_ref_2]));
									});
								
									// get Deaths of last 28 days
								
									data.addColumn({
										destination: "Deaths_2021"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_ref_2]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed = data.column("Confirmed_2021").index;
									var iDeaths = data.column("Deaths_2021").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_2021"
									}, function (row) {
										if (Number(row[iConfirmed])){
											return (Number(row[iDeaths]) / Number(row[iConfirmed]) * 100);
										}else{
											return 0;
										}
									});

									data.column("Lat.1").rename("Lat");
									data.column("Long_.1").rename("Long_");
									data.column("Country_Region.1").rename("Country_Region");
									data.column("Case_Fatality_Ratio.1").rename("Case-Fatality_Ratio");
								
									ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
									
									// --------------------------------------
									// deploy the data
									// --------------------------------------

									options.setData(data, {
										type: "dbtable",
										name: options.name
									});

							});
					});
			});
	};
	
	ixmaps.CSSE_COVID_CASE_FATALITY_RATIO = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					
					var lastDate = date.toLocaleDateString();
					
					szDate1 = date.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate2 = date.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*56);
					szDate3 = date.toISOString();
					dateA = szDate3.split("T")[0].split("-");
					szDate3 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*180);
					szDate4 = date.toISOString();
					dateA = szDate4.split("T")[0].split("-");
					szDate4 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];

					szDate5 = "08-01-2020";
					
					szDate6 = "12-31-2020";

					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.addSource(szUrl2 + szDate3 + ".csv", "csv")
						.addSource(szUrl2 + szDate4 + ".csv", "csv")
						.addSource(szUrl2 + szDate5 + ".csv", "csv")
						.addSource(szUrl2 + szDate6 + ".csv", "csv")
						.realize(
							function (dataA) {
								
							// merge the two data tables	
								
							var merger = new Data.Merger();
							merger.addSource(dataA[0], {
								lookup: "Combined_Key",
								columns: dataA[0].columnNames()
							});
							merger.addSource(dataA[1], {
								lookup: "Combined_Key",
								columns: dataA[1].columnNames()
							});
							merger.addSource(dataA[2], {
								lookup: "Combined_Key",
								columns: dataA[2].columnNames()
							});
							merger.addSource(dataA[3], {
								lookup: "Combined_Key",
								columns: dataA[3].columnNames()
							});
							merger.addSource(dataA[4], {
								lookup: "Combined_Key",
								columns: dataA[4].columnNames()
							});
							merger.addSource(dataA[5], {
								lookup: "Combined_Key",
								columns: dataA[5].columnNames()
							});

							merger.realize(function (data) {

									var iConfirmed = data.column("Confirmed.1").index;
									var iDeaths = data.column("Deaths.1").index;
									var iRecovered = data.column("Recovered.1").index;
								
									var iConfirmed_28 = data.column("Confirmed.2").index;
									var iDeaths_28 = data.column("Deaths.2").index;
									var iRecovered_28 = data.column("Recovered.2").index;
								
									var iConfirmed_56 = data.column("Confirmed.3").index;
									var iDeaths_56 = data.column("Deaths.3").index;
									var iRecovered_56 = data.column("Recovered.3").index;

									var iConfirmed_180 = data.column("Confirmed.4").index;
									var iDeaths_180 = data.column("Deaths.4").index;
									var iRecovered_180 = data.column("Recovered.4").index;

									var iConfirmed_ref = data.column("Confirmed.5").index;
									var iDeaths_ref = data.column("Deaths.5").index;
									var iRecovered_ref = data.column("Recovered.4").index;

									var iConfirmed_ref_2020 = data.column("Confirmed.6").index;
									var iDeaths_ref_2020 = data.column("Deaths.6").index;
									var iRecovered_ref_2020 = data.column("Recovered.6").index;

									// get Confirmed of last 28 days

									data.addColumn({
										destination: "Confirmed_28"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_28]));
									});
								
									// get Deaths of last 28 days
								
									data.addColumn({
										destination: "Deaths_28"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_28]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed_calc = data.column("Confirmed_28").index;
									var iDeaths_calc = data.column("Deaths_28").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_28"
									}, function (row) {
										if (Number(row[iConfirmed_calc])){
											return (Number(row[iDeaths_calc]) / Number(row[iConfirmed_calc]) * 100);
										}else{
											return 0;
										}
									});
								
									// calcolate Case-Fatality_Ratio before this

									data.addColumn({
										destination: "Case-Fatality_Ratio_before_28"
									}, function (row) {
										if (Number(row[iConfirmed_28])){
											return (Number(row[iDeaths_28]) / Number(row[iConfirmed_28]) * 100);
										}else{
											return 0;
										}
									});

									// get Confirmed of last 56 days

									data.addColumn({
										destination: "Confirmed_56"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_56]));
									});
								
									// get Deaths of last 56 days
								
									data.addColumn({
										destination: "Deaths_56"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_56]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed_calc = data.column("Confirmed_56").index;
									var iDeaths_calc = data.column("Deaths_56").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_56"
									}, function (row) {
										if (Number(row[iConfirmed_calc])){
											return (Number(row[iDeaths_calc]) / Number(row[iConfirmed_calc]) * 100);
										}else{
											return 0;
										}
									});
								
									// calcolate Case-Fatality_Ratio before this

									data.addColumn({
										destination: "Case-Fatality_Ratio_before_56"
									}, function (row) {
										if (Number(row[iConfirmed_56])){
											return (Number(row[iDeaths_56]) / Number(row[iConfirmed_56]) * 100);
										}else{
											return 0;
										}
									});

									// get Confirmed of last 180 days

									data.addColumn({
										destination: "Confirmed_180"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_180]));
									});
								
									// get Deaths of last 180 days
								
									data.addColumn({
										destination: "Deaths_180"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_180]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed_calc = data.column("Confirmed_180").index;
									var iDeaths_calc = data.column("Deaths_180").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_180"
									}, function (row) {
										if (Number(row[iConfirmed_calc])){
											return (Number(row[iDeaths_calc]) / Number(row[iConfirmed_calc]) * 100);
										}else{
											return 0;
										}
									});
								
									// calcolate Case-Fatality_Ratio before this

									data.addColumn({
										destination: "Case-Fatality_Ratio_before_180"
									}, function (row) {
										if (Number(row[iConfirmed_180])){
											return (Number(row[iDeaths_180]) / Number(row[iConfirmed_180]) * 100);
										}else{
											return 0;
										}
									});
									// calcolate Case-Fatality_Ratio at ref date 08-01-2020

									data.addColumn({
										destination: "Case-Fatality_Ratio_08-01-2020"
									}, function (row) {
										if (Number(row[iConfirmed_ref])){
											return (Number(row[iDeaths_ref]) / Number(row[iConfirmed_ref]) * 100);
										}else{
											return 0;
										}
									});

									// calcolate Case-Fatality_Ratio at ref date 12-31-2020

									data.addColumn({
										destination: "Case-Fatality_Ratio_12-31-2020"
									}, function (row) {
										if (Number(row[iConfirmed_ref_2020])){
											return (Number(row[iDeaths_ref_2020]) / Number(row[iConfirmed_ref_2020]) * 100);
										}else{
											return 0;
										}
									});

									data.column("Lat.1").rename("Lat");
									data.column("Long_.1").rename("Long_");
									data.column("Country_Region.1").rename("Country_Region");
									data.column("Case_Fatality_Ratio.1").rename("Case-Fatality_Ratio");
								
									ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
									
									// --------------------------------------
									// deploy the data
									// --------------------------------------

									options.setData(data, {
										type: "dbtable",
										name: options.name
									});

							});
					});
			});
	};
	
	ixmaps.CSSE_COVID_LAST_56_DAILY = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					
					var lastDate = date.toLocaleDateString();
					
					szDate1 = date.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*56);
					szDate2 = date.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					

					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.realize(
							function (dataA) {
								
							// merge the two data tables	
								
							var merger = new Data.Merger();
							merger.addSource(dataA[0], {
								lookup: "Combined_Key",
								columns: dataA[0].columnNames()
							});
							merger.addSource(dataA[1], {
								lookup: "Combined_Key",
								columns: dataA[1].columnNames()
							});

							merger.realize(function (data) {

									var iConfirmed = data.column("Confirmed.1").index;
									var iDeaths = data.column("Deaths.1").index;
									var iRecovered = data.column("Recovered.1").index;
								
									var iConfirmed_56 = data.column("Confirmed.2").index;
									var iDeaths_56 = data.column("Deaths.2").index;
									var iRecovered_56 = data.column("Recovered.2").index;
								
									// get Confirmed of last 56 days

									data.addColumn({
										destination: "Confirmed_56"
									}, function (row) {
										return (Number(row[iConfirmed]) - Number(row[iConfirmed_56]));
									});
								
									// get Deaths of last 56 days
								
									data.addColumn({
										destination: "Deaths_56"
									}, function (row) {
										return (Number(row[iDeaths]) - Number(row[iDeaths_56]));
									});
								
									// calcolate Case-Fatality_Ratio from this
								
									var iConfirmed = data.column("Confirmed_56").index;
									var iDeaths = data.column("Deaths_56").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_56"
									}, function (row) {
										if (Number(row[iConfirmed])){
											return (Number(row[iDeaths]) / Number(row[iConfirmed]) * 100);
										}else{
											return 0;
										}
									});

									data.column("Lat.1").rename("Lat");
									data.column("Long_.1").rename("Long_");
									data.column("Country_Region.1").rename("Country_Region");
									data.column("Case_Fatality_Ratio.1").rename("Case-Fatality_Ratio");
								
									ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
									
									// --------------------------------------
									// deploy the data
									// --------------------------------------

									options.setData(data, {
										type: "dbtable",
										name: options.name
									});

							});
					});
			});
	};
	
	ixmaps.CSSE_COVID_SEQUENCE_RATIO_28 = function (theme, options) {
		
		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// root url to daily reports 
		var szUrl2 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					var date = dataA[0].columnNames().pop();
					dateA = date.split("/");
					date = new Date(Number("20" + dateA[2]), Number(dateA[0]) - 1, Number(dateA[1]), 18);
					
					var lastDate = date.toLocaleDateString();
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate6 = date.toISOString();
					dateA = szDate6.split("T")[0].split("-");
					szDate6 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate5 = date.toISOString();
					dateA = szDate5.split("T")[0].split("-");
					szDate5 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate4 = date.toISOString();
					dateA = szDate4.split("T")[0].split("-");
					szDate4 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate3 = date.toISOString();
					dateA = szDate3.split("T")[0].split("-");
					szDate3 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate2 = date.toISOString();
					dateA = szDate2.split("T")[0].split("-");
					szDate2 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					date = new Date(date.getTime() - 1000*60*60*24*28);
					szDate1 = date.toISOString();
					dateA = szDate1.split("T")[0].split("-");
					szDate1 = dateA[1] + "-" + dateA[2] + "-" + dateA[0];
					
					console.log(szDate1);
					console.log(szDate2);
					console.log(szDate3);
					console.log(szDate4);
					console.log(szDate5);
					console.log(szDate6);
					new Data.Broker()
						.addSource(szUrl2 + szDate1 + ".csv", "csv")
						.addSource(szUrl2 + szDate2 + ".csv", "csv")
						.addSource(szUrl2 + szDate3 + ".csv", "csv")
						.addSource(szUrl2 + szDate4 + ".csv", "csv")
						.addSource(szUrl2 + szDate5 + ".csv", "csv")
						.addSource(szUrl2 + szDate6 + ".csv", "csv")
						.realize(
							function (dataA) {
								
							console.log(dataA);	
								
							// merge the two data tables	
								
							var columnsA = dataA[0].columnNames();
							var merger = new Data.Merger();
							merger.addSource(dataA[0], {
								lookup: "Combined_Key",
								columns: dataA[0].columnNames()
							});
							merger.addSource(dataA[1], {
								lookup: "Combined_Key",
								columns: dataA[1].columnNames()
							});
							merger.addSource(dataA[2], {
								lookup: "Combined_Key",
								columns: dataA[2].columnNames()
							});
							merger.addSource(dataA[3], {
								lookup: "Combined_Key",
								columns: dataA[3].columnNames()
							});
							merger.addSource(dataA[4], {
								lookup: "Combined_Key",
								columns: dataA[4].columnNames()
							});
							merger.addSource(dataA[5], {
								lookup: "Combined_Key",
								columns: dataA[5].columnNames()
							});
							console.log(merger);

							merger.realize(function (data) {
								
									console.log(data);

									// get Confirmed/Deaths of last 28 days
								
									var iConfirmed 		= data.column("Confirmed.6").index;
									var iDeaths 		= data.column("Deaths.6").index;
									var iConfirmed_28 	= data.column("Confirmed.5").index;
									var iDeaths_28 		= data.column("Deaths.5").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_5"
									}, function (row) {
									if ( (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) > 100 ){
											return 	((Number(row[iDeaths]) - Number(row[iDeaths_28])) / 
													 (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) * 100);
										}else{
											return 0;
										}
									});
								
									// get Confirmed/Deaths of before 28 days
								
									var iConfirmed 		= data.column("Confirmed.5").index;
									var iDeaths 		= data.column("Deaths.5").index;
									var iConfirmed_28 	= data.column("Confirmed.4").index;
									var iDeaths_28 		= data.column("Deaths.4").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_4"
									}, function (row) {
									if ( (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) > 100 ){
											return 	((Number(row[iDeaths]) - Number(row[iDeaths_28])) / 
													 (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) * 100);
										}else{
											return 0;
										}
									});
								
									// get Confirmed/Deaths of before 28 days
								
									var iConfirmed 		= data.column("Confirmed.4").index;
									var iDeaths 		= data.column("Deaths.4").index;
									var iConfirmed_28 	= data.column("Confirmed.3").index;
									var iDeaths_28 		= data.column("Deaths.3").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_3"
									}, function (row) {
									if ( (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) > 100 ){
											return 	((Number(row[iDeaths]) - Number(row[iDeaths_28])) / 
													 (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) * 100);
										}else{
											return 0;
										}
									});
								
									// get Confirmed/Deaths of before 28 days
								
									var iConfirmed 		= data.column("Confirmed.3").index;
									var iDeaths 		= data.column("Deaths.3").index;
									var iConfirmed_28 	= data.column("Confirmed.2").index;
									var iDeaths_28 		= data.column("Deaths.2").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_2"
									}, function (row) {
									if ( (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) > 100 ){
											return 	((Number(row[iDeaths]) - Number(row[iDeaths_28])) / 
													 (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) * 100);
										}else{
											return 0;
										}
									});
								
									// get Confirmed/Deaths of before 28 days
								
									var iConfirmed 		= data.column("Confirmed.2").index;
									var iDeaths 		= data.column("Deaths.2").index;
									var iConfirmed_28 	= data.column("Confirmed.1").index;
									var iDeaths_28 		= data.column("Deaths.1").index;
								
									data.addColumn({
										destination: "Case-Fatality_Ratio_1"
									}, function (row) {
										if ( (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) > 100 ){
											return 	((Number(row[iDeaths]) - Number(row[iDeaths_28])) / 
													 (Number(row[iConfirmed]) - Number(row[iConfirmed_28])) * 100);
										}else{
											return 0;
										}
									});
								

									data.column("Lat.1").rename("Lat");
									data.column("Long_.1").rename("Long_");
									data.column("Country_Region.1").rename("Country_Region");
								
									ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:18px;color:#444444'>aggiornato al " + lastDate + "</span>", "right");
								
									theme.szXaxisA = [szDate1,szDate2,szDate3,szDate4,szDate5];

									
									// --------------------------------------
									// deploy the data
									// --------------------------------------

									options.setData(data, {
										type: "dbtable",
										name: options.name
									});

							});
					});
			});
	};

	ixmaps.CSSE_COVID_NEW_CONFIRMED_INCIDENCE_CUMULATIVE_14 = function (theme, options) {

		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// to get the contry population 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
				var data_Confirmed = dataA[0];	
				var data_Pop = dataA[1];	
					
				// make lookupArray: country name ==> population
				data_Pop.column("Country Name").map(function(value){
					if (value == "United States"){
						return "US";
					}
					if (value == "Russian Federation"){
						return "Russia";
					}
					return value;
				});
				var popA = data_Pop.lookupArray("2019","Country Name");
				console.log(popA);	
	
				// get last 14 columns
				var last_14 = data_Confirmed.columnNames().slice(-14);
				// get first and last	
				var lastDataColumnName  = last_14.pop();
				var firstDataColumnName = last_14.shift();
				var firstIndex = data_Confirmed.column(firstDataColumnName).index;
				var lastIndex  = data_Confirmed.column(lastDataColumnName).index;
				var popIndex = data_Confirmed.column("Country/Region").index;
				console.log("-------------------------");	
				console.log(firstIndex);	
				console.log(lastIndex);	
				console.log("-------------------------");	
			    data_Confirmed.addColumn({"destination":"14gg"},function(row){
					return ((Number(row[lastIndex])-Number(row[firstIndex]))/Number(popA[row[popIndex]])*100000).toFixed(2);
				});

				// set as data fields in actual theme
				options.theme.szFields = "14gg";
				options.theme.szFieldsA = ["14gg"];

				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(data_Confirmed, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};

	ixmaps.CSSE_COVID_NEW_CONFIRMED_INCIDENCE_CUMULATIVE_7 = function (theme, options) {

		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
		
		// to get the contry population 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
				var data_Confirmed = dataA[0];	
				var data_Pop = dataA[1];	
					
				// make lookupArray: country name ==> population
				data_Pop.column("Country Name").map(function(value){
					if (value == "United States"){
						return "US";
					}
					if (value == "Russian Federation"){
						return "Russia";
					}
					return value;
				});
				var popA = data_Pop.lookupArray("2019","Country Name");
				console.log(popA);	
	
				// get last 14 columns
				var last_7 = data_Confirmed.columnNames().slice(-7);
				// get first and last	
				var lastDataColumnName  = last_7.pop();
				var firstDataColumnName = last_7.shift();
				var firstIndex = data_Confirmed.column(firstDataColumnName).index;
				var lastIndex  = data_Confirmed.column(lastDataColumnName).index;
				var popIndex = data_Confirmed.column("Country/Region").index;
				console.log("-------------------------");	
				console.log(firstIndex);	
				console.log(lastIndex);	
				console.log("-------------------------");	
			    data_Confirmed.addColumn({"destination":"7gg"},function(row){
					return ((Number(row[lastIndex])-Number(row[firstIndex]))/Number(popA[row[popIndex]])*100000).toFixed(2);
				});

				// set as data fields in actual theme
				options.theme.szFields = "7gg";
				options.theme.szFieldsA = ["7gg"];

				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(data_Confirmed, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};


	ixmaps.CSSE_COVID_VACCINATIONS_POP = function (theme, options) {

		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
		
		// to get the contry population 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
				var data_Vaccinations = dataA[0];	
				var data_Pop = dataA[1];	
					
				var popA = data_Pop.lookupArray("2019","Country Code");
	
			    data_Vaccinations.addColumn({"source":"iso_code","destination":"pop"},function(code){
					return popA[code];
				});

				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(data_Vaccinations, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};
	
	ixmaps.CSSE_COVID_VACCINATIONS_POP_MAX = function (theme, options) {

		// to get the last date in the time series 
		var szUrl1 = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
		
		// to get the contry population 
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/World/API_SP.POP.TOTL_DS2_en_csv_v2_1926760.csv";

		new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				function (dataA) {
					
				var data_Vaccinations = dataA[0];	
				var data_Pop = dataA[1];	
					
				var popA = data_Pop.lookupArray("2019","Country Code");
	
			    data_Vaccinations.addColumn({"source":"iso_code","destination":"pop"},function(code){
					return popA[code];
				});

				data_Vaccinations.condense("iso_code",{"calc":"max"});
					
				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(data_Vaccinations, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};

	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
