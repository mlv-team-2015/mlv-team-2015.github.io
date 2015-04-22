
createCollapseTree("#data_tree", "data/data_tree.json");
createCollapseTree("#structure_tree", "data/structure_tree.json");
createCollapseTree("#encoding_tree", "data/encoding_tree.json");

// from http://bl.ocks.org/mbostock/3184089
function createTree(div, json){
	var margin = {top: 140, right: 10, bottom: 140, left: 10},
		width = 240 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var orientations = {
	  "top-to-bottom": {
	    size: [width, height],
	    x: function(d) { return d.x; },
	    y: function(d) { return d.y; }
	  },
	  "right-to-left": {
	    size: [height, width],
	    x: function(d) { return width - d.y; },
	    y: function(d) { return d.x; }
	  },
	  "bottom-to-top": {
	    size: [width, height],
	    x: function(d) { return d.x; },
	    y: function(d) { return height - d.y; }
	  },
	  "left-to-right": {
	    size: [height, width],
	    x: function(d) { return d.y; },
	    y: function(d) { return d.x; }
	  }
	};

	var svg = d3.select(div).selectAll("svg")
	    .data(d3.entries(orientations))
	  .enter().append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("rect")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "border");

	svg.append("text")
	    .attr("x", 6)
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .text(function(d) { return d.key; });

	d3.json(json, function(root) {
	  svg.each(function(orientation) {
	    var svg = d3.select(this),
	        o = orientation.value;

	    // Compute the layout.
	    var tree = d3.layout.tree().size(o.size),
	        nodes = tree.nodes(root),
	        links = tree.links(nodes);

	    // Create the link lines.
	    svg.selectAll(".link")
	        .data(links)
	      .enter().append("path")
	        .attr("class", "link")
	        .attr("d", d3.svg.diagonal().projection(function(d) { return [o.x(d), o.y(d)]; }));

	    // Create the node circles.
	    svg.selectAll(".node")
	        .data(nodes)
	      .enter().append("circle")
	        .attr("class", "node")
	        .attr("r", 4.5)
	        .attr("cx", o.x)
	        .attr("cy", o.y);

	  });
	});
}
// from http://bl.ocks.org/mbostock/4339083
function createCollapseTree(div, json){
	var margin = {top: 20, right: 120, bottom: 20, left: 120},
	    width = 960 - margin.right - margin.left,
	    height = 800 - margin.top - margin.bottom;
	    
	var i = 0,
	    duration = 750,
	    root;

	var tree = d3.layout.tree()
	    .size([width, height]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.x, d.y]; });

	var svg = d3.select(div).append("svg")
	    .attr("width", width + margin.right + margin.left)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(json, function(error, flare) {
	  root = flare;
	  root.x0 = height / 2;
	  root.y0 = 0;

	  function collapse(d) {
	    if (d.children) {
	      d._children = d.children;
	      d._children.forEach(collapse);
	      d.children = null;
	    }
	  }

	  root.children.forEach(collapse);
	  update(root);
	});

	d3.select(self.frameElement).style("height", "800px");

	function update(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
	      links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 180; });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
	      .on("click", click);

	  nodeEnter.append("circle")
	      .attr("r", 1e-6)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeEnter.append("text")
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .text(function(d) { return d.name; })
	      .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 8)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeUpdate.select("text")
	      .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
	      .remove();

	  nodeExit.select("circle")
	      .attr("r", 1e-6);

	  nodeExit.select("text")
	      .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
	      .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = {x: source.x0, y: source.y0};
	        return diagonal({source: o, target: o});
	      });

	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}
}