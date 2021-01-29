/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from GitHub
 * map area to NUTS
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.VACCINI_SOMMINISTRAZIONI_LAST = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			mydata.condense('area',{keep:"area"});
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(mydata, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
	    ixmaps.VACCINI_PERCENTUALI_POPOLAZIONE_LAST = function (theme,options) {
		
		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-summary-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {

			var mydata = dataA[0];
				
			var dateA = mydata.column("data_somministrazione").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			mydata.condense('area',{keep:"area"});
			
			// get population lookup for incidence
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				if (value == "Emilia-Romagna") {
					return "Emilia Romagna";
				} 
				return value;
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			var iName  = mydata.column("nome_area").index;
			var iValue = mydata.column("prima_dose").index;
			mydata.addColumn({destination:"prima_dose_pop"},function(row){
				return (Number(row[iValue]) / pop[row[iName].replace(/\-/," ")]*100).toFixed(2);	
			});

			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

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
