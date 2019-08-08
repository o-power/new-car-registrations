//d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(dataset) {
//    makeGraphs(dataset);
//});

Promise.all([
    d3.csv("assets/data/UnitsByMakeAndYear.csv"),
    d3.csv("assets/data/UnitsByColourAndYear.csv"),
    d3.json("assets/data/UnitsByMakeModelAndYear.json")
]).then(function(files) {
    makeGraphs(files[0]);
    makeGraphs2(files[1]);
    makeGraphs3(files[2]);
}).catch(function(err) {
    console.log(err);
});

/**
  * makeGraphs()
  * 
  */
function makeGraphs(dataset) {
    
    dataset.forEach(function(d) {
        d.Units = parseInt(d.Units);
    });

    mybarplot(dataset.filter(function (d) { return d.Year == "2019"; }));
    mystackedareaplot(dataset);
    
    // {Rank: "1", Make: "TOYOTA", Units: 21724, Year: "2008"}
    //console.log(dataset[0]);
    
    // "1"
    //console.log(dataset[0].Rank);
    // "TOYOTA"
    //console.log(dataset[0].Make);
    // 21724
    //console.log(dataset[0].Units);
    // "2008"
    //console.log(dataset[0].Year);
    // 489
    //console.log(dataset.length);
}

/**
  * makeGraphs2()
  * 
  */
function makeGraphs2(dataset) {
    
    dataset.forEach(function(d) {
        d.Units = parseInt(d.Units);
        d.Rank = parseInt(d.Rank);
        d.Year = parseInt(d.Year);
    });
    
    mybumpchart(dataset.filter(function (d) { return (d.Year > 2009); }));
    
    // {Colour: "Grey", Units: 30023, Year: 2019, Rank: 1, Class: "grey"}
    //console.log(dataset[0]);
}

/**
  * makeGraphs3()
  * 
  */
function makeGraphs3(dataset) {
    
    // {children: Array(12), name: "UnitsByYearMakeModel"}
    //console.log(dataset);
    
    // UnitsByYearMakeModel
    //console.log(dataset.name);
    
    // {children: Array(35), name: "2019"}
    //console.log(dataset.children[0]);
    
    // "2019"
    //console.log(dataset.children[0].name);
    
    // {children: Array(11), name: "VOLVO"}
    //console.log(dataset.children[0].children[0]);
    
    // "VOLVO"
    //console.log(dataset.children[0].children[0].name);
    
    // {name: "XC60", value: 267}
    //console.log(dataset.children[0].children[0].children[0]);
    
    // "XC60"
    //console.log(dataset.children[0].children[0].children[0].name);
    // 267
    //console.log(dataset.children[0].children[0].children[0].value);
    
    mytreemap(dataset.children[0]);
}

/**
  * mybumpchart()
  * 
  */
