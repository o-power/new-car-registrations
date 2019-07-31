d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(dataset) {
    makeGraphs(dataset);
});

// note 2019 is year to date (29th July 2019)

function makeGraphs(dataset) {
    
    dataset.forEach(function(d) {
        d.Units = parseInt(d.Units);
    });
    
    mybarplot(dataset);
    //mytreemap(data);
    
    console.log(dataset[0]);
    console.log(dataset[0].Rank);
    console.log(dataset[0].Make);
    console.log(dataset[0].Units);
    console.log(dataset[0].Year);
}

function mybarplot(dataset) {
    
    // https://www.d3-graph-gallery.com/graph/barplot_ordered.html
    // https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const w = 460 - margin.left - margin.right;
    const h = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#mybarplot")
                  .append("svg")
                  .attr("width", w + margin.left + margin.right)
                  .attr("height", h + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // // sort data
    // data.sort(function(b, a) {
    //     return a.Value - b.Value;
    // });
    
    // X axis
    var x = d3.scaleBand()
                .range([ 0, w ])
                .domain(dataset.map(function(d) { return d.Make; }))
                .padding(0.2);
    
    // translate moves axis to bottom of chart
    // this means the axis is actually in the bottom margin
    svg.append('g')
       .attr('transform', `translate(0, ${h})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
              .domain([0, 15000])
              .range([ h, 0]);
    
    svg.append("g")
       .call(d3.axisLeft(y));

  // Bars
  svg.selectAll()
     .data(dataset)
     .enter()
     .append("rect")
      .attr("x", function(d) { return x(d.Make); })
      .attr("y", function(d) { return y(d.Units); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return h-y(d.Units); })
      .attr("fill", "#69b3a2");
    
    
    
// add gridlines https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
// add labels
// add interactivity
// add colors and fonts
// https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/
    
    
    
    
    
    
    
    
    // const svg = d3.select("#mybarplot")
    //             .append("svg")
    //             .attr("height",h)
    //             .attr("width",w);
    
    // // https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
    // const yScale = d3.scaleLinear()
    //                  .domain([0, d3.max(dataset.Units)]);
    //                  .range([height, 0]);
                    
    // const xScale = d3.scaleBand()
    //                  .range([0, width])
    //                  .domain(sample.map((s) => s.language))
    //                  .padding(0.2)
    
    
    // svg.selectAll("rect")
    //     .data(dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function(d) { return d.Make; })
    //     .attr("y", function(d) { return d.Units; });
                
                
    // console.log("hello");       
                
    
    
}


function mytreemap(data) {
    // Treemap https://www.d3-graph-gallery.com/graph/treemap_basic.html
    
    // set the dimensions and margins of the graph
    //let margin = {top: 10, right: 10, bottom: 10, left: 10};
  
    //let width = 445 - margin.left - margin.right;
    //let height = 445 - margin.top - margin.bottom;
    let width = 445;
    let height = 445;
    
    // append the svg object to the body of the page
    let svg = d3.select("#mytreemap")
                .append("svg")
                .attr("width",width)
                .attr("height",height);
                //.attr("width", width + margin.left + margin.right)
                //.attr("height", height + margin.top + margin.bottom)
                //.append("g")
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // convert to a hierarchy
    // https://github.com/d3/d3-hierarchy/blob/master/README.md#stratify
    let root = d3.stratify()
                .id(function(d) { return d.Units; })   // Name of the entity (column name is name in csv)
                .parentId(function(d) { return d.Make; })   // Name of the parent (column name is parent in csv)
                (data);
    
    //svg.selectAll("rect")
    //    .data(root.leaves())
    //    .enter()
    //    .append("rect")

}