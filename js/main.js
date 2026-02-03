// Za'atari Refugee Camp Data Visualization
// D3.js v7 - Population and Shelter Analysis

const parseTime = d3.timeParse("%Y-%m-%d");

const margin = { top: 30, right: 0, bottom: 30, left: 50 };
const width = 650 - margin.left - margin.right;
const height = 580 - margin.top - margin.bottom;

// Initialize Area Chart SVG
const areaSvg = d3.select("#areaChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize Bar Chart SVG
const barSvg = d3.select("#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([height, 0]);

    // Area generator
    const area = d3.area()
        .x(d => xScale(d.date))
        .y0(height)
        .y1(d => yScale(d.population));

    areaSvg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Line overlay
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.population));

    areaSvg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // X Axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(3))
        .tickFormat(d3.timeFormat("%b %Y"));

    areaSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("font-size", "10px");

    // Y Axis
    areaSvg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(yScale));

    // Chart title
    areaSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Camp Population");

    // Tooltip setup
    const tooltipGroup = areaSvg.append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltipGroup.append("line")
        .attr("class", "tooltip-line")
        .attr("y1", 10)
        .attr("y2", height)
        .style("stroke", "black")
        .style("stroke-width", "1px");

    const tooltipDate = tooltipGroup.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 10)
        .attr("y", 45)
        .style("text-anchor", "start");

    const tooltipPopulation = tooltipGroup.append("text")
        .attr("class", "tooltip-population")
        .attr("x", 10)
        .attr("y", 20)
        .style("text-anchor", "start");

    // Invisible overlay for mouse tracking
    const bisectDate = d3.bisector(d => d.date).left;

    areaSvg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "transparent")
        .style("pointer-events", "all")
        .on("mousemove", function(event) {
            const x0 = xScale.invert(d3.pointer(event)[0]);
            const i = bisectDate(data, x0, 1);

            // Clamp index to valid range
            const clampedIndex = Math.min(Math.max(i, 0), data.length - 1);
            const selectedData = data[clampedIndex];

            if (selectedData) {
                tooltipGroup.attr("transform", `translate(${xScale(selectedData.date)},0)`);
                tooltipDate.text(d3.timeFormat("%Y-%m-%d")(selectedData.date));
                tooltipPopulation.text(`Population: ${selectedData.population.toLocaleString()}`);
                tooltipGroup.style("opacity", 1);
            }
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
        .range([height, 0]);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, width])
        .padding(0.2);

    // Draw bars
    barSvg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.type))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.percentage))
        .attr("height", d => height - yScale(d.percentage));

    // Y Axis
    barSvg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(yScale).tickFormat(d => d + "%"));

    // X Axis
    barSvg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("text-anchor", "middle");

    // Chart title
    barSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Type of Shelter");

    // Percentage labels above bars
    barSvg.selectAll(".percentage-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "percentage-label")
        .attr("x", d => xScale(d.type) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.percentage) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.percentage + "%");
}
