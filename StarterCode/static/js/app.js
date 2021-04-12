// 1. Init and pull data from the json file provided
function init (){
  var selector = d3.selectAll('#selDataset');

  d3.json('samples.json').then((data)=>{
  
      var sampleNames=data.names;
      sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
          });
    
      var defaultID = sampleNames[0];
  
      barChart(defaultID);
      bubbleChart(defaultID);
      metaData(defaultID);
  
    });
   };

// Refresh the data each time when a new subject ID is selected
  function optionChanged(newID) {
      barChart(newID);
      bubbleChart(newID);
      metaData(newID);
   };
  init ();

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
  function barChart(subjectId){
      d3.json('samples.json').then((data)=>{
          var samples = data.samples;
          var ID = samples.map(row=>row.id).indexOf(subjectId);
          var otuValueTen = samples.map(row=>row.sample_values);
          var otuValueTen = otuValueTen[ID].slice(0,10).reverse();
          var otuIdTen = samples.map(row=>row.otu_ids);
          var otuIdTen = otuIdTen[ID].slice(0,10);
          var otuLabelTen = samples.map(row=>row.otu_labels).slice(0,10);
          
          var trace={
              x: otuValueTen,
              y: otuIdTen.map(r=>`UTO ${r}`),
              text: otuLabelTen,
              type:'bar',
              orientation:'h'
          }
          var layout = {title: "Top 10 OTUs Found", margin: { t: 100, l: 150 }};
    
         Plotly.newPlot('bar',[trace],layout);
      })
  };
// 3. Create a bubble chart that displays each sample.
  function bubbleChart(subjectID){
      d3.json('samples.json').then((data)=>{
          var samples = data.samples;
          var ID = samples.map(row=>row.id).indexOf(subjectID);
          var otuIds = samples.map(row => row.otu_ids);
          var otuIds = otuIds[ID];            
          var sampleValues = samples.map(row => row.sample_values);
          var sampleValues = sampleValues[ID];
          var otuLabels = samples.map(row => row.otu_labels);
          var otuLabels = otuLabels[ID];
          var trace1 = {
              x: otuIds,
              y: sampleValues,
              text: otuLabels,
              mode: 'markers',
              marker: {size: sampleValues, 
                      color: otuIds, 
                      colorscale: "Rainbow" 
                      }
              };                       
              
          var layout = { xaxis: {title: 'OTU ID'},
                         height: 600,
                         width: 1000,
                       };
          Plotly.newPlot('bubble',[trace1], layout);
      })
  };


// 4. Display the sample metadata, i.e., an individual's demographic information.

function metaData(subjectID) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the selected ID number 
    var filteredData = metadata.filter(object => object.id == subjectID);
    var result = filteredData[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
        panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
} 
  

