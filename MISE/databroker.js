/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

		// --------------------------------------------------------------------------------------------
		// get multiple data sources and process 
		// --------------------------------------------------------------------------------------------

		ixmaps.prezzi_tipo_latlon = function(theme,options){
			
			function decodeHTMLEntities(text) {
			  var textArea = document.createElement('textarea');
			  textArea.innerHTML = text;
			  return textArea.value;
			}

			var szUrl = "https://raw.githubusercontent.com/gjrichter/data/master/MISE/anagrafica_impianti_attivi.csv";		
			$.get(szUrl,
				  function(data){
				  ixmaps.setTitleBox("<span style='font-family:open sans,arial;vertical-align:-1px'>"+data.substr(0,25)+"</span>");
				
			data = decodeHTMLEntities(data);	
			data = data.replace(/\"/g,"");
				
			Data.object({source:data,
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).import(function(impianti){
			Data.feed({source:"https://raw.githubusercontent.com/gjrichter/data/master/MISE/prezzo_alle_8.csv",
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).load(function(prezzi){

				var merger = new Data.Merger();
					merger.addSource(prezzi,{lookup:"idImpianto",columns:["descCarburante","prezzo","isSelf","dtComu"]});
					merger.addSource(impianti,{lookup:"idImpianto",columns:["Bandiera","Latitudine","Longitudine"]});
				var newData = merger.realize();

				ixmaps.setExternalData(newData, {
					type: "dbtable",
					name: options.name
				});

			});	// end Data.feed
			});	// end Data.feed
			});	// end $.get()

		};	// end data provider

		ixmaps.impianti_latlon = function(theme,options){
			
			function decodeHTMLEntities(text) {
			  var textArea = document.createElement('textarea');
			  textArea.innerHTML = text;
			  return textArea.value;
			}

			var szUrl = "https://raw.githubusercontent.com/gjrichter/data/master/MISE/anagrafica_impianti_attivi.csv";		
			$.get(szUrl,
				  function(data){
				  ixmaps.setTitleBox("<span style='font-family:open sans,arial;vertical-align:-1px'>"+data.substr(0,25)+"</span>");
				
			data = decodeHTMLEntities(data);	
			data = data.replace(/\"/g,"");
				
			Data.object({source:data,
					   type:"csv",
					   parser: {comments: "Estrazione"}
					  }).import(function(impianti){
	
				ixmaps.setExternalData(impianti, {
					type: "dbtable",
					name: options.name
				});

			});	// end Data.object
			});	// end $.get()

		};	// end data provider


})();
