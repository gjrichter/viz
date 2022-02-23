/**
 * data provider for GTSF-RT data source del AMTAB Bari
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.TripData = window.ixmaps.TripData || {};
(function () {

	ixmaps.TripData = function (theme, options) {

			ixmaps.tmp = ixmaps.tmp || {};
			ixmaps.tmp.positions = null;

			ixmaps.oldP = ixmaps.oldP || [];
			ixmaps.lastP = ixmaps.lastP || [];
			
			function xmlParser(xml) {
				updates = [];
				$(xml).find("FeedEntity").each(function () {
					var entity = {};
					entity["TripId"] = $(this).find("TripId").text();
					entity["Delay"] = $(this).find("Arrival").find("Delay").text();
					updates[entity["TripId"]] = entity;
				  });
				result = [{Id:"0",RouteId:"0",TripId:"0",Latitude:"0",Longitude:"0",
						   OldLat:"0",OldLon:"0",LastLat:"0",LastLon:"0",Speed:"0",Delay:"0"}];
				$(ixmaps.tmp.positions).find("FeedEntity").each(function () {
					var entity = {};
					
					var id = $(this).find("Id").text();
					ixmaps.oldP[id] = ixmaps.oldP[id] || {};
					ixmaps.lastP[id] = ixmaps.lastP[id] || {};

					entity["Id"] = $(this).find("Id").text();
					entity["RouteId"] = $(this).find("RouteId").text();
					entity["TripId"] = $(this).find("TripId").text();
					entity["Latitude"] = $(this).find("Latitude").text();
					entity["Longitude"] = $(this).find("Longitude").text();
					entity["Speed"] = $(this).find("Speed").text();
					
					if ( (ixmaps.lastP[id].lat != entity["Latitude"]) ||
					   	 (ixmaps.lastP[id].lon != entity["Longitude"])){
						ixmaps.oldP[id].lat = ixmaps.lastP[id].lat || entity["Latitude"];
						ixmaps.oldP[id].lon = ixmaps.lastP[id].lon || entity["Longitude"];
					}
					
					entity["LastLat"] = ixmaps.lastP[id].lat || entity["Latitude"];
					entity["LastLon"] = ixmaps.lastP[id].lon || entity["Longitude"];
					
					ixmaps.lastP[id].lat = entity["Latitude"];
					ixmaps.lastP[id].lon = entity["Longitude"];
					
					entity["OldLat"] = ixmaps.oldP[id].lat || entity["Latitude"];
					entity["OldLon"] = ixmaps.oldP[id].lon || entity["Longitude"];

					entity["Delay"] = updates[entity["TripId"]]?updates[entity["TripId"]].Delay:0;
					
					result.push(entity);
				  });
				options.type = "json",
				ixmaps.setExternalData(result,options);
			}			
			
			function getTripUpdate(positions) {
				ixmaps.tmp.positions = positions;
				$.ajax({
					type: "GET",
					url: "https://corsme.herokuapp.com/https://avl.amtab.it/WSExportGTFS_RT/api/gtfs/TripUpdates",
					dataType: "xml",
					success: xmlParser,
					error: function (xhr, ajaxOptions, thrownError) {
						options.type = "json",
						result = [{Id:"0",RouteId:"0",TripId:"0",Latitude:"0",Longitude:"0",OldLat:"0",OldLon:"0",Speed:"0",Delay:"0"}];
						ixmaps.setExternalData(result,options);
					  }
				});
			}			

			$.ajax({
				type: "GET",
				url: "https://corsme.herokuapp.com/https://avl.amtab.it/WSExportGTFS_RT/api/gtfs/VechiclePosition",
				dataType: "xml",
				success: getTripUpdate,
				error: function (xhr, ajaxOptions, thrownError) {
					options.type = "json",
					result = [{Id:"0",RouteId:"0",TripId:"0",Latitude:"0",Longitude:"0",OldLat:"0",OldLon:"0",Speed:"0",Delay:"0"}];
					ixmaps.setExternalData(result,options);
				  }
			});
	};
	

	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
