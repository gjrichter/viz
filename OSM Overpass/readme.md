# Smart City Move Maps

#### Maps created by OSM Overpass Queries

These maps takes OSM data via the Overpass Query API and performs an analysis on the ways (streets) based on the information stored in their tags. The map is, based on the code published by 'BikeOttawa' in this project on <a href='https://github.com/BikeOttawa/stressmodel' target='_blank'>GitHub</a> and inspired by the adaption to Italy by Maurizio Napoletano, Matteo Fortini e Francesco Piersoft Paolicelli.

The query is executed on zoom level below 1:27000 or on the rfresh button. The maps cover the whole OSM range. 

You can create an url or embed code from any map view (actual position and zoom) to embed or share your own map. You will find the functions in the map context menu (right mouse key)

## Cycling Stress Map

<iframe id="map1" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map1&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Stressmap_Roma.json"></iframe>

Visualizzazioni: iXMaps, i progetti (json) per la mappa si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Copernicus%20WMS" target="_blank">GitHub</a>
codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Stressmap_Roma.json"></iframe>
```


## Street type 

Per validare il contesto ambientale della offerta recettiva sono presente alcuni layer del EEA Map Server
DiscoMap: Costal Zones, Riparian Zones, Grasslands and Tree Cover Density.

<iframe id="map2" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map2&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Streetmap_Roma.json"></iframe>

Visualizzazioni: iXMaps, i progetti (json) per la mappa si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Copernicus%20WMS" target="_blank">GitHub</a>



## Max. Speed Limit per street

Per validare il contesto ambientale della offerta recettiva sono presente alcuni layer del EEA Map Server
DiscoMap: Costal Zones, Riparian Zones, Grasslands and Tree Cover Density.

<iframe id="map3" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_StreetSpeedMap_Roma.json"></iframe>

Visualizzazioni: iXMaps, i progetti (json) per la mappa si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Copernicus%20WMS" target="_blank">GitHub</a>



## Bus Stops and Wheelchair flag

Per validare il contesto ambientale della offerta recettiva sono presente alcuni layer del EEA Map Server
DiscoMap: Costal Zones, Riparian Zones, Grasslands and Tree Cover Density.

<iframe id="map3" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/OSM Overpass/ixmaps_project_OSM_Overpass_Bus_Wheelchair.json"></iframe>

Visualizzazioni: iXMaps, i progetti (json) per la mappa si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Copernicus%20WMS" target="_blank">GitHub</a>







