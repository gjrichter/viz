/**
 * data provider for CKAN Open Data Marche
 * loads info and data from CKAN 
 * controls data
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	var nuts2 = {};

	nuts2["PIEMONTE"] = "ITC1";
	nuts2["VALLE D'AOSTA"] = "ITC2";
	nuts2["LOMBARDIA"] = "ITC4";
	nuts2["VENETO"] = "ITH3";
	nuts2["FRIULI VENEZIA GIULIA"] = "ITH4";
	nuts2["LIGURIA"] = "ITC3";
	nuts2["EMILIA ROMAGNA"] = "ITH5";
	nuts2["TOSCANA"] = "ITI1";
	nuts2["UMBRIA"] = "ITI2";
	nuts2["MARCHE"] = "ITI3";
	nuts2["LAZIO"] = "ITI4";
	nuts2["ABRUZZO"] = "ITF1";
	nuts2["MOLISE"] = "ITF2";
	nuts2["CAMPANIA"] = "ITF3";
	nuts2["PUGLIA"] = "ITF4";
	nuts2["BASILICATA"] = "ITF5";
	nuts2["CALABRIA"] = "ITF6";
	nuts2["SICILIA"] = "ITG1";
	nuts2["SARDEGNA"] = "ITG2";
	nuts2["BOLZANO-BOZEN"] = "ITH1";
	nuts2["TRENTO"] = "ITH2";
	
	
	
	

    ixmaps.MARCHE_MOVIMENTI_REGIONI_2019 = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/GoodPA/Arrivi%20e%20presenze%20per%20tipo%20di%20esercizio%20e%20REGIONE%20ITALIANA%20di%20provenienza%20dei%20turisti_2019.csv.gz";
		
		var broker = Data.broker();
			broker.addSource(szUrl,"csv");
		
			broker.realize(function(dataA) {
				
				var mydata = dataA[0];
				
				mydata.addColumn({"destination":"target"},function(row){
					return "ITI3";
					});
				mydata.addColumn({"source":"nome_regione","destination":"nuts2"},function(value){
					return nuts2[value];
					});
				
				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
				});
			});
	};
	
    ixmaps.MARCHE_MOVIMENTI_WORLD_2019 = function (theme,options) {

		var szUrl = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/GoodPA/Arrivi%20e%20presenze%20per%20rtipo%20di%20esercizio%20e%20STATO%20ESTERO%20di%20provenienza%20dei%20turisti_2019.csv.gz";
		
		var broker = Data.broker();
			broker.addSource(szUrl,"csv");
		
			broker.realize(function(dataA) {
				
				var mydata = dataA[0];
				
				mydata.addColumn({"destination":"target"},function(row){
					return "ITA";
					});

				ixmaps.setExternalData(mydata, {
					type: "dbtable",
					name: options.name
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
