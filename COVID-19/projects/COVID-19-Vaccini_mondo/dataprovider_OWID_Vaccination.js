/**
 * data provider for COVID-19 World Vaccination Map
 *
 *
 */

window.ixmaps = window.ixmaps || {};
(function () {

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