function mybumpchart(dataset) {
    // Adapted from: http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a

    // Add a CSS safe class for use in hover interactions and coloring
    dataset.forEach(function(d) {
        d.Class = d.Colour.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-');
    });
    
    const margin = { top: 35, right: 0, bottom: 30, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Sort data in descending order
    dataset.sort(function(a, b) {
         return parseInt(b.Year) - parseInt(a.Year);
    });
    
    const chart = d3.select("#mybumpchart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",`translate(${margin.left},${margin.top})`);
     
    const x = d3.scaleBand()
                .domain(dataset.map(function(d) { return d.Year; }).reverse())
                .rangeRound([25, width - 15]);

    const y = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) { return d.Rank }), d3.max(dataset, function(d) { return d.Rank; })])
                .range([20, height - 30]);

    const size = d3.scaleLinear()
                   .domain(d3.extent(dataset, function(d) { return d.Units; }))
                   .range([3, 10]);
    
    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(-"+ x.bandwidth()/2.0 +"," + height + ")")
         .call(xAxis);

    chart.append("g")
         .attr("class", "y axis")
         .call(yAxis);
         
    chart.append("text")
         .text("Popularity ranking of car colours")
         .attr("text-anchor", "middle")
         .attr("class", "graph-title")
         .attr("y", -10)
         .attr("x", width / 2.0);

    chart.append("text")
         .text("Rank")
         .attr("text-anchor", "middle")
         .attr("class", "graph-title")
         .attr("y", -35)
         .attr("x", width / -4.0)
         .attr("transform", "rotate(-90)");
    
    const defs = chart.append("defs");
    
    const linearGradient = defs.append("linearGradient")
    		    .attr("id", "myGradient");
        
    linearGradient.html(`<stop offset="0.0%" stop-color="#FF0000"></stop>  
        <stop offset="20%" stop-color="#0000FF"></stop>
        <stop offset="40%" stop-color="#FFFF00"></stop>
        <stop offset="60%" stop-color="#800080"></stop>
        <stop offset="80%" stop-color="#FFA500"></stop> 
        <stop offset="100%" stop-color="#000000"></stop>`);
        
    const colours = d3.map(dataset, function(d) { return d.Colour; }).keys();
    
    // array of the colours
    //console.log(colours);
    
    colours.forEach(function(colour) {
        const currData = dataset.filter(function(d) { if(d.Colour == colour) { return d; } }); 
        
        // array with all the rows for a particular colour
        //console.log(currData);
        
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
            .attr("stroke-opacity", 0.5)
            .attr("d", line);
        
    }); // for each colour
    
    const node = chart.append("g")
                    .selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("cx", function(d) { return x(d.Year); })
                    .attr("cy", function(d) { return y(d.Rank); })
                    .attr('fill', 'blue')
                    // replace spaces with - and remove '.' (from d.c. united)
                    .attr("class", function(d) { return d.Colour.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-') })
                    .attr("r", 6)
                    //.attr("r", function(d) { return size(d['goals_for']) })
                    .attr("stroke-width", 1.5)
                    .attr('opacity', '1.0');
                    
    // tooltips
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip");

    chart.selectAll("circle")
         .on("mouseover", function(d) {
            chart.selectAll('.' + d.Class)
            .classed('active', true);

            const tooltip_str = "Colour: " + d.Colour +
                                "<br/>" + "Year: " + d.Year +
                                "<br/>" + "Units: " + d.Units +
                                "<br/>" + "Rank: " + d.Rank;

            tooltip.html(tooltip_str)
                   .style("visibility", "visible");
         })
         .on("mousemove", function(d) {
             // or use d3.mouse to get x and y coordinates?
            tooltip.style("top", event.pageY - (tooltip.node().clientHeight + 5) + "px")
                   .style("left", event.pageX - (tooltip.node().clientWidth / 2.0) + "px");
         })
         .on("mouseout", function(d) {
            chart.selectAll('.'+d.Class)
                 .classed('active', false);

            tooltip.style("visibility", "hidden");
         })
         .on('click', function(d) {
            chart.selectAll('.' + d.Class)
                 .classed('click-active', function(d) {
                    // toggle state
                    return !d3.select(this).classed('click-active');
                 });
         })
}

/**
  * mybarplot()
  * 
  */
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
    // svg.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(d3.axisBottom()
    //   .scale(xScale)
    //   .tickSize(-height, 0, 0)
    //   .tickFormat(''))
    
    svg.append('g')
       .attr('class', 'grid')
       .call(d3.axisLeft()
       .scale(yScale)
       .tickSize(-width, 0, 0)
       .tickFormat(''));
       
    // add y label
    svg.append('text')
       .attr('x', -height/2)
       .attr('y', -margin.left/2)
       .attr('transform', 'rotate(-90)')
       .attr('text-anchor', 'middle')
       .text('Units');
    
    // add title
    svg.append('text')
       .attr('x', width / 2 + margin.left)
       .attr('y', margin.top/2)
       .attr('text-anchor', 'middle')
       .text('Car makes by units (2019)');
    
    // add interactivity
    svg.selectAll("rect")
       .on('mouseenter', function (actual, i) {
           console.log(this);
           d3.select(this).attr('opacity', 0.5);
       })
       .on('mouseleave', function (actual, i) {
           d3.select(this).attr('opacity', 1);
       });
    
    // add colors and fonts
    
    
    // https://blog.risingstack.com/tutorial-d3-js-calendar-heatmap/
    // https://jsfiddle.net/matehu/w7h81xz2/
}

