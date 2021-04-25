/**
 * data preprocessing 
 * 
 * get the last 28 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.treeDataObj = window.ixmaps.treeDataObj || {};

(function() {
        
    ixmaps.treeDataObj.process = function(data,options) { 
		
		var index_altura = data.column("ALTURA").index;
		var index_perimetro = data.column("PERIMETRO").index;
		
		data.addColumn({
			destination: "product"
		}, function (row) {
			return row[index_altura] * row[index_perimetro];
		});
		
		var sernum = [];
		data.addColumn({
			source: "SERIALNUM",
			destination: "double"
		}, function (value) {
			if ( value == "" ){
				return 0;
			}
			if (sernum[String(value)]){
				return 1;
			}
			sernum[String(value)] = 1;
			return 0;
		});

		return data.select('WHERE "double" > "0"');
		
     };   
 
	ixmaps.htmlgui_colorScheme = function(objTheme){
		if ( objTheme.colorScheme == "user" ){
			for ( i=0; i<objTheme.szLabelA.length; i++){
				var rr = Math.floor(Math.random()*255);
				var bb = Math.floor(Math.random()*155);
				var gg = 200;
				objTheme.colorScheme[i] = "RGB("+rr+","+gg+","+bb+")";
			}
		}
	};
	
	
	
	
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
