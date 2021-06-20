/**********************************************************************
databroker_citibike-gbfs.js

$Comment: provides JavaScript for loading NYC Citibike status information
$Source : databroker_citibike-gbfs.js,v $

$InitialAuthor: guenter richter $
$InitialDate: 2019/26/09 $
$Author: guenter richter $

Copyright (c) Guenter Richter
**********************************************************************/

/**
	defines 3 data loading functions
	
	ixmaps.bike_stations - to read the positions of the bike stations
	ixmaps.bike_status	 - to get the actual bike station usage status and evt. old status (if refresh)
	ixmaps.free_bike_status	 - to get the actual free bike status
	
	the functions are called if the iXMaps project defines
	equally named data sources with the 'dbtable' property
	
	example: 
	
	"dbtable" : "bike_status" will call ixmaps.bike_status()
 */


// define ixmaps namespace !
window.ixmaps = window.ixmaps || {};

(function() {

		// ----------------------------
		// get bike station positions
		// ----------------------------

		ixmaps.bike_stations = function(themeObj){
			
			var myFeed = Data.feed({source:themeObj.coTableUrl,
					   type:"json",
					  }).error(function(error){
						ixmaps.error(error);
					  }).load(function(){

						// deploy the loaded data (data.stations) in 'myFeed.data' as object 'bike_stations' 
						ixmaps.setExternalData(myFeed.data.data.stations,{"type":"json","name":"bike_stations"});

			});	

			return true;

		};	// end ixmaps.bike_stations
	

		// -------------------------------------
		// read bike station status information
		// -------------------------------------
		ixmaps.oldBikeUrl = null;
		ixmaps.oldBikeStatus = null;
		ixmaps.bike_status = function(themeObj){

			var myFeed = Data.feed({source:themeObj.coTableUrl,
					   type:"json",
					  }).error(function(error){
						ixmaps.error(error);
					  }).load(function(){

						ixmaps.setTitle("");
 
						// get the actual date and set as theme title (->legend)
						ixmaps.bikeUTC = myFeed.data.last_updated;
						var d = new Date(ixmaps.bikeUTC*1000);
						
						themeObj.szSnippet = "<p>last updated: "+d.toLocaleString().split("GMT")[0].replace(",","")+"</p>";
				
						// if new feed, or old bike status non set, do it here
						if (!ixmaps.oldBikeStatus || (themeObj.coTableUrl != ixmaps.oldBikeUrl) ){
							ixmaps.oldBikeUrl 	 = themeObj.coTableUrl; 
							ixmaps.oldBikeStatus = myFeed.data.data.stations; 
						}

						// enable differenc theme by adding 'old values' column
						if (ixmaps.oldBikeStatus){
							for ( var i in myFeed.data.data.stations ){
								if ( myFeed.data.data.stations[i].station_id == ixmaps.oldBikeStatus[i].station_id ){
									myFeed.data.data.stations[i].old_num_bikes_available = ixmaps.oldBikeStatus[i].num_bikes_available;
								}
							}
						}
							
						// deploy the loaded data as object 'bike_status' 
						ixmaps.setExternalData(myFeed.data.data.stations,{"type":"json","name":"bike_status"});

			});	

			return true;

		};	// end ixmaps.bike_status

		// -------------------------------------
		// read bike station status information
		// -------------------------------------

		ixmaps.free_bike_status = function(themeObj){
			
			console.log(themeObj);

			var myFeed = Data.feed({source:themeObj.coTableUrl,
					   type:"json",
					  }).error(function(error){
						ixmaps.error(error);
					  }).load(function(json){
				
						ixmaps.setTitle("");
				
						console.log(myFeed);

						// get the actual date and set as theme title (->legend)
						ixmaps.bikeUTC = myFeed.data.last_updated;
						var d = new Date(ixmaps.bikeUTC*1000);
				
						themeObj.szSnippet = "<p>last updated: "+d.toLocaleString().split("GMT")[0].replace(",","")+"</p>";
				
						if ( myFeed.data.data.bikes && myFeed.data.data.bikes.length ){
							// deploy the loaded the JSON object with the status info as object 'bike_status' 
							ixmaps.setExternalData(myFeed.data.data.bikes,{"type":"json","name":"free_bike_status"});
						}else{
							// loaded data has no bikes
							ixmaps.error("no bike positions");
							ixmaps.setExternalData(null,{"type":"jsonDB","name":"free_bike_status"});
						}

			});	

			return true;

		};	// end ixmaps.free_bike_status

})();
