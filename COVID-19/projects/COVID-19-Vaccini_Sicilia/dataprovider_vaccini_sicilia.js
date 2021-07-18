/**
 * data provider for COVID-19 Italy 
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.COVID_VACCINI_SICILIA = function (theme,options) {

		var szUrl1 = "https://dati.regione.sicilia.it/dataset/63acfe4d-73a5-4a2b-9c18-ec5b5eee1a5b/resource/30e9d3ea-0c7c-40c0-846b-a36f173028fe/download/targetvaccinaticomunisiciliaprimosemestre2021.csv";
		
		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
				
			mydata = dataA[0];
				
			mydata.condense("CODISTAT");
				
			var iTarget = mydata.column("Target").index;	
			var iVaccini = mydata.column("Vaccinati").index;	
				
			mydata.addColumn({destination:"Percent"},function(row){
				return (row[iVaccini]/row[iTarget]*100);
			});	
			console.log(mydata);	

			// -----------------------------------------------------------------------------------------------             
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});
		});
	};

	ixmaps.COVID_VACCINI_SICILIA_PIVOT = function (theme,options) {

		var szUrl1 = "https://dati.regione.sicilia.it/dataset/63acfe4d-73a5-4a2b-9c18-ec5b5eee1a5b/resource/30e9d3ea-0c7c-40c0-846b-a36f173028fe/download/targetvaccinaticomunisiciliaprimosemestre2021.csv";
		
		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
				
			mydata = dataA[0];
				
			var iTarget = mydata.column("Target").index;	
			var iVaccini = mydata.column("Vaccinati").index;	
				
			mydata.addColumn({destination:"Percent"},function(row){
				return (row[iVaccini]/row[iTarget]*100);
			});
				
			console.log(mydata);
				
			pivot = mydata.pivot({lead:"Comune",
								  keep:"CODISTAT|Target",
								  columns:"classeEta",
								  value:"Percent"});	

			// -----------------------------------------------------------------------------------------------             
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
		});
	};
 	
	ixmaps.COVID_VACCINI_SICILIA_PIVOT_BARS = function (theme,options) {

		var szUrl1 = "https://dati.regione.sicilia.it/dataset/63acfe4d-73a5-4a2b-9c18-ec5b5eee1a5b/resource/30e9d3ea-0c7c-40c0-846b-a36f173028fe/download/targetvaccinaticomunisiciliaprimosemestre2021.csv";
		
		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.realize(
				
			function (dataA) {
				
			mydata = dataA[0];
				
			var iTarget = mydata.column("Target").index;	
			var iVaccini = mydata.column("Vaccinati").index;	
				
			mydata.addColumn({destination:"Percent"},function(row){
				return (row[iVaccini]/row[iTarget]*100);
			});
				
			console.log(mydata);
				
			pivot1 = mydata.pivot({lead:"Comune",
								  keep:"CODISTAT",
								  columns:"classeEta",
								  value:"Target"});	

			pivot2 = mydata.pivot({lead:"Comune",
								  keep:"CODISTAT",
								  columns:"classeEta",
								  value:"Vaccinati"});	
				
			var merger = new Data.Merger();
			merger.addSource(pivot1, {
				lookup: "Comune",
				columns: pivot1.columnNames()
			});
			merger.addSource(pivot2, {
				lookup: "Comune",
				columns: pivot2.columnNames()
			});
			merger.realize(function (dbTable) {

				// -----------------------------------------------------------------------------------------------             
				// deploy the data
				// ----------------------------------------------------------------------------------------------- 

				ixmaps.setExternalData(dbTable, {
					type: "dbtable",
					name: options.name
				});
			});
		});
	};
		
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
