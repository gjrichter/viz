/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {

	ixmaps.electricity_production_by_source = function (theme, options) {

		/**
		 ** query data from Word Bank API and preprocess for the map 
		 ** 1. get the JSON from Worl Bank with all data of an indicator 
		 ** 2. get the data part from the raw data = feed.data[1]
		 ** 3. import this part of the JSON into a Data object
		 ** 4. make a pivot table width one row pwe country and columns = years
		 ** 5. get an array with all the year columns in the pivot
		 ** 6. set theme definition properties with the years array (theme data, clip frames, ...) 
		 ** 7. deploy the data 
		 **
		 ** the query function will be included into the theme definitions below
		 **/

		/**
		 ** indicator SH.XPD.CHEX.GD.ZS health expenditure % of GDP
		 **/

		var feed = Data.feed({
			source: "../../data/World Dataviz Prize 2023/energy/electricity-production-by-source.csv",
			type: "csv"
		}).load(function(newData) {

			var table = newData;

			table = table.select("WHERE Year BETWEEN 2010 AND 2020");

			var pivot1 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from oil (TWh)"
			});
			var pivot2 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from coal (TWh)"
			});
			var pivot7 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from solar (TWh)"
			});
			var pivot4 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from nuclear (TWh)"
			});
			var pivot5 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from hydro (TWh)"
			});
			var pivot6 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from wind (TWh)"
			});
			var pivot3 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from gas (TWh)"
			});
			var pivot8 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Other renewables excluding bioenergy (TWh)"
			});
			var pivot9 = table.pivot({
				lead: "Code",
				keep: "Entity",
				columns: "Year",
				value: "Electricity from bioenergy (TWh)"
			});

			var years = pivot1.columnNames();
			years = years.slice(2);
			years.pop();

			var merger = new Data.Merger();
			merger.addSource(pivot1, {
				lookup: "Code",
				columns: pivot1.columnNames()
			});
			merger.addSource(pivot2, {
				lookup: "Code",
				columns: pivot2.columnNames()
			});
			merger.addSource(pivot3, {
				lookup: "Code",
				columns: pivot3.columnNames()
			});
			merger.addSource(pivot4, {
				lookup: "Code",
				columns: pivot4.columnNames()
			});
			merger.addSource(pivot5, {
				lookup: "Code",
				columns: pivot5.columnNames()
			});
			merger.addSource(pivot6, {
				lookup: "Code",
				columns: pivot7.columnNames()
			});
			merger.addSource(pivot7, {
				lookup: "Code",
				columns: pivot7.columnNames()
			});
			merger.addSource(pivot8, {
				lookup: "Code",
				columns: pivot8.columnNames()
			});
			merger.addSource(pivot9, {
				lookup: "Code",
				columns: pivot9.columnNames()
			});
			merger.realize(function(dbTable) {

				fieldsA = [];
				for (i in years) {
					fieldsA.push(years[i] + ".1");
					fieldsA.push(years[i] + ".2");
					fieldsA.push(years[i] + ".3");
					fieldsA.push(years[i] + ".4");
					fieldsA.push(years[i] + ".5");
					fieldsA.push(years[i] + ".6");
					fieldsA.push(years[i] + ".7");
					fieldsA.push(years[i] + ".8");
					fieldsA.push(years[i] + ".9");
				}

				var xaxisA = [];
				var i = 0;
				for (i in years) {
					xaxisA.push((i % 10) ? " " : String(Number(years[0]) + Number(i)));
				}
				if (i % 10 > 5) {
					xaxisA.pop();
					xaxisA.push(Number(years[0]) + Number(i));
				}

				if (theme.szId == "curves") {
					theme.setProperties({
						fields: fieldsA.join("|"),
						xaxis: xaxisA.join("|"),
						scale: 1.7 / years.length
					});
				} else {
					theme.setProperties({
						field: years[years.length - 1]
					});
				}

				console.log(dbTable);

				options.type = "jsonDB",
				ixmaps.setExternalData(dbTable, options);
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
