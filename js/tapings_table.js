// Chart title
var h2 = d3.select("#tapings_tab")
           .append("h2")
           .text("Bok Center Tapings")
var h3 = d3.select("#tapings_tab")
           .append("h3")
           .text("July 2014 - March 2015");

// Input the data from txt csv
var data = d3.text("./data/all_taping_categories_clean.csv", function(error, data){
  var csvData = d3.csv.parseRows(data);
  var csvHeader = csvData.shift();
  // Display the data as a table
  var table = d3.select("#tapings_tab").append("table"),
      caption = table.append("caption"),
      thead = table.append("thead"),
      tbody = table.append("tbody");
  d3.select("caption").text("Bok Center tapings");

  var hrows = thead.selectAll("th")
                   .data(csvHeader)
                   .enter()
                   .append("th")
                   .text(function(d){ return d; });

  var rows = tbody.selectAll("tr")
                  .data(csvData)
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