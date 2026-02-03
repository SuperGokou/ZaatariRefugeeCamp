// Za'atari Refugee Camp Data Visualization
// D3.js v7 - Population and Shelter Analysis

const parseTime = d3.timeParse("%Y-%m-%d");

const margin = { top: 45, right: 25, bottom: 45, left: 55 };
const width = 520;
const height = 340;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Initialize Area Chart SVG with viewBox for responsiveness
const areaSvg = d3.select("#areaChart").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add gradient definition for area chart
const defs = d3.select("#areaChart svg").append("defs");

const areaGradient = defs.append("linearGradient")
    .attr("id", "areaGradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

areaGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#2d6a6a")
    .attr("stop-opacity", 0.4);

areaGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#2d6a6a")
    .attr("stop-opacity", 0.05);

// Initialize Bar Chart SVG with viewBox for responsiveness
const barSvg = d3.select("#barChart").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load and process population data
d3.csv("data/zaatari-refugee-camp-population.csv", d => {
    d.population = +d.population;
    d.date = parseTime(d.date);
    return d;
}).then(data => {
    drawAreaChart(data);
}).catch(error => {
    console.error("Error loading data:", error);
});

function drawAreaChart(data) {
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population) * 1.1])
        .range([innerHeight, 0]);

    // Area generator
    const area = d3.area()
        .x(d => xScale(d.date))
        .y0(innerHeight)
        .y1(d => yScale(d.population))
        .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.population))
        .curve(d3.curveMonotoneX);

    // Draw area with animation
    const areaPath = areaSvg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Animate area fill
    const areaLength = areaPath.node().getTotalLength();
    areaPath
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 0.8);

    // Draw line with animation
    const linePath = areaSvg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    const lineLength = linePath.node().getTotalLength();
    linePath
        .attr("stroke-dasharray", lineLength)
        .attr("stroke-dashoffset", lineLength)
        .transition()
        .duration(1500)
        .ease(d3.easeQuadOut)
        .attr("stroke-dashoffset", 0);

    // X Axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(4))
        .tickFormat(d3.timeFormat("%b %Y"))
        .tickSize(-innerHeight)
        .tickPadding(10);

    areaSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.1));

    // Y Axis
    const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d => d3.format(".2s")(d))
        .tickSize(-innerWidth)
        .tickPadding(10);

    areaSvg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.1));

    // Chart title
    areaSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", innerWidth / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .text("Camp Population Over Time");

    // Tooltip setup
    const tooltipGroup = areaSvg.append("g")
        .attr("class", "tooltip-group")
        .style("opacity", 0);

    tooltipGroup.append("line")
        .attr("class", "tooltip-line")
        .attr("y1", 0)
        .attr("y2", innerHeight);

    const tooltipCircle = tooltipGroup.append("circle")
        .attr("class", "tooltip-circle")
        .attr("r", 6);

    const tooltipBox = tooltipGroup.append("g")
        .attr("class", "tooltip-box");

    tooltipBox.append("rect")
        .attr("class", "tooltip-bg")
        .attr("width", 130)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -25);

    const tooltipDate = tooltipBox.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 20)
        .attr("y", -5);

    const tooltipPopulation = tooltipBox.append("text")
        .attr("class", "tooltip-population")
        .attr("x", 20)
        .attr("y", 15);

    // Invisible overlay for mouse tracking
    const bisectDate = d3.bisector(d => d.date).left;

    areaSvg.append("rect")
        .attr("class", "overlay")
        .attr("width", innerWidth)
        .attr("height", innerHeight)
        .on("mousemove", function(event) {
            const [mouseX] = d3.pointer(event);
            const x0 = xScale.invert(mouseX);
            const i = bisectDate(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];

            if (!d0 || !d1) return;

            const selectedData = x0 - d0.date > d1.date - x0 ? d1 : d0;
            const xPos = xScale(selectedData.date);
            const yPos = yScale(selectedData.population);

            tooltipGroup
                .attr("transform", `translate(${xPos},0)`)
                .style("opacity", 1);

            tooltipCircle.attr("cy", yPos);

            // Flip tooltip if near right edge
            const flipTooltip = xPos > innerWidth - 150;
            tooltipBox.attr("transform", flipTooltip ? "translate(-150, 0)" : "translate(0, 0)");
            tooltipBox.select("rect").attr("x", flipTooltip ? -140 : 10);
            tooltipBox.selectAll("text").attr("x", flipTooltip ? -130 : 20);

            tooltipDate.text(d3.timeFormat("%B %d, %Y")(selectedData.date));
            tooltipPopulation.text(`Pop: ${selectedData.population.toLocaleString()}`);
        })
        .on("mouseout", function() {
            tooltipGroup.style("opacity", 0);
        });
}

// Shelter distribution data (source: UNHCR shelter survey)
const shelterData = [
    { type: "Caravans", percentage: 79.68 },
    { type: "Combination", percentage: 10.81 },
    { type: "Tents", percentage: 9.51 }
];

drawBarChart(shelterData);

function drawBarChart(data) {
    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([innerHeight, 0]);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, innerWidth])
        .padding(0.35);

    // Draw bars with animation
    barSvg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.type))
        .attr("width", xScale.bandwidth())
        .attr("y", innerHeight)
        .attr("height", 0)
        .attr("rx", 4)
        .transition()
        .duration(800)
        .delay((d, i) => i * 150)
        .ease(d3.easeBackOut.overshoot(0.5))
        .attr("y", d => yScale(d.percentage))
        .attr("height", d => innerHeight - yScale(d.percentage));

    // Y Axis
    const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => d + "%")
        .tickSize(-innerWidth)
        .tickPadding(10);

    barSvg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke-opacity", 0.1));

    // X Axis
    barSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickSize(0).tickPadding(12))
        .call(g => g.select(".domain").remove());

    // Chart title
    barSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", innerWidth / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .text("Shelter Distribution");

    // Percentage labels above bars (animated)
    barSvg.selectAll(".percentage-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "percentage-label")
        .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
        .attr("y", innerHeight)
        .attr("text-anchor", "middle")
        .style("opacity", 0)
        .text(d => d.percentage.toFixed(1) + "%")
        .transition()
        .duration(800)
        .delay((d, i) => i * 150 + 400)
        .attr("y", d => yScale(d.percentage) - 12)
        .style("opacity", 1);
}
