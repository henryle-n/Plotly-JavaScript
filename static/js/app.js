d3.json('data/samples.json').then(data => console.log(data));

    // Grab values from the response json object to build the plots
    // {var name = data.dataset.name;
    // var stock = data.dataset.dataset_code;
    // var startDate = data.dataset.start_date;
    // var endDate = data.dataset.end_date;
    // var dates = unpack(data.dataset.data, 0);
    // var openingPrices = unpack(data.dataset.data, 1);
    // var highPrices = unpack(data.dataset.data, 2);
    // var lowPrices = unpack(data.dataset.data, 3);
    // var closingPrices = unpack(data.dataset.data, 4);

    // var trace1 = {
    //   type: "scatter",
    //   mode: "lines",
    //   name: name,
    //   x: dates,
    //   y: closingPrices,
    //   line: {
    //     color: "#17BECF"
    //   }
    // };

//     // Candlestick Trace
//     var trace2 = {
//       type: "candlestick",
//       x: dates,
//       high: highPrices,
//       low: lowPrices,
//       open: openingPrices,
//       close: closingPrices
//     };

//     var data = [trace1, trace2];

//     var layout = {
//       title: `${stock} closing prices`,
//       xaxis: {
//         range: [startDate, endDate],
//         type: "date"
//       },
//       yaxis: {
//         autorange: true,
//         type: "linear"
//       }
//     };

//     Plotly.newPlot("plot04", data, layout);
//   });
// }