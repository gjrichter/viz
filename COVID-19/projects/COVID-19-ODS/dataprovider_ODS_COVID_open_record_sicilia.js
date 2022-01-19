/**
 * data provider for COVID-19 Maps
 * loads data from ODS GitHub covid-open-report-sicilia
 * parses into iXMaps data table format and param themes
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.COVID_19_SICILIA_CASI_DIFF_LATEST = window.ixmaps.COVID_19_SICILIA_CASI_DIFF_LATEST || {};
window.ixmaps.COVID_19_SICILIA_INCIDENZA_LATEST = window.ixmaps.COVID_19_SICILIA_INCIDENZA_LATEST || {};

(function () {
	
	ixmaps.COVID_19_SICILIA_CASI_DIFF_LATEST.process = function(data,options){

		var pivot = data.pivot({
			lead: "pro_com_t",
			columns: "data",
			keep: "comune",
			value: "casi"
		  });

		pivot.column("Total").remove();

		/** get columns */
		var columnsA = pivot.columnNames().slice(2);

		/** set as data fields in actual theme */
		options.theme.setProperties({
			fields:columnsA.slice(-2).join("|")
		});

		/** set label and xaxis in actual theme */
		options.theme.style.setProperties({
			"snippet" :"al " + columnsA[columnsA.length-1]
		});

		/** set the date frame as map title */
		ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:24px;color:#444444'>" + " al " + columnsA[columnsA.length-1] +"</span>");

		return pivot;
	};

	ixmaps.COVID_19_SICILIA_INCIDENZA_LATEST.process = function(data,options){

		var pivot = data.pivot({
			lead: "pro_com_t",
			columns: "data",
			keep: "comune",
			value: "incidenza"
		  });

		pivot.column("Total").remove();

		/** get columns */
		var columnsA = pivot.columnNames().slice(2);

		/** set as data fields in actual theme */
		options.theme.setProperties({
			fields:columnsA.slice(-2).join("|");
		});

		/** set label and xaxis in actual theme */
		options.theme.style.setProperties({
			"snippet" :"al " + columnsA[columnsA.length-1]
		});

		/** set the date frame as map title */
		ixmaps.setTitle("<span style='font-family:courier new,Raleway,arial,helvetica;font-size:24px;color:#444444'>" + " al " + columnsA[columnsA.length-1] +"</span>");

		return pivot;
	};

 	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
