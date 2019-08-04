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
        d.Rank = parseInt(d.Rank);
        d.Year = parseInt(d.Year);
    });
    
    mybumpchart(dataset.filter(function (d) { return d.Rank < 11; }));
    
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
    // http://bl.ocks.org/cjhin/b7a5f24a0853524414b06124c559961a
    
    //// For each row, calculate the "finishing" position
    //   // first sort, year, then points, then goals_for
    //   data.sort(function(a, b) {
    //     if(b['year'] != a['year']) {
    //       return b['year'] - a['year'];
    //     }
    //     if(b['points'] != a['points']) {
    //       return b['points'] - a['points'];
    //     }
    //     if(b['goals_for'] != a['goals_for']) {
    //       return b['goals_for'] - a['goals_for'];
    //     }
    //   });
    
    //   // Then add the position with a simple integer increment
    //   // now that the data is "in order"
    //   var pos = 1;
    //   data[0].position = pos;
    //   for(var i=1; i<data.length; i++) {
    //     // this is a new year, so start over
    //     if(data[i - 1].year != data[i].year) {
    //       pos = 1;
    //     } else {
    //       pos++;
    //     }
    //     data[i].position = pos;
    //   }

    // add a css safe class for use in hover interactions and coloring
    dataset.forEach(function(d) {
        d.Class = d.Colour.toLowerCase().replace(/ /g, '-').replace(/\./g,'').replace(/\//g,'-');
    })
    
    const margin = { top: 35, right: 0, bottom: 30, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // sort data
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