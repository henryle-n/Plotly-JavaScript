// d3 promise for json
const promise = d3.json('data/samples.json')

//create an array of all subject IDs 
promise.then(data => {
    subjID = data.names;
    // console.log("this is subID", subjID);
    d3.select("select").selectAll("option")
    .data(subjID)
    .enter() // creates placeholder for new data
    .append("option") // appends a option to placeholder
    .text(function (idNum) {return idNum});
    });





// ====================== BAR CHART =====================    
// function to load initial subjID 
function init() {

    d3.selectAll("#selDataset").on("change", updatePlotly);

    otuID = promise.then(data => {
        // get subject name
        var otuName = data.names[0];
        // console.log("this is subjName", otuName);
        // get OTU IDs
        var otuID = data.samples[0].otu_ids.map(eaID => "OTU " + eaID);
        // console.log("this is otuID", otuID);
        // OTU Values 
        var otuVal = data.samples[0].sample_values;
        // console.log("this is otuVal", otuVal);
        // OTU Hover-over Text
        var otuText = data.samples[0].otu_labels;
        // console.log("this is otuText", otuText);
    
        // create trace
        var trace1 = {
        type: "bar",
        x: otuVal.slice(0,10), // slice first 10 data
        y: otuID.slice(0,10), // slice first 10 data
        text: otuText.slice(0,10), // slice first 10 data
        orientation: 'h',  // horizontal bar chart
        name: 'OTU vs. Sample Values'
        };
        console.log("this is X in trace 1", trace1.x);
        console.log("this is Y in trace 1", trace1.y);
        // point plot's data to created trace 
        var data = [trace1];
    
        // specify layout format parameters
        var layout = {
            title: `Sample Analysis of Test Subject ID # ${otuName}`,
            xaxis: {
                title: {
                    text: "Sample Values"
                },
                showgrid : true, // major grid lines 
                showline: true   // axis line
            },
            yaxis: {
                title: {
                    text: "Operational Taxonomic Units"
                },  
                autorange: "reversed",
                showgrid : true,   // major grid lines
                showline: true    // axis line
            }
        };    
    
        // create plot with tag id=bar (from index.HTML)  
        Plotly.newPlot("bar_plot", data, layout);
    })
}

d3.selectAll("#selDataset").on("change", updatePlotly);


function updatePlotly () {
    d3.event.preventDefault();
    console.log("updatePlotly called");
 
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var currSubID = dropdownMenu.property("value");
    console.log("the data set selected is :: ", currSubID);
    
    // filter data based on user selection of "Test Subject ID No."
    promise.then(data => {    
        // extract the otu_ids array from the json
        // console.log("this is samples :: ", data.samples);
        var subjArr = data.samples.filter(row => row.id == currSubID);
        console.log("this is filtered object :: ", subjArr);

        // get OTU IDs
        var otuID = subjArr[0].otu_ids;
        otuID = otuID.map(eaID => "OTU " + eaID);
        console.log("this is otuID", otuID);

        // OTU Values 
        var otuVal = subjArr[0].sample_values;
        console.log("this is otuVal", otuVal);

        // OTU Hover-over Text
        var otuText = subjArr[0].otu_labels;
        console.log("this is otuText", otuText);

        // specify what needs to be updated
        var update = {
            text : otuText.slice(0,10),  // take only top 10 data points 
            x: [otuVal.slice(0,10)],
            y: [otuID.slice(0,10)]
        };

        console.log("this is new trace X :: ", update.x, "\n"
            )

        // specify new graph title
        var reLayout = {
            title: `Sample Analysis of Test Subject ID # ${currSubID}`,
        }; 

        // update plot
        Plotly.restyle("bar_plot", update);
        Plotly.relayout("bar_plot", reLayout)
    })  
}


// Call updatePlotly() when a change takes place to the DOM
console.info("attempting event handling");
console.log(d3.select("#selDataset")); 

init()

// ====================== BUBBLE CHART =====================
// Use otu_ids for the x values.


// Use sample_values for the y values.


// Use sample_values for the marker size.


// Use otu_ids for the marker colors.


// Use otu_labels for the text values.