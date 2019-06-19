var dataset = [30, 86, 168, 281, 303, 365];

var svgWidth = 500,
    svgHeight = 300,
    barPadding = 5;
var barWidth = (svgWidth / dataset.length);

// 实现横向柱状图，有label,并支持scales


var svg = d3.select('.chart')
    .style('width', svgWidth + "px")
    .style('height', svgHeight + "px");

var h_scales = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgWidth])

var bar = svg.selectAll('div')
    .data(dataset)
    .enter()
    .append('div')
    .style('width', function(d) {
      return h_scales(d) + "px";
    })
    .attr("class", 'bar')
    .text(function(d) {
      return d;
    })
