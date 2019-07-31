d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(dataset) {
    makeGraphs(dataset);
});

// note 2019 is year to date (29th July 2019)

function makeGraphs(dataset) {
    
    dataset.forEach(function(d) {
        // convert Units from string to integer
        d.Units = parseInt(d.Units);
    });
    
    mybarplot(dataset);
    //mytreemap(data);
    
    console.log(dataset[0]);
    console.log(dataset[0].Rank);
    console.log(dataset[0].Make);
    console.log(dataset[0].Units);
    console.log(dataset[0].Year);
    console.log(dataset.length);
}

function mybarplot(dataset) {
    
    // References:
    // https://www.d3-graph-gallery.com/graph/barplot_ordered.html
    // https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
    
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // append the svg object to the div
    // add margins
    const svg = d3.select("#mybarplot")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // // sort data
    // data.sort(function(b, a) {
    //     return a.Value - b.Value;
    // });
    
    // x-axis scale
    var xScale = d3.scaleBand()
                   .domain(dataset.map(function(d) { return d.Make; }))
                   .range([0, width])
                   .padding(0.2);
    
    // append x-axis to the svg object
    // translate moves axis to bottom of chart
    // this means the axis is actually in the bottom margin
    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    // y-axis scale
    var yScale = d3.scaleLinear()
                   .domain([0, 15000])
                   .range([height, 0]);
    
    // append y-axis to the svg object
    svg.append("g")
       .call(d3.axisLeft(yScale));

    // append the bars
    svg.selectAll()
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", function(d) { return xScale(d.Make); })
       .attr("y", function(d) { return yScale(d.Units); })
       .attr("width", xScale.bandwidth())
       .attr("height", function(d) { return height - yScale(d.Units); })
       .attr("fill", "#69b3a2");
    
    // add gridlines https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
    // add labels
    // add interactivity
    // add colors and fonts
    // https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/

}


// function mytreemap(data) {
//     // Treemap https://www.d3-graph-gallery.com/graph/treemap_basic.html
    
//     // set the dimensions and margins of the graph
//     //let margin = {top: 10, right: 10, bottom: 10, left: 10};
  
//     //let width = 445 - margin.left - margin.right;
//     //let height = 445 - margin.top - margin.bottom;
//     let width = 445;
//     let height = 445;
    
//     // append the svg object to the body of the page
//     let svg = d3.select("#mytreemap")
//                 .append("svg")
//                 .attr("width",width)
//                 .attr("height",height);
//                 //.attr("width", width + margin.left + margin.right)
//                 //.attr("height", height + margin.top + margin.bottom)
//                 //.append("g")
//                 //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//     // convert to a hierarchy
//     // https://github.com/d3/d3-hierarchy/blob/master/README.md#stratify
//     let root = d3.stratify()
//                 .id(function(d) { return d.Units; })   // Name of the entity (column name is name in csv)
//                 .parentId(function(d) { return d.Make; })   // Name of the parent (column name is parent in csv)
//                 (data);
    
//     //svg.selectAll("rect")
//     //    .data(root.leaves())
//     //    .enter()
//     //    .append("rect")

// }