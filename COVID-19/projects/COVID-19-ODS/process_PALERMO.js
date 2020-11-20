/**
 * data preprocessing 
 * 
 * get the last 56 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.CSSE_COVID_PALERMO_CONFIRMED_CLIP = window.ixmaps.CSSE_COVID_PALERMO_CONFIRMED_CLIP || {};
window.ixmaps.CSSE_COVID_PALERMO_CONFIRMED_SEQUENCE = window.ixmaps.CSSE_COVID_PALERMO_CONFIRMED_SEQUENCE || {};

(function() {
        
	var __clean = function(table) {
		
		// set missing values with last value
		var records = table.records;
		for ( var r=0; r<records.length; r++ ){
			for ( var c=records[r].length-1; c>=5; c--){
				if ((isNaN(Number(records[r][c]))) || (records[r][c] == "") ){
					records[r][c] = records[r][c-1]
				}
			}
		}
		return table;
    };  

	ixmaps.CSSE_COVID_PALERMO_CONFIRMED_CLIP.process = function(data,options) { 
		
		data = __clean(data);
		
		// get columns
		var columns = data.columnNames().slice();
		
		columns.shift();
		columns.shift();
		columns.shift();
		columns.shift();
		
		// set as data fields in actual theme
		options.theme.szFields = columns.slice().join("|");
		options.theme.szFieldsA = columns.slice();
		
		// make label ! -1 because of DIFFERENC theme
		options.theme.szLabelA = columns.slice();
		options.theme.szXaxisA = columns.slice();
		
		options.theme.nClipFrames = columns.length;
		options.theme.nClipFramerate = 24;
		
		ixmaps.setTitle("<span style='color:#888888'> dal: "+options.theme.szXaxisA[0]+" al: "+options.theme.szXaxisA[columns.length-1]+"</span>");
     }; 
	
	 ixmaps.CSSE_COVID_PALERMO_CONFIRMED_SEQUENCE.process = function(data,options) { 
		
		data = __clean(data);
		
		// get columns
		var columns = data.columnNames().slice();
		
		columns.shift();
		columns.shift();
		columns.shift();
		columns.shift();
		
		// set as data fields in actual theme
		options.theme.szFields = columns.slice().join("|");
		options.theme.szFieldsA = columns.slice();
		
		// make label 
		var xAxis = [];
		for ( i in columns ){
			xAxis.push(" ");
		}
		xAxis[0]=columns[0];
		xAxis[columns.length-1]=columns[columns.length-1];
		options.theme.szXaxisA = xAxis; 
		
		ixmaps.setTitle("<span style='color:#888888'> dal: "+options.theme.szXaxisA[0]+" al: "+options.theme.szXaxisA[columns.length-1]+"</span>");
     };   
    
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
