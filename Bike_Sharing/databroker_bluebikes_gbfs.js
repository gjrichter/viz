/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

		ixmaps.bike_stations = function(themeObj){

			var myFeed = Data.feed({source:"https://gbfs.bluebikes.com/gbfs/en/station_information.json",
					   type:"json",
					  }).error(function(error){
						ixmaps.error(error);
					  }).load(function(json){

						myFeed.__processJsonData(myFeed.data.data.stations,{"type":"json"});

						ixmaps.setExternalData(myFeed.dbtable,{"type":"jsonDB","name":"bike_stations"});

			});	// end Data.feed 1

			return true;

		};	// end ixmaps.bike_stations

		ixmaps.bike_status = function(themeObj){

			var myFeed = Data.feed({source:"https://gbfs.bluebikes.com/gbfs/en/station_status.json",
					   type:"json",
					  }).error(function(error){
						ixmaps.error(error);
					  }).load(function(json){

						ixmaps.bikeUTC = myFeed.data.last_updated;
						var d = new Date(ixmaps.bikeUTC*1000-8*60*60*1000);
						themeObj.szTitle = "<p>"+d.toString().split("GMT")[0]+"</p>";
						themeObj.szSnippet = "<p>BlueBikes Docking Station Status</p><hr>";

						myFeed.__processJsonData(myFeed.data.data.stations,{"type":"json"});

						ixmaps.setExternalData(myFeed.dbtable,{"type":"jsonDB","name":"bike_status"});

						console.log("----- refresh -------");

			});	// end Data.feed 1

			return true;

		};	// end ixmaps.bike_stations


})();
