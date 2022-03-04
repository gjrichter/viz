# Concessioni demaniali - Canoni e scadenze

Progetti iXmaps ispirato da questo articolo del [Post](https://www.ilpost.it/2022/03/01/mappa-canoni-concessioni-stabilimenti-balneari/) analizza e visualizza i dati pubblicati dal dal ministero delle Infrastrutture sul suo sito in una [pagina](https://dati.mit.gov.it/catalog/dataset/concessioni-demaniali-marittime-a-maggio-2021) dedicata ai open data in merito. 

Questi progetti si trovano in questo [Github ripository](https://github.com/gjrichter/viz/tree/master/Concessioni%20Demaniali/projects) e sono alla base di alcune mappa interattiva per esplorare canoni e scadenze delle concessioni demaniali.



### micro storia con le mappe interattiva

![](.\story.png)
L'applicazione è accessibile con questa URL: [https://gjrichter.github.io/ixmaps/app/Viewer/index.html?layout=right&sidebar=35%&sidebarbutton=0&story=https://gjrichter.github.io/viz/Concessioni%20Demaniali/stories/Concessioni_Demaniali/index.html](https://gjrichter.github.io/ixmaps/app/Viewer/index.html?layout=right&sidebar=35%&sidebarbutton=0&story=https://gjrichter.github.io/viz/Concessioni%20Demaniali/stories/Concessioni_Demaniali/index.html)



### dati, progetti e piattaforma

Tutto il codice dei [progetti](https://github.com/gjrichter/viz/tree/master/Concessioni%20Demaniali/projects) dell'applicazione e del framework [iXmaps](https://gjrichter.github.io/ixmaps/) è pubblicato su GitHub.

Oltre la **scala di 1:20 000** sono visibili anche le **strutture** relative alle concessioni. Un grazie a **Andrea Borruso**  per aver trasformato il dataset pubblicato del ministero (shp) in coordinate utilizzabili per la visualizzazione. E' stato poi trasformato in 'vector tiles' (SVG) per la pittaforma iXMaps e spostato su **Amazon S3**.

Oltre all'applicazione ci sono altri strumenti per vedere e conoscere i progetti:

- [ ] una **lista di tutti progetti** si può vedere qui:
  [https://gjrichter.github.io/ixmaps/app/ProjectP/html/index.html?projects=gjrichter/viz/contents/Concessioni Demaniali/projects](https://gjrichter.github.io/ixmaps/app/ProjectP/html/index.html?projects=gjrichter/viz/contents/Concessioni Demaniali/projects)
- [ ] una **galleria con alcune mappe** interattive definite con questi progetti si apre qui: [https://gjrichter.github.io/viz/Concessioni Demaniali/gallery]( https://gjrichter.github.io/viz/Concessioni Demaniali/gallery ) 
  (Sotto le mappe nella galleria si trova il codice per includerli in una pagina HTML).
- [ ] una mappa sviluppato **passo per passo** da consultare nella piattaforma **ObervableHQ**
  [https://observablehq.com/collection/@gjrichter/concessioni-demaniali]( https://observablehq.com/collection/@gjrichter/concessioni-demaniali ) 



