import * as d3 from "d3"

const drawChart = (all) => {

  const baseTemperature = all.baseTemperature;
  const data = all.monthlyVariance;

  const margin = {top: 20, right: 40, bottom: 110, left: 80};
  const width = 1024 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const maxTemp = d3.max(data, d => baseTemperature + d.variance);
  const minTemp = d3.min(data, d => baseTemperature + d.variance);

  const colors = ["skyblue", "#FFFFDD", "darkorange"];
  const offsets = [0, .5, 1];
  const colorScale = d3.scaleLinear()
	                     .domain([minTemp, (minTemp + maxTemp)/2, maxTemp])
                       .range(colors);

  const minYear = d3.min(data, d => d.year);
  const maxYear = d3.max(data, d => d.year);
  const yearsTotal = maxYear - minYear;

  x.domain([minYear, maxYear]); // years
  y.domain([12, 1]); // months

  const cellH = height / 12;
  const cellW = width / yearsTotal;

  const svg = d3.select(".chart")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const div = d3.select("#app").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

  const heat = svg.selectAll(".grid-cell")
                  .data(data, d => d.year + ':' + d.month)
                  .enter().append("g")
                    .attr("class", "grid-cell")
                    .on("mouseenter", (d, i) => {
                      div.html(
                            "<strong>" + (months[+d.month - 1]) + " " + d.year + "</strong>" +
                            "<strong>" + d3.format(".3f")(baseTemperature + d.variance) + "&deg;C</strong>" +
                            d3.format(".3f")(d.variance) + "&deg;C"
                          )
                         .transition()
                         .duration(50)
                         .style("opacity", .9)
                         .style("left", margin.left + (+d.year - minYear) * cellW + "px")
                         .style("top", margin.top + (+d.month - 1) * cellH + "px");
                    })
                    .on("mouseleave", function(d) {
                      div.transition()
                         .duration(500)
                         .style("opacity", 0);
                    });

  heat.append("rect")
      .attr("x", (d) => (+d.year - minYear) * cellW)
      .attr("y", (d) => (+d.month - 1) * cellH)
      .attr("width", cellW)
      .attr("height", cellH)
      .style("fill", d => colorScale((baseTemperature + d.variance)));

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d => d3.format("04d")(d)));


  // Add the y Axis months
  svg.selectAll(".axis-month")
                  .data(months)
                  .enter().append("text")
                    .attr("class", "axis-month")
                    .attr("transform", (d, i) => "translate(" + (-5) + ", " + ((i + 1) * cellH - cellH/2) + ")")
                    .style("text-anchor", "end")
                    .text(d => d);

  // text label for the x axis
  svg.append("text")
       .attr("class", "axis-title")
       .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 25) + ")")
       .style("text-anchor", "middle")
       .text("Year");

  // text label for the y axis
  svg.append("text")
       .attr("class", "axis-title")
       .attr("transform", "rotate(-90)")
       .attr("y", -60)
       .attr("x", -height/2)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Month");

  //
  // draw legend:
  //
  svg.append("defs")
    .append("linearGradient")
    .attr("id", "legend-grad")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%")
    .selectAll("stop")
      .data(colors)
      .enter().append("stop")
        .attr("offset", (d,i) => offsets[i])
        .attr("stop-color", (d,i) => d);



  const legendWidth = 400;

  //Color Legend container
  const legendsvg = svg.append("g")
                       .attr("class", "legend-wrapper")
  	                   .attr("transform", "translate(" + (width/2) + "," + (height + 80) + ")");

  //Draw the Rectangle
  legendsvg.append("rect")
  	       .attr("class", "legend-rect")
  	       .attr("x", -legendWidth/2)
  	       .attr("y", 0)
           .attr("width", legendWidth)
           .attr("height", 10)
           .style("fill", "url(#legend-grad)");

  //Append title
  legendsvg.append("text")
  	       .attr("class", "legend-title")
  	       .attr("x", 0)
           .attr("y", -10)
           .style("text-anchor", "middle")
           .text("Temperature");

   const xLegend = d3.scaleLinear()
                     .range([-legendWidth/2, legendWidth/2])
                     .domain([minTemp, maxTemp]);

   legendsvg.append("g")
   	        .attr("class", "axis")
   	        .attr("transform", "translate(0," + (10) + ")")
   	        .call(d3.axisBottom(xLegend)
                    .tickValues([minTemp, (minTemp + maxTemp)/2, maxTemp])
                    .tickFormat(d => d3.format(".0f")(d) + "°C"));
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (err, data) => {
  if (err) return console.warn(err);
  drawChart(data);
});
