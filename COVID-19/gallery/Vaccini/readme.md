## CODID-19 - Vaccini

Visualizzazione di dati sul progresso dei vaccini anti Covid-19 scaricati ciclicamente da onData dal sito del Ministero della Salute e reso accessibili in un archivio pubblicato su GitHub.

Il dataset si trova qui: [https://github.com/ondata/covid19italia/tree/master/webservices/vaccini](https://github.com/ondata/covid19italia/tree/master/webservices/vaccini)



## il progresso dei vaccini anti COVID-19 

La visualizzazione mostra i **vaccini attualmente somministrati** per Regione (confini delle Regioni) e **l'evoluzione delle somministrazioni** giorno per giorno (simbolo) 

codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_clip_primula.json.json"></iframe>
```



<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&popout=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_clip_primula.json"></iframe>

## il progresso dei vaccini anti COVID-19 in %

La visualizzazione mostra le **dosi consegnate** e le **somministrazioni** in  **percentuali della popolazione** delle Regioni.

Le dosi consegnate alle Regioni figurano come un fiore pallido che rappresenta il numero di vaccini fino ad oggi consegnate per 100 abitanti. Le somministrazioni sono rappresentati da fiori in pieno colore e crescono con la percentuale della popolazione vaccinata. La differenza tra i due fiori visualizza la percentuale dei vaccini effettuati rispettivo alle dosi consegnate.



codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_clip_primula_percentuale_popolazione_sagoma.json"></iframe>
```



<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&popout=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_clip_primula_percentuale_popolazione_sagoma.json"></iframe>

## i vaccini anti COVID-19 in % (curve)

La visualizzazione mostra **l'evoluzione del percentuale** dei vaccini somministrati (in % della popolazione della Regione) .

codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_curve_primula_percent_population.json"></iframe>
```



<iframe id="map" width="100%" height="850" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&popout=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-Vaccini/ixmaps_project_Vaccini_curve_primula_percent_population.json"></iframe>



# Visualizzazioni realizzati da altri  



### - Our World in Data  



<iframe src="https://ourworldindata.org/grapher/covid-vaccination-doses-per-capita?tab=chart&stackMode=absolute&time=latest..2021-01-06&region=World" loading="lazy" style="width: 100%; height: 600px; border: 0px none;"></iframe>












