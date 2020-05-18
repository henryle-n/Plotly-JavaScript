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
var demInfoBox = d3.select(".panel-body").append("ul");
var demInfoBox = d3.select(".panel-body").attr("style", "padding:10px");

var sliceNo = 9;

// specify color to fill both needle and its root circle
var needleColor = '#610d9e';

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

        Object.entries(demInfo).forEach(([key, value]) => {
            demInfoBox.append("li").text(`${key} : ${value}`);
            // demInfoBox.append("p").text(key + " : " + value);

        });
    

        // ============================= BAR CHART ================
        // create traceBar
        var traceBar = {
            type: "bar",
            x: otuVal.slice(0,10), // slice first 10 data
            y: otuID.slice(0,10).map(eaID => "OTU " + eaID), // slice first 10 data
            text: otuText.slice(0,10), // slice first 10 data
            orientation: 'h',  // horizontal bar chart
            name: 'Top 10 OTU Sample Values',
            marker : {
                // Use otu_ids for the marker colors.
                color: otuID
            }
        };

        // point plot's data to created traceBar 
        var dataBar = [traceBar];
    
        // specify layout format parameters
        var layoutBar = {
            title: `Top 10 Sample Analysis <br> Test Subject ID # <b>${otuName} </b>`,
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
            title: `Sample Analysis <br> Test Subject ID # <b>${otuName} </b>`,
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
                showgrid: true,   // major grid lines
                showline: false,    // axis line
                // rangemode : "tozero"
            }
        };

        Plotly.newPlot("bubble", dataBble, layoutBble);  
        // ====================== GAUGE CHART =====================
        /*
            The idea behind the gauge chart is to create 3 plots/ objects stacked on top of each other
                1. The needle, composed of a triangle (by path method) and a round object = root of the needle (by scatter plot with single data point / chart marker). Position of the needle depends on the wash frequency

                2. Gauge slices by pie chart, composed of slices for each data interval, only half of the pie chart is used

                3. Inner circle (hole of the same pie chart) to masquerade the blank space from the needle to the bottom of the gauge slices 
        */

        // getting the path for needle
        finalPath = pathMapper(wfq);
        // console.log("this is the final path :: ", finalPath);


        // specify how many gauge intervals and how much of a "pie" / "circle" is used to make the fan slices
        var pieAreaUsed = 50;  // only 50% is used
        var sliceArea = pieAreaUsed / sliceNo;

        // create trace data for gauge chart
        var traceGauge = [
            {
                // create needle root (round object) by using scatter plot with a single data point at the origin (0, 0) on Cartisan Coordinates
                type: 'scatter',
                x: [0],
                y: [0],
                marker: {
                    size: 25,  // needle root size
                    color: needleColor
                },
                showlegend: false,
            },
            {
                // create all slices of the gauge by pie chart
                values: [
                    // entire pie chart is 100%, only half is needed, so 50% is used to creat the slices of data interval, the other half is not be used and put to transparent
                    sliceArea, 
                    sliceArea, 
                    sliceArea,
                    sliceArea,
                    sliceArea,
                    sliceArea,
                    sliceArea,
                    sliceArea,
                    sliceArea,
                    100 - pieAreaUsed
                ],
                rotation: 90, // rotate clockwise from 12 o'clock to x-axis for the starting slice
                text: [
                    '0-1',
                    '1-2',
                    '2-3',
                    '3-4',
                    '4-5',
                    '5-6',
                    '6-7',
                    '7-8',
                    '8-9'
                ],
                textinfo: 'text',
                textposition:'inside',	  
                marker: 
                    {
                        colors: [
                            "rgba(255, 224, 219, 0.5)",
                            "rgba(250, 211, 204, .5)",
                            "rgba(245, 190, 182, .5)",
                            "rgba(230, 159, 148, .5)",
                            "rgba(222, 140, 127, .5)",
                            "rgba(212, 115, 100, .5)",
                            "rgba(201, 89, 71, .5)",
                            "rgba(186, 61, 41, .5)",
                            "rgba(171, 42, 22, .5)",
                            "rgba(0, 0, 0, 0)",
                        ]
                    },
                hoverinfo: [
                    '0-1',
                    '1-2',
                    '2-3',
                    '3-4',
                    '4-5',
                    '5-6',
                    '6-7',
                    '7-8',
                    '8-9'
                ],
                hole: 0.5, // only 50% of the slices are made blank
                type: 'pie',
                direction: "clockwise",
                showlegend: false
            }
        ];
        var showGrids = true;
        var layoutGauge = 
            {
                shapes:[
                    {
                        type: 'path',
                        path: finalPath,
                        fillcolor: needleColor,
                        line: 
                            {
                                color: needleColor
                            }
                    }
                ],
                title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',
                height: 600,
                width: 700,
                xaxis: {zeroline:showGrids, showticklabels:showGrids,
                            showgrid: showGrids, range: [-1, 1]},
                yaxis: {zeroline:showGrids, showticklabels:showGrids,
                            showgrid: showGrids, range: [-1, 1]}
            };

        Plotly.newPlot('gauge', traceGauge, layoutGauge);
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
            // title: `Top 10 Sample Analysis | Test Subject ID # ${currSubID}`,
            title: `Top 10 Sample Analysis <br> Test Subject ID # <b>${currSubID} </b>`        }; 

        // update bar plot
        Plotly.restyle("bar_plot", updateBar);
        Plotly.relayout("bar_plot", reLayoutBar);


        // ====================== UPDATE BUBBLE CHART =====================
       // specify what needs to be updated
       var updateBble = {
        text : otuText, 
        x: [otuID],   // Use `otu_ids` for the x values
        y: [otuVal]   // Use `sample_values` for the y values
        };

        // specify new chart title
        var reLayoutBble = {
            title: `Sample Analysis <br> Test Subject ID # <b>${currSubID} </b>`,
        }; 

        // update bar plot
        Plotly.restyle("bubble", updateBble);
        Plotly.relayout("bubble", reLayoutBble);
    
    
        // ================== UPDATE GAUGE CHART =====================
           
        var layoutGauge = 
            {
                shapes:[
                    {
                        type: 'path',
                        path: pathMapper(wfq),
                        fillcolor: needleColor,
                        line: 
                            {
                                color: needleColor
                            }
                    }
                ],

                
            };
        
        Plotly.relayout("gauge", layoutGauge);
    })
}


var finalPath;
function pathMapper(washFreq) {
    var needlePos = 180 * washFreq/ sliceNo;    
    
    //  since zero postiion in polar coordinates start from "postitive x-axis and goes counter-clockwise, need to flip angle back to clockwise
    var needleDeg = 180 - needlePos;
    var needleRadius = 0.5;
    var needleRads = needleDeg * Math.PI / 180;

    // then convert from Polar coordinates back to Cartesian coordinates
    var x = needleRadius * Math.cos(needleRads);         
    var y = needleRadius * Math.sin(needleRads);

    // ============ create needle by using path with Cartisan Coordinates===================
    var baseNeedlePath = 'M -.0 -0.025 L .0 0.025 L'
    var finalPath = baseNeedlePath.concat(" ", String(x), " ", String(y), ' Z');

    return finalPath;
}



