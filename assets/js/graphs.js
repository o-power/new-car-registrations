//d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(dataset) {
//    makeGraphs(dataset);
//});

Promise.all([
    d3.csv("assets/data/UnitsByYear.csv"),
    d3.csv("assets/data/UnitsByMakeAndYear.csv"),
    d3.csv("assets/data/UnitsByColourAndYear.csv"),
    d3.json("assets/data/UnitsByMakeModel2018.json"),
    d3.json("assets/data/IrelandCounties.json"),
    d3.csv("assets/data/UnitsByCountyAndYear.csv")
]).then(function(files) {
    makeGraphs(files[0], files[1], files[2], files[3], files[4], files[5]);
}).catch(function(err) {
    console.log(err);
});

/**
  * makeGraphs()
  * 
  */
function makeGraphs(unitsByYear, unitsByMakeAndYear, unitsByColourAndYear,
    unitsByMakeModelAndYear, irelandCounties, unitsByCountyAndYear) {
    
    unitsByYear.forEach(function(d) {
        d.Units = parseInt(d.Units);
        d.Year = parseInt(d.Year);
    });
    
    unitsByMakeAndYear.forEach(function(d) {
        d.Units = parseInt(d.Units);
        d.Rank = parseInt(d.Rank);
        d.Year = parseInt(d.Year);
    });
    
    unitsByColourAndYear.forEach(function(d) {
        d.Units = parseInt(d.Units);
        d.Rank = parseInt(d.Rank);
        d.Year = parseInt(d.Year);
    });
    
    unitsByCountyAndYear.forEach(function(d) {
        d.Units = parseInt(d.Units);
        d["2016 Population Over 19"] = parseInt(d["2016 Population Over 19"]);
        d.Year = parseInt(d.Year);
    });
    
    newVsOldStackedAreaChart(unitsByYear);
    makeBumpChart(unitsByMakeAndYear);
    makeModelTreemap(unitsByMakeModelAndYear.children[0]);
    colourBumpChart(unitsByColourAndYear);
    roiMap(irelandCounties, unitsByCountyAndYear.filter(function (d) { return d.Year == 2018; }));
}

/**
  * newVsOldStackedAreaChart()
  * 
  */
