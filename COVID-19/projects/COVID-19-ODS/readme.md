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

```
<a href="http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_concentric_zoom.json"> text </a>
```

> Sostituendo http://view.ixmaps.com con http://embed.ixmaps.com si crea un link per integrare la mappa in un iframe di una pagina HTML



[Numeri attuali](http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_concentric_zoom.json)
(ci sono anche i dati delle regioni e del mondo, basta spostare la mappa)

<a href="http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_concentric_zoom.json"><img src="ixmaps_project_ODS_Prov2019_COVID_concentric_zoom.png" width="500px"></a>



[Curve con la Prevalenza](http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_curves_dhhir_prevalence_sicilia.json) (casi per 10.000 abitanti)

<a href="http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_curves_dhhir_prevalence_sicilia.json"><img src="ixmaps_project_ODS_Prov2019_COVID_curves_dhhir_prevalence_sicilia.png" width="500px"></a>



[Barre con Prevalenza](http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_prevalence_sicilia.json)  (casi per 10.000 abitanti)

<a href="http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_prevalence_sicilia.json"><img src="ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_prevalence_sicilia.png" width="500px"></a>



[Barre con casi per categoria](http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_sicilia.json)

<a href="http://view.ixmaps.com?project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_sicilia.json"><img src="ixmaps_project_ODS_Prov2019_COVID_stackedbars_dhhir_sicilia.png" width="500px"></a>








