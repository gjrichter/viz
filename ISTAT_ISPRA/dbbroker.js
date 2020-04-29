/**********************************************************************
 dbbroker.js

$Comment: provides JavaScript to query data from data.world and prepare for ixmaps theme
$Source : preprocess.js,v $

$InitialAuthor: guenter richter $
$InitialDate: $
$Author: guenter richter $
$Id: dbbroker.js 8 2017-09-11 00:00:00Z Guenter Richter $

Copyright (c) Guenter Richter
$Log: dbbroker.js,v $
**********************************************************************/

/** 
 * @fileoverview provides JavaScript to query data from data.world and prepare for ixmaps theme
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function() {

	ixmaps.queryData = function(themeObj,options){

		_LOG("dbbroker -----------------------");

		// get an array of the fields we want to query from data.world
		// -----------------------------------------------------------

		var szRequestedFields = "";
		var nFields = themeObj.szFieldsA.length;
		var szField = themeObj.szFieldsA[0];

		for ( var i=0; i<nFields; i++ ){
			szRequestedFields += (i>0?",":"") + themeObj.szFieldsA[i];
		}
		szRequestedFields += ((themeObj.szField100 && themeObj.szField100.length)?(","+themeObj.szField100):"") +
							 ((themeObj.szItemField && themeObj.szItemField.length)?(","+themeObj.szItemField):"") +
							 ((themeObj.szTitleField && themeObj.szTitleField.length)?(","+themeObj.szTitleField):"") +
							 ((themeObj.szAlphaField && themeObj.szAlphaField.length)?(","+themeObj.szAlphaField):"");

		// allways add these fields for filter usage
		if ( !szRequestedFields.match(/pop_2015/i) ){
			szRequestedFields += (",pop_2015");
		}
		if ( !szRequestedFields.match(/denspop/i) ){
			szRequestedFields += (",denspop");
		}
		if ( !szRequestedFields.match(/agmax_50/i) ){
			szRequestedFields += (",agmax_50");
		}
		if ( !szRequestedFields.match(/ALT_LOC_AB/i) ){
			szRequestedFields += (",alt_loc_ab");
		}
		if ( !szRequestedFields.match(/DZPRO/i) ){
			szRequestedFields += (",dzpro");
		}
		if ( !szRequestedFields.match(/DZCOM/i) ){
			szRequestedFields += (",dzcom");
		}
		if ( !szRequestedFields.match(/ALT_LOC_AB/i) ){
			szRequestedFields += (",alt_loc_ab");
		}

		// define the query
		// ----------------

		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://api.data.world/v0/sql/grichter/mappa-dei-rischi-dei-comuni-italiani-indicatori?includeTableSchema=false&query=SELECT%20"+szRequestedFields+"%20FROM%20indicatori_intero_territorio_nazionale",
		  "method": "GET",
		  "headers": {
			"authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OmdyaWNodGVyIiwiaXNzIjoiYWdlbnQ6Z3JpY2h0ZXI6OjFkMTJiY2VjLTQ0NzItNDg2Mi05YmZmLTE2YTBlMDY4Y2M1ZSIsImlhdCI6MTQ5OTA5MzQ0Niwicm9sZSI6WyJ1c2VyX2FwaV9yZWFkIiwidXNlcl9hcGlfd3JpdGUiXSwiZ2VuZXJhbC1wdXJwb3NlIjp0cnVlLCJzYW1sIjp7fX0.udmbmg8WGyDRwEevNUrsWVcF_ESbTuTWq6wTPse2c0oFBRGUVqU5WLPk0iSs0BV2eT-j225Y5rTio_xfIo9TaA",
			"accept": "application/json"
		  },
		  "data": "{}"
		}

		// here we go
		// ----------------

		_LOG("dbbroker - "+JSON.stringify(settings));

		$.ajax(settings).done(function (response) {

			if ( response ){

				_LOG("dbbroker - data received");

				// if we have a data response, we must analyse it, to define an appropriate theme
				// ------------------------------------------------------------------------------

				// load the data using data.js
				Data.object({"source":response,"type":"json"}).import(function(mydata){

					if ( !themeObj.szFlag.match(/EXACT/) ){

						// check if we have distinct values, that is less than 20 unique values 
						//
						// get the values array
						var a = mydata.column(szField).values();
						// get unique valyes array
						var onlyUnique = function(value, index, self) { 
							return self.indexOf(value) === index;
						};
						var u = a.filter( onlyUnique );

						// if less than 20 unique values, assume distinct values -> theme type EXACT
						// 
						nDistinct = u.length;
						if ( nDistinct < 20 ){

							// sort the values to give the themes always the same value sequence
							u.sort();
							// correct known problem; ["dopo ...","entro ...","entro ...",...]
							if ( String(u[0]).match(/dopo/) ){
								u.push(u.shift());
							}
							// set the values in the theme object !!! 
							themeObj.szValuesA = [];
							for ( i=0; i<u.length; i++){
								themeObj.szValuesA.push(String(u[i]));
								themeObj.getStringValueIndex(String(u[i]),"set");
							}
							// set the theme distribution type 
							themeObj.szFlag += "|EXACT";
							themeObj.origColorScheme = ["7","fruit"];
						}else{
							// if we have textual values, make always EXACT 
							if ( isNaN(u[0]) ){
								themeObj.szFlag += "|EXACT";
								themeObj.origColorScheme = ["7","fruit"];
							}
						}
					}	
					
					// finally set the data into the theme and go on
					ixmaps.setData(mydata,{type:"dbtable",name:options.name});

				});	
			}else{
				alert("error loading data from data.world");
			}

		}); // end of ajax http request

	}; // end of data broker  

})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
