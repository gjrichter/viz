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

            // load data
            .addSource("https://raw.githubusercontent.com/ondata/rifiutiUrbaniComunaliISPRA/master/ispraRifiuti.csv", "csv")

            // load ISTAT code variations 
            .addSource("https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/Istat/Variazioni_amministrative_territoriali_dal_01011991.csv.gz", "csv")

             // load ISTAT popolazione 
            .addSource("https://s3.eu-central-1.amazonaws.com/maps.ixmaps.com/Istat/Elenco-comuni-italiani.csv", "csv")

            .realize(function (data) {

                var data1 = data[0];

                // filter ISTAT code variations 

                var IstatVar = data[1];
                var IstatVar = IstatVar.select('WHERE "Anno" >= "2010" AND "Anno" <= "2018"');
                var IstatES = IstatVar.select('WHERE "Tipo variazione" = "ES"');
                var IstatAP = IstatVar.select('WHERE "Tipo variazione" = "AP"');

                // make lookup table for ISTAT code mapping 

                var istat_lookupES = IstatES.lookupArray("Codice Istat del Comune associato alla variazione o nuovo codice Istat del Comune", "Codice Istat del Comune");
                var istat_lookupAP = IstatAP.lookupArray("Codice Istat del Comune associato alla variazione o nuovo codice Istat del Comune", "Codice Istat del Comune");

                var istat_lookup = Object.assign({}, istat_lookupES, istat_lookupAP);
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

                // correct obsolet or changed ISTAT codes  

                data1.column("IDComune").map(function (value) {
                    value = value.substr(2, 6);
                    value = istat_lookup['"' + String(value) + '"'] || value;
                    return value.replace(/^0+/, '');
                });
                
                var data2010 = data1.select('WHERE "ANNO" = "2010"');                
                var data2011 = data1.select('WHERE "ANNO" = "2011"');                
                var data2012 = data1.select('WHERE "ANNO" = "2012"');                
                var data2013 = data1.select('WHERE "ANNO" = "2013"');                
                var data2014 = data1.select('WHERE "ANNO" = "2014"');                
                var data2015 = data1.select('WHERE "ANNO" = "2015"');                
                var data2016 = data1.select('WHERE "ANNO" = "2016"');                
                var data2017 = data1.select('WHERE "ANNO" = "2017"');                
 
                // put corrected data into one table 
                // keep only % of RD    

                var merger = new Data.Merger()
                    .addSource(data2010, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2010","Totale RU 2010"]
                    })
                    .addSource(data2011, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2011","Totale RU 2011"]
                    })
                    .addSource(data2012, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2012","Totale RU 2012"]
                    })
                    .addSource(data2013, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2013","Totale RU 2013"]
                    })
                    .addSource(data2014, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2014","Totale RU 2014"]
                    })
                    .addSource(data2015, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2015","Totale RU 2015"]
                    })
                    .addSource(data2016, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2016","Totale RU 2016"]
                    })
                    .addSource(data2017, {
                        lookup: "IDComune",
                        columns: ["PERCRD","RU"],
                        label: ["% RD 2017","Totale RU 2017"]
                    })

                    .setOutputColumns(["IDComune", "COMUNE",
                        "% RD 2010", "% RD 2011", "% RD 2012", "% RD 2013", "% RD 2014", "% RD 2015", "% RD 2016", "% RD 2017","Totale RU 2010", "Totale RU 2011", "Totale RU 2012", "Totale RU 2013", "Totale RU 2014", "Totale RU 2015", "Totale RU 2016", "Totale RU 2017"])

                    .realize(function (dbTable) {
                        
                        dbTable = dbTable.condense("IDComune",{keep:"COMUNE"});
                        
                        var IstatPop = data[2];
                        var istat_lookupPop = IstatPop.lookupArray("Popolazione legale 2011 (09/10/2011)", "Codice Comune formato alfanumerico");
                    
                        dbTable.addColumn({source:"IDComune",destination:"Pop_legale_2011"},function (value){
                            return istat_lookupPop['"' + String(value) + '"'];
                        });

                        ixmaps.setExternalData(dbTable, {
                            type: "dbtable",
                            name: "rifiuti_all"
                        });
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
