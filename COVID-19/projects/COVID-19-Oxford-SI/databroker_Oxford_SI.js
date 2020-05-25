/**
 * data broker for COVID-19 Italy Map
 * loads data fro ArcGis feature service
 * parses it into iXMaps data table
 */

window.ixmaps = window.ixmaps || {};
(function () {
	
	ixmaps.OX_SI_COVID_SEQUENCE = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/stringency_index.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
						// get the columns with date 
					var columns = data.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = columns[0] + " - " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.OX_SI_COVID_SEQUENCE_DEATHS = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/confirmed_deaths.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
						// get the columns with date 
					var columns = data.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = columns[0] + " - " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
						type: "dbtable",
						name: options.name
					});
				});
	};

	ixmaps.OX_SI_COVID_SEQUENCE_CASES = function (theme, options) {

		var szUrl1 = "https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/COVID-19/confirmed_cases.csv";

		var broker = new Data.Broker()
			.addSource(szUrl1, "csv")
			.realize(
				function (dataA) {

					data = dataA[0];
					
						// get the columns with date 
					var columns = data.columnNames();
					columns.shift();
					columns.shift();

					var last = columns.length - 1;

					// and configure the theme
					theme.szFields = columns.slice().join('|');
					theme.szFieldsA = columns.slice();

					// and set the label
					theme.szLabelA = columns.slice();
					
					theme.szSnippet = columns[0] + " - " + columns[last];
					
					var szXaxisA = [];
					for ( var i =0; i<columns.length; i++ ){
						szXaxisA.push(" ");
					}
					szXaxisA[0] = (columns[0]);
					szXaxisA[columns.length-1] = (columns[columns.length-1]);
					theme.szXaxisA = szXaxisA;
								 
					theme.nClipFrames = columns.length;

					// -----------------------------------------------------------------------------------------------               
					// deploy the data
					// ----------------------------------------------------------------------------------------------- 

					ixmaps.setExternalData(data, {
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
