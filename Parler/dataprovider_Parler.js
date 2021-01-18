/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {
	
	ixmaps.PARLER_ALL  = function(data,option){
		
		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Parler/AllGeo.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.column("CreateDate").map(function(value){
				valueA = value.split(":");
				return valueA[0]+'-'+valueA[1]+'-'+valueA[2]+':'+valueA[3]+':'+valueA[4];
			})

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};

	ixmaps.PARLER_VIDEO  = function(data,option){
		
		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Parler/metadata.csv.gz";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Parler/user_to_video.csv.gz";

		// -----------------------------------------------------------------------------------------------               
		// read the data
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var mydata 	= dataA[0];
			var usermap = dataA[1];

			var lookup = [];
			var records = usermap.records;	
			for (var r=0; r<records.length;r++){
				for (var c=records[r].length-1; c>=2;c--){
					if ( records[r][c].length > 1 ){
						lookup[String("/"+records[r][c])] = records[r][0];
					}
				}
			}
			mydata.addColumn({"source":"URL","destination":"user"},function(value){
				return lookup[value];
			});

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});
		});
	};

	ixmaps.PARLER_RIOT_GEO  = function(data,option){
		
		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Parler/RiotGeo.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the tree data base
		// ----------------------------------------------------------------------------------------------- 

		var dataTable = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.column("CreateDate").map(function(value){
				valueA = value.split(":");
				return valueA[0]+'-'+valueA[1]+'-'+valueA[2]+':'+valueA[3]+':'+valueA[4];
			})

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});
	};

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