function newVsOldStackedAreaChart(dataset) {
    // adapted from: https://www.d3-graph-gallery.com/graph/stackedarea_basic.html
    
    const margin = {top: 30, right: 30, bottom: 50, left: 70};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#new-vs-old-stacked-area-chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // sort data
    dataset.sort(function(a, b) {
         return parseInt(a.Year) - parseInt(b.Year);
    });
    
    // nest the data: one array for each year
    const sumStat = d3.nest()
                      .key(function(d) { return d.Year; })
                      .entries(dataset);
    
    // {key: "2008", values: Array(2)}
    //console.log(sumStat[0]);
    
    // {Year: "2008", Units: 60091, Type: "Used imports"}
    //console.log(sumStat[0].values[1]);
    
    const mygroups = ["New cars", "Used Imports"];
    const mygroup = [0, 1];
    
    // returns an array (see below)
    const stackedData = d3.stack()
                          .keys(mygroup)
                          .value(function(d, key) { 
                               return d.values[key].Units;
                          })(sumStat);
    
    // [0, 151609, data: {key: "2008", values: Array(2)}]
    //console.log(stackedData[0][0]);
    
    // [151609, 211700, data: {key: "2008", values: Array(2)}]
    //console.log(stackedData[1][0]);
    // 211700
    //console.log(stackedData[1][0][1]);
    
    // x scale
    const x = d3.scaleLinear()
                .domain(d3.extent(stackedData[0], function(d) { return d.data.key; }))
                .range([0, width]);
    
    // 0
    //console.log(x(2008));
    // 370
    //console.log(x(2018));
    
    // x-axis
    const xAxis = d3.axisBottom(x)
                    // don't want commas displaying in years
                    .tickFormat(d3.format("d"));
                    
    
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    
    // x axis label
    svg.append("text")
       .text("Year of registration")
       .attr("text-anchor", "middle")
       //.attr("class", "graph-title")
       .attr("y", height + 40)
       .attr("x", width / 2.0);
    
    // y scale
    const y = d3.scaleLinear()
                .domain([0, d3.max(stackedData[1], function(d) { return d[1]; })])
                .range([height, 0]);
    
    // 200
    //console.log(y(100000));
    // 300
    //console.log(y(0));
    
    // y axis
    const yAxis = d3.axisLeft(y);
    
    svg.append("g")
       .call(yAxis);
    
    // y axis label
    svg.append("text")
         .text("Number cars")
         .attr("text-anchor", "middle")
         //.attr("class", "axes-labels")
         .attr("y", -55)
         .attr("x", height / -2.0)
         .attr("transform", "rotate(-90)");
    
    // colours
    const color = d3.scaleOrdinal()
                    .domain(mygroups)
                    .range(["#377eb8","#e41a1c"])
    
    // 0
    //console.log(stackedData[0].key)
    // 2008
    //console.log(stackedData[0][0].data.key);
    // 0
    //console.log(stackedData[0][0][0]);
    // 151609
    //console.log(stackedData[0][0][1]);
    
    // create the chart    
    svg.append("g")
       .selectAll("path")
       .data(stackedData)
       .enter()
       .append("path")
       .style("fill", function(d) { return color(mygroups[d.key]); })
       .attr("d",
            d3.area()
              .x(function(d, i) { return x(d.data.key); })
              .y0(function(d) { return y(d[0]); })
              .y1(function(d) { return y(d[1]); })
        );
    
    // colour legend
    // Adapted from: https://www.d3-graph-gallery.com/graph/custom_legend.html
    svg.append("circle")
       .attr("cx", (width / 4.0))
       .attr("cy", 10)
       .attr("r", 6)
       .style("fill", color(mygroups[1]));
    svg.append("circle")
       .attr("cx", (width / 4.0))
       .attr("cy", 10 + 30)
       .attr("r", 6)
       .style("fill", color(mygroups[0]));
    svg.append("text")
       .attr("x", (width / 4.0) + 20)
       .attr("y", 10)
       .text(mygroups[1])
       .style("font-size", "15px")
       .attr("alignment-baseline","middle");
    svg.append("text")
       .attr("x", (width / 4.0) + 20)
       .attr("y", 10 + 30)
       .text(mygroups[0])
       .style("font-size", "15px")
       .attr("alignment-baseline","middle");
       
    // tooltip
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
              
    // display tooltips on mousemove
    // for a stacked area chart we invert the mouse coordinates
    // adapted from: http://bl.ocks.org/WillTurman/4631136
    svg.selectAll("path")
        .on("mousemove", function(d) {
            const mouseXY = d3.mouse(this);
            
            const mouseNearestYear = Math.round(x.invert(mouseXY[0]));
            
            try {
                const mouseNearestRow = d.filter(function(d) {return parseInt(d.data.key) == mouseNearestYear; });
                
                const tooltip_str = mygroups[d.key] +
                                "<br/>" + "Year: " + mouseNearestRow[0].data.key +
                                "<br/>" + "Units: " + (mouseNearestRow[0][1] - mouseNearestRow[0][0]);
                
                //console.log(mouseNearestRow[0])
                
                tooltip.html(tooltip_str)
                       .style("visibility", "visible");
                
                tooltip.style("top", d3.event.pageY - (tooltip.node().clientHeight + 5) + "px")
                      .style("left", d3.event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
            
                
            } catch(err) {
                // mouse moved too quickly across chart to display tooltip
            }
            
        })
        .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden");
        });
                      
}

/**
  * makeBumpChart()
  * 
  */
