/**
 * data preprocessing 
 * 
 * get the last 28 columns from the data table
 * and set the theme fields (columns) appropriate
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.EU_COVID_DATA = window.ixmaps.EU_VOVID_DATA || {};

(function() {
        
    ixmaps.EU_COVID_DATA.process = function(data,options) {
		
		data.column("geo_id_final").map(function(value){
			switch(value){
				case "NOCSR03":
					return "NO01";
			}
			return value.split("X")[0];
		});
		
		var date = data.column("week").values()[0];
		ixmaps.setTitle("<f2 style='color:#888888;background-color:rgba(255,255,255,0.1);padding:0.3em 0.5em;border:#888888 solid 0.5px;border-radius:0.2em'>settimana: "+date+"</f2>");
		
	};
	
})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
