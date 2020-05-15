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
    // console.log("this is idArr : ", subjArr);

    // var valArr = data.samples.map(row => row.sample_values);
    //     valArr = valArr.flat(1)
    //     console.log("this is valArr : ", valArr);

    // var text = data.samples.otu_labels;


    // var trace1 = {
    //   type: "bar",
    //   x: idArr,
    //   y: valArr,
    // //   text: text
    // };


    // var data = [trace1];

    // var layout = {
    //   title: "Sample Analysis"
    //   };    

    // Plotly.newPlot("bar", data, layout);
  });
}

x = promise.then(data => {
    var otuID = data.samples[0].otu_ids;
    console.log("this is otuID", otuID);
})

