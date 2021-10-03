/**
 * data provider for OSM Overpass Queries
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	ixmaps.oldBounds = null;

	ixmaps.OSM_dataquery_streetmap  = function(data,option){
		
		ixmaps.setTitleBox("Overpass API &#8644;","RGBA(95, 185, 135,0.5)");
		ixmaps.in_query = true;

		var bounds = ixmaps.oldBounds = ixmaps.getBoundingBox();
		var szBounds = bounds[0].lng+'/'+bounds[0].lat+'/'+bounds[1].lng+'/'+bounds[1].lat;

		query = 
		'[out:json][timeout:250][bbox:'+
			   bounds[0].lat+','+
			   bounds[0].lng+','+
			   bounds[1].lat+','+
			   bounds[1].lng+'];'+
		'('+
		  'way["barrier"];'+
		  '(way["highway"];);'+
		');'+
		'out body center qt;'+
		'>;'+
		'out skel qt;';


		var szUrl = "https://overpass.kumi.systems/api/interpreter?data="+query;
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){

			if ( myfeed.data.elements ){
				
				geo = osmtogeojson(myfeed.data);
				
				var xgeo = {type:"featurecollection",features:[]}
				for (i in geo.features ){
					if (!geo.features[i].geometry.type.match(/Point/) ){
						xgeo.features.push(geo.features[i]);
					}
				}

				ixmaps.in_query = false;
				ixmaps.setTitle("");
				ixmaps.setExternalData(xgeo,{type:"geojson",name:options.name});

			}

		})
		.error(function(e){
			ixmaps.setTitleBox("error while loading","RGBA(128,0,0,0.5)");
			ixmaps.setExternalData(null,{name:option.name});
			ixmaps.in_query = false;
		});

	};
	
	ixmaps.OSM_dataquery_tourism  = function(data,option){

		var bounds = ixmaps.oldBounds = ixmaps.getBoundingBox();
		var szBounds = bounds[0].lng+'/'+bounds[0].lat+'/'+bounds[1].lng+'/'+bounds[1].lat;

		query = 
		'[out:json][timeout:100][bbox:'+
			   bounds[0].lat+','+
			   bounds[0].lng+','+
			   bounds[1].lat+','+
			   bounds[1].lng+'];'+
		'('+
			  'node["tourism"="museum"];'+
			  'way["tourism"="museum"];'+
			  'relation["tourism"="museum"];'+
			');'+
		'out body center qt;'+
		'>;'+
		'out skel qt;';

		var szUrl = "https://overpass.kumi.systems/api/interpreter?data="+query;
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){

			ixmaps.in_query = false;
			ixmaps.setTitle("");
			if ( myfeed.data.elements ){
				geo = osmtogeojson(myfeed.data);
				ixmaps.setExternalData(geo,{type:"geojson",name:option.name});
			}

		})
		.error(function(e){
			ixmaps.setTitleBox("error while loading","RGBA(128,0,0,0.5)");
			ixmaps.setExternalData(null,{name:option.name});
			ixmaps.in_query = false;
		});

	};

	
	ixmaps.OSM_dataquery_bus_stop  = function(data,option){

		var bounds = ixmaps.oldBounds = ixmaps.getBoundingBox();
		var szBounds = bounds[0].lng+'/'+bounds[0].lat+'/'+bounds[1].lng+'/'+bounds[1].lat;

		query = 
			'[out:json][timeout:100][bbox:'+
				   bounds[0].lat+','+
				   bounds[0].lng+','+
				   bounds[1].lat+','+
				   bounds[1].lng+'];'+
			'('+
				' node["highway"="bus_stop"];'+
				');'+
			'out body center qt;'+
			'>;'+
			'out skel qt;';									 

		var szUrl = "https://overpass-api.de/api/interpreter?data="+query;
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){

			ixmaps.in_query = false;
			ixmaps.setTitle("");

			if ( myfeed.data.elements ){
				geo = osmtogeojson(myfeed.data);
				ixmaps.setExternalData(geo,{type:"geojson",name:option.name});
			}

		})
		.error(function(e){
			ixmaps.setTitleBox("error while loading","RGBA(128,0,0,0.5)");
			ixmaps.setExternalData(null,{name:option.name});
			ixmaps.in_query = false;
		});

	};

	ixmaps.OSM_dataquery_bike_rental  = function(data,option){

		var bounds = ixmaps.oldBounds = ixmaps.getBoundingBox();
		var szBounds = bounds[0].lng+'/'+bounds[0].lat+'/'+bounds[1].lng+'/'+bounds[1].lat;

		query = 
			'[out:json][timeout:100][bbox:'+
				   bounds[0].lat+','+
				   bounds[0].lng+','+
				   bounds[1].lat+','+
				   bounds[1].lng+'];'+
			'('+
				' node["amenity"="bicycle_rental"];'+
				');'+
			'out body center qt;'+
			'>;'+
			'out skel qt;';									 

		var szUrl = "https://overpass-api.de/api/interpreter?data="+query;
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){

			ixmaps.in_query = false;
			ixmaps.setTitle("");

			if ( myfeed.data.elements && myfeed.data.elements.length ){
				geo = osmtogeojson(myfeed.data);
				ixmaps.setExternalData(geo,{type:"geojson",name:option.name});
			}else{
				ixmaps.setTitleBox("no points in map view");
				ixmaps.setExternalData(null,{type:"geojson",name:option.name});
			}

		})
		.error(function(e){
			ixmaps.setTitleBox("error while loading","RGBA(128,0,0,0.5)");
			ixmaps.setExternalData(null,{name:option.name});
			ixmaps.in_query = false;
		});

	};

	ixmaps.OSM_dataquery_recycling  = function(data,option){

		var bounds = ixmaps.oldBounds = ixmaps.getBoundingBox();
		var szBounds = bounds[0].lng+'/'+bounds[0].lat+'/'+bounds[1].lng+'/'+bounds[1].lat;

		query = 
			'[out:json][timeout:100][bbox:'+
				   bounds[0].lat+','+
				   bounds[0].lng+','+
				   bounds[1].lat+','+
				   bounds[1].lng+'];'+
			'('+
				' node["amenity"="waste_basket"];'+ 
				' node["amenity"="recycling"];'+ 
				');'+
			'out body center qt;'+
			'>;'+
			'out skel qt;';									 

		var szUrl = "https://overpass-api.de/api/interpreter?data="+query;
		var myfeed = Data.feed({"source":szUrl,"type":"json"}).load(function(mydata){

			ixmaps.in_query = false;
			ixmaps.setTitle("");

			if ( myfeed.data.elements && myfeed.data.elements.length ){
				geo = osmtogeojson(myfeed.data);
				ixmaps.setExternalData(geo,{type:"geojson",name:option.name});
			}else{
				ixmaps.setTitleBox("no points in map view");
				ixmaps.setExternalData(null,{type:"geojson",name:option.name});
			}

		})
		.error(function(e){
			ixmaps.setTitleBox("error while loading","RGBA(128,0,0,0.5)");
			ixmaps.setExternalData(null,{name:option.name});
			ixmaps.in_query = false;
		});

	};

	ixmaps.setTitleBox = function(szTitle,szColor){
		ixmaps.setTitle("<span style='padding: 0.3em 1em;border:solid #ddd 1px;border-radius:0.2em;font-family:courier new,Raleway,arial,helvetica;background:"+(szColor||"rgba(255,255,255,0.9)")+";color:"+(szColor?"#fff":"#888")+"'>"+szTitle+"</span");
	};
	
	ixmaps.refreshTimeout = null;
	ixmaps.htmlgui_onZoomAndPan_old = ixmaps.htmlgui_onZoomAndPan;
	ixmaps.htmlgui_onZoomAndPan = function(nZoom){ 
		
		ixmaps.htmlgui_onNewTheme("features");

		if (ixmaps.getZoom() < 14 ){
			ixmaps.htmlgui_onRemoveTheme("features");
			ixmaps.setTitleBox("please zoom in or <a style='pointer-events:all' href='javascript:ixmaps.refreshTheme(null,\"features\")'>refresh</a>");
			ixmaps.htmlgui_onZoomAndPan_old(nZoom);
			return;
		}
		
		if ( 0 && ixmaps.in_query ){
			ixmaps.setTitleBox("theme busy ...");
			ixmaps.htmlgui_onZoomAndPan_old(nZoom);
			return;
		}

		ixmaps.setTitleBox("query overpass ...","RGBA(95, 185, 135,0.5)");

		var bounds = ixmaps.getBoundingBox();
		if ( ixmaps.oldBounds ){
			if ( (bounds[0].lat >= ixmaps.oldBounds[0].lat) && 
				 (bounds[0].lng >= ixmaps.oldBounds[0].lng) &&
				 (bounds[1].lat <= ixmaps.oldBounds[1].lat) &&
				 (bounds[1].lng <= ixmaps.oldBounds[1].lng) 
			   ){
				ixmaps.htmlgui_onZoomAndPan_old(nZoom);
				ixmaps.setTitle("");
				return;
			}
		}

		if ( ixmaps.refreshTimeout ){
			clearTimeout(ixmaps.refreshTimeout);
			ixmaps.refreshTimeout = null;
		}
		ixmaps.refreshTimeout = setTimeout('ixmaps.refreshTheme(null,"features")',250);
		
		ixmaps.oldBounds = bounds;
		ixmaps.htmlgui_onZoomAndPan_old(nZoom);
	};
			

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
