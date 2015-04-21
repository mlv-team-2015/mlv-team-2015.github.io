// read in data
var formatDate = d3.time.format("%m/%d/%Y"); 
var dataset = [];
var mappedSet = [];
var daySet = [];  // 100 days
var monthSet = []; // 10 months
var weekSet=[]; // 31 weeks

var monthMapped=[];

d3.csv("data/all_taping_categories_clean.csv", function(csv){
  dataset = csv;
  //mappedSet is JUST millis for each record
  mappedSet = (dataset.map(function(d){ return formatDate.parse(d.Appt_Date).getTime() }));

  // nested data -- created key: value pairing, where value is freq
  daySet = d3.nest()
     .key(function(d){ return d3.time.day(formatDate.parse(d.Appt_Date)) })
     .rollup(function(d){ return d.length })
     .entries(dataset);

  monthSet = d3.nest()
     .key(function(d){ return d3.time.month(formatDate.parse(d.Appt_Date)) }) // key is date
     .rollup(function(d){ return d.length })
     .entries(dataset);

  monthSet.sort(sortByDateAscending);

  weekSet = d3.nest()
     .key(function(d){ return d3.time.week(formatDate.parse(d.Appt_Date)) })
     .sortKeys(sortByDateAscending)
     .rollup(function(d){ return d.length })
     .entries(dataset);

  weekSet.sort(sortByDateAscending);

  createHist();
  createBar(weekSet);
});

function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return +(new Date(a.key)) - +(new Date(b.key)); // convert to date, then to time.... who knows why
}