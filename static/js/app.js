// d3 promise for json
promise = d3.json('data/samples.json');

//create an array of all subject IDs 
promise.then(data => {
    var subjID = data.names;
    // console.log("this is subID", subjID);
    d3.select("select").selectAll("option")
    .data(subjID)
    .enter() // creates placeholder for new data
    .append("option") // appends a option to placeholder
    .text(function (idNum) {return idNum});
});

// ====================== BAR CHART =======================    
// function to load initial subjID 
var demInfoBox = d3.select(".panel-body");

function init() {

    d3.selectAll("#selDataset").on("change", updatePlotly);

    otuID = promise.then(data => {
        // get subject name
        var otuName = data.names[0];
        // get OTU IDs
        var otuID = data.samples[0].otu_ids;
        // OTU Values 
        var otuVal = data.samples[0].sample_values;
        // OTU Hover-over Text
        var otuText = data.samples[0].otu_labels;

        // extract the demographic info
        demInfoBox.html("");
        var demInfo = data.metadata.filter(row => row.id == otuName)[0];
        wfq = demInfo.wfreq;
        console.log("wash frequency", wfq);
        Object.entries(demInfo).forEach(([key, value]) => {
            demInfoBox.append("p").text(`${key}: ${value}`);
        });
    

        // ============================= BAR CHART ================
        // create traceBar
        var traceBar = {
            type: "bar",
            x: otuVal.slice(0,10), // slice first 10 data
            y: otuID.slice(0,10).map(eaID => "OTU " + eaID), // slice first 10 data
            text: otuText.slice(0,10), // slice first 10 data
            orientation: 'h',  // horizontal bar chart
            name: 'Top 10 OTU Sample Values'
        };

        // point plot's data to created traceBar 
        var dataBar = [traceBar];
    
        // specify layout format parameters
        var layoutBar = {
            title: `Top 10 Sample Analysis | Test Subject ID # ${otuName}`,
            xaxis: {
                title: {
                    text: "Sample Values"
                },
                showgrid : true, // major grid lines 
                showline: true,   // axis line
                rangemode : "tozero"
            },
            yaxis: {
                title: {
                    text: "Operational Taxonomic Units"
                },  
                autorange: "reversed",
                showgrid : true,   // major grid lines
                showline: true,    // axis line
                rangemode : "tozero"
            }
        };    
    
        // create plot with tag id=bar (from index.HTML)  
        Plotly.newPlot("bar_plot", dataBar, layoutBar);
        
        
        // ======================== BUBBLE CHART =======================
        
        console.log("bubble size = sample values :: ", otuVal);
        // Use sample_values for the y values.
        var traceBble = {
            // Use otu_ids for the x values.
            x : otuID,
            y : otuVal,
            marker : {
                // Use otu_ids for the marker colors.
                color: otuID,

                 // Use sample_values for the marker size.
                size: otuVal
            },
            mode :'markers',

            // Use otu_labels for the text values.
            text: otuText 
        };

        
        var dataBble = [traceBble];

        var layoutBble = {
            title: `Sample Analysis | Test Subject ID # ${otuName}`,
            showlegend: false,
            height: 600,
            width: 1000,
            
            xaxis: {
                title: {
                    text: "OTU"
                },
                showgrid : true, // major grid lines 
                showline: false   // axis line
            },
            yaxis: {
                title: {
                    text: "Sample Values"
                },  
                showgrid : true,   // major grid lines
                showline: false,    // axis line
                // rangemode : "tozero"
            }
        };

        Plotly.newPlot("bubble", dataBble, layoutBble);  
        
        // ================== GAUGE CHART =====================
        
        // OPTION 1: =========================
        // var traceGauge = [
        //     {
        //         domain: {
        //             x: [0, 1], 
        //             y: [0, 1] },
        //         value: wfq,
        //         title: { text: "Scrubs per Week" },
        //         type: "indicator",
        //         mode: "gauge+number"
        //     }
        // ];
        
        // var layoutGauge = { width: 500, height: 500, margin: { t: 0, b: 0 } };
        // Plotly.newPlot('gauge', traceGauge, layoutGauge);

        // OPTION 2:====================
        // var traceGauge = [
        //     {
        //       type: "indicator",
        //       mode: "gauge+number",
        //       value: wfq,
        //       title: {text: "Scrubs per Week", font: { size: 24 } },
        //       gauge: {
        //         axis: {range: [0, 9], tickwidth: 1, tickcolor: "darkblue"},
        //         bar: {color: "darkkhaki"},
        //         bgcolor: "white",
        //         borderwidth: 2,
        //         bordercolor: "black",
        //         steps: [
        //           {range: [0, 1], color: "white"},
        //           {range: [1, 2], color: "oldlace"},
        //           {range: [2, 3], color: "cornsilk"},
        //           {range: [3, 4], color: "antiquewhite"},
        //           {range: [4, 5], color: "bisque"},
        //           {range: [5, 6], color: "wheat"},
        //           {range: [6, 7], color: "tan"},
        //           {range: [7, 8], color: "goldenrod"},
        //           {range: [8, 9], color: "darkgoldenrod"}
        //         ],
        //         threshold: {
        //           line: {color: "orange", width: 3},
        //           thickness: 2,
        //           value: 0
        //         }
        //       }
        //     }
        //   ];
          
        //   var layoutGauge = {
        //     width: 500,
        //     height: 400,
        //     margin: {t: 0, r: 0, l: 0, b: 0},
        //     paper_bgcolor: "white",
        //     font: {color: "firebrick", family: "Arial"}
        //   };
          
        //   Plotly.newPlot('gauge', traceGauge, layoutGauge);


          // Enter a speed between 0 and 180

        //   OPTION 3: ===================
        
        var level = 180* wfq/9;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = 0.55;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        // var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        // ========= only for needle
        var mainPath = 'M -.0 -0.015 L .0 0.015 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        console.log("this is path needle :: ", path);



        var traceGauge = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['0-1', '1-2', '2-3', '3-4',
                    '4-5', '5-6', '6-7', '7-8', '8-9'].reverse(),
        textinfo: 'text',
        textposition:'inside',	  
        // marker: {colors: [
        //     'rgba(14, 127, 0, .5)',
        //     'rgba(14, 127, 0, .5)',
        //     'rgba(14, 127, 0, .5)',
        //     'rgba(110, 154, 22, .5)',
        //     'rgba(170, 202, 42, .5)',
        //     'rgba(202, 209, 95, .5)',
        //     'rgba(210, 206, 145, .5)',
        //     'rgba(232, 226, 202, .5)',
        //     'rgba(230, 255, 255, 0.5)',
        //     'rgba(255, 255, 255, 0)'
        // ]},

        marker: {colors: [
            'rgba(171, 42, 22, .5)',
            'rgba(186, 61, 41, .5)',
            'rgba(201, 89, 71, .5)',
            'rgba(212, 115, 100, .5)',
            'rgba(222, 140, 127, .5)',
            'rgba(230, 159, 148, .5)',
            'rgba(245, 190, 182, .5)',
            'rgba(250, 211, 204, .5)',
            'rgba(255, 224, 219, 0.5)',
            'rgba(255, 255, 255, 0)'
        ]},
        // labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
        // hoverinfo: 'label',
        hole: 0.5,
        type: 'pie',
        showlegend: false
        }];
        var showBool = false;
        var layoutGauge = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',
        height: 600,
        width: 700,
        xaxis: {zeroline:showBool, showticklabels:showBool,
                    showgrid: showBool, range: [-1, 1]},
        yaxis: {zeroline:showBool, showticklabels:showBool,
                    showgrid: showBool, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', traceGauge, layoutGauge, {showSendToCloud:true});
    })
}
d3.selectAll("#selDataset").on("change", updatePlotly);


