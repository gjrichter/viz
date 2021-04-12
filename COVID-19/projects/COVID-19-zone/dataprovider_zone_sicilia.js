/**
 * data provider for COVID-19 Italy 
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.COVID_ZONE_ROSSE_SICILIA = function (theme,options) {

		var szUrl1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSA38rXb3R9B0lYUtHvgvr9aWcxwiYAxksTTAg-jIbe1qjGh2bGANgUlUnuynG-UL6U2iLY7rgPvuOH/pub?gid=1930494999&single=true&output=csv";
		
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/popolazione_gennaio_2020_sicilia.csv";


		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
				
			mydata = dataA[0];
				
			mydata.column("dataInizio").map(function(value){
				return (new Date(value).toLocaleDateString());
			})	
				
			var merger = new Data.Merger();
			merger.addSource(dataA[0], {
				lookup: "comune"
			});
			merger.addSource(dataA[1], {
				lookup: "Comune"
			});
			merger.realize(function (dbTable) {
				
				console.log(dbTable);

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
