// checking to see data from csv
// let musicData = [];
// d3.csv('./music.csv', function (d) {
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

function barChart(choice) {
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
} // end function barChart

function scatterPlot(choice) {
    let margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let div = d3.select("body").append("div")
        .classed("tooltip", true)
        .style("opacity", 0);

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (choice === "physicalScatter") {
        svg.classed("physical", true);
        csvChoice = csvPhysical;
        csvText = csvPText;
    } else {
        svg.classed("digitalScatter", true);
        csvChoice = csvDigital;
        csvText = csvDText;
    }

    d3.csv(csvChoice, function (d) {
        d.sales = +d.sales;
        d.released = +d.released;
        return d;
    }, function (error, data) {
        if (error) throw error;

        let xMin = d3.min(data, d => d.released);
        let xMax = d3.max(data, d => d.released);
        let yMin = d3.min(data, d => d.sales);
        let yMax = d3.max(data, d => d.sales);

        let xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([height, 0]);

        let xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format(".0f"))
            .ticks(20, ".0f");

        g.append("g")
            .classed("axis axis--x", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        g.append("g")
            .classed("axis axis--y", true)
            .call(d3.axisLeft(yScale))

        g.selectAll('.circle')
            .data(data)
            .enter()
            .append('circle')
            .classed("circle", true)
            .attr('cx', d => xScale(d.released))
            .attr('cy', d => yScale(d.sales))
            .attr('r', d => 0.4 * d.sales)
            .on("mouseover", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<strong>Artist:</strong> <span style='color:red'>${d.artist}</span><br><strong>Song:</strong> <span style='color:red'>${d.single}</span><br><strong>Year:</strong> <span style='color:red'>${d.released}</span><br><strong>Sales (mil):</strong> <span style='color:red'>${d.sales}</span><br>`)
                    .style("left", (d3.event.pageX + 2) + "px")
                    .style("top", (d3.event.pageY - 10) + "px");
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
} // end function scatterPlot


function donutChart(choice) {
    let margin = { top: 40 },
        width = +svg.attr("width"),
        height = +svg.attr("height") - margin.top;

    let radius = Math.min(width, height) / 2;

    let div = d3.select("body").append("div")
        .classed("tooltip", true)
        .style("opacity", 0);

    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    if (choice === "physicalDonut") {
        svg.classed("physicalDonut", true);
        csvChoice = csvPhysical;
        csvText = csvPText;
    } else {
        svg.classed("digitalDonut", true);
        csvChoice = csvDigital;
        csvText = csvDText;
    }

    d3.csv(csvChoice, function (d) {
        d.sales = +d.sales;
        // d.released = +d.released;
        return d;
    }, function (error, data) {
        if (error) throw error;

        let vis = svg.data([data])
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let arc = d3.arc()
            .innerRadius(radius - 80)
            .outerRadius(radius - 10);

        let pie = d3.pie()
            .value(d => d.sales)
            .sort(null);

        let arcs = vis.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .classed("arc", true);

        arcs.append("path")
            .attr("d", arc)
            // .attr("fill", (d, i) => color(d.date.label))
            .on("mouseover", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(`<strong>Artist:</strong> <span style='color:red'>${d.data.artist}</span><br><strong>Song:</strong> <span style='color:red'>${d.data.single}</span><br><strong>Year:</strong> <span style='color:red'>${d.data.released}</span><br><strong>Sales (mil):</strong> <span style='color:red'>${d.data.sales}</span><br>`)
                    .style("left", (d3.event.pageX + 2) + "px")
                    .style("top", (d3.event.pageY - 10) + "px");
            })
            .on("mouseout", d => {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 + (margin.top/3))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(csvText);

    }); // end d3.csv
} // end function donutChart

d3.select("select").on("change", () => {
    let newVal = d3.select("select").property("value");
    d3.select("svg").selectAll("*").remove();

    if (newVal === "digital") {
        barChart("digital");
    } else if (newVal === "physical") {
        barChart("physical");
    } else if (newVal === "digitalScatter") {
        scatterPlot("digitalScatter");
    } else if (newVal === "physicalScatter") {
        scatterPlot("physicalScatter");
    } else if (newVal === "digitalDonut") {
        donutChart("digitalDonut");
    } else {
        donutChart("physicalDonut");
    }
});

// initial page load
barChart("physical");