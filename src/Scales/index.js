let dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160]

var svgWidth = 500,
    svgHeight = 300,
    barPadding = 5;
var barWidth = (svgWidth / dataset.length);

var svg = d3.select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var yScales = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight]);


var barChart = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('height', function(d) {
      return yScales(d);      
    })
    .attr('width', function(d) {
      return barWidth - barPadding;
    })
    .attr('y', function(d) {
      console.log(`d: ${d}, yScales(d): ${yScales(d)}`)
      return svgHeight - yScales(d);
    })
    .attr('fill', "red")
    .attr("transform", function (d, i,arr) {
    var translate = [barWidth * i, 0]; 
      return "translate("+ translate +")";
    });
