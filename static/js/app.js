// d3 promise for json
var promise = d3.json('data/samples.json')

//create an array of all subject IDs 
promise.then(data => {
    subjID = data.samples.map(row => row.id);
    console.log("this is subID", subjID);
    d3.select("select").selectAll("option")
    .data(subjID)
    .enter() // creates placeholder for new data
    .append("option") // appends a option to placeholder
    .text(function (idNum) {return idNum});
    });


function otu_plot () {
   promise.then(data => {
    
    // extract the otu_ids array from the json
    console.log("this is samples :: ", data.samples);
    var subjArr = data.samples.filter(row => row.id == 940);
    console.log("this is subjArr :: ", subjArr);
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
otu_plot()