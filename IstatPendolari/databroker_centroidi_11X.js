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
            .addSource("https://gjrichter.github.io/viz/IstatPendolari/comuni.csv", "csv")

            // load Andrea Borrusos positions that are centered on the urban fabric
            .addSource("https://gjrichter.github.io/viz/IstatPendolari/comuni_11X_geo.csv", "csv")

            .realize(function (data) {

				var istat = data[0];
				var pos   = data[1];
				
				// get indices to change the position 
				var procom_index = istat.column("PRO_COM").index;
				var lat_index    = istat.column("Y").index;
				var lon_index    = istat.column("X").index;
				
				// if we find new and better positions here for the PRP_COM code
				var lat_lookup   = pos.lookupArray("Y","PRO_COM");
				var lon_lookup   = pos.lookupArray("X","PRO_COM");
				
				// we have to fix some positions by overwriting the lookup
				var toppe = {
					"84001" : {lat:37.31317829,lon:13.57686996}
				}
				for ( t in toppe ){
					lat_lookup[t] = toppe[t].lat;
					lon_lookup[t] = toppe[t].lon;
				}
				
				// ok let's overwrite the centroids with the better positions 
				//
				var records = istat.records;
				for ( var i=0; i<records.length; i++ ){
					if  ( lat_lookup[records[i][procom_index]] ){
						records[i][lat_index] = lat_lookup[records[i][procom_index]];
						records[i][lon_index] = lon_lookup[records[i][procom_index]];
					}
				}

				// -----------------------------------------------------------------------------------------------               
				// deploy the corrected data
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
