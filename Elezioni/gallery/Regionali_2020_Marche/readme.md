# elezioni-regionali-2020 Marche

Visualizzazioni cartografiche sulla base di dati pubblicati dalla Regione Marche sul sito della Regione,
resi accessibili in formato aperto su GitHub dall'associazione OnData.

Fonte: OnData <a href="https://github.com/ondata/elezioni_2020" target="_blank">GitHub</a> <- <a href="https://www.regione.marche.it/Entra-in-Regione/Elezioni-regionali-2020" target="_blank">Regione Marche</a>

In seguito le varie mappe:

## il candidato vincente


Per ogni comune il colore indica il **candidato** che ha ottenuto il **maggiore numero di voti**.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_winner.json?id=123"></iframe>La mappa dà una veloce informazione sulla prevalenza territoriale degli candidati. Non dà informazioni sul numero di voti degli altri candidati, in altre parole non dice nulla sul vantaggio del vincitore. 

Aggiungendo l'informazione sulla **densità dei votanti** si ottiene la prossima mappa, che in qualche modo enfatizza il **peso del comune sul risultato finale**.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_winner_density.json?id=123"></iframe>

Per  visualizzare il successo del vincitore nei comuni si può variare **l'intensità del colore in base alla percentuale dei voti** del candidato vincente ed aggiungere la percentuale in forma testuale. 

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_winner_text.json?id=123"></iframe>

Oltre al vincitore, questa mappa mostra anche la percentuale della vittoria.

<br>

## Paesaggio politico 

## visualizzazione multivariata del risultato con colori composti

Creando un colore composto a partire dai colori dei candidati in percentuali uguali al risultato ottenuto, si ottiene per ogni comune un colore specifico, che rappresenta non solo il candidato vincitore, ma il risultato nella sua complessità. 

Insieme questi colori creano un paesaggio politico del risultato degli elezioni. L'intensità del colore rappresenta la densità degli votanti. 

> 
>
> *suggerimento: cliccando sui colori nella leggenda si può isolare un candidato o creare paesaggi da solo due concorrenti*.
>

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_compose_density.json?id=123"></iframe>

<br>

## risultati sopra alla propria media

Per ogni comune il colore indica il candidato che ha ottenuto il risultato relativamente maggiore, cioè il risultato maggiore sopra la propria media regionale.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_performer.json?id=123"></iframe>

Come nella mappa dei vincitori, anche qui si può valutare il risultato ottenuto e visualizzarlo al variare dell'intensità del colore.



<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_performer_text.json?id=123"></iframe>

Aggiungendo i valori in forma testuale si nota subito la differenza tra i candidati

<br>

### Paesaggio politico 

### visualizzazione multivariata dei risultati relativi

Anche dai risultati relativi (alla media regionale) si può creare un tema con colori composti dai colori dei candidati: si ottiene per ogni comune un colore specifico, che rappresenta la particolarità del comune rispetto alla media regionale. 

Questi colori nell'insieme creano un paesaggio politico delle presenze relativamente forti sul territorio. 

La mappa **non** è rappresentativa per il risultato delle elezioni, ma indica dove un candidato ha ottenuto i risultati migliori.

> 
>
> *suggerimento: cliccando sui colori nella leggenda si può isolare un candidato o creare paesaggi basati su due concorrenti*.
>
> 

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_compose_harmonize_alpha.json?id=123"></iframe>

<br>

## i risultati forti e deboli delle principali liste

Aggiungiamo a questa mappa i risultati delle liste principali a supporto dei candidati. Le frecce indicano quando il risultato è superiore o inferiore al risultato della lista al livello regionale.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_candidate_compose_harmonize_alpha_pointer_liste.json?id=123"></iframe>

Qui sotto solo i risultati delle liste principali a supporto dei candidati. Le frecce indicano - come sopra - se il risultato è superiore o inferiore rispetto a quello della lista al livello regionale.

> *suggerimento: cliccando sui colori nella leggenda si può isolare una o più liste.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste_pointer.json?id=123"></iframe>

<br>

## l'importanza delle liste

