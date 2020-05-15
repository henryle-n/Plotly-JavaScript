// d3 promise for json
const promise = d3.json('data/samples.json')

//create an array of all subject IDs 
promise.then(data => {
    subjID = data.names;
    console.log("this is subID", subjID);
    d3.select("select").selectAll("option")
    .data(subjID)
    .enter() // creates placeholder for new data
    .append("option") // appends a option to placeholder
    .text(function (idNum) {return idNum});
    });


// function to load initial dataset 
function init() {
    otuID = promise.then(data => {
        // get subject name
        var otuName = data.names[0];
        console.log("this is subjName", otuName);
        // get OTU IDs
        var otuID = data.samples[0].otu_ids.map(eaID => "OTU " + eaID);
        console.log("this is otuID", otuID);
        // OTU Values 
        var otuVal = data.samples[0].sample_values;
        console.log("this is otuVal", otuVal);
        // OTU Hover-over Text
        var otuText = data.samples[0].otu_labels;
        console.log("this is otuText", otuText);
    
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
        Plotly.newPlot("bar", data, layout);
    })
}



// function init() {
//     // // page load error correction
//     d3.selectAll("#selDataset").on("change", updatePlotly);
    
//     data = [{
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16] }];
  
//     Plotly.newPlot("dropdown_plot", data);
//   }
  
//   d3.select("#selDataset").on("change", updatePlotly);


function otu_plot () {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");

    console.log("the data set selected is :: ", dataset);

    promise.then(data => {    
        // extract the otu_ids array from the json
        console.log("this is samples :: ", data.samples);
        var subjArr = data.samples.filter(row => row.id == 940);
        console.log("this is subjArr :: ", subjArr[0].otu_ids);
        console.log("this is idArr : ", subjArr);
    });   
}



 