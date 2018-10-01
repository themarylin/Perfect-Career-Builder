(function(){
  var width = 500,
    height = 500;

  var svg = d3.select("#chart")
  //   .select(".chart")
//d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")

  var radiusScale = d3.scaleSqrt().domain([758, 39303]).range([10, 70])

  //the simulation is a collection of forceSimulation
  //about where we want our circles to go
  //and how we want our circles to interact
  var simulation = d3.forceSimulation()
    //give force a name and define the force
    //stregth is be a number between 0-1, play around with it
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    //get circles to the middle
    //don't have them collide
    .force("collide", d3.forceCollide(function(d){
      return radiusScale(d.frequency)+2;
    }))

  d3.queue()
    .defer(d3.csv, "sales.csv")
    .await(ready)

  function ready (error, datapoints) {

    var circles = svg.selectAll(".word")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "word")
      //radius of circles
      .attr("r", function(d){
        return radiusScale(d.sales);
      })
      .attr("fill", "lightblue")
      .on('click', function(d) {
        console.log(d)
      })
      // .attr("cx", 100)
      // .attr("cy", 300)

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
