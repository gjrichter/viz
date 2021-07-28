# Smart City Move Maps

#### Some Maps created with  OSM data via Overpass API

These maps query OSM data via the Overpass Query API for the actual map view and perform analysis on the ways (streets) based on the information stored in their tags. 
>
> The maps are inspired and in particular the first map is based on the code published by **'BikeOttawa'** in this project on <a href='https://github.com/BikeOttawa/stressmodel' target='_blank'>GitHub</a> and also inspired by the adaption to Italy by Maurizio Napoletano, Matteo Fortini e Francesco Piersoft Paolicelli.

The application makes use of the Overpass API at 'overpass-api.de', 'osmtogeojson' to transform the Overpass response into geojson and the code from the BikeOttawa project to calculate the stress level.

The map implements a real time access to the OSM data. This may take some time dependent to the size of the  area of interest. The queries are executed automatically on view changes if the zoom level is below 1:27000 or by clicking the refresh button. The maps cover the whole OSM range. So you can create the maps for nearly every point on earth.

From your specific map or view you can create an url for sharing the map or embed code to include the map in a HTML page. You will find the functions for that purpose in the context menu (right mouse key)

## Cycling Stress Map

<iframe id="map1" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map1&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Stressmap_Roma.json"></iframe>

the iXMaps project for this map you find here: <a href="https://github.com/gjrichter/viz/tree/master/OSM%Overpass" target="_blank">GitHub</a>




## Street type 

To compare with the stress map here a alternative view which shows the type of every road.

<iframe id="map2" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map2&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Streetmap_Roma.json"></iframe>

the iXMaps project for this map you find here: <a href="https://github.com/gjrichter/viz/tree/master/OSM%Overpass" target="_blank">GitHub</a>


## Max. Speed Limit per street

Speed limits are relevant for the cycling stress map so we show here what OSM knows about the street level speed limits. You can note that the coverage is may differ much from city to city and suburbs.

<iframe id="map3" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_StreetSpeedMap_Roma.json"></iframe>

the iXMaps project for this map you find here: <a href="https://github.com/gjrichter/viz/tree/master/OSM%Overpass" target="_blank">GitHub</a>



## Bus Stops and Wheelchair flag

A map to show all bus stops present in the OSM data and colorize them by the wheelchair ability tag. 

<iframe id="map3" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Bus_Wheelchair.json"></iframe>

the iXMaps project for this map you find here: <a href="https://github.com/gjrichter/viz/tree/master/OSM%Overpass" target="_blank">GitHub</a>







