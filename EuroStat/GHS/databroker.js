/**********************************************************************
 databroker.js

$Comment: provides JavaScript to query data from data.world and prepare for ixmaps theme
$Source : databroker.js,v $

$InitialAuthor: guenter richter $
$InitialDate: $
$Author: guenter richter $
$Id: databroker.js 8 2020-02-17 00:00:00Z Guenter Richter $

Copyright (c) Guenter Richter
$Log: databroker.js,v $
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
							 ((themeObj.szTitleField && themeObj.szTitleField.length)?(","+themeObj.szTitleField):"") +
							 ((themeObj.szSizeField && themeObj.szSizeField.length)?(","+themeObj.szSizeField):"") +
							 ((themeObj.szAlphaField && themeObj.szAlphaField.length)?(","+themeObj.szAlphaField):"");

		// allways add these fields
		if ( !szRequestedFields.match(/GCPNT_LAT/i) ){
			szRequestedFields += (",GCPNT_LAT");
		}
		if ( !szRequestedFields.match(/GCPNT_LON/i) ){
			szRequestedFields += (",GCPNT_LON");
		}
		if ( !szRequestedFields.match(/UC_NM_MN/i) ){
			szRequestedFields += (",UC_NM_MN");
		}

		// define the query
		// ----------------
		
		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "https://api.data.world/v0/sql/grichter/ghsstatucdb2015mtglober2019av11?includeTableSchema=false&query=SELECT%20"+szRequestedFields+"%20FROM%20GHS_STAT_UCDB2015MT_GLOBE_R2019A_V1_1",
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
