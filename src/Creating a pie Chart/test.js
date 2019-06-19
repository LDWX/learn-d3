var dataset = [
  {"platform": "Android", "percentage": 40.11}, 
  {"platform": "Windows", "percentage": 36.69},
  {"platform": "iOS", "percentage": 13.06}
];

// var dataset = [110, 90, 80, 49]

var svgWidth = 500,
    svgHeight = 400,
    barWidth = 50,
    radius = Math.min(svgHeight, svgWidth) / 2;

var svg = d3.select('.bar-chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

var g = svg.append('g')
    .attr('transform', 'translate(' + radius + "," + radius + ")")

var pie = d3.pie().value(function(d) {
  console.log(`pie value d: `, d)
  return d.percentage;
})



var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(0)

var color = d3.scaleOrdinal(d3.schemeCategory10)


var arc = g.selectAll('arc')
  .data(pie(dataset))
  .enter()
  .append('g')

arc.append('path')
  .attr('d', path)
  .attr('fill', function(d, i) {
    console.log(`arc append path d: `, d)
    return color(i)
  })

arc.append('text')
  .attr('transform', function(d) {
    return 'translate(' + path.centroid(d) + ")";
  })
  .attr('text-anchor', 'middle')
  .text(function(d) {
    console.log(`arc append text d: `, d)
    return d.data.platform;
  })
  

