/** 
 * @fileoverview This file provides data loading and processing functions for iXMaps
 * @author Guenter Richter guenter.richter@medienobjekte.de
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.com2011_g = function () {

        var broker = new Data.Broker()

            // load ISTAT 2011 comuni centroids
            .addSource("https://raw.githubusercontent.com/aborruso/centroidiurbanfabric/master/output/ElencoUnitaAmministrative2011.geojson", "geojson")

            .realize(function (data) {

				var istat = data[0];

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(istat, {
					type: "dbtable",
					name: "com2011_g"
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
