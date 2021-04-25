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
		var index_copa = data.column("DIAMETRO_COPA").index;
		
		data.select('WHERE "PERIMETRO" < "5"');
		data.select('WHERE "DIAMETRO_COPA" < "50"');

		data.addColumn({
			destination: "crown"
		}, function (row) {
			var r = Number(row[index_copa])/2;
			return r*r*Math.PI;
		});

		data.addColumn({
			destination: "product"
		}, function (row) {
			return row[index_altura] * row[index_perimetro];
		});
		
		data.addColumn({
			destination: "weight"
		}, function (row) {
			var d = Number(row[index_perimetro]) / Math.PI * 39.3701;
			var h = Number(row[index_altura]) * 3.28084;
			var p =  (d<11?0.25:0.15) * d*d * h;

 			return p*0.453592*1.2*0.725;
		});

		data.addColumn({
			source: "weight",
			destination: "CO2"
		}, function (value) {
 			return value*0.5*3.6663;
		});
		
		data.addColumn({
			destination: "age"
		}, function (row) {
			var d = Number(row[index_perimetro]) / Math.PI * 39.3701;
 			return d*5;
		});
		
		var index_co2  = data.column("CO2").index;
		var index_age = data.column("age").index;
		data.addColumn({
			destination: "CO2/year"
		}, function (row) {
			return Number(row[index_co2]) / Number(row[index_age]);
		});


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
