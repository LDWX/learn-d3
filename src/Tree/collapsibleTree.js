var treeData = {
  "name": "flare",
  "children": [{
      "name": "analytics",
      type: 'config',
      showDelete: false,
      "children": [{
          "name": "zluster",
          type: 'text',
          showDelete: false,
          "children": [{
            "name": "AgglomerativeCluster",
            "size": 3938,
            type: 'text',
            showDelete: false,
          }, {
            "name": "CommunityStructure",
            "size": 3812,
            showDelete: false,
          }]
        },
        {
          "name": "optimization",
          "children": [{
            "name": "AspectRatioBanker",
            "size": 7074
          }]
        }
      ]
    },
    {
      "name": "animate",
      "children": [{
        "name": "Easing",
        "size": 17010
      }, {
        "name": "FunctionSequence",
        "size": 5842
      }]
    },
  ]
}

// Calculate total nodes, max label length
var totalNodes = 0;
var maxLabelLength = 0;
// Misc. variables
var i = 0;
var duration = 750;
var root;

// size of the diagram
// 设置视图区域的宽度与高度   
// var viewerWidth = document.querySelector("#tree-container").offsetWdith;
// var viewerHeight = document.querySelector("#tree-container").offsetHeight;
var viewerWidth = $(document).width();
var viewerHeight = $(document).height();

//   定义每个节点的大小
var tree = d3.layout.tree()
  .nodeSize([100, 50]);

// define a d3 diagonal projection for use by the node paths later on.
var diagonal = d3.svg.diagonal()
  .projection(function (d) {
    // console.log('projection d: ', d)
    return [d.y, d.x];
  });

// A recursive helper function for performing some setup by walking through all nodes

function visit(parent, visitFn, childrenFn) {
  if (!parent) return;

  visitFn(parent);

  var children = childrenFn(parent);
  if (children) {
    var count = children.length;
    for (var i = 0; i < count; i++) {
      visit(children[i], visitFn, childrenFn);
    }
  }
}

// Call visit function to establish maxLabelLength
visit(treeData, function (d) {
  totalNodes++;
  maxLabelLength = Math.max(d.name.length, maxLabelLength);

}, function (d) {
  return d.children && d.children.length > 0 ? d.children : null;
});

