import * as d3 from "d3"
import axios from "axios"

const drawChart = (all) => {
  const data = all.data;
  const margin = {top: 20, right: 30, bottom: 50, left: 40};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"]

  const x = d3.scaleTime().domain([new Date(data[0][0]), new Date(data[274][0])]).range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Scale the range of the data
  y.domain([0, d3.max(data, function(d) { return d[1]; })]);

  // title
  d3.select(".title").append("h2").html(all.source_name);

  // description
  d3.select(".description").append("pre").html(all.description);

  const chart = d3.select(".chart")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const barWidth = width / data.length;
  const div = d3.select("#app").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

  const bar = chart.selectAll("g")
                    .data(data)
                   .enter().append("g")
                    .attr("transform", (d, i) => "translate(" + i * barWidth + ",0)")
                    .on("mouseenter", (d, i) => {
                      const [year, month, day] = d[0].split("-");
                      div.html("<strong>" + d3.format("$,.2f")(d[1]) + "B</strong>" + months[+month - 1] + " " + year)
                         .transition()
                         .duration(50)
                         .style("opacity", .9)
                         .style("left", (i * barWidth) + "px")
                         .style("bottom", (height - y(d[1]) + 180) + "px");
                    })
                    .on("mouseleave", function(d) {
                      div.transition()
                         .duration(500)
                         .style("opacity", 0);
                    });

  bar.append("rect")
     .attr("class", "bar")
     .attr("y", (d) => y(d[1]))
     .attr("height", (d) => height - y(d[1]))
     .attr("width", barWidth);

  // Add the x Axis
  chart.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y Axis
  chart.append("g")
       .call(d3.axisLeft(y));

  // text label for the x axis
  chart.append("text")
       .attr("class", "axis-title")
       .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 15) + ")")
       .style("text-anchor", "middle")
       .text("Quarter");

  // text label for the y axis
  chart.append("text")
       .attr("class", "axis-title")
       .attr("transform", "rotate(-90)")
       .attr("y", 10)
       .attr("x", -height/2)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("GDP (Billion)");
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (err, data) => {
  if (err) return console.warn(err);
  drawChart(data);
});
