// credit to Tommy Olutomiwa for providing guidance in this homework
function buildPieChart(data) {
  // Create a PIE chart that uses data from your samples route (/samples/<sample>) to display the top 10 samples.

  // Use sample_values as the values for the PIE chart
  // Use otu_ids as the labels for the pie chart
  // Use otu_labels as the hovertext for the chart

  // define trace
  let labels = data.otu_ids.slice(0, 10);
  let values = data.sample_values.slice(0, 10);
  let hovertext = data.otu_labels.slice(0, 10);

  let trace_pie = {
    type: 'pie',
    values: values,
    labels: labels,
    hovertext: hovertext,
    colorscale: 'Viridis',
  };
  // set data
  var data_pie = [trace_pie]; // data has to be an array
  // set layout -> commented out as not requested but left in for future reference
  let layout = {
    //   title: "pie chart"
  };

  // show plot in html with id 'bubble'
  Plotly.newPlot('pie', data_pie, layout, { responsive: true });
}

function buildBubbleChart(data) {
  // Create a Bubble Chart that uses data from your samples route (/samples/<sample>) to display each sample.

  // Use otu_ids for the x values
  // Use sample_values for the y values
  // Use sample_values for the marker size
  // Use otu_ids for the marker colors
  // Use otu_labels for the text values

  // define trace
  let x_values = data.otu_ids;
  let y_values = data.sample_values;
  let marker_size = data.sample_values;
  let marker_colors = data.otu_ids;
  let text_values = data.otu_labels;

  let trace_bubble = {
    x: x_values,
    y: y_values,
    type: 'scatter',
    text: text_values,
    mode: 'markers',
    marker: {
      size: marker_size,
      color: marker_colors,
      opacity: 0.6,
      colorscale: 'Viridis',
    },
  }
  // set data
  var data_bubble = [trace_bubble] // data has to be an array
  // set layout  -> title and y axis commented out as not requested but left in for future reference
  let layout_bubble = {
    // title: " bubble chart ",
    xaxis: {
      title: 'OTU ID',
    },
    yaxis: {
      //   title: 'sample values',
    }
  }

  // show plot in html with id 'bubble'
  Plotly.newPlot('bubble', data_bubble, layout_bubble, { responsive: true });
}

function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {
    // Build a Bubble Chart using the sample data
    buildBubbleChart(data);
    // Build a Pie Chart
    buildPieChart(data);
  });
}

function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var metadataSample = d3.select("#sample-metadata");
  d3.json(`/metadata/${sample}`).then(data => {
    // Use `.html("") to clear any existing metadata
    metadataSample.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      metadataSample
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        .append('p').text(`${key} : ${value}`) // each line in separate paragraph

      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);

    });
  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
