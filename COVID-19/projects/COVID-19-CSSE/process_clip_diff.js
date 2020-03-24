/**
 * data preprocessing 
 * 
 * get the last 28 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};

(function() {
        
    ixmaps.themeDataObj.process = function(data,options) { 
		
		// get last 28 columns
		var columnsA = data.columnNames();
		
		columnsA.shift();
		columnsA.shift();
		columnsA.shift();
		columnsA.shift();
		
		for ( var i=0; i<data.records.length; i++){
			for ( var c=4; c<data.records[i].length-1; c++ ){
				data.records[i][c] = String(data.records[i][c+1]-data.records[i][c]);
			}
			data.records[i][data.records[i].length-1] = String(data.records[i][data.records[i].length-2]);
		}
		// set as data fields in actual theme
		options.theme.szFields = columnsA.slice().join("|");
		options.theme.szFieldsA = columnsA.slice();
		
		options.theme.nClipFrames = columnsA.length;
		
		// make label 
		var xAxis = [];
		for ( i in columnsA ){
			var dte = new Date(columnsA[i]);
			xAxis.push(dte.toLocaleDateString());
		}
		options.theme.szXaxisA = xAxis; //columnsA.slice();
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
