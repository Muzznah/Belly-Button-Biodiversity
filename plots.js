// function that populates the dropdown menue.
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })
};

init();
// The default dispaly panel and gauge chart, upon opening website.
buildMetadata("940");

//The default bar and bubble charts, upon opening website.
buildCharts("940");


// function for handling change.
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Function to populate the panel and to make gauge chart.
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(object => object.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    // PANEL.append("h6").text(result.location);
    Object.entries(result).forEach(([key, value]) => PANEL.append("h6").text
      (`${key[0].toUpperCase() + key.slice(1).toLowerCase()}: ${value}`));

    // Trace gauge chart.
    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: result.wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week", font: { size: 16 } },
        gauge: {
          axis: { range: [null, 9] },
          bar: { color: "#0000b3" },
          steps: [
            
            { range: [0, 1], color: "#f2ffcc "},
            { range: [1, 2], color: "#d2ff4d" },
            { range: [2, 3], color: "#99e600" },
            { range: [3, 4], color: "#80ff80" },
            { range: [4, 5], color: "#33ff33" },
            { range: [5, 6], color: "#33cc33" },
            { range: [6, 7], color: "#4d94ff" },
            { range: [7, 8], color: "#0066ff" },
            { range: [8, 9], color: "#0052cc" }
          ]
        }
      }];

    var layout = {
      width: 400,
      height:600,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Candara", size:"16" }
    };
    Plotly.newPlot("gauge", data, layout);
  });

};


// Trace bar and bubble plot.
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var samples = data.samples;
    var resultArray = samples.filter(object => object.id == sample);
    var result = resultArray[0];
    console.log(result);
    //     // sort the data in decending order, then choose top ten values, ids and labels.
    //     var sortedresult=result.sort((a,b)=>(b.sample_values-a.sample_values));
    var otu_ids = result.otu_ids
    var otu_ids_topTen = otu_ids.slice(0, 10).map(num => `OTU- ${num}`);
    var otu_labels = result.otu_labels
    var otu_lables_topTen = otu_labels.slice(0, 10); 
    var sample_values = result.sample_values
    var sample_values_topTen = sample_values.slice(0, 10);
    

    /* Create a horizontal bar chart to display the top 10 OTUs found in an individual.
      sample_values as x values, otu_ids as y labels and otu_labels as the hover text for the chart*/
    var trace = [{
      x: sample_values_topTen,
      y: otu_ids_topTen,
      text: otu_lables_topTen,
      type: "bar",
      orientation: 'h',
        marker:{color: '#5cd65c'}
    }];

    var layout = {
      title: "<b>Top Ten Bacterial Species</b>",
      
      yaxis: { autorange: "reversed", font:{size:"11" }},
      width: 600,
      height: 600,
      font: { color: "black", family: "Candara", size:"16" }
    };


    Plotly.newPlot("bar", trace, layout);


    /* Create a bubble chart that displays each sample:otu_ids as x-axis values, 
    sample_values as y-axis values and marker size, 
    otu_ids as the marker colors and otu_labels for the text values.*/

    var trace = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      type: 'scatter',
      text: otu_labels,
     
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }

    }];

    var layout = {
      title: "<b>Qunatities of Bacterial Species Present<b> ",
      xaxis: { title: "OTUD ID" },
      yaxis: { title: "Qunatities in (CFU)" },
      width: 1200,
      height: 600,
      font: { color: "black", family: "Candara", size:"16" }
    }
    Plotly.newPlot('bubble', trace, layout);
  });

}


