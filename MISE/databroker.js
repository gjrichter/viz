/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

		// --------------------------------------------------------------------------------------------
		// get multiple data sources and process 
		// --------------------------------------------------------------------------------------------

		ixmaps.prezzi_tipo_latlon = function(theme,options){

			var szUrl = "https://corsme.herokuapp.com/https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv";		
			$.get(szUrl,
				  function(data){
				  ixmaps.setTitleBox("<span style='font-family:open sans,arial;vertical-align:-1px'>"+data.substr(0,25)+"</span>");

			Data.feed({source:"https://corsme.herokuapp.com/https://www.mise.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv",
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).load(function(impianti){
			Data.feed({source:"https://corsme.herokuapp.com/https://www.mise.gov.it/images/exportCSV/prezzo_alle_8.csv",
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
			});	// end $.get()

		};	// end ixmaps.prezzi_tipo_latlon

})();
