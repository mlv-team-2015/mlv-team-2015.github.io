// Chart title
var h2 = d3.select("#tapings_tab")
           .append("h2")
           .text("Bok Center Tapings")
var h3 = d3.select("#tapings_vis")
           .append("h3")
           .text("July 2014 - March 2015");

// Input the data from txt tsv
var data = d3.text("./data/all_taping_categories_clean.tsv", function(error, data){
  var tsvData = d3.tsv.parseRows(data);
  var tsvHeader = tsvData.shift();
  // Display the data as a table
  var table = d3.select("#tapings_tab").append("table"),
      caption = table.append("caption"),
      thead = table.append("thead"),
      tbody = table.append("tbody");
  d3.select("caption").text("Bok Center tapings");

  var hrows = thead.selectAll("th")
                   .data(tsvHeader)
                   .enter()
                   .append("th")
                   .text(function(d){ return d; });

  var rows = tbody.selectAll("tr")
                  .data(tsvData)
                  .enter()
                  .append("tr");

  var cells = rows.selectAll("td")
                  .data(function(row){
                    return d3.range(Object.keys(row).length).map(function(column, i){
                      return row[Object.keys(row)[i]];
                    })
                  })
                  .enter()
                  .append("td")
                  .text(function(d){ return d; })

});

// Formatting and placement on page
var margin = {
  top: 10, 
  right: 50, 
  bottom: 10,
  left: 100
}
var width = 960 - margin.left - margin.right;
var height = 800 - margin.bottom - margin.top;

// Data and scale variables - from CSV
var data;
var dateFormat = d3.time.format("%m/%d/%Y"); 
var countFormat = d3.format(",.0f");
var x_scale = d3.time.scale().range([0, width]);
var y_scale = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x_scale).orient("bottom").tickFormat(dateFormat);
var yAxis = d3.svg.axis().scale(y_scale).orient("left").ticks(5);

d3.csv("data/all_taping_categories_clean.csv", function(dataset){
    var values=[];
    dataset.forEach(function(d){
      d.Appt_Date = dateFormat.parse(d.Appt_Date);
      values.push(d.Appt_Date); 
    })

    data = d3.layout.histogram().bins(x_scale.ticks(20))(values);
    
    x_scale.domain(d3.extent(dataset, function(d){ return d.Appt_Date }));
    y_scale.domain([0, d3.max(data, function(d){ return d.y; })]);
    
    console.log("dataset: ", dataset); /// print it

    return createVis();  // draw it
});

createVis = function(){
  var svg = d3.select("#tapings_hist")
              .append("svg")
              .attr({
                "width": width + margin.left + margin.right,
                "height": height + margin.top + margin.bottom,
              })
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");

  svg.append("g")
     .attr({
      "class": "x axis",
      "transform":"translate(0, "+height+")",
     })
     .call(xAxis);

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x_scale(d.x) + "," + y_scale(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x_scale(data[0].dx) - 1)
    .attr("height", function(d) { return height - y_scale(d.y); });

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", x_scale(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return countFormat(d.y); });

}




// Example from http://bl.ocks.org/mbostock/3886208
var n = 3, // number of layers
    m = 58, // number of samples per layer
    stack = d3.layout.stack(),
    layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); })),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

var margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], .08);

var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);

var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#aad", "#556"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom");

var svg = d3.select("#example_vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
    .data(layers)
    .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}