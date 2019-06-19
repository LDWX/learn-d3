var data = {
  "name": "flare",
  "children": [
    {
      "name": "analytics",
      "children": [{
          "name": "zluster",
          "children": [{
              "name": "AgglomerativeCluster",
              "size": 3938
          }, {
              "name": "CommunityStructure",
              "size": 3812
          }, {
              "name": "HierarchicalCluster",
              "size": 6714
          }, {
              "name": "MergeEdge",
              "size": 743
          }]
      }, {
          "name": "araph",
          "children": [{
              "name": "BetweennessCentrality",
              "size": 3534
          }, {
              "name": "LinkDistance",
              "size": 5731
          }, {
              "name": "MaxFlowMinCut",
              "size": 7840
          }, {
              "name": "ShortestPaths",
              "size": 5914
          }, {
              "name": "SpanningTree",
              "size": 3416
          }]
      }, {
          "name": "optimization",
          "children": [{
              "name": "AspectRatioBanker",
              "size": 7074
          }]
      }]
    }, 
    {
      "name": "animate",
      "children": [{
          "name": "Easing",
          "size": 17010
      }, {
          "name": "FunctionSequence",
          "size": 5842
      }, {
          "name": "interpolate",
          "children": [{
              "name": "ArrayInterpolator",
              "size": 1983
          }, {
              "name": "ColorInterpolator",
              "size": 2047
          }, {
              "name": "DateInterpolator",
              "size": 1375
          }, {
              "name": "Interpolator",
              "size": 8746
          }, {
              "name": "MatrixInterpolator",
              "size": 2202
          }, {
              "name": "NumberInterpolator",
              "size": 1382
          }, {
              "name": "ObjectInterpolator",
              "size": 1629
          }, {
              "name": "PointInterpolator",
              "size": 1675
          }, {
              "name": "RectangleInterpolator",
              "size": 2042
          }]
      }, {
          "name": "ISchedulable",
          "size": 1041
      }, {
          "name": "Parallel",
          "size": 5176
      }, {
          "name": "Pause",
          "size": 449
      }, {
          "name": "Scheduler",
          "size": 5593
      }, {
          "name": "Sequence",
          "size": 5534
      }, {
          "name": "Transition",
          "size": 9201
      }, {
          "name": "Transitioner",
          "size": 19975
      }, {
          "name": "TransitionEvent",
          "size": 1116
      }, {
          "name": "Tween",
          "size": 6006
      }]
  },]
}

let width = 932

let tree = data => {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
}



const root = tree(data);

let x0 = Infinity;
let x1 = -x0;
root.each(d => {
if (d.x > x1) x1 = d.x;
if (d.x < x0) x0 = d.x;
});

const svg = d3.select('svg')
    .style("width", "100%")
    .style("height", "800px");

const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

    

const link = g.append("g")
.attr("fill", "none")
.attr("stroke", "#555")
.attr("stroke-opacity", 0.4)
.attr("stroke-width", 1.5)
.selectAll("path")
.data(root.links())
.join("path")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

const node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
.selectAll("g")
.data(root.descendants())
.join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 2.5);

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
.clone(true).lower()
    .attr("stroke", "white");

// return svg.node();