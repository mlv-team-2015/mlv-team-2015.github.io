function createHist(){
  var nbins=100;

  // A formatter for counts.
  var formatCount = d3.format(",.0f");

  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      barMarg = 1;

  var x = d3.scale.linear()
      .domain([d3.min(mappedSet), d3.max(mappedSet)])
      .range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram()
      .bins(nbins)
      (mappedSet);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([7, 8, 9, 10, 11, 12, 1, 2, 3]);

  var svg = d3.select("#tapings_histogram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", (width/nbins)-barMarg)
      .attr("height", function(d) { return height - y(d.y); });

  bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", ((width/nbins)-barMarg)/2)
      .attr("text-anchor", "middle")
      .text(function(d) { return formatCount(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
}


// // Formatting and placement on page
// var margin = {
//   top: 10, 
//   right: 50, 
//   bottom: 10,
//   left: 50
// }
// var width = 960 - margin.left - margin.right;
// var height = 500 - margin.bottom - margin.top;

// // Data and scale variables - from CSV
// var data, dataset, mappedSet;
// var formatDate = d3.time.format("%m/%d/%Y"); 
// var countFormat = d3.format(",.0f");
// var x_scale = d3.scale.linear().range([0, width]);
// var y_scale = d3.scale.linear().range([height, 0]);
// var xAxis = d3.svg.axis().scale(x_scale).orient("bottom").tickFormat(formatDate);
// var yAxis = d3.svg.axis().scale(y_scale).orient("left").ticks(5);
// var nbins = 20;

// d3.csv("data/all_taping_categories_clean.csv", function(csv){
//     dataset = csv;
//     mappedSet = (dataset.map(function(d){ return formatDate.parse(d.Appt_Date).getTime() }));

//     data = d3.layout.histogram()
//                     .bins(x_scale.ticks(nbins))  // a bin per month
//                     (mappedSet); 
    
//     x_scale.domain([d3.min(mappedSet), d3.max(mappedSet)]);
//     y_scale.domain([0, d3.max(data, function(d){ return d.y; })]);
    
//     console.log("data: ", data);

//     return createVis();  // draw it
// });

// createVis = function(){
//   var svg = d3.select("#tapings_hist")
//               .append("svg")
//               .attr({
//                 "width": width + margin.left + margin.right,
//                 "height": height + margin.top + margin.bottom,
//               })
//               .append("g")
//               .attr("transform", "translate("+margin.left+","+margin.top+")");

//   svg.append("g")
//      .attr("class", "y axis")
//      .call(yAxis);

// var bar = svg.selectAll(".bar")
//     .data(data)
//   .enter().append("g")
//     .attr("class", "bar")
//     .attr("transform", function(d) { return "translate(" + x_scale(d.x) + "," + y_scale(d.y) + ")"; });

// bar.append("rect")
//     .attr("x", 1)
//     .attr("width", width/nbins)
//     .attr("height", function(d) { return height - y_scale(d.y); });

// bar.append("text")
//     .attr("dy", ".75em")
//     .attr("y", 6)
//     .attr("x", x_scale(data[0].dx) / 2)
//     .attr("text-anchor", "middle")
//     .text(function(d) { return countFormat(d.y); });

// }




