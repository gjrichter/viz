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
		
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
