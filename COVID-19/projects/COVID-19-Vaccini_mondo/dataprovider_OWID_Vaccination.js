/**
 * data provider for COVID-19 World Vaccination Map
 *
 *
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	 var __mean_7 = function(table) {
		
		// make mean of 7 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=10; c--){
				records[r][c] = ((Number(records[r][c])+
								 Number(records[r][c-1])+
								 Number(records[r][c-2])+
								 Number(records[r][c-3])+
								 Number(records[r][c-4])+
								 Number(records[r][c-5])+
								 Number(records[r][c-6]))/7).toFixed(2);
			}
		}
		var columns = table.columnNames();
		table.column(columns[4]).remove();
		table.column(columns[5]).remove();
		table.column(columns[6]).remove();
		table.column(columns[7]).remove();
		table.column(columns[8]).remove();
		table.column(columns[9]).remove();
		
		return table;
     };  

   var __get_xaxis = function(columns) { 
		var szXaxisA = [];
		for ( var i =0; i<columns.length; i++ ){
			if (columns[i].match("01-01")){
			  szXaxisA.push("jan");
			}else
			if (columns[i].match("02-01")){
			  szXaxisA.push("feb");
			}else
			if (columns[i].match("03-01")){
			  szXaxisA.push("mar");
			}else
			if (columns[i].match("04-01")){
			  szXaxisA.push("apr");
			}else
			if (columns[i].match("05-01")){
			  szXaxisA.push("mag");
			}else
			if (columns[i].match("06-01")){
			  szXaxisA.push("giu");
			}else
			if (columns[i].match("07-01")){
			  szXaxisA.push("lug");
			}else
			if (columns[i].match("08-01")){
			  szXaxisA.push("ago");
			}else
			if (columns[i].match("09-01")){
			  szXaxisA.push("set");
			}else
			if (columns[i].match("10-01")){
			  szXaxisA.push("ott");
			}else
			if (columns[i].match("11-01")){
			  szXaxisA.push("nov");
			}else
			if (columns[i].match("12-01")){
			  szXaxisA.push("dic");
			}else{
			  szXaxisA.push(" ");
			}
		}
	   	return szXaxisA;
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
	
				data_Vaccinations.sort("date");
					
				var dateA = data_Vaccinations.column("date").values();	
				var actDate = dateA.pop();
					
				data_Vaccinations.addColumn({"source":"iso_code","destination":"pop"},function(code){
					return popA[code];
				});

				data_Vaccinations.condense("iso_code",{"calc":"max"});
					
				ixmaps.setTitle("<span style='background:rgba(255,255,255,0.3);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;font-weigtht:700;color:#004400'>aggiornato al " + actDate + "</span>", "right");
					
				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(data_Vaccinations, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};

	ixmaps.CSSE_COVID_VACCINATIONS_SEQUENCE_DAILY_PER_MILLION = function (theme, options) {

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
					
				data_Vaccinations.sort("date");	
					
				var pivot = data_Vaccinations.pivot({"lead":"iso_code"
													 ,"keep":"location"
													 ,"columns":"date"
													 ,"value":"daily_vaccinations_per_million"
													})	

				pivot.column("Total").remove();

				pivot = __mean_7(pivot);	
				
			    pivot.addColumn({"source":"iso_code","destination":"pop"},function(code){
					return popA[code];
				});
					
				pivot = pivot.select("WHERE pop > 4000000");
					
				var columnsA = pivot.columnNames();
					
				columnsA.pop();
				columnsA.pop();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for (var i = 0; i < columnsA.length; i++) {
					fieldsA.push(columnsA[i]);
				}

				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
					
				// make label 
				var szXaxisA = [];
				for (i in columnsA) {
					var dte = new Date(columnsA[i]);
					szXaxisA.push(dte.toLocaleDateString());
				}
				options.theme.szLabelA = szXaxisA; 
	
				theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];
				ixmaps.setTitle("<span style='background:rgba(255,255,255,0.3);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;font-weigtht:700;color:#004400'>" + "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1] + "</span>", "right");
					
				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(pivot, {
					type: "dbtable",
					name: options.name
				});
					
			});
	};

	ixmaps.CSSE_COVID_VACCINATIONS_SEQUENCE_PERCENT_FULLY_VACCINATED = function (theme, options) {

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
					
				data_Vaccinations.sort("date");	
					
				var pivot = data_Vaccinations.pivot({"lead":"iso_code"
													 ,"keep":"location"
													 ,"columns":"date"
													 ,"value":"people_fully_vaccinated_per_hundred"
													})	

				pivot.column("Total").remove();
					
				pivot = __mean_7(pivot);	
				
			    pivot.addColumn({"source":"iso_code","destination":"pop"},function(code){
					return popA[code];
				});
					
				pivot = pivot.select("WHERE pop > 4000000");
					
				var columnsA = pivot.columnNames();
					
				columnsA.pop();
				columnsA.pop();
				columnsA.shift();
				columnsA.shift();

				// set as data fields in actual theme

				fieldsA = [];
				for (var i = 0; i < columnsA.length; i++) {
					fieldsA.push(columnsA[i]);
				}

				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
					
				// make label 
				var szXaxisA = [];
				for (i in columnsA) {
					var dte = new Date(columnsA[i]);
					szXaxisA.push(dte.toLocaleDateString());
				}
				options.theme.szLabelA = szXaxisA; 
					
				theme.szXaxisA = __get_xaxis(columnsA);
					
	
				theme.szSnippet = "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1];
				ixmaps.setTitle("<span style='background:rgba(255,255,255,0.3);padding:0.3em 0.5em;border:solid #888888 0.5px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;font-size:18px;font-weigtht:700;color:#004400'>" + "from "+columnsA[0]+" to "+fieldsA[fieldsA.length-1] + "</span>", "right");
					
				// -----------------------------------------------------------------------------------------------             // deploy the data
				// ----------------------------------------------------------------------------------------------- 
				ixmaps.setExternalData(pivot, {
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
