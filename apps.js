const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// create demographic
function subjectData(id) {
    d3.json(url).then((i) => {
      let meta = i.metadata;
      let subject = meta.filter(sampleObj => sampleObj.id == id)[0];

      let panel = d3.select("#sample-metadata");
      panel.html("");

      for (j in subject){
        panel.append("h6").text(`${j.toUpperCase()}: ${subject[j]}`);
      };
  
    });
  }

// create and format the bar and bubble graph
function charts(id) {
    d3.json(url).then((i) => {
        let samples = i.samples;
        let result = samples.filter(sampleObj => sampleObj.id == id)[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;


        let layoutBubble = {
        title: `ID ${id}'s OTUs Values`,
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Values"}
        };

        let dataBubble = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "YlGnBu"
            }
        }
        ];

        Plotly.newPlot("bubble", dataBubble, layoutBubble);

        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let dataBar = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
        ];

        let layoutBar = {
        title: `ID ${id}'s Top 10 Bacteria Cultures`
        };

        Plotly.newPlot("bar", dataBar, layoutBar);
    });
  }

// set the initial data and create drop down
function init() {
    let dropdown = d3.select("#selDataset");
  
    d3.json(url).then((j) => {
      let subjectID = j.names;
  
      subjectID.forEach(subject => {
            dropdown.append('option').text(subject).property('value', subject);
        })
  
      let firstSubject = subjectID[0];
      charts(firstSubject);
      subjectData(firstSubject);
    });
  }

// load new data  
function optionChanged(newSubject) {
    charts(newSubject);
    subjectData(newSubject);
  }
  
// initialize
init();
  