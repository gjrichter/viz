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
				{lead:"ISTAT",
				 columns:"eta",
				 value:"p1",
				 keep:["reg","N2"],
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
					{lead:"ISTAT",
					 columns:"eta",
					 value:"p1",
					 keep:["reg","N2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "reg",
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
				mydata.sort('data');
				var dateA = mydata.column("data").values();
				var date = dateA.pop();
				date = new Date(date).toLocaleDateString();
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato al: "+date+"</f2>");

				// make result table
				mydata = mydata.pivot(
					{lead:"reg",
					 columns:"eta",
					 value:"p1",
					 keep:["reg","N2"],
					 calc:"sum"}
				);
				
				var i0 = mydata.column("50-59").index;	
				var i1 = mydata.column("60-69").index;	
				var i2 = mydata.column("70-79").index;	
				var i3 = mydata.column("80-89").index;	
				var i4 = mydata.column("90+").index;	
				mydata.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				
				var i0 = dataPop.column("50-59").index;	
				var i1 = dataPop.column("60-69").index;	
				var i2 = dataPop.column("70-79").index;	
				var i3 = dataPop.column("80-89").index;	
				var i4 = dataPop.column("90+").index;	
				dataPop.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "reg",
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
					{lead:"reg",
					 columns:"eta",
					 value:"d2",
					 keep:["reg","N2"],
					 calc:"sum"}
				);

				var i0 = mydata.column("50-59").index;	
				var i1 = mydata.column("60-69").index;	
				var i2 = mydata.column("70-79").index;	
				var i3 = mydata.column("80-89").index;	
				var i4 = mydata.column("90+").index;	
				mydata.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				
				var i0 = dataPop.column("50-59").index;	
				var i1 = dataPop.column("60-69").index;	
				var i2 = dataPop.column("70-79").index;	
				var i3 = dataPop.column("80-89").index;	
				var i4 = dataPop.column("90+").index;	
				dataPop.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "reg",
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

	ixmaps.VACCINI_SOMMINISTRAZIONI_ETA_BOOSTER_DOSE_LAST_POPOLAZIONE = function (theme,options) {

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
					{lead:"reg",
					 columns:"eta",
					 value:"db1",
					 keep:["reg","N2"],
					 calc:"sum"}
				);

				var i0 = mydata.column("50-59").index;	
				var i1 = mydata.column("60-69").index;	
				var i2 = mydata.column("70-79").index;	
				var i3 = mydata.column("80-89").index;	
				var i4 = mydata.column("90+").index;	
				mydata.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				mydata.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				
				var i0 = dataPop.column("50-59").index;	
				var i1 = dataPop.column("60-69").index;	
				var i2 = dataPop.column("70-79").index;	
				var i3 = dataPop.column("80-89").index;	
				var i4 = dataPop.column("90+").index;	
				dataPop.addColumn({destination:"80+"},function(row){
					return Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"70+"},function(row){
					return Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"60+"},function(row){
					return Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})
				dataPop.addColumn({destination:"50+"},function(row){
					return Number(row[i0]) + Number(row[i1]) + Number(row[i2]) + Number(row[i3]) + Number(row[i4]);
				})

				var merger = new Data.Merger();
				merger.addSource(mydata, {
					lookup: "reg",
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
					{lead:"reg",
					 columns:"eta",
					 value:"p1",
					 keep:["reg","N2"],
					 calc:"sum"}
				);

				var mydata2 = mydata.pivot(
					{lead:"reg",
					 columns:"eta",
					 value:"d2",
					 keep:["reg","N2"],
					 calc:"sum"}
				);

				var merger = new Data.Merger();
				merger.addSource(mydata2, {
					lookup: "reg",
					columns: mydata1.columnNames()
				});
				merger.addSource(mydata1, {
					lookup: "reg",
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

    var __mean_3 = function(table) { 
		
		// make mean of 3 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=4; c--){
				records[r][c] = ((Number(records[r][c])+Number(records[r][c-1])+Number(records[r][c-2]))/3).toFixed(2);
			}
		}
		return table;
    }; 

    var __mean_7 = function(table) { 
		
		// make mean of 7 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=8; c--){
				records[r][c] = ((Number(records[r][c])+
								  Number(records[r][c-1])+
								  Number(records[r][c-2])+
								  Number(records[r][c-3])+
								  Number(records[r][c-4])+
								  Number(records[r][c-5])+
								  Number(records[r][c-6])
								 )/7).toFixed(2);
			}
		}
		return table;
    }; 

	// -----------------------------------------------------------------------------------------------               
	// make curve data for categories filtered by age group
	// values per date, calculated in person / 100000 inhabitants
	// the categories are given by the parameter columns
	// the agegroup is given by theme parameter 'fields'
	// ----------------------------------------------------------------------------------------------- 
	/**
	 * make curve data for categories filtered by age group 
	 * rows: regions
	 * columns: values per date and categorie calculated in dose / 100000 inhabitants
	 * @param theme the theme definitiuon object which wants the data 
	 * @param options options of the request, we need options.name to deploy the data 
	 * @param columns the categories (columns of the orginal data table)
	 * @param flag defines the flattening (mobile mean)
	 * @type object
	 * @return the initialized ixmaps object
	 */
	
	ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE = function (theme, options, columns, flag) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var data = dataA[0];
				
			// sort data by date
				
			data.sort('data');
				
			// filter by age group
				
			data = data.select("WHERE eta = "+theme.szFields+"");	

			// make local dates
				
			var dateA = data.column("data").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
				
			// get population lookup for incidence
				
			var dataPop = dataA[1];
			// correct region names in population table
			dataPop.column("Territorio").map(function (value) {
				return value.replace(/\-/," ");
			});
			var pop = [];
			var terrA = dataPop.column("Territorio").values();
			var popA = dataPop.column("Value").values();
			for (var i = 0; i < terrA.length; i++) {
				pop[terrA[i]] = popA[i];
			}

			// get the categories 
				
			var cat = [];
			for ( var i in columns ){	
				cat.push(columns[i]);
			}

			// and nake one pivot table per categorie 
				
			var nCat = cat.length;
			var pivot = [];	
			for ( i=0; i<nCat; i++ ){	
				pivot[i] = data.pivot(
					{lead:"N2",
					 keep:"reg",
					 columns:"data",
					 value:cat[i]}
				);
				pivot[i].column("Total").remove();
				if ( flag && flag.match(/mean3/) ){
					pivot[i] = __mean_3(pivot[i]);
				}
				if ( flag && flag.match(/mean7/) ){
					pivot[i] = __mean_7(pivot[i]);
				}
				
				var indexName = pivot[i].column("reg").index;

				var records = pivot[i].records;
				for ( var r=0; r<records.length; r++ ){
					for ( var c=2; c<records[r].length; c++ ){
						records[r][c] = (records[r][c] / pop[records[r][indexName].replace(/\-/," ")]*100000).toFixed(6);
					}
				}
			}
				
			// get the column names (dates) from one pivot 
				
			var columnsA = pivot[0].columnNames();

			// and merge the 'one per category' pivots into one big table
			// merge the columns defined in columnsA 
			// the column names in the merged table get the appendix .1,.2,.3,... 
			// to indicate the merge source they came from	
		    // ----------------------------------------------------------
				
			var merger = new Data.Merger();
			for ( i=0; i<nCat; i++ ){	
				merger.addSource(pivot[i], {
					lookup: "N2",
					columns: columnsA	
				});
			}
			merger.realize(function (dbTable) {
						
				columnsA.shift();
				columnsA.shift();

				// clean merger columns, remove obsolete columns
				
				dbTable.column("N2.1").rename("N2");
				dbTable.column("reg.1").rename("reg");
				for ( i=2; i<=nCat; i++ ){	
					dbTable.column("N2."+i).remove();
					dbTable.column("reg."+i).remove();
				}

				// set columns of merge result as data fields in actual theme
				// for a stacked curve theme
				// sequenze: date1.1,date1.2,date1.3,date2.1,date2.2,date2.3,...
				// date1.1 = first date from first merged pivot
				
				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					for ( var x=1; x<=nCat; x++){
						fieldsA.push(columnsA[i]+"."+x);
					}
				}

				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = nCat;

				options.theme.szItemField = "N2";
				options.theme.szSelectionField = "N2";

				// make label
				
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dte = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dte.toLocaleDateString());
				var dte = new Date(columnsA[0]);
				xAxis[0]=(dte.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

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
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1","d2"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2","p1"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1","d2"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_REVERS_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2","p1"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_TOTALE_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["totale"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_TOTALE_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["totale"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2"], "mean7");
	};
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_personale_scolastico",
																"categoria_forze_armate",
																"categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_altro"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_altro",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80",
															    "categoria_forze_armate",
															    "categoria_personale_scolastico"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_personale_scolastico",
																"categoria_forze_armate",
																"categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_altro"],"mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_altro",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80",
															    "categoria_forze_armate",
															    "categoria_personale_scolastico"],"mean7");
	};
	
	ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE = function (theme, options, columns, flag) {

		var szUrl1 = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";
		var szUrl2 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/DCIS_POPRES1_13032020145850184.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 
		
		if ( !theme.szFields.length ){
			theme.szFields = "p1";
		}
		
		var broker = new Data.Broker()
		
			.addSource(szUrl1, "csv")
			.addSource(szUrl2, "csv")
			.realize(
				
			function (dataA) {
					
			var dataX = dataA[0];
				
			dataX.sort('data');
			
			// create new data column totale = 1. + 2. dose	
			var p1_i = dataX.column("p1").index;	
			var d2_i = dataX.column("d2").index;	
			dataX.addColumn({destination:"totale"},function(row){
				return Number(row[p1_i]) + Number(row[d2_i]);
			})

			var cat = [];
			for ( var i in columns ){	
				cat.push(columns[i]);
			}

			var nCat = cat.length;
			var pivot = [];	
			for ( i=0; i<nCat; i++ ){	
				data = dataX.select("WHERE eta = "+cat[i]+"");	

				var dateA = data.column("data").values();
				var date = dateA.pop();
				date = new Date(date).toLocaleDateString();
				ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");

				// get population lookup for incidence
				var dataPop = dataA[1];
				// correct region names in population table
				dataPop.column("Territorio").map(function (value) {
					return value.replace(/\-/," ");
				});
				var pop = [];
				var terrA = dataPop.column("Territorio").values();
				var popA = dataPop.column("Value").values();
				for (var p = 0; p < terrA.length; p++) {
					pop[terrA[p]] = popA[p];
				}
				pivot[i] = data.pivot(
					{lead:"N2",
					 keep:"reg",
					 columns:"data",
					 value:theme.szFields}
				);

				pivot[i].column("Total").remove();
				if ( flag && flag.match(/mean3/) ){
					pivot[i] = __mean_3(pivot[i]);
				}
				if ( flag && flag.match(/mean7/) ){
					pivot[i] = __mean_7(pivot[i]);
				}
				if ( flag && flag.match(/mean77/) ){
					pivot[i] = __mean_7(pivot[i]);
					pivot[i] = __mean_7(pivot[i]);
				}
				
				var indexName = pivot[i].column("reg").index;

				var records = pivot[i].records;
				for ( var r=0; r<records.length; r++ ){
					for ( var c=2; c<records[r].length; c++ ){
						records[r][c] = (records[r][c] / pop[records[r][indexName].replace(/\-/," ")]*100000).toFixed(6);
					}
				}
			}
			var columnsA = pivot[0].columnNames();
			for ( i=0; i<nCat; i++ ){
				if ( pivot[i].columnNames().length < columnsA.length ){
					columnsA = pivot[i].columnNames();
				}	
			}
			var merger = new Data.Merger();
			for ( i=0; i<nCat; i++ ){	
				merger.addSource(pivot[i], {
					lookup: "N2",
					columns: columnsA	
				});
			}
			merger.realize(function (dbTable) {
				
				console.log(dbTable);
						
				columnsA.shift();
				columnsA.shift();

				// clean merger columns, remove obsolete columns
				dbTable.column("N2.1").rename("N2");
				dbTable.column("reg.1").rename("reg");
				for ( i=2; i<=nCat; i++ ){	
					dbTable.column("N2."+i).remove();
					dbTable.column("reg."+i).remove();
				}

				// set as data fields in actual theme

				fieldsA = [];
				for ( var i=0; i<columnsA.length; i++ ){
					for ( var x=1; x<=nCat; x++){
						fieldsA.push(columnsA[i]+"."+x);
					}
				}

				options.theme.szFields = fieldsA.slice().join("|");
				options.theme.szFieldsA = fieldsA;
				options.theme.nGridX = nCat;

				options.theme.szItemField = "N2";
				options.theme.szSelectionField = "N2";

				// make label 
				var xAxis = [];
				for ( i in columnsA ){
					xAxis.push(" ");
				}
				var dte = new Date(columnsA[columnsA.length-1]);
				xAxis[columnsA.length-1]=(dte.toLocaleDateString());
				var dte = new Date(columnsA[0]);
				xAxis[0]=(dte.toLocaleDateString());
				options.theme.szXaxisA = xAxis; 

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
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1","d2"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2","p1"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1","d2"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_SECONDA_POPOLAZIONE_SEQUENCE_REVERS_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2","p1"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_TOTALE_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["totale"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2"], "mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_TOTALE_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["totale"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_PRIMA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["p1"], "mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_SECONDA_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["d2"], "mean7");
	};
	
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_personale_scolastico",
																"categoria_forze_armate",
																"categoria_over80",
																"categoria_ospiti_rsa",
																"categoria_personale_non_sanitario",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_altro"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_3 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_altro",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80",
															    "categoria_forze_armate",
															    "categoria_personale_scolastico"],"mean3");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_7_AGE = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE(theme, options, [
																"90+",
																"80-89",
																"70-79",
																"60-69",
																"50-59",
																"40-49",
																"30-39",
																"20-29"],"mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_7_AGE = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE(theme, options, [
																"20-29",
																"30-39",
																"40-49",
																"50-59",
																"60-69",
																"70-79",
																"80-89",
																"90+"],"mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_77_AGE = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE(theme, options, [
																"90+",
																"80-89",
																"70-79",
																"60-69",
																"50-59",
																"40-49",
																"30-39",
																"20-29"],"mean77");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_77_AGE = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE(theme, options, [
																"20-29",
																"30-39",
																"40-49",
																"50-59",
																"60-69",
																"70-79",
																"80-89",
																"90+"],"mean77");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_REVERS_MEAN_7_AGE_60_PIU = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE_AGE(theme, options, [
																"60-69",
																"70-79",
																"80-89",
																"90+"],"mean7");
	};
	ixmaps.VACCINI_SOMMINISTRAZIONI_ALL_NEW_POPOLAZIONE_SEQUENCE_MEAN_7 = function (theme, options) {
		return ixmaps.VACCINI_POPOLAZIONE_COLUMNS_SEQUENCE(theme, options, ["categoria_altro",
																"categoria_operatori_sanitari_sociosanitari",
																"categoria_personale_non_sanitario",
																"categoria_ospiti_rsa",
																"categoria_over80",
															    "categoria_forze_armate",
															    "categoria_personale_scolastico"],"mean7");
	};
	

    ixmaps.VACCINI_SOMMINISTRAZIONI_LAST = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.sort('data');

			mydata = mydata.select("WHERE eta = 70-79");	

			var dateA = mydata.column("data").values();
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
    ixmaps.VACCINI_SOMMINISTRAZIONI_LAST_20_29 = function (theme,options) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.sort('data');

			mydata = mydata.select("WHERE eta = 20-29");	

			var dateA = mydata.column("data").values();
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
	
   ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST = function (theme,options,category) {

		var szUrl = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/somministrazioni-vaccini-latest.csv";

		// -----------------------------------------------------------------------------------------------               
		// read the ArcGis Feature service
		// ----------------------------------------------------------------------------------------------- 

		var myfeed = Data.feed({"source":szUrl,"type":"csv"}).load(function(mydata){
			
			mydata.sort('data');

			var dateA = mydata.column("data").values();
			var date = dateA.pop();
			date = new Date(date).toLocaleDateString();
			ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>aggiornato: "+date+"</f2>");
			
			mydata = mydata.aggregate(category,"reg|N2|eta");
			
			console.log(mydata);
			
			var pivot = mydata.pivot(
				{lead:"N2",
				 keep:"reg",
				 columns:"eta",
				 value:category}
			);
			
			// -----------------------------------------------------------------------------------------------               
			// deploy the data
			// ----------------------------------------------------------------------------------------------- 

			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});

		})
		.error(function(e){alert("error loading data from:\n"+szUrl);});

	};
	
  	ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST_ALTRO = function (theme,options) {
		  return ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST(theme,options,"categoria_altro");
	};

  	ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST_SCUOLA = function (theme,options) {
		  return ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST(theme,options,"categoria_personale_scolastico");
	};

  	ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST_SANITA = function (theme,options) {
		  return ixmaps.VACCINI_SOMMINISTRAZIONI_AGE_LAST(theme,options,"categoria_operatori_sanitari_sociosanitari");
	};

	
	
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
