/**********************************************************************
 databroker.js

$Comment: provides JavaScript to preprocess data for 'ISPRA Rifiuti'
$Source : databroker.js,v $

Copyright (c) Guenter Richter
$Log: databroker.js,v $
**********************************************************************/

/** 
 * @fileoverview This file provides preprocessing functions for datasets of 'ISPRA Rifiuti'
 * @author Guenter Richter guenter.richter@medienobjekte.de
 * @version 1.0 
 */

/**
 * define namespace ixmaps
 */

window.ixmaps = window.ixmaps || {};
(function () {

    var data1, data2, data3, data4;

    ixmaps.rifiuti_all = function () {

        var broker = new Data.Broker()

            // load data, one file with years 2010 - 2017, creted by OnData from ISPRA source
            .addSource("https://raw.githubusercontent.com/ondata/rifiutiUrbaniComunaliISPRA/master/ispraRifiuti.csv", "csv")

            // load ISTAT code variations 
            .addSource("https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/Istat/Variazioni_amministrative_territoriali_dal_01011991.csv.gz", "csv")

            // load ISTAT population 
            .addSource("https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/Istat/Elenco-comuni-italiani.csv", "csv")

            .realize(function (data) {

                var data1 = data[0];
                
                // -----------------------------------------------------------------------------------------------               
                // replace all 'obsolete' ISTAT codes (IDComune) with new code (result of unification of comunes)
                // ----------------------------------------------------------------------------------------------- 
                
                // 1. filter ISTAT code variations 

                var IstatVar = data[1];
                var IstatVar = IstatVar.select('WHERE "Anno" >= "2010" AND "Anno" <= "2018"');
                var IstatES = IstatVar.select('WHERE "Tipo variazione" = "ES"');
                var IstatAP = IstatVar.select('WHERE "Tipo variazione" = "AP"');

                // 2. make lookup table for ISTAT code mapping 

                var istat_lookupES = IstatES.lookupArray("Codice Istat del Comune associato alla variazione o nuovo codice Istat del Comune", "Codice Istat del Comune");
                var istat_lookupAP = IstatAP.lookupArray("Codice Istat del Comune associato alla variazione o nuovo codice Istat del Comune", "Codice Istat del Comune");
                var istat_lookup = Object.assign({}, istat_lookupES, istat_lookupAP);
                
                // 3. remove all code changes not within the date of the data file 
                
                delete istat_lookup["\"028051\""];
                delete istat_lookup["\"024011\""];
                delete istat_lookup["\"024069\""];
                delete istat_lookup["\"028074\""];
                delete istat_lookup["\"028081\""];
                delete istat_lookup["\"028051\""];
                delete istat_lookup["\"097080\""];
                delete istat_lookup["\"030050\""];
                delete istat_lookup["\"030125\""];
                delete istat_lookup["\"030134\""];
                delete istat_lookup["\"030080\""];
                delete istat_lookup["\"030038\""];
                delete istat_lookup["\"078108\""];
                delete istat_lookup["\"078044\""];

                istat_lookup["\"002019\""] = "020171";

                // 4. use the lookup to correct obsolet or changed ISTAT codes  

                data1.column("IDComune").map(function (value) {
                    value = value.substr(2, 6);
                    value = istat_lookup['"' + String(value) + '"'] || value;
                    return value.replace(/^0+/, '');
                });

                // -----------------------------------------------------------------------------------------------               
                // make pivot table with the % RD for all years
                // ----------------------------------------------------------------------------------------------- 
                
                var pivot =  data1.pivot({
                    "lead": ['IDComune'],
                    "keep": ['COMUNE'],
                    "cols": 'ANNO',
                    "value": "PERCRD"
                });

                // -----------------------------------------------------------------------------------------------               
                // add population column
                // ----------------------------------------------------------------------------------------------- 

                var IstatPop = data[2];
                var istat_lookupPop = IstatPop.lookupArray("Popolazione legale 2011 (09/10/2011)", "Codice Comune formato alfanumerico");

                pivot.addColumn({
                    source: "IDComune",
                    destination: "Pop_legale_2011"
                }, function (value) {
                    return istat_lookupPop['"' + String(value) + '"'];
                });

                // -----------------------------------------------------------------------------------------------               
                // deploy the corrected pivot data
                // ----------------------------------------------------------------------------------------------- 
                
                ixmaps.setExternalData(pivot, {
                    type: "dbtable",
                    name: "rifiuti_all"
                });
            });
    };


})();

/**
 * end of namespace
 */

// -----------------------------
// EOF
// -----------------------------
