/**
 * data provider for COVID-19 Italy Viccini Map
 * loads data from GitHub
 * map area to NUTS
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

    ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata = mydata.pivot(
				{lead:"codice_regione_ISTAT",
				 columns:"fascia_anagrafica",
				 value:"prima_dose",
				 keep:["nome_area","codice_NUTS2"],
				 calc:"sum"}
			);

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

   ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST_PERCENT_STACKED = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_2020_regioni_classe_et%C3%A0.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
			function (dataA) {

				var mydata = dataA[0];
				var dataPop = dataA[1];

				mydata = mydata.pivot(
					{lead:"codice_regione_ISTAT",
					 columns:"fascia_anagrafica",
					 value:"prima_dose",
					 keep:["nome_area","codice_NUTS2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "nome_area",
					columns: mydata.columnNames()
				});
				merger.addSource(dataPop, {
					lookup: "Territorio",
					columns: dataPop.columnNames()
				});
				merger.realize(function (dbTable) {
					var index = dbTable.column("20-29.1").index;
					dbTable.column("20-29.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("30-39.1").index;
					dbTable.column("30-39.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("40-49.1").index;
					dbTable.column("40-49.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("50-59.1").index;
					dbTable.column("50-59.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("60-69.1").index;
					dbTable.column("60-69.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("70-79.1").index;
					dbTable.column("70-79.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("80-89.1").index;
					dbTable.column("80-89.2").map(function(value,row){
						return(value-row[index]);
					})
					var index = dbTable.column("90+.1").index;
					dbTable.column("90+.2").map(function(value,row){
						return(value-row[index]);
					})

					ixmaps.setExternalData(dbTable, {
						type: "dbtable",
						name: options.name
					});
				});
			});

	};
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_ETA_PRIMA_DOSE_LAST_POPOLAZIONE = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_2020_regioni_classe_et%C3%A0.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
			function (dataA) {

				var mydata = dataA[0];
				var dataPop = dataA[1];

				// set last date in title
				mydata.sort('data_somministrazione');
				var dateA = mydata.column("data_somministrazione").values();
				var date = dateA.pop();
				date = new Date(date).toLocaleDateString();
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato al: "+date+"</f2>");

				// make result table
				mydata = mydata.pivot(
					{lead:"nome_area",
					 columns:"fascia_anagrafica",
					 value:"prima_dose",
					 keep:["nome_area","codice_NUTS2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "nome_area",
					columns: mydata.columnNames()
				});
				merger.addSource(dataPop, {
					lookup: "Territorio",
					columns: dataPop.columnNames()
				});
				merger.realize(function (dbTable) {
					
					ixmaps.setExternalData(dbTable, {
						type: "dbtable",
						name: options.name
					});
				});
			});

	};
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_ETA_SECONDA_DOSE_LAST_POPOLAZIONE = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_2020_regioni_classe_et%C3%A0.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
			function (dataA) {

				var mydata = dataA[0];
				var dataPop = dataA[1];

				mydata = mydata.pivot(
					{lead:"nome_area",
					 columns:"fascia_anagrafica",
					 value:"seconda_dose",
					 keep:["nome_area","codice_NUTS2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "nome_area",
					columns: mydata.columnNames()
				});
				merger.addSource(dataPop, {
					lookup: "Territorio",
					columns: dataPop.columnNames()
				});
				merger.realize(function (dbTable) {

					ixmaps.setExternalData(dbTable, {
						type: "dbtable",
						name: options.name
					});
				});
			});

	};

	ixmaps.VACCINI_SOMMINISTRAZIONI_ETA_PRIMA_SECONDA_DOSE_LAST_POPOLAZIONE = function (theme,options) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_2020_regioni_classe_et%C3%A0.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
			function (dataA) {

				var mydata = dataA[0];
				var dataPop = dataA[1];

				var mydata1 = mydata.pivot(
					{lead:"nome_area",
					 columns:"fascia_anagrafica",
					 value:"prima_dose",
					 keep:["nome_area","codice_NUTS2"],
					 calc:"sum"}
				);

				var mydata2 = mydata.pivot(
					{lead:"nome_area",
					 columns:"fascia_anagrafica",
					 value:"seconda_dose",
					 keep:["nome_area","codice_NUTS2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata2, {
					lookup: "nome_area",
					columns: mydata1.columnNames()
				});
				merger.addSource(mydata1, {
					lookup: "nome_area",
					columns: mydata2.columnNames()
				});
				merger.addSource(dataPop, {
					lookup: "Territorio",
					columns: dataPop.columnNames()
				});
				merger.realize(function (dbTable) {

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