function updatePlotly () {
    d3.event.preventDefault();
 
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var currSubID = dropdownMenu.property("value");
    
    // filter data based on user selection of "Test Subject ID No."
    promise.then(data => {    

        // extract the otu_ids array from the json
        var subjArr = data.samples.filter(row => row.id == currSubID);

        // extract metadata and make a box
        demInfoBox.html("")
        demInfo = data.metadata.filter(row => row.id == currSubID)[0];
        wfq = demInfo.wfreq; // wash frequency 
        Object.entries(demInfo).forEach(([key, value]) => {
            demInfoBox.append("p").text(`${key}: ${value}`);
        });

        // get OTU IDs
        var otuID = subjArr[0].otu_ids;

        // OTU Values 
        var otuVal = subjArr[0].sample_values;

        // OTU Hover-over Text
        var otuText = subjArr[0].otu_labels;


        // ====================== UPDATE BAR CHART ========================
        // specify what needs to be updated
        var updateBar = {
            text : otuText.slice(0,10),  // take only top 10 data points 
            x: [otuVal.slice(0,10)],
            y: [otuID.slice(0,10).map(eaID => `OTU ${eaID}`)]
        };

        // specify new graph title
        var reLayoutBar = {
            title: `Top 10 Sample Analysis | Test Subject ID # ${currSubID}`,
        }; 

        // update bar plot
        Plotly.restyle("bar_plot", updateBar);
        Plotly.relayout("bar_plot", reLayoutBar)


    // ====================== BUBBLE CHART =====================
        console.log("bubble size = sample values :: ", otuVal);
       // specify what needs to be updated
       var updateBble = {
        text : otuText, 
        x: [otuID],   // Use `otu_ids` for the x values
        y: [otuVal]   // Use `sample_values` for the y values
        };

    // specify new chart title
    var reLayoutBble = {
        title: `Sample Analysis | Test Subject ID # ${currSubID}`,
    }; 

    // update bar plot
    Plotly.restyle("bubble", updateBble);
    Plotly.relayout("bubble", reLayoutBble)
    
    
    // ================== GAUGE CHART =====================

    // var updateGauge = {
    //         value: wfq
    //         // title: { text: "Scrubs per Week" },
    //     };
    
    // Plotly.restyle("gauge", updateGauge);
    })  
}


// Call updatePlotly() when a change takes place to the DOM
console.info("attempting event handling");
console.log(d3.select("#selDataset")); 




