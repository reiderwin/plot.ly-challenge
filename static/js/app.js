// Step 1. Use the D3 library to read in samples.json.
// Note, here I had to go to terminal where files as located
// and enter 'python -m http.server and open web browser @ http://[::]:8000/
// in order to get console to read the samples.json file.

// Create connection between HTML and JS using D3 select 
let dropdown = d3.select("#selDataset");


// Log data from json

d3.json("static/samples.json").then(data => {
    console.log(data)
    for (let i = 0; i < data["names"].length; i++) {
        let id = data["names"][i];
        dropdown
            .append("option")
            .text(id)
            .attr("value", id);
    }

    d3.select("option").property("selected", true);

    // Create a variable ID to hold the subject id for the plots

    id = dropdown.property('value')
    console.log(id)

    // Enable variable change from dropdown menu
    dropdown.on("click", () => {
        let id = dropdown.property("value");
        console.log(id);

        // Compiling data for charts

        let sample_values = data["samples"].filter(item => (item["id"] === id))[0];
        let otu_ids = sample_values["otu_ids"];
        let values = sample_values["sample_values"];
        let labels = sample_values["otu_labels"];

        let top_otu = otu_ids.slice(0, 10).map(ids => "OTU" + String(ids)).reverse();
        let top_ten = values.slice(0, 10).reverse();
        let top_labels = labels.slice(0, 10).reverse();

        console.log(top_otu);
        console.log(top_ten);
        console.log(top_labels);

        // Select metadata

        let meta_data = data["metadata"].filter(item => (item["id"] === parseInt(id)))[0];
        let eth = meta_data["ethnicity"];
        let sex = meta_data["gender"];
        let loc = meta_data["location"];
        let age = meta_data["age"];
        let washes = meta_data["wfreq"]

        console.log(eth);
        console.log(sex);
        console.log(loc);

        // Create data and format for index

        let person_data = d3.select("#sample-metadata");

        person_data.selectAll("*").remove();

        // Append values for each person

        person_data.append("p").text("Ethnicity: " + eth);
        person_data.append("p").text("Gender: " + sex);
        person_data.append("p").text("Location: " + loc);
        person_data.append("p").text("Age: " + age);

        // Create bar chart

        let barchart = d3.select("#bar")

        barchart.selectAll("*").remove();


        // Autoadjust repsonsive as TRUE
        let config = {
            responsive: true

        }

        //Create bar chart
        let bar1 = {
            x: top_ten,
            y: top_otu,
            type: "bar",
            orientation: "h",
            marker: {
                color: "#1a3bf8"
            },
            hovertext: top_labels,
        };

        let bar_labels = {
            title: `Top 10 OTUS for patient #${id}`,
            xaxis: {
                title: "Values in Sample"
            },
            font: {
                color: "#1a3bf8"
            }
        };

        //Plot bar chart

        Plotly.newPlot("bar", [bar1], bar_labels, config);

        // Create bubble chart

        let bubblechart = d3.select("#bubble")

        // clean data so that a new chart shows everytime id gets changed.
        bubblechart.selectAll("*").remove();

        // Create bubble chart.
        let bubble_chart = {
            x: otu_ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                size: values,
                sizeref: 2 * Math.max(...values) / (90 ** 2),
                sizemode: "area",
                color: "#1a3bf8"
            },
        };

        let bubble_labels = {
            title: `OTUs Present in Subject #${id}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            font: {
                color: "#1a3bf8"
            }
        };

        // Plot bubble chart
        Plotly.newPlot("bubble", [bubble_chart], bubble_labels, config);



    });
});


