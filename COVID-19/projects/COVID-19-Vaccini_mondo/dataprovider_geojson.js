/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.WORLD_ISO_3_ALPHA = function (theme,options) {

		var szUrl = "https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/geojson/countries.geojson.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"geojson"}).load(function(mydata){
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
    ixmaps.WORLD_ISO_3_ALPHA_XX = function (theme,options) {

		var szUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){
			
			console.log(myfeed);
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl)});

	};
		
    ixmaps.WORLD_ISO_3_ALPHA_X = function (theme,options) {
		
		var szUrl1 = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
		var szUrl2 = "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json";

		var broker = new Data.Broker()

			.addSource(szUrl1, "json")
			.addSource(szUrl2, "json")
			.realize(

			function (dataA) {
				
				// topojson to geojson
				var countries = topojson.feature(dataA[0].raw, dataA[0].raw.objects.countries);
				
				// get named array and replace iso-3 numeric with iso-3 alpha codes
				var countryCodes = dataA[1];
				var countryCodesA = countryCodes.lookupArray("alpha-3","country-code");
				for ( var i in countries.features){
					countries.features[i].properties.id = countryCodesA[countries.features[i].id];  
				}
				
				// ----------------------------------------------------------------------------------------------- 
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(countries, {
					type: "geojson",
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