// Define the zoom function for the zoomable tree
function zoom() {
  svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom()
  .scaleExtent([0.1, 3])
  .on("zoom", zoom);

// define the baseSvg, attaching a class for styling and the zoomListener
var baseSvg = d3.select("#tree-container").append("svg")
  .attr("width", viewerWidth)
  .attr("height", viewerHeight)
  .attr("class", "overlay")
  .call(zoomListener)
  .on('dblclick.zoom', null); //阻止双击后出发zoom区域被放大的问题


// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

function centerNode(source) {
  scale = zoomListener.scale();
  x = -source.y0;
  y = -source.x0;
  //   x = x * scale + viewerWidth / 2;
  //   y = y * scale + viewerHeight / 2;
  x = x * scale + 200;
  y = y * scale + viewerHeight / 2;
  d3.select('g').transition()
    .duration(duration)
    .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
  zoomListener.scale(scale);
  zoomListener.translate([x, y]);
}

// Toggle children function
// 节点收缩与扩展
function toggleChildren(d) {
  console.log(d)
  if (d.children) {    
    d._children = d.children;
    d.children = null;
  } else if (d._children) {
    
    d.children = d._children;
    d._children = null;
  }
  update(d)
  return d;
}

// 删除当前节点及其子节点
function deleteNode(d) {
  let pChildren = d.parent.children
  let find = false
  if (pChildren) {
    let pChildrenLen = pChildren.length
    let id = d.id
    for (var i = pChildrenLen; i--; ) {
      if (pChildren[i].id == id) {
        find = true
        break;
      }
    }
    if (find) {
      console.log('find children:', id)
      pChildren.splice(i, 1)
      update(d)
    }
  }
}

let div = document.querySelector('.testNode')

//   用于控制双击的时候不触发单击事件
let clickTimer = null;
let showController = false;
// Toggle children on click.
//   单击触发配置弹框
function configController(d) {
  if (d3.event.defaultPrevented) return; // click suppressed
  console.log('click data: ', d)
  if (showController) {
    div.style = "display: none;"
    showController = !showController
  }else {
    div.style = "display: inline-block;"
    showController = !showController
  }
  d.name = 'hello world'
  update(d)
  clearTimeout(clickTimer)
  // clickTimer = setTimeout(() => {
  //   // console.log('click')
  //   // d = toggleChildren(d);
  //   // update(d);
  //   // centerNode(d);
  // }, 200)
}

//控制节点是否显示删除按钮
function nodeController(d) {
  d.showDelete = !d.showDelete
  console.log('showDelete', d.showDelete)
}
/**
 * 双击触发添加子节点
 * 添加节点时要判断节点类型，是文本节点还是配置节点
 * @param {Object} d 
 */
function dblclick(d) {
  if (d3.event.defaultPrevented) return;
  clearTimeout(clickTimer)
  let node = {
    name: '',
    children: []
  }
  if (!d.children) {
    d.children = []
  }
  d.children.push(node)
  console.log('dblclick data: ', d)
  update(d)
}

//   点击右键删除对应节点及其子节点
function rightClick(d) {
  event.stopPropagation()
  if (event.button == 2) {
    console.log('this is rightClick data: ', d)

    let pChildren = d.parent.children
    let find = false
    if (pChildren) {
      let pChildrenLen = pChildren.length
      let id = d.id
      for (var i = 0; i < pChildrenLen; i++) {
        if (pChildren[i].id == id) {
          find = true
          break;
        }
      }
      if (find) {
        pChildren.splice(i, 1)
      }

      update(d)
    }
  }

}

function update(source) {
  // Compute the new height, function counts total children of root node and sets tree height accordingly.
  // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
  // This makes the layout more consistent.
  var levelWidth = [1];
  var childCount = function (level, n) {

    if (n.children && n.children.length > 0) {
      if (levelWidth.length <= level + 1) levelWidth.push(0);

      levelWidth[level + 1] += n.children.length;
      n.children.forEach(function (d) {
        childCount(level + 1, d);
      });
    }
  };
  childCount(0, root);

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Set widths between levels based on maxLabelLength.
  nodes.forEach(function (d) {
    //   定义父子节点之间的距离
    //   d.y = (d.depth * (300)); //maxLabelLength * 10px
    //   d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
    // alternatively to keep a fixed scale one can set a fixed depth per level
    // Normalize for fixed-depth by commenting out below line
    d.y = (d.depth * 500); //500px per level.
  });

  // Update the nodes…
  node = svgGroup.selectAll("g.node")
    .data(nodes, function (d) {
      return d.id || (d.id = ++i); //给每个节点分配一个唯一id，便于接下来能够定位
    });


  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('dblclick', dblclick)
    .on('mousedown', rightClick)
    .on('mouseover', function(d, i) {
      d.showDelete = true
      node.select('image')
        .style('display', function(d) {
          if (d.showDelete) {
            return 'inline-block'
          }else {
            return 'none'
          }
        })
    })
    .on('mouseout', function(d, i) {
      d.showDelete = false
      node.select('image')
        .style('display', function(d) {
          if (d.showDelete) {
            return 'inline-block'
          }else {
            return 'none'
          }
        })
    })

  nodeEnter.append("circle")
    .style('display', function(d) {
      if (d.children && d.children.length) {
        return 'inline-block'
      }else {
        return 'none'
      }
    })
    .attr('class', 'nodeCircle')
    .attr("r", 0)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('transform', function() {
      return 'translate(105, 0)'
    })
    .on('click', toggleChildren);
 

  //节点的显示框
  nodeEnter.append('rect')
    .attr('width', 200)
    .attr('height', 50)
    .attr('fill', 'white')
    .attr('transform', function (d) {
      if (d.type == 'text') {
        return "translate(-100,-25)";
      }else {
        return "translate(-100,-35)";
      }
    })
    .on('click', nodeController)
    
   

  nodeEnter.append('text')
    .attr('x', -90)
    .attr('y', 0)
    .attr('dx', '0')
    .attr('dy', '0')
    .attr('class', 'condition-value')
    // .attr('title', function(d) {
    //   return d.name
    // })
    .text(function(d) {
      return d.name
    })
  
  nodeEnter.append('svg:image')
    .attr('class', 'close-icon')
    .style('display', 'none')
    .attr('x', '90')
    .attr('y', function(d) {
      if(d.type == 'text') {
        return '-35'
      }else {
        return '-45'
      }
    })
    .attr('width', '20')
    .attr('height', '20')
    .attr('xlink:href', '../../assets/images/close-icon.png')
    .on('click', deleteNode)
    

  // 节点的控制框  
  nodeEnter.append('rect')
    .attr('width', 200)
    .attr('height', 30)
    .attr('fill', 'white')
    .attr('stroke', 'red')
    .attr('transform', function(d) {
      return 'translate(-100, 15)'
    })

  nodeEnter.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dx', '-90')
    .attr('dy', '33')
    .attr('class', 'rect-controller')
    .text('点击打开配置框')
    .on('click', configController)
    

  // Update the text to reflect whether node has children or not.
  // node.select('text')
  //   .attr("x", function (d) {
  //     return d.children || d._children ? -10 : 10;
  //   })
  //   .attr("text-anchor", function (d) {
  //     return d.children || d._children ? "end" : "start";
  //   })
  //   .text(function (d) {
  //     return d.name;
  //   });
  node.select('circle')
    .style('display', function(d) {
      console.log('circle select ',d.children)
      if(d.children && d.children.length) {
        return 'inline-block'
      }else {
        return 'none'
      }
    })
  node.select('.node .condition-value')
    .text(function(d) {
      console.log('condition-value: ', d)
      return d.name
    })

  

  // Change the circle fill depending on whether it has children and is collapsed
  node.select("circle.nodeCircle")
    .attr("r", 4.5)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  // Fade the text in
  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 0);

  nodeExit.select("text")
    .style("fill-opacity", 0);

  // Update the links…
  var link = svgGroup.selectAll("path.link")
    .data(links, function (d) {
      // console.log('link target.id: ', d.target.id)
      return d.target.id;
    });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Append a group which holds all nodes and which the zoom Listener can act upon.
var svgGroup = baseSvg.append("g");

// Define the root
root = treeData;
root.x0 = viewerHeight / 2;
root.y0 = 0;

// Layout the tree initially and center on the root node.
update(root);
centerNode(root);

//   阻止浏览器的默认右键菜单弹出
var canvas = document.querySelector('#tree-container')
window.onload = function () {
  canvas.oncontextmenu = function () {
    return false
  }
}