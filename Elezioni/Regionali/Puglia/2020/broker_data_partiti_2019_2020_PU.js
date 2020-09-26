/** 
 * @fileoverview This file provides processing functions for ixmaps 
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};

(function() {
    
 	ixmaps.partiti_2019_2020 = function() { 
		
		Data.feed({source:"https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ISTAT/Com01012019.csv",
				   type:"csv"
				  }).load(function(istat2019){
		Data.feed({source:"https://s3.eu-west-1.amazonaws.com/data.ixmaps.com/ElezioniEuropee2019/Scrutini_comuni_partiti.csv.gz",
				   type:"csv"
				  }).load(function(data2019){
		Data.feed({source:"https://raw.githubusercontent.com/ondata/elezioni_2020/master/regionali/output/scrutini_liste.csv",
				   type:"csv"
				  }).load(function(data2020PU){
			
			// calcolate % for 2019

			var i1 = data2019.column("PARTITO DEMOCRATICO").index;
			var i2 = data2019.column("Total").index;
			data2019.addColumn({destination:'PARTITO DEMOCRATICO PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2019.column("LEGA SALVINI PREMIER").index;
			var i2 = data2019.column("Total").index;
			data2019.addColumn({destination:'LEGA SALVINI PREMIER PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2019.column("MOVIMENTO 5 STELLE").index;
			var i2 = data2019.column("Total").index;
			data2019.addColumn({destination:'MOVIMENTO 5 STELLE PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2019.column("FORZA ITALIA").index;
			var i2 = data2019.column("Total").index;
			data2019.addColumn({destination:'FORZA ITALIA PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2019.column("FRATELLI D'ITALIA").index;
			var i2 = data2019.column("Total").index;
			data2019.addColumn({destination:"FRATELLI D'ITALIA PERCENTO"},function(value){
					return (100/value[i2]*value[i1]);
			});
			
			// make ISTAT pro_com column
			
			console.log(istat2019);
			var procomA = istat2019.lookupArray("PRO_COM_T,C,6","COMUNE_U,C,100");
			console.log(procomA);
			data2019.addColumn({source:"COMUNE",destination:"CODICE ISTAT"},function(value){
								return (procomA[value]);
						});			
			console.log(data2019);

			// make 2020 ER pivot table 
			
			data2020PU = data2020PU.select("WHERE IDREGIONE is 16");
			
			data2020PU = data2020PU.pivot({  
							"lead":	'CODICE ISTAT',
							"cols":	'desc_lis_c',
							"value": 'voti' 
						});

			console.log(data2020PU);
			console.log("start ---------->");
			
			// calcolate % for 2020

			var i1 = data2020PU.column("PARTITO DEMOCRATICO").index;
			var i2 = data2020PU.column("Total").index;
			data2020PU.addColumn({destination:'PARTITO DEMOCRATICO PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2020PU.column("LEGA SALVINI PUGLIA").index;
			var i2 = data2020PU.column("Total").index;
			data2020PU.addColumn({destination:'LEGA PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2020PU.column("MOVIMENTO 5 STELLE").index;
			var i2 = data2020PU.column("Total").index;
			data2020PU.addColumn({destination:'MOVIMENTO 5 STELLE PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2020PU.column("FORZA ITALIA BERLUSCONI PER FITTO").index;
			var i2 = data2020PU.column("Total").index;
			data2020PU.addColumn({destination:'FORZA ITALIA PERCENTO'},function(value){
					return (100/value[i2]*value[i1]);
			});
			var i1 = data2020PU.column("FRATELLI D'ITALIA").index;
			var i2 = data2020PU.column("Total").index;
			data2020PU.addColumn({destination:"FRATELLI D'ITALIA PERCENTO"},function(value){
					return (100/value[i2]*value[i1]);
			});

			console.log(data2020PU);

			Data.merger()
			
				.addSource(data2019,{lookup:"CODICE ISTAT",columns:["CODICE ISTAT","PARTITO DEMOCRATICO PERCENTO","LEGA SALVINI PREMIER PERCENTO","MOVIMENTO 5 STELLE PERCENTO","FORZA ITALIA PERCENTO","FRATELLI D'ITALIA PERCENTO"]})
			
				.addSource(data2020PU,{lookup:"CODICE ISTAT",columns:["PARTITO DEMOCRATICO PERCENTO","LEGA PERCENTO","MOVIMENTO 5 STELLE PERCENTO","FORZA ITALIA PERCENTO","FRATELLI D'ITALIA PERCENTO","Total"]})
			
				.realize(function(newData){

					console.log(newData);

				var i1 = newData.column("PARTITO DEMOCRATICO PERCENTO.1").index;
					var i2 = newData.column("PARTITO DEMOCRATICO PERCENTO.2").index;
					newData.addColumn({destination:'PARTITO DEMOCRATICO VARIAZIONE'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? (value[i2]-value[i1]) : 0 );
					});
					var i1 = newData.column("LEGA SALVINI PREMIER PERCENTO.1").index;
					var i2 = newData.column("LEGA PERCENTO.2").index;
					newData.addColumn({destination:'LEGA VARIAZIONE'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? (value[i2]-value[i1]) : 0 );
					});
					var i1 = newData.column("MOVIMENTO 5 STELLE PERCENTO.1").index;
					var i2 = newData.column("MOVIMENTO 5 STELLE PERCENTO.2").index;
					newData.addColumn({destination:'MOVIMENTO 5 STELLE VARIAZIONE'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? (value[i2]-value[i1]) : 0 );
					});
					var i1 = newData.column("FORZA ITALIA PERCENTO.1").index;
					var i2 = newData.column("FORZA ITALIA PERCENTO.2").index;
					newData.addColumn({destination:'FORZA ITALIA VARIAZIONE'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? (value[i2]-value[i1]) : 0 );
					});
					var i1 = newData.column("FRATELLI D'ITALIA PERCENTO.1").index;
					var i2 = newData.column("FRATELLI D'ITALIA PERCENTO.2").index;
					newData.addColumn({destination:"FRATELLI D'ITALIA VARIAZIONE"},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? (value[i2]-value[i1]) : 0 );
					});

					var i1 = newData.column("PARTITO DEMOCRATICO PERCENTO.1").index;
					var i2 = newData.column("PARTITO DEMOCRATICO PERCENTO.2").index;
					newData.addColumn({destination:'PARTITO DEMOCRATICO VARIAZIONE%'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? ((value[i2]-value[i1])/value[i1]*100) : 0 );
					});
					var i1 = newData.column("LEGA SALVINI PREMIER PERCENTO.1").index;
					var i2 = newData.column("LEGA PERCENTO.2").index;
					newData.addColumn({destination:'LEGA VARIAZIONE%'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? ((value[i2]-value[i1])/value[i1]*100) : 0 );
					});
					var i1 = newData.column("MOVIMENTO 5 STELLE PERCENTO.1").index;
					var i2 = newData.column("MOVIMENTO 5 STELLE PERCENTO.2").index;
					newData.addColumn({destination:'MOVIMENTO 5 STELLE VARIAZIONE%'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? ((value[i2]-value[i1])/value[i1]*100) : 0 );
					});
					var i1 = newData.column("FORZA ITALIA PERCENTO.1").index;
					var i2 = newData.column("FORZA ITALIA PERCENTO.2").index;
					newData.addColumn({destination:'FORZA ITALIA VARIAZIONE%'},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? ((value[i2]-value[i1])/value[i1]*100) : 0 );
					});
					var i1 = newData.column("FRATELLI D'ITALIA PERCENTO.1").index;
					var i2 = newData.column("FRATELLI D'ITALIA PERCENTO.2").index;
					newData.addColumn({destination:"FRATELLI D'ITALIA VARIAZIONE%"},function(value){
						return (((value[i1] != 0) && (value[i2] != 0)) ? ((value[i2]-value[i1])/value[i1]*100) : 0 );
					});

					console.log(newData);
				
					ixmaps.setExternalData(newData, {
						type: "dbtable",
						name: "partiti_2019_2020"
					});
				
				});

		});	// end Data.feed 1
		});	// end Data.feed 2
		});	// end Data.feed 3
 	};

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
