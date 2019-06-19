var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

var svgWidth = 500,
    svgHeight = 300,
    barPadding = 5;
var barWidth = (svgWidth / dataset.length);

var svg = d3.select(".bar-chart")
      .attr("height", svgHeight)
      .attr("width", svgWidth)

var barChart = svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("height", function(d) {
        return d
      })
      .attr("y", function(d) {
        return svgHeight - d;
      })
      .attr("width", function(d) {
        return barWidth - barPadding;
      })
      .attr("transform", function(d, i) {
        let position = [barWidth*i, 0]
        return "translate(" + position + ")";
      })

var text = svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("font-size", "20px")
      .attr("y", function(d) {
        return svgHeight - d -2;
      })
      .attr("x", function(d, i) {
        return barWidth * i
      })
      .attr("fill", "#a64c38")