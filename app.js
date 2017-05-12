// checking to see data from csv
// let musicData = [];
// d3.csv('./music.csv', function(d) { 
//     // console.log(d);
//     return musicData.push(d);
// });
// console.log(musicData)

// d3 - bar chart
let svg = d3.select("svg");

// data from https://en.wikipedia.org/wiki/List_of_best-selling_singles
let csvPhysical = './music_non-digital.csv';
let csvPText = 'Most Popular Singles Sold Physically (Millions)';
let csvDigital = './music_digital.csv';
let csvDText = 'Most Popular Singles Sold Digitally (Millions)';
let csvChoice = csvPhysical;
let csvText = csvPText;

function option(choice) {
    let margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

    let div = d3.select("body").append("div")
        .classed("tooltip", true)
        .style("opacity", 0);

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (choice === "physical") {
        svg.classed("physical", true);
        csvChoice = csvPhysical;
        csvText = csvPText;
    } else {
        svg.classed("digital", true);
        csvChoice = csvDigital;
        csvText = csvDText;
    }

    d3.csv(csvChoice, function (d) {
        d.sales = +d.sales;
        d.released = +d.released;
        return d;
    }, function (error, data) {
        if (error) throw error;

        x.domain(data.map(d => d.released));
        y.domain([0, d3.max(data, (d) => d.sales)])

        let barPadding = 1;
        let barWidth = width / data.length - barPadding;

        g.append("g")
            .classed("axis axis--x", true)
            .attr("transform", "translate(0," + height + ")");

        g.append("g")
            .classed("axis axis--y", true)
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
            .classed("bar", true)
            .attr("x", (d, i) => (barWidth + barPadding) * i + barPadding)
            .attr("y", d => y(d.sales))
            .attr("width", barWidth)
            .attr("height", d => height - y(d.sales))
            .on("mouseover", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<strong>Artist:</strong> <span style='color:red'>${d.artist}</span><br><strong>Song:</strong> <span style='color:red'>${d.single}</span><br><strong>Year:</strong> <span style='color:red'>${d.released}</span><br><strong>Sales (mil):</strong> <span style='color:red'>${d.sales}</span><br>`)
                    .style("left", (d3.event.pageX + 2) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 3))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(csvText);

    }); // end d3.csv
} // end function option

d3.select("select").on("change", () => {
    let newVal = d3.select("select").property("value");
    d3.select("svg").selectAll("*").remove();

    if (newVal === "digital") {
        option("digital");
    } else {
        option("physical");
    }
});

// initial page load
option("physical");