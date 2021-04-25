/**
 * data preprocessing 
 * 
 * get pivot data table from barrios csv
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.MADRID_BARRIOS_ALL = window.ixmaps.MADRID_BARRIOS_ALL || {};

(function() {
        
    ixmaps.MADRID_BARRIOS_ALL.process = function(data,options) { 
	
		data = data.select("WHERE \"año\" is \"2019\"");
		data = data.pivot(
			{lead:"cod_barrio",
			 columns:"indicador_completo",
			 value:"valor_indicador",
			 keep:["año","barrio"]}
		);
		
		data.fields.forEach(function(value){
			value.id = value.id.trim();
		});
		console.log(data);
		return data;
	};
	
	
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
