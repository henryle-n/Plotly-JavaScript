var id;
var valArr;
var text;

d3.json('data/samples.json').then(data => {
    
    // extract the otu_ids array from the json
    var idArr = data.samples.map(row => row.otu_ids);
        // combine sub-arrays into one array (flatten)
        // Opt 1:  use concat
        // idArr = [].concat.apply([], idArr);
        // Opt 2: use flat (may not work with IE, tested in Chrome-works well)
        idArr = idArr.flat(1);
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


 
  
