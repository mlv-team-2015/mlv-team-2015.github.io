
// from http://bl.ocks.org/mbostock/3885304

function createBar(data){

  var margin = {top: 20, right: 20, bottom: 200, left: 40},
      width = 960 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var formatXDate = d3.time.format("%M"); 

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      // .tickFormat(d3.time.format("%B"));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "%");

  var svg = d3.select("#tapings_bar").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  

  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .style("text-anchor", "middle")
        .attr({
          "x": 6,
          "y": 6,
          "transform": "rotate(-45)"
        });


  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

  svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.values); })
        .attr("height", function(d) { return height - y(d.values); });

}

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
