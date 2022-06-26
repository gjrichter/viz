/**
 * data broker for COVID-19 Maps
 * loads data from Google Doc Sheet maintained by OpenDataSicilia
 * parses into iXMaps data table format and param themes
 */

window.ixmaps = window.ixmaps || {};
(function () {

	/**
	 * ODS_SICILIA_COVID_ORDINANZE_COMUNI
	 */
	
	ixmaps.ORDINANZE_PIVOT = function (theme, options) {

		var szUrl1 = "https://raw.githubusercontent.com/opendatasicilia/ordinanze-covid/main/data.csv";
		var szUrl2 = "https://raw.githubusercontent.com/opendatasicilia/comuni-italiani/main/dati/popolazione_2021.csv";
		var szUrl3 = "https://raw.githubusercontent.com/opendatasicilia/comuni-italiani/main/dati/comuni.csv";

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.addSource(szUrl3, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
			var pop_21 = dataA[1];
			var com_21 = dataA[2];
				
			// make lookupArray: pro_com_t ==> population
			var pop_21_A = pop_21.lookupArray({key:"pro_com_t",value:"pop_res_21"});
				
			// make lookupArray: pro_com_t ==> den. provinciapopulation
			var com_pro_A = com_21.lookupArray({key:"pro_com_t",value:"den_prov"});
				
			// crteate a new table with one day per comune and zona rossa	
				
			var table = [];
			var lastColumn = data.columnNames().length - 1;
			var found = 0;
			var records = data.records;
			var len = records.length;

			// go through the records and create for every record (Comune/Ordinanza) as many new table rows 
			// as days are between data_inizio e data_fine with the appropriate date 

			for ( var r=0; r<records.length; r++ ){
			  var data_inizio = records[r][3];
			  var data_fine = records[r][4];
			  var giorno = 1;
			  var giorni = (new Date(data_fine).getTime() - new Date(data_inizio).getTime()) / 1000 / 60 / 60 / 24;
			  while ( data_inizio != data_fine ) {
				table.push({pro_com:records[r][0],comune:records[r][1],pro:com_pro_A["0"+records[r][0]],date:data_inizio,ord:(giorno==1)?1:0,giorno:giorno,giorni:(giorno==1)?giorni:0,pop:pop_21_A["0"+records[r][0]]});
				data_inizio = new Date(new Date(data_inizio).getTime()+1000*60*60*24).toISOString().split("T")[0];
				giorno++;
			   };
			}

    		// create and return a new Data object from the table 
			var __expand_data = Data.import({"source":table,"type":"json"}).sort("date");
				
			// make pivot from this	
			pivot = __expand_data.pivot({
			  lead: "pro_com",
			  columns: "date",
			  keep: ["comune","pro"],
			  value: "pop"
			})		
				
			var columnsA = pivot.columnNames().slice(3);	
			
			columnsA.pop();
				
			// and configure the theme
			theme.szFields = columnsA.join('|');
			theme.szFieldsA = columnsA;
				
			theme.nClipFrames = columnsA.length;	

			// and set the label
			theme.szLabelA = columnsA;
			theme.szXaxisA = columnsA;

			theme.szSnippet = "dal " + columnsA[0] + " al " + columnsA[columnsA.length - 1];
				
				
				
			// ---------------------------------------------------------------------------------------------
			// deploy the data
			// --------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
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
