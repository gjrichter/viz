/**
 * data broker for NEXT STRAIN Data
 * loads data from NextStrain
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	// --------------------------------------------------------
	// recursive function to get all vectors out of child tree
	// --------------------------------------------------------

	__one_branch = function (branch, targetA) {
		var start = branch.node_attrs.division?branch.node_attrs.division.value:"";
		var childs = branch.children;
		for (var c in childs) {
			if (childs[c].node_attrs.division){
				var end = childs[c].node_attrs.division.value;
				targetA.push({
					start: start,
					end: end,
					name: childs[c].name,
					country: (childs[c].node_attrs.country?childs[c].node_attrs.country.value:"-"),
					recency: (childs[c].node_attrs.recency?childs[c].node_attrs.recency.value:"-"),
					division_exposure: (childs[c].node_attrs.division_exposure?childs[c].node_attrs.division_exposure.value:"-"),
					clade_membership: (childs[c].node_attrs.clade_membership?childs[c].node_attrs.clade_membership.value:"-") 
				});
			}
			__one_branch(childs[c], targetA);
		}
	}


	ixmaps.NEXT_STRAIN_location = function () {


		var szUrl = "http://data.nextstrain.org/ncov.json";

		// -----------------------------------------------------------------------------------------------               
		// read the NEXT STRAIN data json 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "json"
			}).load(function (mydata) {

				// -------------------          
				// make location table
				// -------------------
				var location = [];
				for (i in myfeed.data.meta.geo_resolutions[0].demes) {
					location.push({
						name: i,
						lat: myfeed.data.meta.geo_resolutions[0].demes[i].latitude,
						lon: myfeed.data.meta.geo_resolutions[0].demes[i].longitude
					});
				}
				for (i in myfeed.data.meta.geo_resolutions[1].demes) {
					location.push({
						name: i,
						lat: myfeed.data.meta.geo_resolutions[1].demes[i].latitude,
						lon: myfeed.data.meta.geo_resolutions[1].demes[i].longitude
					});
				}
				for (i in myfeed.data.meta.geo_resolutions[2].demes) {
					location.push({
						name: i,
						lat: myfeed.data.meta.geo_resolutions[2].demes[i].latitude,
						lon: myfeed.data.meta.geo_resolutions[2].demes[i].longitude
					});
				}
				myfeed.__processJsonData(location, {
					"type": "json"
				});

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(myfeed.dbtable, {
					type: "dbtable",
					name: "NEXT_STRAIN_location"
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});

	};

	ixmaps.NEXT_STRAIN_vectors = function (theme,options) {
		
		var szUrl = "http://data.nextstrain.org/ncov.json";

		// -----------------------------------------------------------------------------------------------               
		// read the NEXT STRAIN data json 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "json"
			}).load(function (mydata) {

				var vectors = [];

				__one_branch(myfeed.data.tree, vectors);
			
				var colors = [];
				var divisions = [];
				var scale = myfeed.data.meta.colorings[4].scale;
			
				for ( var i=0; i<scale.length; i++ ){
					divisions.push(scale[i][0]);
					colors.push(scale[i][1]);
				}
				ixmaps.changeThemeStyle(theme.szId,"values:"+divisions.join(','),'fast');
				theme.origColorScheme = theme.colorScheme = colors;
			
				theme.szTitle = myfeed.data.meta.title;
				theme.szSnippet = "source:<a href='https://nextstrain.org/ncov' target='_blank'>nextstrain.org</a><br>updated: "+ myfeed.data.meta.updated;
			
				myfeed.__processJsonData(vectors, {
					"type": "json"
				});

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(myfeed.dbtable, {
					type: "dbtable",
					name: "NEXT_STRAIN_vectors"
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});
	};

	ixmaps.NEXT_STRAIN_vectors_II = function (theme,options) {
		
		var szUrl = "http://data.nextstrain.org/ncov.json";

		// -----------------------------------------------------------------------------------------------               
		// read the NEXT STRAIN data json 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "json"
			}).load(function (mydata) {

				var vectors = [];

				__one_branch(myfeed.data.tree, vectors);
			
				var colors = [];
				var divisions = [];
				var scale = myfeed.data.meta.colorings[4].scale;
			
				for ( var i=0; i<scale.length; i++ ){
					divisions.push(scale[i][0]);
					colors.push(scale[i][1]);
				}
				ixmaps.changeThemeStyle(theme.szId,"values:"+divisions.join(','),'fast');
				theme.origColorScheme = theme.colorScheme = colors;
			
				theme.szTitle = myfeed.data.meta.title;
				theme.szSnippet = "source:<a href='https://nextstrain.org/ncov' target='_blank'>nextstrain.org</a><br>updated: "+ myfeed.data.meta.updated;
			
				myfeed.__processJsonData(vectors, {
					"type": "json"
				});

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(myfeed.dbtable, {
					type: "dbtable",
					name: "NEXT_STRAIN_vectors_II"
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});
	};

	ixmaps.NEXT_STRAIN_vectors_clean = function (theme,options) {
		
		var szUrl = "http://data.nextstrain.org/ncov.json";

		// -----------------------------------------------------------------------------------------------               
		// read the NEXT STRAIN data json 
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({
				"source": szUrl,
				"type": "json"
			}).load(function (mydata) {

				var vectors = [];

				__one_branch(myfeed.data.tree, vectors);
			
				myfeed.__processJsonData(vectors, {
					"type": "json"
				});

				// -----------------------------------------------------------------------------------------------               
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(myfeed.dbtable, {
					type: "dbtable",
					name: "NEXT_STRAIN_vectors_clean"
				});

			})
			.error(function (e) {
				alert("error loading data from:\n" + szUrl)
			});
	};


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
