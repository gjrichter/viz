# Amministratori - (dis)parità di genere

Visualizzazioni di dati della EEA (European Environment Agency) con la qualità delle acque balneare dell'Italia dal 1990 al 2019. Cerchi: Qualità nel 2019. Quadretti a destra: serie storica 
Per validare il contesto ambientale della qualità acque balneare sono integrate alcuni layer del EEA Map Server
DiscoMap: Costal Zones, Riparian Zones, Grasslands and Tree Cover Density.

Fonte: <a href="https://www.eea.europa.eu/themes/water/interactive/bathing/state-of-bathing-waters" target="_blank">EEA</a>  

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Amministratori/ixmaps_project_ammcom_pointer_diff.json"></iframe>

Visualizzazioni: iXMaps, i progetti (json) per la mappa si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Copernicus%20WMS" target="_blank">GitHub</a>
codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/dispatch.htm?ui=embed&basemap=ll&legend=1&project=project=https://raw.githubusercontent.com/gjrichter/viz/master/Amministratori/ixmaps_project_ammcom_pointer_diff.json"></iframe>
```



