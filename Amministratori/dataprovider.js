
/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

	/**
	 * data broker for ammcom
	 * @return void
	 */

	ixmaps.ammcom = function(theme, option){ 
		
		var broker = new Data.Broker()
			.addSource("https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Amministrazioni/ammcom.csv.gz","csv")
			.realize(
		
		function(dataA) {

			ixmaps.showLoadingArrayStop();
			ixmaps.hideLoading();

			var ammcom = dataA[0];

			ammcom.column("denominazione_comune").map( 
				function(value){
					if ( value.match(/LEINI/i) ) {
						return ("LEINI'");
					}else
					if ( value.match(/GIARDINI NAXOS/i) ) {
						return ("GIARDINI-NAXOS");
					}else
					if ( value.match(/DUINO AURISINA/i) ) {
						return ("DUINO-AURISINA");
					}else{
						return value;
					}
			});
			ammcom.column("data_elezione").map( 
				function(value){
					if ( value.match(/2013/i) ) {
						return ("2013");
					}else
					if ( value.match(/2014/i) ) {
						return ("2014");
					}else
					if ( value.match(/2015/i) ) {
						return ("2015");
					}else
					if ( value.match(/2016/i) ) {
						return ("2016");
					}else
					if ( value.match(/2017/i) ) {
						return ("2017");
					}else{
						return "";
					}
			});
			ammcom.addColumn({source:'partito',destination:'partito_class'},
				function(value){
					if ( value.match(/CEN-DES/i) ) {
						return ("CEN-DES");
					}else
					if ( value.match(/CEN-SIN/i) ) {
						return ("CEN-SIN");
					}else
					if ( value.match(/Partito Democratico/i) ) {
						return ("PD");
					}else
					if ( value.match(/Forza Italia/i) ) {
						return ("FI");
					}else
					if ( value.match(/Lega Nord/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Lega Salvini/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Movimento 5 stelle/i) ) {
						return ("5STELLE");
					}else
					if ( value.match(/Fratelli/i) ) {
						return ("FdI");
					}else
					if ( value.match(/ALLEANZA NAZIONALE/i) ) {
						return ("AN");
					}else
					if ( value.match(/SINISTRA ECOLOGIA/i) ) {
						return ("SEL");
					}else
					if ( value.match(/SINISTRA/i) ) {
						return ("SINISTRA");
					}else
					if ( value.match(/PD-/i) ) {
						return ("PD");
					}else
					if ( value.match(/Unione Di Centro/i) ) {
						return ("UDC");
					}else
					if ( value.match(/Popolo della L/i) ) {
						return ("PDL");
					}else
					if ( value.match(/scelta Civica/i) ) {
						return ("SC");
					}else{
						return ("altro");
					}
			});

			ixmaps.setExternalData(ammcom, {
				type: "dbtable",
				name: options.name
			});
			
		});
	};

	ixmaps.ammcom_pivot = function(theme, option){ 
		
		var broker = new Data.Broker()
			.addSource("https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Amministrazioni/ammcom.csv.gz","csv")
			.realize(
		
		function(dataA) {

			ixmaps.showLoadingArrayStop();
			ixmaps.hideLoading();

			var ammcom = dataA[0];

			ammcom.column("denominazione_comune").map( 
				function(value){
					if ( value.match(/LEINI/i) ) {
						return ("LEINI'");
					}else
					if ( value.match(/GIARDINI NAXOS/i) ) {
						return ("GIARDINI-NAXOS");
					}else
					if ( value.match(/DUINO AURISINA/i) ) {
						return ("DUINO-AURISINA");
					}else{
						return value;
					}
			});
			ammcom.column("data_elezione").map( 
				function(value){
					if ( value.match(/2013/i) ) {
						return ("2013");
					}else
					if ( value.match(/2014/i) ) {
						return ("2014");
					}else
					if ( value.match(/2015/i) ) {
						return ("2015");
					}else
					if ( value.match(/2016/i) ) {
						return ("2016");
					}else
					if ( value.match(/2017/i) ) {
						return ("2017");
					}else{
						return "";
					}
			});
			ammcom.addColumn({source:'partito',destination:'partito_class'},
				function(value){
					if ( value.match(/CEN-DES/i) ) {
						return ("CEN-DES");
					}else
					if ( value.match(/CEN-SIN/i) ) {
						return ("CEN-SIN");
					}else
					if ( value.match(/Partito Democratico/i) ) {
						return ("PD");
					}else
					if ( value.match(/Forza Italia/i) ) {
						return ("FI");
					}else
					if ( value.match(/Lega Nord/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Lega Salvini/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Movimento 5 stelle/i) ) {
						return ("5STELLE");
					}else
					if ( value.match(/Fratelli/i) ) {
						return ("FdI");
					}else
					if ( value.match(/ALLEANZA NAZIONALE/i) ) {
						return ("AN");
					}else
					if ( value.match(/SINISTRA ECOLOGIA/i) ) {
						return ("SEL");
					}else
					if ( value.match(/SINISTRA/i) ) {
						return ("SINISTRA");
					}else
					if ( value.match(/PD-/i) ) {
						return ("PD");
					}else
					if ( value.match(/Unione Di Centro/i) ) {
						return ("UDC");
					}else
					if ( value.match(/Popolo della L/i) ) {
						return ("PDL");
					}else
					if ( value.match(/scelta Civica/i) ) {
						return ("SC");
					}else{
						return ("altro");
					}
			});

			pivot = ammcom.pivot({
				"lead":"denominazione_comune",
				"columns": "sesso",
				"keep": ["codice_regione","codice_provincia","popolazione_censita"]
			}); 
			
			var iTotal = pivot.column("Total").index;
			var iF = pivot.column("F").index;
			pivot.addColumn({
				"destination": "quota"},
				function(row){
					return (row[iF]/row[iTotal]*100);
			});
			ixmaps.setExternalData(pivot, {
				type: "dbtable",
				name: options.name
			});
			
		});
	};
	
	ixmaps.ammcom_extended = function(theme, option){ 
		
		var broker = new Data.Broker()
			.addSource("https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/Amministrazioni/ammcom.csv.gz","csv")
			.realize(
		
		function(dataA) {

			ixmaps.showLoadingArrayStop();
			ixmaps.hideLoading();

			var ammcom = dataA[0];

			ammcom.column("denominazione_comune").map( 
				function(value){
					if ( value.match(/LEINI/i) ) {
						return ("LEINI'");
					}else
					if ( value.match(/GIARDINI NAXOS/i) ) {
						return ("GIARDINI-NAXOS");
					}else
					if ( value.match(/DUINO AURISINA/i) ) {
						return ("DUINO-AURISINA");
					}else{
						return value;
					}
			});
			ammcom.column("data_elezione").map( 
				function(value){
					if ( value.match(/2013/i) ) {
						return ("2013");
					}else
					if ( value.match(/2014/i) ) {
						return ("2014");
					}else
					if ( value.match(/2015/i) ) {
						return ("2015");
					}else
					if ( value.match(/2016/i) ) {
						return ("2016");
					}else
					if ( value.match(/2017/i) ) {
						return ("2017");
					}else{
						return "";
					}
			});
			ammcom.addColumn({source:'partito',destination:'partito_class'},
				function(value){
					if ( value.match(/CEN-DES/i) ) {
						return ("CEN-DES");
					}else
					if ( value.match(/CEN-SIN/i) ) {
						return ("CEN-SIN");
					}else
					if ( value.match(/Partito Democratico/i) ) {
						return ("PD");
					}else
					if ( value.match(/Forza Italia/i) ) {
						return ("FI");
					}else
					if ( value.match(/Lega Nord/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Lega Salvini/i) ) {
						return ("LEGA");
					}else
					if ( value.match(/Movimento 5 stelle/i) ) {
						return ("5STELLE");
					}else
					if ( value.match(/Fratelli/i) ) {
						return ("FdI");
					}else
					if ( value.match(/ALLEANZA NAZIONALE/i) ) {
						return ("AN");
					}else
					if ( value.match(/SINISTRA ECOLOGIA/i) ) {
						return ("SEL");
					}else
					if ( value.match(/SINISTRA/i) ) {
						return ("SINISTRA");
					}else
					if ( value.match(/PD-/i) ) {
						return ("PD");
					}else
					if ( value.match(/Unione Di Centro/i) ) {
						return ("UDC");
					}else
					if ( value.match(/Popolo della L/i) ) {
						return ("PDL");
					}else
					if ( value.match(/scelta Civica/i) ) {
						return ("SC");
					}else{
						return ("altro");
					}
			});

			pivot = ammcom.pivot({
				"lead":"denominazione_comune",
				"columns": "sesso",
				"keep": ["codice_regione","codice_provincia","popolazione_censita"]
			}); 
			
			var iTotal = pivot.column("Total").index;
			var iF = pivot.column("F").index;
			pivot.addColumn({
				"destination": "quota"},
				function(row){
					return (row[iF]/row[iTotal]*100);
			});
			var lookup = pivot.lookupArray("quota","denominazione_comune");
			
			ammcom.addColumn({source:"denominazione_comune",destination:"quota"},function(value){
				return lookup[value];
			});
			
			var iProv = ammcom.column("codice_provincia").index;
			var iCom = ammcom.column("codice_comune").index;
			ammcom.addColumn({destination:"PROCOM"},function(row){
				return String(row[iProv] + substr(("000"+String(row[iCom])),3));
			});
			
			ixmaps.setExternalData(ammcom, {
				type: "dbtable",
				name: options.name
			});
			
		});
	};
	
})();


