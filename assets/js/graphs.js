d3.csv("assets/data/UnitsByMakeAndYear.csv").then(function(data) {
    makeGraphs(data);
});

function makeGraphs(data) {
    console.log(data);
}