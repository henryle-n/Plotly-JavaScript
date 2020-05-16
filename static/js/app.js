// d3 promise for json
promise = d3.json('data/samples.json');

//create an array of all subject IDs 
promise.then(data => {
    var subjID = data.names;
    var samples = data.samples;
    // console.log("this is subID", subjID);
    d3.select("select").selectAll("option")
    .data(subjID)
    .enter() // creates placeholder for new data
    .append("option") // appends a option to placeholder
    .text(function (idNum) {return idNum});
});

// ====================== BAR CHART =====================    
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
        Object.entries(demInfo).forEach(([key, value]) => {
            demInfoBox.append("p").text(`${key}: ${value}`);
        });
    
        // create traceBarBar
        var traceBar = {
        type: "bar",
        x: otuVal.slice(0,10), // slice first 10 data
        y: otuID.slice(0,10).map(eaID => "OTU " + eaID), // slice first 10 data
        text: otuText.slice(0,10), // slice first 10 data
        orientation: 'h',  // horizontal bar chart
        name: 'OTU vs. Sample Values'
        };

        // point plot's data to created traceBar 
        var data = [traceBar];
    
        // specify layout format parameters
        var layout = {
            title: `Sample Analysis of Test Subject ID # ${otuName}`,
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
        Plotly.newPlot("bar_plot", data, layout);
        
        
        // ====================== BUBBLE CHART =====================
        

        // Use sample_values for the y values.
        var traceBble = {
            // Use otu_ids for the x values.
            x : otuID,
            y : otuVal,
            marker : {
                // Use otu_ids for the marker colors.
                // color: ['red', 'blue', 'green'],

                 // Use sample_values for the marker size.
                size: otuVal
            },
            mode :'markers',

            // Use otu_labels for the text values.
            text: otuText 
        };

        
        var dataBble = [traceBble];

        var layoutBble = {
            title: 'Bubble Chart',
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: {
                    text: "Sample Values"
                },
                showgrid : true, // major grid lines 
                showline: true   // axis line
            },
            yaxis: {
                title: {
                    text: "Sample Values"
                },  
                showgrid : true,   // major grid lines
                showline: true,    // axis line
                rangemode : "tozero"
            }
        };

        Plotly.newPlot("bubble", dataBble, layoutBble);      
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
        Object.entries(demInfo).forEach(([key, value]) => {
            demInfoBox.append("p").text(`${key}: ${value}`);
        });

        // get OTU IDs
        var otuID = subjArr[0].otu_ids;
        otuID = otuID.map(eaID => `OTU ${eaID}`);

        // OTU Values 
        var otuVal = subjArr[0].sample_values;

        // OTU Hover-over Text
        var otuText = subjArr[0].otu_labels;


        // ====================== UPDATE BAR CHART ========================
        // specify what needs to be updated
        var update = {
            text : otuText.slice(0,10),  // take only top 10 data points 
            x: [otuVal.slice(0,10)],
            y: [otuID.slice(0,10)]
        };

        // specify new graph title
        var reLayout = {
            title: `Sample Analysis of Test Subject ID # ${currSubID}`,
        }; 

        // update plot
        Plotly.restyle("bar_plot", update);
        Plotly.relayout("bar_plot", reLayout)


    // ====================== BUBBLE CHART =====================


        
  

    
    })  
}


// Call updatePlotly() when a change takes place to the DOM
console.info("attempting event handling");
console.log(d3.select("#selDataset")); 




