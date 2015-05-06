
// from http://bl.ocks.org/mbostock/3885304

function createBar(data, period){
  var formatCount = d3.format(",.0f");

  var margin = {top: 20, right: 20, bottom: 200, left: 40},
      width = 960 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

  // formats based on type of data
  var chartFormat = {
    xDate: function(){ // not working...
      if(period=="day"){ return "%m/%d/%Y" }
      else if(period=="week"){ return "%b %d %Y" }
      else if(period=="month"){ return "%b %Y" }
      
    },
    yTransform: function(){
      if(period=="day"){ return "rotate(-50)" }
      else if(period=="week"){ return "rotate(-45)" }
      else if(period=="month"){ return "rotate(0)" }
    },
  }

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var formatXDate = d3.time.format("%b %Y"); 

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%d %b %Y"));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10)
      .tickFormat(formatCount);

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
          "x": 0,
          "y": 30,
          "transform": chartFormat.yTransform
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

  var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.values); })
        .attr("height", function(d) { return height - y(d.values); });

    bar.append("text")
      .attr({
        "dy": ".75em",
        "x": function(d) { return x(d.key);},
        "y": function(d) { return y(d.values); },
        "text-anchor": "middle",
      })
      .text(function(d) { return formatCount(d.values); });

}

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
