# elezioni-regionali-2020 Puglia

Visualizzazioni cartografiche sulla base dei dati pubblicato dal Ministero dell'Interno sul sito 'Eligendo'
e reso accessibile su GitHub dall'associazione OnData.

Fonte: OnData <a href="https://github.com/ondata/elezioni_2020" target="_blank">GitHub</a> <- <a href="https://dait.interno.gov.it/elezioni" target="_blank">Eligendo - Ministero dell'Interno</a>

In seguito le varie mappe:

## il candidato vincente


Per ogni comune il colore indica il candidato il quale ha ottenuto il maggiore numero di voti.  

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_winner.json?id=123"></iframe>La mappa da una veloce informazione sulla prevalenza territoriale degli candidati. Non da informazioni sul numero di voti degli altri candidati, in altre parole non dice nulla sul vantaggio del vincitore. 

Aggiungendo l'informazione sulla densità dei votanti si ottiene la prossima mappa che in qualche modo enfatizza il peso del comune per il risultato finale.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_winner_density.json?id=123"></iframe>

Un altro modo di dare più profondità e variare l'intensità del colore con il percentuale dei voti del candidato vincente



<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_winner_text.json?id=123"></iframe>

Oltre al candidato vincente, questa mappa mostra anche la percentuale della vittoria.

<br>
<br>

## il candidato con il risultato sopra alla propria media

Per ogni comune il colore indica il candidato il quale ha ottenuto il risultato relativamente maggiore, cioè il risultato più ampio sopra la propria media regionale.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_performer.json?id=123"></iframe>

Come nella mappa dei vincitori si può valutare il risultato ottenuto e visualizzarlo variando l'intensità del colore.



<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_performer_text.json?id=123"></iframe>

Aggiungendo il valori in forma testuale si nota subito la differenza tra i candidati



## visualizzazione multivariata del risultato con colori composti

Se si crea un colore composto dai colori degli candidati in percentuali uguali al risultato ottenuto, si ottiene per ogni comune un colore specifico rappresentando non solo il candidato vincitore, ma il risultato nella sua complessità. 

Insieme questi coloro creano un paesaggio politico del risultato degli elezioni. l'intensità del colore rappresenta la densità degli votanti. 

> *suggerimento: cliccando sui colori nella leggenda si può isolare un candidato o creare paesaggi da solo due concorrenti*.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_compose_harmonize_alpha.json?id=123"></iframe>



## i risultati delle liste

Aggiungiamo a questo mappa i risultati delle liste principali a supporto dei candidati. Le frecce indicano quando il risultato è superiore o inferiore al risultato della lista al livello regionale.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_candidate_compose_harmonize_alpha_pointer_liste.json?id=123"></iframe>

Qui sotto solo i risultati delle liste principali a supporto dei candidati. Le frecce indicano come sopra il risultato è superiore o inferiore al risultato della lista al livello regionale.

> *suggerimento: cliccando sui colori nella leggenda si può isolare una o più liste.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_Liste_pointer.json?id=123"></iframe>



## l'importanza delle liste

Visto il numero elevato delle liste a supporto di alcuni candidati, ho fatto la seguente mappa per vedere il rapporto tra lista principale del candidato e le list a supporto. Per le liste a supporto del candidato Emiliano ho scelto il colore rosa. Per Fratelli d'Italia, Forza Italia e Lega a supporto di Fitto ho scelto i colori partitici.

Si può notare una grande variazione nel rapporto tra lista principale e liste a supporto da comune a comune.



<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_Liste_pie_candidate_liste.json?id=123"></iframe>

Si nota anche che in non pochi comuni le liste civiche hanno il risultato maggiore. 



<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_Liste_pie_candidate_liste_star.json?id=123"></iframe>



## Guadagni e perdite rispetto a 2019

Alla fine un confronto delle percentuali raggiunti nelle Elezioni Europee del 2019 con le Elezione Regionale nel 2020 per i principali partiti.

<iframe id="map" width="100%" height="640" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Puglia/2020/ixmaps_project_Puglia_2020_Liste_pointer_2019_diff.json?id=123"></iframe>

La valutazione del risultato lascio a chi si intende.



Fonte: OnData <a href="https://github.com/ondata/elezioni_2020" target="_blank">GitHub</a>  <---  <a href="https://dait.interno.gov.it/elezioni" target="_blank">Eligendo - Ministero dell'Interno</a>

Visualizzazioni: iXMaps



