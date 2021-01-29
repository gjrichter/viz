/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from GitHub
 * map area to NUTS
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	var areaToNuts = [];
		areaToNuts["PAT"]="ITH2";
		areaToNuts["PIE"]="ITC1";
		areaToNuts["CAM"]="ITF3";
		areaToNuts["PAB"]="ITH1";
		areaToNuts["SAR"]="ITG2";
		areaToNuts["ITA"]="IT";
		areaToNuts["BAS"]="ITF5";
		areaToNuts["MOL"]="ITF2";
		areaToNuts["MAR"]="ITI3";
		areaToNuts["SIC"]="ITG1";
		areaToNuts["FVG"]="ITH4";
		areaToNuts["PUG"]="ITF4";
		areaToNuts["UMB"]="ITI2";
		areaToNuts["ABR"]="ITF1";
		areaToNuts["VDA"]="ITC2";
		areaToNuts["LOM"]="ITC4";
		areaToNuts["EMR"]="ITH5";
		areaToNuts["CAL"]="ITF6";
		areaToNuts["TOS"]="ITI1";
		areaToNuts["LIG"]="ITC3";
		areaToNuts["LAZ"]="ITI4";
		areaToNuts["VEN"]="ITH3";
	
	var areaToNome = [];
		areaToNome["PAT"]="Provincia Autonoma di Bolzano/Bozen";
		areaToNome["PIE"]="Piemonte";
		areaToNome["CAM"]="Campania";
		areaToNome["PAB"]="Provincia Autonoma di Trento";
		areaToNome["SAR"]="Sardegna";
		areaToNome["ITA"]="Italia";
		areaToNome["BAS"]="Basilicata";
		areaToNome["MOL"]="Molise";
		areaToNome["MAR"]="Marche";
		areaToNome["SIC"]="Sicilia";
		areaToNome["FVG"]="Friuli-Venezia-Gorizia";
		areaToNome["PUG"]="Puglia";
		areaToNome["UMB"]="Umbria";
		areaToNome["ABR"]="Abruzzo";
		areaToNome["VDA"]="Valle d'Aosta / Vallée d'Aoste";
		areaToNome["LOM"]="Lombardia";
		areaToNome["EMR"]="Emilia Romagna";
		areaToNome["CAL"]="Calabria";
		areaToNome["TOS"]="Toscana";
		areaToNome["LIG"]="Liguria";
		areaToNome["LAZ"]="Lazio";
		areaToNome["VEN"]="Veneto";

	
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
			
			mydata.addColumn({source:"area",destination:"NUTS"},function(value){
				return areaToNuts[value];	
			});

			mydata.addColumn({source:"area",destination:"Nome"},function(value){
				return areaToNome[value];	
			});
	
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
			
			mydata.addColumn({source:"area",destination:"NUTS"},function(value){
				return areaToNuts[value];	
			});

			mydata.addColumn({source:"area",destination:"Nome"},function(value){
				return areaToNome[value];	
			});
				
			// get population lookup for incidence
			var dataPop = dataA[1];
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
