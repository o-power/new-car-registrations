//d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(dataset) {
//    makeGraphs(dataset);
//});

Promise.all([
    d3.csv("assets/data/UnitsByMakeAndYear.csv"),
    d3.csv("assets/data/UnitsByColourAndYear.csv")
]).then(function(files) {
    makeGraphs(files[0]);
    makeGraphs2(files[1]);
    // files[0] will contain file1.csv
    // files[1] will contain file2.csv
}).catch(function(err) {
    // handle error here
})

// note 2019 is year to date (29th July 2019)

function makeGraphs(dataset) {
    
    dataset.forEach(function(d) {
        // convert Units from string to integer
        d.Units = parseInt(d.Units);
        //d.Year = new Date(d.Year);
    });

    //mybarplot(dataset.filter(function (d) { return d.Year.getFullYear() == 2019; }));
    mybarplot(dataset.filter(function (d) { return d.Year == "2019"; }));
    mystackedareaplot(dataset);
    //mytreemap(data);
    
    //console.log(dataset[0]);
    //console.log(dataset[0].Rank);
    //console.log(dataset[0].Make);
    //console.log(dataset[0].Units);
    //console.log(dataset[0].Year);
    //console.log(dataset.length);
}

function makeGraphs2(dataset) {
    
    dataset.forEach(function(d) {
        // convert Units from string to integer
        d.Units = parseInt(d.Units);
        //d.Year = new Date(d.Year);
    });
    
    mybumpchart(dataset);
    
    console.log(dataset[0]);
    console.log(dataset[0].Rank);
    console.log(dataset[0].Colour);
    console.log(dataset[0].Units);
    console.log(dataset[0].Year);
}

//=================================================
// Bump Chart
//=================================================
function mybumpchart(dataset) {
    console.log("Hello!");
}

//=================================================
// Bar Plot
//=================================================
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
                   .domain([0, d3.max(dataset, function(d) { return d.Units; })])
                   .range([height, 0]);
    
    // append y-axis to the svg object
    svg.append("g")
       .call(d3.axisLeft(yScale));

    // append the bars
    svg.selectAll("rect")
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

//=================================================
// Stacked Area Plot
//=================================================
function mystackedareaplot(dataset) {
    // https://www.d3-graph-gallery.com/graph/stackedarea_basic.html
    // https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca
    
    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#mystackedareaplot")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // sort data
    dataset.sort(function(a, b) {
         return parseInt(a.Year) - parseInt(b.Year);
    });
    
    // group the data: one array for each value of the X axis.
    const sumstat = d3.nest()
                      .key(function(d) { return d.Year; })
                      .entries(dataset);

    //console.log(sumstat);
    
    const mygroups = ["VOLKSWAGEN", "TOYOTA", "HYUNDAI"] // list of group names
    
    const mygroup = [1,2,3] // list of group names
  
    const stackedData = d3.stack()
                          .keys(mygroup)
                          .value(function(d, key){ 
                                    return d.values[key].Units
                                })(sumstat);

    //console.log(stackedData);
    
    // x-axis
    const x = d3.scaleLinear()
                .domain(d3.extent(dataset, function(d) { return d.Year; }))
                .range([ 0, width ]);
    
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x).ticks(5));
    
    // y-axis
    const y = d3.scaleLinear()
                //.domain([0, d3.max(dataset, function(d) { return d.Units; })*1.2])
                .domain([0,50000])
                .range([ height, 0 ]);
    
    svg.append("g")
       .call(d3.axisLeft(y));
       
    const color = d3.scaleOrdinal()
                  .domain(mygroups)
                  .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);
                  
    // Show the areas
    svg
         .selectAll("mylayers")
         .data(stackedData)
         .enter()
         .append("path")
         .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
         .attr("d", d3.area()
         .x(function(d, i) { return x(d.data.key); })
         .y0(function(d) { return y(d[0]); })
         .y1(function(d) { return y(d[1]); })
     );


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