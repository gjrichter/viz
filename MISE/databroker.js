/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

		// --------------------------------------------------------------------------------------------
		// get multiple data sources and process 
		// --------------------------------------------------------------------------------------------

		ixmaps.prezzi_tipo_latlon = function(){

			Data.feed({source:"https://raw.githubusercontent.com/gjrichter/viz/master/MISE/anagrafica_impianti_attivi.csv.gz",
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).load(function(impianti){
			Data.feed({source:"https://raw.githubusercontent.com/gjrichter/viz/master/MISE/prezzo_alle_8.csv.gz",
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).load(function(prezzi){

				Data.merger()
				    .addSource(prezzi,{lookup:"idImpianto",columns:["descCarburante","prezzo","isSelf","dtComu"]})
				    .addSource(impianti,{lookup:"idImpianto",columns:["Bandiera","Nome Impianto","Gestore","Indirizzo","Comune","Latitudine","Longitudine"]})
				    .realize(function(newData){
						ixmaps.setExternalData(newData,{"type":"jsonDB","name":"prezzi_tipo_latlon"});
					});

			});	// end Data.feed 1
			});	// end Data.feed 2

		};	// end ixmaps.prezzi_tipo_latlon

})();
