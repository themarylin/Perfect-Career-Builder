(function(){
  var width = 650,
    height = 650;

  var svg = d3.select("#chart")
  //   .select(".chart")
//d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")

  var radiusScale = d3.scaleSqrt().domain([1, 800]).range([10, 80])

  //the simulation is a collection of forceSimulation
  //about where we want our circles to go
  //and how we want our circles to interact
  var simulation = d3.forceSimulation(d3.json("/api/occupationstats").then(function (response) {
            response.forEach(function (s) {
                console.log(response);
                if (s.attributes.STATE == stateName) {
                    data.name = stateName;
                    data.total_jobs = s.attributes.TOT_EMP;
                    data.a_mean = s.attributes.A_MEAN;
                    data.jobs_per_1000 = s.attributes.JOBS_1000;
                    info.update(data);
                };
            });
        });)
    //give force a name and define the force
    //strength should be a number between 0-1, play around with it
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    //get circles to the middle
    //don't have them collide
    .force("collide", d3.forceCollide(function(d){
      return radiusScale(d.sales)+1;
    }))

  d3.queue()
    .defer(d3.json("/api/occupationstats").then(function (response) {
              response.forEach(function (s) {
                  console.log(response);
                  if (s.attributes.STATE == stateName) {
                      data.name = stateName;
                      data.total_jobs = s.attributes.TOT_EMP;
                      data.a_mean = s.attributes.A_MEAN;
                      data.jobs_per_1000 = s.attributes.JOBS_1000;
                      info.update(data);
                  };
              });
          });)
    .await(ready)

  function ready (error, datapoints) {

    var circles = svg.selectAll(".artist")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "artist")
      //radius of circles
      .attr("r", function(d){
                           //size of cirlces
        return radiusScale(d.sales);
      })
      .attr("fill", "lightblue")
      .on('click', function(d) {
        console.log(d)
      })
      // // .attr("cx", 100)
      // // .attr("cy", 300)

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .style("display", "none")
      .classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circles.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `<strong>${(d.name)}<strong><hr>${d.decade}
        medal(s) won`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
        // Step 3: Create "mouseout" event listener to hide tooltip
       .on("mouseout", function() {
         toolTip.style("display", "none");
       });


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }

  }

})();
