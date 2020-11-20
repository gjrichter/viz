## CODID-19 - Sicilia

Visualizzazione di un dataset pubblicato dalla Città di Palermo sul sito istituzionale.

Il dataset si trova qui: [https://www.comune.palermo.it/statistica.php?sel=9&per=2020](https://www.comune.palermo.it/statistica.php?sel=9&per=2020)

nome del documento: **Covid-19 Dati per Comune 20201119**

La visualizzazione consiste in curve che mostrano la prevalenza dei attualmente positivi (positivi per 100.000 abitanti) per ogni comune della Città  Metropolitana di Palermo dal 19.10.2020 al 19.11.2020.

I valori comunali sono aggregati per una griglia di 100 pixel (dello schermo); cosi con il zoomare nella mappa si arriva ad una visualizzazione meno aggregato fino al livello di ogni comune.

codice per includere la mappa in una pagina HTML:

```javascript
<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_PALERMO_positivi_100000_curve_19_10_19_11_2020.json"></iframe>
```



<iframe id="map" width="100%" height="650" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=left&legend=1&name=map3&sync=false&footer=true&popout=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/COVID-19/projects/COVID-19-ODS/ixmaps_project_PALERMO_positivi_100000_curve_19_10_19_11_2020.json"></iframe>




