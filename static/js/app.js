//create an array of all subject IDs 
var subjID = d3.json('data/samples.json').then(data => 
    data.samples.map(row => row.id));

// add subject IDs to drop down usind D3 select and data binding 
<option value="dataset1">DataSet1</option>    

function otu_plot () {
    d3.json('data/samples.json').then(data => {
    
    // extract the otu_ids array from the json
    var idArr = data.samples.map(row => row.otu_ids);
    console.log("this is idArr : ", idArr);

    var valArr = data.samples.map(row => row.sample_values);
        valArr = valArr.flat(1)
        console.log("this is valArr : ", valArr);

    var text = data.samples.otu_labels;


    var trace1 = {
      type: "bar",
      x: idArr,
      y: valArr,
    //   text: text
    };


    var data = [trace1];

    var layout = {
      title: "Sample Analysis"
      };    

    Plotly.newPlot("bar", data, layout);
  });
}
