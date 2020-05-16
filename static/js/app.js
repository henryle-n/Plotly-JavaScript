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
        var trace = {
        type: "bar",
        x: otuVal.slice(0,10), // slice first 10 data
        y: otuID.slice(0,10), // slice first 10 data
        text: otuText.slice(0,10), // slice first 10 data
        orientation: 'h'
        };
    
        // point plot's data to created trace 
        var data = [trace];
    
        // specify layout format parameters
        var layout = {
          title: `Sample Analysis of Test Subject ID # ${otuName}`,
          yaxis: {autorange: "reversed"}
          };    
    
        // create plot with tag id=bar (from index.HTML)  
        Plotly.newPlot("bar_plot", data, layout);
    })
}

d3.selectAll("#selDataset").on("change", updatePlotly);
init()

function updatePlotly () {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var currSubID = dropdownMenu.property("value");
    console.log("the data set selected is :: ", currSubID);
    // Test Subject ID #
    promise.then(data => {    
        // extract the otu_ids array from the json
        // console.log("this is samples :: ", data.samples);
        var subjArr = data.samples.filter(row => row.id == currSubID);
        console.log("this is filtered object :: ", subjArr);
        console.log("this is otu_id :: ", subjArr[0].otu_ids);

        // get OTU IDs
        var otuID = subjArr.otu_ids;
        // otuID = otuID.map(eaID => "OTU " + eaID);
        console.log("this is otuID", otuID);
    //     // OTU Values 
    //     var otuVal = subjArr.sample_values;
    //     console.log("this is otuVal", otuVal);
    //     // OTU Hover-over Text
    //     var otuText = subjArr.otu_labels;
    //     console.log("this is otuText", otuText);

    //     var x = otuVal.slice(0,10);
    //     var y = otuID.slice(0,10);
     
    //     Plotly.restyle("bar_plot", "x", [x]);
    //     Plotly.restyle("bar_plot", "y", [y]);
        
    //         // point plot's data to created trace 
    //     // var data = [trace];
    
    //     // specify layout format parameters
    //     // var layout = {
    //     //     title: `Sample Analysis of Test Subject ID # ${otuName}`,
    //     //     yaxis: {autorange: "reversed"}
    //     //     };    
    
    //     // create plot with tag id=bar (from index.HTML)  
    //     // Plotly.newPlot("bar", data, layout);
    })
  
}



// function updatePlotly() {
//   // debugging technique to see if we got to the function
//   console.log("updatePlotly called");
//   // Select the dropdown menu
//   var dropdownMenu = d3.select("#selsubjID");
//   // Assign the value of the dropdown menu option to a variable
//   var subjID = dropdownMenu.property("value");

//   console.info("subjID selected",subjID);
//   alert(subjID);

//   // Initialize x and y arrays
//   var x = [];
//   var y = [];

//   if (subjID === 'subjID1') {
//     x = [1, 2, 3, 4, 5];
//     y = [1, 2, 4, 8, 16];
//   }

//   if (subjID === 'subjID2') {
//     x = [10, 20, 30, 40, 50];
//     y = [1, 10, 100, 1000, 10000];
//   }

//   // Note the extra brackets around 'x' and 'y'
//   Plotly.restyle("dropdown_plot", "x", [x]);
//   Plotly.restyle("dropdown_plot", "y", [y]);
// }


// Call updatePlotly() when a change takes place to the DOM
// console.info("attempting event handling");
// console.log(d3.select("#selDataset")); 