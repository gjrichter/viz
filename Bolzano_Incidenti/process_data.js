/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
window.ixmaps.themeDataObj = window.ixmaps.themeDataObj || {};
(function() {


		// --------------------------------------------------------------------------------------------
		// process loaded data 
		// --------------------------------------------------------------------------------------------

		ixmaps.themeDataObj.process = function(data) {

			// parse date and generate new fields giorno, mese, ora
			
			data.addColumn({source:"DATA",destination:"year"},function(value){
				return (value.split("/")[2]);
			});
			data.addColumn({source:"DATA",destination:"month"},function(value){
				return (value.split("/")[1]);
			});
			data.addColumn({source:"DATA",destination:"day"},function(value){
				var a = value.split("/");
				var date = new Date(a[2],a[1],a[0]);
				return (date.getDay());
			});
			
			var illesiIndex = data.column("ILLESI").index;
			var feritiIndex = data.column("FERITI").index;
			var mortiIndex = data.column("MORTI").index;
			data.addColumn({destination:"pericolo"},function(row){
				return ((row[illesiIndex]||0)*0.3+(row[feritiIndex]||0)*3+(row[mortiIndex]||0)*10);
			});
			
		};

})();
