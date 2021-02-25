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
					return "NO081";
					break;
				case "NOCSR11":
					return "NO0A1";
					break;
				case "NOCSR15":
					return "NO0A3";
					break;
				case "NOCSR18":
					return "NO071";
					break;
				case "NOCSR30":
					return "NO082";
					break;
				case "NOCSR34":
					return "NO020 ";
					break;
				case "NOCSR38":
					return "NO091";
					break;
				case "NOCSR42":
					return "NO092";
					break;
				case "NOCSR46":
					return "NO0A2";
					break;
				case "NOCSR50":
					return "NO060";
					break;
				case "NOCSR54":
					return "NO074";
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