Visto il numero delle liste a supporto di alcuni candidati, ho fatto la seguente mappa per vedere il rapporto tra lista principale del candidato e le liste a supporto. Per le liste a supporto del candidato del centrosinistra ho scelto il colore rosa. Per Fratelli d'Italia, Forza Italia e Lega a supporto del candidato del centrodestra  ho preferito i colori partitici già noti.

Si può notare una grande variazione nel rapporto tra la lista principale e le liste a supporto, da comune a comune.



<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste_pie_candidate_liste.json?id=123"></iframe>

Versione alternativa degli stessi dati con la lista con più voti al centro.
<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste_pie_candidate_liste_star.json?id=123"></iframe>

<br>

Tornando ad una visualizzazione territoriale qui la lista con più voti per comune. Oltre ai territori 'rocca forti' del 'Partito Democratico' e della 'Lega' si nota la presenza vincente di 'Fratelli d'Italia' nelle valli.



<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_winner.json?id=123"></iframe>

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_winner_text.json?id=123"></iframe>

Aggiunto delle frecce per visualizzare il risultato sopra alla propria media di ogni lista, cosi si vede anche risultati importanti delle liste che non hanno il risultato migliore del comune ma un risultato eccezionale rispetto alla propria media.  

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_Liste.json?id=123"></iframe>

<br>
Qui gli stessi risultati eccezionale ma con grandezza relativo al numero di voti presi



<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_pointer.json?id=123"></iframe>


## Guadagni e perdite rispetto a 2019

Alla fine un confronto delle percentuali raggiunte nelle Elezioni Europee del 2019 con le Elezione Regionali del 2020 per i principali partiti.

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste_pointer_2019_diff.json?id=123"></iframe>

La valutazione del risultato la lascio a chi se ne intende.

<br>

Si può aggiungere i guadagni e perdite anche alla mappe delle liste vincenti.

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_diff.json?id=123"></iframe>

<br>

# Altre Mappe

## Paesaggio politico delle liste

### visualizzazione multivariata dei risultati relativi delle liste principali

Anche dai risultati relativi (alla media regionale) si può creare un tema con colori composti dai colori delle liste: si ottiene per ogni comune un colore specifico, che rappresenta la particolarità del comune rispetto alla media regionale. 

Questi colori nell'insieme creano un paesaggio politico delle presenze relativamente forti sul territorio. 

La mappa **non** è rappresentativa per il risultato delle elezioni, ma indica dove un candidato ha ottenuto i risultati migliori.

> 
>
> *suggerimento: cliccando sui colori nella leggenda si può isolare un candidato o creare paesaggi basati su due concorrenti*.
>
> 


<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste+_compose_harmonize.json?id=123"></iframe>



## Candidati e liste minori

### visualizzazione dei candidati non aggregati nel centro sinistra/destra o del Movimento 5S

per visualizzare il successo territoriale dei candidati con minore risultato, qui delle visualizzazioni con solo questi candidati.

> I colori sono casuali

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste-_winner.json?id=123"></iframe>

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste-_winner_text.json?id=123"></iframe>

<br>

Aggregazione dei risultati per una griglia rettangolare di 100 pixel dello schermo. 

> ingrandendo o diminuendo il zoom della mappa, la risoluzione cambia fino a mostrare i singoli comuni

<br>

<iframe id="map" width="100%" height="840" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://gjrichter.github.io/ixmaps/ui/html/embed_sync_Leaflet.html?ui=embed&basemap=ll&align=right&legend=1&name=map3&sync=false&footer=true&project=https://raw.githubusercontent.com/gjrichter/viz/master/Elezioni/Regionali/Marche/2020/ixmaps_project_Marche_2020_Liste-_bars.json?id=123"></iframe>



Fonte: OnData <a href="https://github.com/ondata/elezioni_2020" target="_blank">GitHub</a>  <---  <a href="https://www.regione.marche.it/Entra-in-Regione/Elezioni-regionali-2020" target="_blank">Regione Marche</a>

Visualizzazioni: iXMaps, i progetti (json) per le mappe si trovano qui: <a href="https://github.com/gjrichter/viz/tree/master/Elezioni/Regionali/Marche/2020" target="_blank">GitHub</a>


