/**
 * data preprocessing 
 * 
 * get the last 28 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.CSSE_COVID_CONFIRMED_28 = window.ixmaps.CSSE_COVID_CONFIRMED_28 || {};

(function() {
        
	var __mean_7 = function(table) {
		
		// make mean of 7 days
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=10; c--){
				records[r][c] = ((Number(records[r][c])+
								 Number(records[r][c-1])+
								 Number(records[r][c-2])+
								 Number(records[r][c-3])+
								 Number(records[r][c-4])+
								 Number(records[r][c-5])+
								 Number(records[r][c-6]))/7).toFixed(2);
			}
		}
		var columns = table.columnNames();
		table.column(columns[4]).remove();
		table.column(columns[5]).remove();
		table.column(columns[6]).remove();
		table.column(columns[7]).remove();
		table.column(columns[8]).remove();
		table.column(columns[9]).remove();
		
		return table;
    };  

	ixmaps.CSSE_COVID_CONFIRMED_28.process = function(data,options) { 
		
		data = __mean_7(data);
		
		// get last 28 columns
		var last_28 = data.columnNames().slice(-28);
		
		// set as data fields in actual theme
		options.theme.szFields = last_28.slice().join("|");
		options.theme.szFieldsA = last_28.slice();
		
		// make label ! -1 because of DIFFERENC theme
		options.theme.szLabelA = last_28.slice(-27);
		options.theme.szXaxisA = last_28.slice(-27);
		for ( var i=1; i < options.theme.szXaxisA.length-1; i++ ){
			options.theme.szXaxisA[i] = " ";
		}
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
