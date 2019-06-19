let dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160]

var svgWidth = 500,
    svgHeight = 500,
    barPadding = 5;
var barWidth = (svgWidth / dataset.length);

var svg = d3.select('svg')
    .attr('style',"padding:30px;")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var yScales = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([svgHeight, 0]);

var xScales = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgWidth])

var y_axis = d3.axisLeft()
    .scale(yScales)

var x_axis = d3.axisBottom()
    .scale(xScales)

svg.append("g")
    .call(y_axis)
    .attr("transform", "translate(50, 10)");

svg.append("g")
  .call(x_axis)
  .attr("transform", "translate(50, " + (svgHeight - 20) +")");