/**
 * data provider for COVID-19 EU variants themes
 * loads data from ECDC 
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
    ixmaps.ECDC_VARIANTS_SEQUENCED_PERCENT = function (theme,options) {

		var szUrl = "https://corsme.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/virusvariant/csv/data.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ECDC variants data
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			data = data.select("WHERE year_week LIKE 2021");
			
			var pivot = data.pivot(
				{lead:"country_code",
				 columns:"year_week",
				 value:"percent_cases_sequenced",
				 calc:"max",
				 keep:["country"]}
			);

			// get the columns with date 
			var columnA = pivot.columnNames();
			columnA.shift();
			columnA.shift();
			columnA.shift();
			columnA.pop();
			columnA.pop();
			
			// and configure the theme
			theme.szFields = columnA.join("|");
			theme.szFieldsA = columnA;

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
    ixmaps.ECDC_VARIANTS_SEQUENCED = function (theme,options) {

		var szUrl = "https://corsme.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/virusvariant/csv/data.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ECDC variants data
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			data = data.select("WHERE year_week LIKE 2021");
			
			var pivot = data.pivot(
				{lead:"country_code",
				 columns:"year_week",
				 value:"number_sequenced",
				 calc:"max",
				 keep:["country"]}
			);

			// get the columns with date 
			var columnA = pivot.columnNames();
			columnA.shift();
			columnA.shift();
			columnA.shift();
			columnA.pop();
			columnA.pop();
			
			// and configure the theme
			theme.szFields = columnA.join("|");
			theme.szFieldsA = columnA;

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
    ixmaps.EU_COVID_VARIANTS_RELIABLE = function (theme,options) {

		var szUrl = "https://corsme.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/virusvariant/csv/data.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ECDC variants data
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(data){
			
			var indexValid = data.column("valid_denominator").index;
			var indexPercentSequenced = data.column("percent_cases_sequenced").index;
			var indexNumberSequenced = data.column("number_sequenced").index;
			var indexPercentVariant = data.column("percent_variant").index;
			
			data.column("percent_variant").map(function(value,row){
				return (((row[indexPercentSequenced] > 10)||(row[indexNumberSequenced] > 500))?value:0);
			});
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(data, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
