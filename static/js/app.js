var id;
var value;
var text;

d3.json('data/samples.json').then(function(data) {
    // console.log(data);
    var name = data.name;
    var id = data.samples.map(row => row.otu_ids);
    console.log(id)
    var value = data.samples.sample_values;
    var text = data.samples.otu_labels;


    var trace1 = {
      type: "bar",
      x: id,
      y: value,
      text: text
    };


    var data = [trace1];

    var layout = {
      title: "Belly Button"
      };    

    Plotly.newPlot("bar", data, layout);
  });

