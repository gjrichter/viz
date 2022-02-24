## Bari - Status TPL AMTAB


<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&legend=1&name=map3&sync=false&footer=true&popout=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Bari/ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json"></iframe>

codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/dispatch.htm?ui=embed&basemap=ll&legend=1&project=https://raw.githubusercontent.com/gjrichter/viz/master/Bari/ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json"></iframe>
```



La mappa visualizza dati pubblicati dal AMTAB (Bari) nel ambito del progetto [MUVT](https://www.amtab.it/it/openmobilitydata) in formato GTFS e GTFS-RT. La mappa e interamente programmato come progetto iXMaps con codice e dati pubblicati su [GitHub](https://github.com/gjrichter/viz/tree/master/Bari).

La mappa contiene sia elementi statici GTFS che elementi dinamici GTFS-RT attualizzai ogni 10 minuti.

#### Elementi statici

------

Gli elementi statici sono le linee degli autobus e le fermate. I dati sono fornito dal MUVT in formato GTSF contenuto in un file scaricabili dal sito MUVT (google_transit.zip), che contiene tra altro *shape.csv* e *stops.csv*.

*shape*.csv contiene punti che insieme definiscono il percorso degli mezzi di trasporto. Questi punti sono stati trasformati in elementi line in formato topojson con l'uso del programma QGIS. 

**Linee.topojson** e **stops.csv** si trovano su GitHub nella cartella https://github.com/gjrichter/viz/tree/master/Bari/transit 

#### Elementi dinamici 

------

**MUVT** pubblica la **posizione degli mezzi** di trasporto e **informazioni sulla stato** in due feed in formato **GTFS-RT**. 
L'API e il formato sono descritto  in questo [PDF](https://www.amtab.it/images/Servizio_Export_GTFS.pdf) 

iXmaps legge questi dati ogni 10 minuti e crea una tabella interna combinata da informazione di tutte due. Questo processo e programmato nel file JavaScript https://github.com/gjrichter/viz/blob/master/Bari/dataprovider.js

Questo *dataprovider* è referito nella definizione del progetto iXmaps per la visualizzazione [ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json](https://github.com/gjrichter/viz/blob/master/Bari/ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json) come fonte dati esterni.

```javascript
...
    "dbtable": "TripData",
    "dbtableType": "ext",
    "dbtableExt": "https://raw.githubusercontent.com/gjrichter/viz/master/Bari/dataprovider.js",
...    
```

<br>

#### Altre conformazioni della Mappe 

------

La mappa inserita in una Mini Pagina HTML insieme con un orologgio digitale:

[https://gjrichter.github.io/viz/Bari/index_embed_map_query_GTFS_RT_Bari_Speed_Delay_Linee.html](https://gjrichter.github.io/viz/Bari/index_embed_map_query_GTFS_RT_Bari_Speed_Delay_Linee.html)



La mappa in modo schermo intero: 

[https://gjrichter.github.io/ixmaps/ui/dispatch.htm?ui=embed&basemap=ll&legend=1&project=https://raw.githubusercontent.com/gjrichter/viz/master/Bari/ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json](https://gjrichter.github.io/ixmaps/ui/dispatch.htm?ui=embed&basemap=ll&legend=1&project=https://raw.githubusercontent.com/gjrichter/viz/master/Bari/ixmaps_project_GTFS_RT_Bari_Speed_Delay_Linee.json)



Un Notebook su ObservableHQ:

[https://observablehq.com/@gjrichter/ixmaps-example-real-time-gtfs-rt-amtab-bari-layer-def](https://observablehq.com/@gjrichter/ixmaps-example-real-time-gtfs-rt-amtab-bari-layer-def)