function makeBumpChart(dataset) {
    // Adapted from: http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a
    
    // Add a CSS safe class for use in hover interactions and coloring
    dataset.forEach(function(d) {
        d.Class = d.Make.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-');
    });
    
    const margin = { top: 35, right: 0, bottom: 30, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Sort data in ascending order
    dataset.sort(function(a, b) {
        return parseInt(a.Year) - parseInt(b.Year);
    });
    
    const chart = d3.select("#make-bump-chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // https://www.d3-graph-gallery.com/graph/custom_axis.html
    const x = d3.scaleBand()
                .domain(dataset.map(function(d) { return d.Year; })) // this is what is written on the axis
                .rangeRound([25, width - 15]); // this is where the axis is placed: from 25px to 945px
    
    const y = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) { return d.Rank; })
                        ,d3.max(dataset, function(d) { return d.Rank; })]) // this is what is written on the axis
                .range([20, height - 30]); // this is where the axis is placed: from 20px to 470px

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y)
                    // http://using-d3js.com/04_03_axis.html
                    .tickValues(d3.range(1
                                        ,d3.max(dataset, function(d) { return d.Rank; })+1
                                        ,1));
    
    chart.append("g")
         .attr("class", "x axis")
         // the width of each band can be accessed using .bandwidth()
         // this moves the axis tick to under the modes (circles)
         .attr("transform", `translate(-${x.bandwidth()/2.0},${height})`)
         .call(xAxis);

    chart.append("g")
         .attr("class", "y axis")
         .call(yAxis);

    chart.append("text")
         .text("Rank")
         .attr("text-anchor", "middle")
         .attr("class", "graph-title")
         .attr("y", -35)
         .attr("x", height / -2.0)
         .attr("transform", "rotate(-90)");
    
    // Patterns for car logo images adapted from:
    // https://www.youtube.com/watch?v=yxr1IZ3MrAw
    // https://www.youtube.com/watch?v=FUJjNG4zkWY
    const defs = chart.append("defs");
    
    const makeClasses = d3.map(dataset, function(d) { return d.Class; }).keys();
    
    const patternGradient = defs.selectAll("pattern")
                                .data(makeClasses)
                                .enter()
                                .append("pattern")
                                .attr("id", function(d) { return d+"-logo"; })
                                .attr("height", "100%")
                                .attr("width", "100%")
                                .attr("patternContentUnits", "objectBoundingBox")
                                .append("image")
                                .attr("height", 1)
                                .attr("width", 1)
                                .attr("preserveAspectRatio", "none")
                                .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                                .attr("xlink:href", function(d) { return `assets/images/${d.toUpperCase()}.jpg`; });
    
    const makes = d3.map(dataset, function(d) { return d.Make; }).keys();
    
    makes.forEach(function(make) {
        const currData = dataset.filter(function(d) { if (d.Make == make) { return d; } }); 
        
        // D3 line generator
        const line = d3.line()
                      .x(function(d) { return x(d.Year); })
                      .y(function(d) { return y(d.Rank); });
        
        chart.append("path")
             .datum(currData)
             .attr("class", make.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-') )
             .attr("style", "fill:none !important")
             .attr("stroke-linejoin", "round")
             .attr("stroke-linecap", "round")
             .attr("stroke-width", 2)
             .attr("stroke-opacity", 0.3)
             .attr("d", line);
             
    }); // for each make
    
    // nodes (circles)
    const node = chart.append("g")
                      .selectAll("circle")
                      .data(dataset)
                      .enter()
                      .append("circle")
                      .attr("cx", function(d) { return x(d.Year); })
                      .attr("cy", function(d) { return y(d.Rank); })
                      .attr("fill", "blue")
                      .attr("class", function(d) { return d.Class; })
                      .attr("r", 12)
                      .attr("stroke-width", 1.5)
                      .attr("opacity", 0.8);
                    
    // tooltips
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
    
    // interactivity
    chart.selectAll("circle")
         .on("mouseover", function(d) {
            chart.selectAll('.' + d.Class)
                 // adds the class active to the line and circles for this colour
                 .classed('active-makes', true);

            const tooltip_str = "Make: " + d.Make +
                                "<br/>" + "Year: " + d.Year +
                                "<br/>" + "Units: " + d.Units +
                                "<br/>" + "Rank: " + d.Rank;

            tooltip.html(tooltip_str)
                  .style("visibility", "visible");
         })
         .on("mousemove", function(d) {
            tooltip.style("top", d3.event.pageY - (tooltip.node().clientHeight + 5) + "px")
                  .style("left", d3.event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
         })
         .on("mouseout", function(d) {
            chart.selectAll('.'+d.Class)
                 .classed('active-makes', false);

            tooltip.style("visibility", "hidden");
         })
         // so user can click on multiple colours and highlight them to make it easier to compare
         // classed("click-active-makes") returns true if any element in the selection has the class
         // the function in classed is evaluated for each element in the selection
         .on("click", function(d) {
            chart.selectAll('.' + d.Class)
                 .classed("click-active-makes", function(d) {
                    // toggle state
                    return !d3.select(this).classed("click-active-makes");
                 });
         })
}
  
/**
  * colourBumpChart()
  * 
  */
function colourBumpChart(dataset) {
    // Adapted from: http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a

    // Add a CSS safe class for use in hover interactions and coloring
    dataset.forEach(function(d) {
        d.Class = d.Colour.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-');
    });
    
    const margin = { top: 35, right: 0, bottom: 30, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Sort data in ascending order
    dataset.sort(function(a, b) {
         return parseInt(a.Year) - parseInt(b.Year);
    });
    
    const chart = d3.select("#colour-bump-chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",`translate(${margin.left},${margin.top})`);
    
    // https://www.d3-graph-gallery.com/graph/custom_axis.html
    const x = d3.scaleBand()
                .domain(dataset.map(function(d) { return d.Year; })) // this is what is written on the axis
                .rangeRound([25, width - 15]); // this is where the axis is placed: from 25px to 945px
    
    const y = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) { return d.Rank; })
                        ,d3.max(dataset, function(d) { return d.Rank; })]) // this is what is written on the axis
                .range([20, height - 30]); // this is where the axis is placed: from 20px to 470px

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y)
                    // http://using-d3js.com/04_03_axis.html
                    .tickValues(d3.range(1
                                        ,d3.max(dataset, function(d) { return d.Rank; })+1
                                        ,1));
    
    chart.append("g")
         .attr("class", "x axis")
         // the width of each band can be accessed using .bandwidth()
         // this moves the axis tick to under the modes (circles)
         .attr("transform", `translate(-${x.bandwidth()/2.0},${height})`)
         .call(xAxis);

    chart.append("g")
         .attr("class", "y axis")
         .call(yAxis);
         
    // chart.append("text")
    //      .text("Popularity ranking of car colours")
    //      .attr("text-anchor", "middle")
    //      .attr("class", "graph-title")
    //      .attr("y", -10)
    //      .attr("x", width / 2.0);

    chart.append("text")
         .text("Rank")
         .attr("text-anchor", "middle")
         .attr("class", "graph-title")
         .attr("y", -35)
         .attr("x", height / -2.0)
         .attr("transform", "rotate(-90)");
    
    // Linear gradient for multi-coloured category adapted from:
    // https://bl.ocks.org/EfratVil/484d0555f6f818ca6eea3de549a21e86
    const defs = chart.append("defs");
    
    const linearGradient = defs.append("linearGradient")
    		                   .attr("id", "myGradient");
    
    linearGradient.append("stop")
                  .attr("offset", "0%")
                  .attr("stop-color", "#FF0000");
                  
    linearGradient.append("stop")
                  .attr("offset", "20%")
                  .attr("stop-color", "#0000FF");
                  
    linearGradient.append("stop")
                  .attr("offset", "40%")
                  .attr("stop-color", "#FFFF00");
                  
    linearGradient.append("stop")
                  .attr("offset", "60%")
                  .attr("stop-color", "#800080");
                  
    linearGradient.append("stop")
                  .attr("offset", "80%")
                  .attr("stop-color", "#FFA500");
                  
    linearGradient.append("stop")
                  .attr("offset", "100%")
                  .attr("stop-color", "#000000");

    const colours = d3.map(dataset, function(d) { return d.Colour; }).keys();
    
    // ["Silver/Aluminium", "Black", "Grey", "Blue", "Red/Maroon", "Gold", "White/Ivory", "Beige"
    // , "Brown", "Green", "Yellow", "Purple", "Bronze", "Orange", "Pink", "Multi-coloured"]
    //console.log(colours);
    
    // {Colour: "Silver/Aluminium", Units: 10, Year: 2019, Rank: 12, Class: "silver-aluminium"}
    //console.log(d3.map(dataset, function(d) { return d.Colour; }).values()[0]);
    
    colours.forEach(function(colour) {
        const currData = dataset.filter(function(d) { if (d.Colour == colour) { return d; } }); 
        
        // currData is an array with all the rows for a particular colour
        // {Colour: "Silver/Aluminium", Units: 21534, Year: 2010, Rank: 1, Class: "silver-aluminium"}
        //console.log(currData[0]);
        
        // D3 line generator
        const line = d3.line()
                       .x(function(d) { return x(d.Year); })
                       .y(function(d) { return y(d.Rank); });
        
        chart.append("path")
             .datum(currData)
             .attr("class", colour.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-') )
             .attr("style", "fill:none !important")
             .attr("stroke-linejoin", "round")
             .attr("stroke-linecap", "round")
             .attr("stroke-width", 2)
             .attr("stroke-opacity", 0.3)
             .attr("d", line);
             
    }); // for each colour
    
    // nodes (circles)
    const node = chart.append("g")
                      .selectAll("circle")
                      .data(dataset)
                      .enter()
                      .append("circle")
                      .attr("cx", function(d) { return x(d.Year); })
                      .attr("cy", function(d) { return y(d.Rank); })
                      .attr("fill", "blue")
                      .attr("class", function(d) { return d.Class; })
                      .attr("r", 6)
                      .attr("stroke-width", 1.5)
                      .attr("opacity", 0.8);
                    
    // tooltips
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
    
    // a single div element with class="tooltip"
    //console.log(tooltip);
    
    // interactivity
    chart.selectAll("circle")
         .on("mouseover", function(d) {
            chart.selectAll('.' + d.Class)
                 // adds the class active to the line and circles for this colour
                 .classed('active', true);

            const tooltip_str = "Colour: " + d.Colour +
                                "<br/>" + "Year: " + d.Year +
                                "<br/>" + "Units: " + d.Units +
                                "<br/>" + "Rank: " + d.Rank;

            tooltip.html(tooltip_str)
                   .style("visibility", "visible");
         })
         .on("mousemove", function(d) {
            tooltip.style("top", d3.event.pageY - (tooltip.node().clientHeight + 5) + "px")
                   .style("left", d3.event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
         })
         .on("mouseout", function(d) {
            chart.selectAll('.'+d.Class)
                 .classed('active', false);

            tooltip.style("visibility", "hidden");
         })
         // so user can click on multiple colours and highlight them to make it easier to compare
         // classed("click-active") returns true if any element in the selection has the class
         // the function in classed is evaluated for each element in the selection
         .on("click", function(d) {
            chart.selectAll('.' + d.Class)
                 .classed("click-active", function(d) {
                    // toggle state
                    return !d3.select(this).classed("click-active");
                 });
         });
}

/**
  * makeModelTreeemap()
  * 
  */
function makeModelTreemap(dataset) {
    // https://www.d3-graph-gallery.com/graph/treemap_custom.html
    // http://bl.ocks.org/JacquesJahnichen/42afd0cde7cbf72ecb81

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 445 - margin.left - margin.right;
    const height = 445 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#make-model-treemap")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);

    // Give the data to this cluster layout
    // Here the size of each leaf is given in the 'value' field in input data
    const root = d3.hierarchy(dataset)
                   .sum(function(d) { return d.value; })
                   .sort(function(a, b) { return b.value - a.value; });
    
    //console.log(root.leaves());
    
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
      .size([width, height])
      .paddingInner(3)  // Padding between each rectangle
      .paddingOuter(1) // Extra padding between car makes
      (root);

    // And a opacity scale
    const opacity = d3.scaleLinear()
                      .domain([0, 5000])
                      .range([.5,1]);
    
    // use this information to add rectangles:
    svg.selectAll("rect")
       .data(root.leaves())
       .enter()
       .append("rect")
       .attr('x', function (d) { return d.x0; })
       .attr('y', function (d) { return d.y0; })
       .attr('width', function (d) { return d.x1 - d.x0; })
       .attr('height', function (d) { return d.y1 - d.y0; })
       .attr("class", function(d) { 
           return d.parent.data.name.toLowerCase().replace(/ /g, '-') + "-square";
       })
       .style("opacity", function(d) { return opacity(d.data.value); });
    
     // tooltips
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
    
    // interactivity
    svg.selectAll("rect")
         .on("mouseover", function(d) {
            const tooltip_str = "Year: " + d.parent.parent.data.name +
                                "<br/>" + "Make: " + d.parent.data.name +
                                "<br/>" + "Model: " + d.data.name +
                                "<br/>" + "Units: " + d.data.value;
            
            tooltip.html(tooltip_str)
                   .style("visibility", "visible");
         })
         .on("mousemove", function(d) {
            tooltip.style("top", d3.event.pageY - (tooltip.node().clientHeight + 5) + "px")
                   .style("left", d3.event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
         })
         .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden");
         });
         
}
  
