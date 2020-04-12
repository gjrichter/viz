## CODID-19 - Sicilia

## Visualizzazioni di dati curati da Open Data Sicilia 

Visualizzazioni degli dati collezionati e curati di Open Data Sicilia e pubblicati in un documento Google Sheet. 

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
<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="../../ixmaps/ui/dispatch.htm?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_active_curves.json"></iframe>
```



<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://embed.ixmaps.com?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_active_curves.json"></iframe>





