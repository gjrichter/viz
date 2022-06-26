/**
 * data provider for PNRR data processing
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.PNRR_PROGETTI_NON_FINANZIATI = function (theme,options) {


		var szUrl1 = "https://raw.githubusercontent.com/ondata/datiBeneComuneMonitoraggio/main/catalogo/PNRRcontributiComuniRigenerazioneUrbana/output/decreto-fl-30-12-2021-all-2.csv";
		var szUrl2 = "https://raw.githubusercontent.com/ondata/datiBeneComuneMonitoraggio/main/catalogo/PNRRcontributiComuniRigenerazioneUrbana/output/decreto-fl-30-12-2021-all-3.csv";

		var broker = new Data.Broker()

			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(

			function (dataA) {
				
				var tutti = dataA[0];
				var finanziati = dataA[1];
				
				var cupFinanziatiA = finanziati.lookupArray({key:"CUP",value:"Ente"});
				
				tutti.addColumn({destination:"finanziato",source:"CUP"},function(value){
					return cupFinanziatiA[value]?"si":"no";
				});

				ixmaps.setExternalData(tutti, {
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
