// checking to see data from csv
// let musicData = [];
// d3.csv('./music.csv', function(d) { 
//     // console.log(d);
//     return musicData.push(d);
// });
// console.log(musicData)

// d3 - bar chart
var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// from https://en.wikipedia.org/wiki/List_of_best-selling_singles
var csvPhysical = './music_non-digital.csv';
var csvPText = 'Most Popular Singles Sold Physically (Millions)';
var csvDigital = './music_digital.csv';
var csvDText = 'Most Popular Singles Sold Digitally (Millions)';

d3.csv(csvDigital, function (d) { // also swap commenting on title - line 91
    d.sales = +d.sales;
    d.released = +d.released;
    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(data.map(d => d.released));
    y.domain([0, d3.max(data, (d) => d.sales)])

    var barPadding = 1;
    var barWidth = width / data.length - barPadding;

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
    // for axis title (not showing up)
    //   .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", "0.71em")
    //     .attr("text-anchor", "end")
    //     .text("Sales (in millions)");

    g.selectAll(".bar")
        .data(data)
        .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => (barWidth + barPadding) * i + barPadding)
        .attr("y", d => y(d.sales))
        .attr("width", barWidth)
        .attr("height", d => height - y(d.sales))
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("<strong>Artist:</strong> <span style='color:red'>" + d.artist + "</span><br><strong>Song:</strong> <span style='color:red'>" + d.single + "</span><br><strong>Year:</strong> <span style='color:red'>" + d.released + "</span><br><strong>Sales (mil):</strong> <span style='color:red'>" + d.sales + "</span><br>")	
                .style("left", (d3.event.pageX + 2) + "px")		
                .style("top", (d3.event.pageY - 30) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", 0);
        });

    g.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")  
        .text(csvDText);
        
}); // end d3.csv