/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.ARCGIS_FOA_COVID = function () {


		var szUrl = "https://services3.arcgis.com/t6lYS2Pmd8iVx1fy/arcgis/rest/services/ita_adm2_covid/FeatureServer/0/query?f=json&where=(confirmed%20%3E%200)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=confirmed%20desc&resultOffset=0&cacheHint=true";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){
			
			// parse the raw data and get the 'attributes' out of the 'features' array
			
			var items = [];
			myfeed.data.features.forEach(function(item, index){
				items.push(item.attributes);					
			});
			
			// parse the resultant 'attributes' array into a dbtable object
			
			myfeed.__processJsonData(items,{"type":"json"});


			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(myfeed.dbtable, {
				type: "dbtable",
				name: "ARCGIS_FOA_COVID"
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