/**
  * roiMap()
  * 
  */
function roiMap(irelandCounties, unitsByCountyAndYear) {
    // Adapted from: https://www.d3-graph-gallery.com/graph/choropleth_basic.html
  
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#roi-map")
                  .append("svg")
                   //.attr("width", width + margin.left + margin.right)
                   //.attr("height", height + margin.top + margin.bottom)
                   .attr("width", 800)
                   .attr("height", 800)
                   .append("g")
                   //.attr("transform",`translate(${margin.left},${margin.top})`);
    
    // prepare the data
    const data = d3.map();
    
    unitsByCountyAndYear.forEach(function (d) {
        // new car sales per 100 adults
        data.set(d.County, Math.round(d.Units * 1000 / d["2016 Population Over 19"]) / 10 );
    });
    
    // 5.2
    //console.log(data.get("Dublin"));
    
    // colour scale
    const colourScale = d3.scaleThreshold()
                          .domain([1, 2, 3, 4, 5, 6])
                          .range(d3.schemeGreens[7]);
                          
    // https://codepen.io/robjoeol/pen/qKReXy
    const projection = d3.geoAlbers()
                   .scale(7307.831779290534)
                   .center([-0.6, 38.7])
                   .translate([978.8244047152583, 2145.7113504855133])
                   .rotate([0, 0, 0]);

    //Generate paths based on projection
    const path = d3.geoPath()
             .projection(projection);
    
    // https://bl.ocks.org/mbostock/4122298
    svg.append("g")
       .attr("class", "counties")
       .selectAll("path")
       .data(topojson.feature(irelandCounties, irelandCounties.objects.IRL_adm1).features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("fill", function (d) { return colourScale(data.get(d.properties.NAME_1)); })
       .attr("stroke", "#808080");
    
    // {type: "GeometryCollection", geometries: Array(26)}
    //console.log(irelandCounties.objects.IRL_adm1);
    
    // {arcs: Array(1), type: "Polygon", properties: {…}}
    //console.log(irelandCounties.objects.IRL_adm1.geometries[0]);
    
    // Carlow
    //console.log(irelandCounties.objects.IRL_adm1.geometries[0].properties.NAME_1);
    
    // add labels for the new car sales per 100 adults
    const labels = svg.selectAll("text")
                      .data(topojson.feature(irelandCounties, irelandCounties.objects.IRL_adm1).features)
                      .enter();
    
    // https://codepen.io/robjoeol/pen/qKReXy
    labels.append("text")
          .attr("class", "label")
          .attr("transform", function(d) {
                return "translate( " + path.centroid(d) + " )"
          })
          .text(function(d) {
                return data.get(d.properties.NAME_1);
          })
          .attr("text-anchor", "middle");
    
    // tooltips
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");
    
    // interactivity
    svg.selectAll("path")
        .on("mouseover", function(d) {
            // const tooltip_str = "Year: " + d.parent.parent.data.name +
            //                     "<br/>" + "Make: " + d.parent.data.name +
            //                     "<br/>" + "Model: " + d.data.name +
            //                     "<br/>" + "Units: " + d.data.value;
            const tooltip_str = "hello";
            console.log(d.properties.NAME_1);
            
            tooltip.html(tooltip_str)
                   .style("visibility", "visible");
         })
         .on("mousemove", function(d) {
            tooltip.style("top", d3.event.pageY - (tooltip.node().clientHeight + 5) + "px")
                   .style("left", d3.event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
         })
         .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden");
         });
         
}