/**
  * mystackedareaplot()
  * 
  */
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

/**
  * mytreemap()
  * 
  */
function mytreemap(dataset) {
    // https://www.d3-graph-gallery.com/graph/treemap_custom.html
    // http://bl.ocks.org/JacquesJahnichen/42afd0cde7cbf72ecb81

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 445 - margin.left - margin.right;
    const height = 445 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#mytreemap")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);

    // Give the data to this cluster layout
    // Here the size of each leave is given in the 'value' field in input data
    const root = d3.hierarchy(dataset)
                   .sum(function(d) { return d.value; });
    
    //console.log(root.leaves());
    
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
      .size([width, height])
      //.paddingTop(28)
      //.paddingRight(7)
      .paddingInner(3)      // Padding between each rectangle
      //.paddingOuter(6)
      //.padding(20)
      (root);
      
    // scales
    // https://www.d3-graph-gallery.com/graph/custom_axis.html

    // prepare a color scale
    // One color per group, opacity proportional to value: classic use of scale
    const color = d3.scaleOrdinal()
                    .domain(["VOLVO","VOLKSWAGEN","OTHER","NISSAN"])
                    .range([ "#402D54","#0000FF","#FF6600","#00FF00"]);

    // And a opacity scale
    const opacity = d3.scaleLinear()
                    .domain(d3.extent(dataset.children.map(function(child) { 
                      return +child.value;
                    })))
                    .range([.5,1]);

    
    console.log(root.leaves());
    
    // use this information to add rectangles:
    svg.selectAll("rect")
       .data(root.leaves())
       .enter()
       .append("rect")
       .attr('x', function (d) { return d.x0; })
       .attr('y', function (d) { return d.y0; })
       .attr('width', function (d) { return d.x1 - d.x0; })
       .attr('height', function (d) { return d.y1 - d.y0; })
       .style("stroke", "black")
       .style("fill", function(d) { return color(d.parent.name); } )
       .style("opacity", function(d) { return opacity(d.data.value); });

    // and to add the text labels
    svg.selectAll("text")
       .data(root.leaves())
       .enter()
       .append("text")
       .attr("x", function(d){ return d.x0+5; })    // +10 to adjust position (more right)
       .attr("y", function(d){ return d.y0+20; })    // +20 to adjust position (lower)
       .text(function(d) { return d.data.name; })
       .attr("font-size", "12px")
       .attr("fill", "white");

    // and to add the text labels
    svg.selectAll("vals")
       .data(root.leaves())
       .enter()
       .append("text")
       .attr("x", function(d){ return d.x0+5; })    // +10 to adjust position (more right)
       .attr("y", function(d){ return d.y0+35; })    // +20 to adjust position (lower)
       .text(function(d){ return d.data.value; })
       .attr("font-size", "11px")
       .attr("fill", "white")

    // Add title for the 3 groups
//    svg.selectAll("titles")
 //      .data(root.descendants().filter(function(d){return d.depth==1}))
//       .enter()
//     .append("text")
//       .attr("x", function(d){ return d.x0})
//       .attr("y", function(d){ return d.y0+21})
//       .text(function(d){ return d.data.name })
//       .attr("font-size", "19px")
//       .attr("fill",  function(d){ return color(d.data.name)} )

//   // Add title for the 3 groups
//   svg
//     .append("text")
//       .attr("x", 0)
//       .attr("y", 14)    // +20 to adjust position (lower)
//       .text("Three group leaders and 14 employees")
//       .attr("font-size", "19px")
//       .attr("fill",  "grey" )

// })  
}