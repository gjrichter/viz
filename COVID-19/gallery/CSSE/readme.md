## CODID-19 - CSSE

## Visualizations of data from the Johns Hopkins CSSE COVID-19 repository on GitHub

Visualization of actual data from the COVID-19 data repository on GitHub maintained by the Johns Hopkins University. 

fonte: <a href='https://github.com/opendatasicilia/COVID-19_Sicilia' target='_blank'>Open Data Sicilia</a>

Le visualizzazioni caricano i dati direttamente da questo documento. Per questo e per i vari processi per la preparazione dei dati per le visualizzazioni ci sono procedure definiti in un file di JavaScript. Il file è:

```
databroker_ODS_COVID_Sicilia.js
```

Ogni visualizzazione è definita attraverso un oggetto JSON , per esempio 

```
ixmaps_project_ODS_Prov2019_COVID_concentric_zoom.json
```

Gli oggetti JSON sono definiti in questo repository e vengono caricati nel viewer generico di ixmaps. In seguito i vari visualizzazioni con istantanea di schermo. Un esempio di un link per una visualizzazione e:

codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://s3.eu-west-1.amazonaws.com/rc.ixmaps.com/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-CSSE/ixmaps_project_JHU_CSSE_new_cases_moving_mean_7_days_white.json"></iframe>
```




<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://s3.eu-west-1.amazonaws.com/rc.ixmaps.com/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-CSSE/ixmaps_project_JHU_CSSE_new_cases_moving_mean_7_days_white.json"></iframe>



# Versione con marker

Versione con marker temporali che indicano **14 giorni passati** dall'inizio dei fermi. Ci sono 3 linee verticali  a 14 giorni di distanza dalla chiusura delle scuole (5 marzo) ed i due DPCM del 11 e 22 marzo.

codice per includere la mappa in una pagina HTML:
```javascript
<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://s3.eu-west-1.amazonaws.com/rc.ixmaps.com/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-CSSE/ixmaps_project_JHU_CSSE_new_cases_moving_mean_7_days_dark.json"></iframe>
```




<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://s3.eu-west-1.amazonaws.com/rc.ixmaps.com/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-CSSE/ixmaps_project_JHU_CSSE_new_cases_moving_mean_7_days_dark.json"></iframe>






