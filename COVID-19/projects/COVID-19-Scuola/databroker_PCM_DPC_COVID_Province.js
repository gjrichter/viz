/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */
/* jshint funcscope:true, evil:true, eqnull:true, loopfunc:true, shadow: true, laxcomma: true, laxbreak: true, expr: true */
/* globals 
	window, ixmaps, alert, Data
*/

window.ixmaps = window.ixmaps || {};
(function () {

	var __process = function (data, options) {

		// make pivot table with columns per day
		data.column("data").map(function (value) {
			return value.split(" ")[0];
		});
        
        data = data.select("WHERE \"denominazione_provincia\" NOT \"In fase\" AND \"denominazione_provincia\" NOT \"Fuori\"");

        var pivot = data.pivot({
			lead: "codice_provincia",
			columns: "data",
			value: "totale_casi",
			keep: ["lat","long","denominazione_provincia"]
		});
        
		return pivot;
	};

	
	ixmaps.PCM_DPC_COVID_1509_3110_INCID_1000 = function (theme, options) {


		var szUrl1 = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-province/dpc-covid19-ita-province.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES_Province_2019.csv";
		var szUrl3 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/Casi-di-positivita-al-Sars-CoV-2-nelle-scuole.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				function (dataA) {

					var mydata = dataA[0];
					var dataPop = dataA[1];
					var dataScuola = dataA[2];
					
					// make pivot: one row x province, data = column 4 ---> 
					var pivot = __process(mydata, options);
					
					var c1 = pivot.column("2020-09-15T17:00:00").index;
					var c2 = pivot.column("2020-10-31T17:00:00").index;

					// make lookupArray: COD_PROV ==> population
					var popA = dataPop.lookupArray("Value","COD_PROV");
					
					pivot.addColumn({destination:"casi"},function(row){
						var before  = Number(row[c1]);
						var last 	= Number(row[c2]);
						return Number(last-before);
				    });
					pivot.addColumn({destination:"incidenza"},function(row){
						var before  = Number(row[c1]);
						var last 	= Number(row[c2]);
						return (Number(last-before)/popA[Number(row[0])]*1000).toFixed(2);
				    });
					
					// add in incidenza Scuola
					dataScuola.condense("Provincia");
					console.log(dataScuola);
					
					var merger = new Data.Merger();
					merger.addSource(pivot, {
						lookup: "denominazione_provincia",
						columns: pivot.columnNames()
					});
					merger.addSource(dataScuola, {
						lookup: "Provincia",
						columns: dataScuola.columnNames()
					});
					merger.realize(function (dbTable) {
						
						var c1 = dbTable.column("I ciclo.2").index;
						var c2 = dbTable.column("II ciclo.2").index;

						// make lookupArray: COD_PROV ==> population
						var popA = dataPop.lookupArray("Value","COD_PROV");

						dbTable.addColumn({destination:"casi.2"},function(row){
							return (Number(row[c1])+Number(row[c2]));
						});
						dbTable.addColumn({destination:"incidenza.2"},function(row){
							return ((Number(row[c1])+Number(row[c2]))/popA[Number(row[0])]*1000).toFixed(2);
						});

						// -----------------------------------------------------------------------------------------------     // deploy the data
						// ----------------------------------------------------------------------------------------------- 

						ixmaps.setExternalData(dbTable, {
							type: "dbtable",
							name: options.name
						});
						
					});

				});

	};
	ixmaps.PCM_DPC_COVID_1509_3110_INCID_1000_ALT = function (theme, options) {
			ixmaps.PCM_DPC_COVID_1509_3110_INCID_1000(theme, options);
	};
	

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
