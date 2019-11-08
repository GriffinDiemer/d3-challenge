// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 160,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(500)
    .call(bottomAxis);

  return xAxis;
}
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
      d.age = +d.age;
      d.income = +d.income;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });

    // X Scales
    // ==============================
    var xPoverty = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.poverty)])
      .range([0, width]);

    var xAge = d3.scaleLinear()
      .domain([28, d3.max(data, d => d.age)])
      .range([0, width]);
      
    var xIncome = d3.scaleLinear()
      .domain([35000, d3.max(data, d => d.income)])
      .range([0, width]);     
// ==========================================
// Y Scales
// ==========================================
    var yHealth = d3.scaleLinear()
      .domain([4, d3.max(data, d => d.healthcare)])
      .range([height, 0]);
    var ySmokes = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.smokes)])
      .range([height, 0]);
    var yObesity = d3.scaleLinear()
      .domain([18, d3.max(data, d => d.obesity)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var povertyAxis = d3.axisBottom(xPoverty);
    var ageAxis = d3.axisBottom(xAge);
    var incomeAxis = d3.axisBottom(xIncome);

    var healthYAxis = d3.axisLeft(yHealth);
    var smokesYAxis = d3.axisLeft(ySmokes);
    var obesityYAxis = d3.axisLeft(yObesity);
        // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(povertyAxis);
    // chartGroup.append("g")
      // .attr("transform", `translate(0, ${height})`)
      // .call(ageAxis);
    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(incomeAxis);

    chartGroup.append("g")
      .call(healthYAxis);
    // chartGroup.append("g")
    //   .call(smokesYAxis);
    // chartGroup.append("g")
    //   .call(obesityYAxis);    

    xScale = xPoverty;
    yScale = yHealth;
    chosenXAxis = 'poverty'
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[chosenXAxis]))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .classed("stateCircle", true)

    
    var textGroup = chartGroup.selectAll(null)
    .data(data)
    .enter()
    .append("text")
    .classed('stateText',true)
    .attr("x", d => xPoverty(d.poverty))
    .attr("y", d => yHealth(d.healthcare -.275))
    .text(d=>(d.abbr));
    
    var tipGroup = chartGroup.selectAll(null)
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xPoverty(d.poverty))
    .attr("cy", d => yHealth(d.healthcare))
    .attr("r", "15")
    .attr("opacity",0)


    // circlesGroup.append("text")
    // .attr("dx", function(d){return -20})
    // .text(function(d){return data.abbr})
    // circlesGroup.selectAll('circle')
    // .data(data)
    // .enter()
    // .append("text")
    // .attr("dx", function(d){return -20})
    // .text(function(d){return d.label})
    // .attr('x','50%')
    // .attr('y','50%')
    // .attr('text-anchor','middle')
    // .attr('dy',".3em")
    // .attr('fill',"black",'>Hello!');

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("class","d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Hits: ${d.healthcare}%`);
      });

      
      
    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    tipGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Y Axis
    // ===============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "active")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 25)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "inactive")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "inactive")
      .text("Obese (%)");
// X Axis
// ==================================
    var povertyLabel = chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "active")
      .text("In Poverty (%)")
      .attr("value","poverty");

    var ageLabel = chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 55})`)
      .attr("class", "inactive")
      .text("Age (Median)")
      .attr("value","age");

    var houseLabel = chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 80})`)
      .attr("class", "inactive")
      .text("Household Income (Median)")
      .attr("value","income");




    chartGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value)
      if (value !== chosenXAxis) {
        if (value === 'poverty') {
        chosenXAxis = value
        // replaces chosenXaxis with valu
        povertyLabel
        .classed("active", true)
        .classed("inactive", false);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
        houseLabel
        .classed("active", false)
        .classed("inactive", true);
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xScale = xPoverty;

        // updates x axis with transition
        xAxis = renderXAxes(xScale, povertyAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);}
        
          if(value === 'age') {
            chosenXAxis = value
        // replaces chosenXaxis with valu
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        ageLabel
        .classed("active", true)
        .classed("inactive", false);
        houseLabel
        .classed("active", false)
        .classed("inactive", true);
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xScale = xAge;

        // updates x axis with transition
        xAxis = renderXAxes(xScale, ageAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);}
          
        

        // changes classes to change bold text
        // if (chosenXAxis === "num_albums") {
        //   albumsLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        //   hairLengthLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        // }
        // else {
        //   albumsLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        //   hairLengthLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        }
      })

}).catch(function(error) {
  console.log(error);

});


