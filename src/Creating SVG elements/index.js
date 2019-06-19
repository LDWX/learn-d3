var svgWidth = 500,
    svgHeight = 500;


var svg = d3.select('.bar-chart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var line = svg.append('line')
    .attr('x1', '100')
    .attr('x2', '300')
    .attr('y1', '20')
    .attr('y2', '50')
    .attr('stroke', 'red')
    .attr('stroke-width', '10')
    // .attr('stroke-linecap', 'butt')
    // .attr('stroke-linecap', 'round')
    .attr('stroke-linecap', 'square')

var rect = svg.append('rect')
    .attr('x', '100')
    .attr('y', '80')
    .attr('width', '200')
    .attr('height', '100')
    .attr('stroke', 'blue')
    .attr('stroke-width', '10')
    .attr('fill', 'yellow')

var circle = svg.append('circle')
    .attr('cx', '150')
    .attr('cy', '270')
    .attr('r', '50')
    .attr('stroke', 'green')
    .attr('stroke-width', '10')
    .attr('fill', 'purple')