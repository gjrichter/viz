# elezioni-comunali-2022 Palermo

Visualizzazioni cartografiche sulla base di dati pubblicati dalla Città di Palermo e poligoni delle sezioni elettorali italiane creati da Gabriele Pinto.

In tutte le mappe l'intensità dei colori rappresenta la densità dei votanti. 

Per maggiori informazioni sul metodo della determinazione dei sezioni elettorali  vedi <a href="https://github.com/gabrielepinto/dati-sezioni-elettorali" target="_blank">qui</a> 

Fonte:  <a href="https://risultatipalermo.maggiolicloud.it/web2206/htm/comunali/ODTOT_1_82053.xml" target="_blank">Elezioni Comunali - PALERMO Open Data</a> 

Fonte:  <a href="https://github.com/gabrielepinto/dati-sezioni-elettorali" target="_blank">Shapefile delle sezioni elettorali italiane - Gabriele Pinto</a> 



In seguito  varie mappe per valutare il risultato sul territorio:

## voti dominanti - vincitore  sindaco

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Dominant.json"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Dominant.json"></iframe>
```
## voti sopra alla propria media - candidati  sindaco
il colore di una sezione indica il candidato  sindaco con il risultato più alto rispettiva alla propria media. Viene utilizzato la deviazione standard per valutare l'eccezionalità del risultato.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Deviation.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Deviation.json"></iframe>
```

## la percentuale dei voti compone il colore - candidati  sindaco

il colore di una sezione viene mescolato dai colori dei candidati sindaco in proporzione al percentuale del candidato

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose.json"></iframe>
```
<br><br>
## variazioni




<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_Lite.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_Lite.json"></iframe>
```

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_Lite_2.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_Lite_2.json"></iframe>
```

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_S.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_S.json"></iframe>
```

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_S_2.json?id=123"></iframe>
codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="900" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Comunali/Palermo/2022/ixmaps_project_Palermo_Sindac_Voti_Sezioni_Compose_S_2.json"></iframe>
```



Visualizzazioni: iXMaps, i progetti (json) per le mappe si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Elezioni/Comunali/Palermo/2022" target="_blank">GitHub</a>
