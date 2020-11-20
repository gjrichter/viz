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
	
	// GR 30.03.2020 NextStrain switched from division to country 
	__branch_depth = 0;
	
	__one_branch = function (branch, targetA, depth) {
		depth = depth||0;
		var start = branch.node_attrs.region?branch.node_attrs.region.value:"";
		var childs = branch.children;
		for (var c in childs) {
			if (childs[c].node_attrs.region){
				var end = childs[c].node_attrs.region.value;
				targetA.push({
					start: start,
					end: end,
					name: childs[c].name,
					country: (childs[c].node_attrs.country?childs[c].node_attrs.country.value:"-"),
					recency: (childs[c].node_attrs.recency?childs[c].node_attrs.recency.value:"-"),
					division_exposure: (childs[c].node_attrs.division_exposure?childs[c].node_attrs.division_exposure.value:"-"),
					clade_membership: (childs[c].node_attrs.clade_membership?childs[c].node_attrs.clade_membership.value:"-"),
					depth: (depth)
				});
			}
			__one_branch(childs[c], targetA, depth+1);
		}
	}


	ixmaps.NEXT_STRAIN_location = function () {


		var szUrl = "https://cors-anywhere.herokuapp.com/https://nextstrain.org/charon/getDataset?prefix=/ncov/global";

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
				for (i in myfeed.data.meta.geo_resolutions[3].demes) {
					location.push({
						name: i,
						lat: myfeed.data.meta.geo_resolutions[3].demes[i].latitude,
						lon: myfeed.data.meta.geo_resolutions[3].demes[i].longitude
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
		
		var szUrl = "https://cors-anywhere.herokuapp.com/https://nextstrain.org/charon/getDataset?prefix=/ncov/global";

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
				for ( var k in myfeed.data.meta.colorings ){
					if (  myfeed.data.meta.colorings[k].key == "region" ){
						var scale = myfeed.data.meta.colorings[k].scale;

						for ( var i=0; i<scale.length; i++ ){
							divisions.push(scale[i][0]);
							colors.push(scale[i][1]);
						}
						ixmaps.changeThemeStyle(theme.szId,"values:"+divisions.join(','),'fast');
						theme.origColorScheme = theme.colorScheme = colors;
					} 
				}
			
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
		
		var szUrl = "https://cors-anywhere.herokuapp.com/https://nextstrain.org/charon/getDataset?prefix=/ncov/global";

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
				for ( var k in myfeed.data.meta.colorings ){
					if (  myfeed.data.meta.colorings[k].key == "region" ){
						var scale = myfeed.data.meta.colorings[k].scale;

						for ( var i=0; i<scale.length; i++ ){
							divisions.push(scale[i][0]);
							colors.push(scale[i][1]);
						}
						ixmaps.changeThemeStyle(theme.szId,"values:"+divisions.join(','),'fast');
						theme.origColorScheme = theme.colorScheme = colors;
					} 
				}
			
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
		
		var szUrl = "https://cors-anywhere.herokuapp.com/https://nextstrain.org/charon/getDataset?prefix=/ncov/global";

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
