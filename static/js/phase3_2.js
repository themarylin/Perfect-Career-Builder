(function () {
    var width = 500,
        height = 500;

    var svg = d3.select("#bubblechart2")
        //   .select(".chart")
        //d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var radiusScale = d3.scaleSqrt().domain([0, 100]).range([0, 100])

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
        .force("collide", d3.forceCollide(function (d) {
            return radiusScale(d.attributes.year2017) + 2;
        }))

    d3.queue()
        .defer(d3.json, "/api/toolspreference")
        .await(ready)

    function ready(error, datapoints) {
        function getColor(value) {
            if (value > 80) {
                return "#016c59";
            } else if (value > 60) {
                return "#1c9099";
            } else if (value > 40) {
                return "#67a9cf";
            } else if (value > 20) {
                return "#9e9ac8";
            } else {
                return "#cbc9e2";
            }
        };

        var circles = svg.selectAll(".tools")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "tools")
            //radius of circles
            .attr("r", function (d) {
                return radiusScale(d.attributes.year2017);
            })
            .attr("fill", function (d) {
                return getColor(radiusScale(d.attributes.year2017));
            })
            .on('click', function (d) {
                console.log(d)
            })
        // // .attr("cx", 100)
        // // .attr("cy", 300)

        // Step 1: Append tooltip div
        var toolTip = d3.select("body")
            .append("div")
            .style("display", "none")
            .classed("tooltip_bubble", true);

        // Step 2: Create "mouseover" event listener to display tooltip
        circles.on("mouseover", function (d) {
                toolTip.style("display", "block")
                    .html(
                        `<strong>${(d.attributes.toolName)}<strong><hr>${d.attributes.year2017}
          %`)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px");
                d3.select(this).style("stroke", "#323232");
            })
            // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function () {
                toolTip.style("display", "none");
                d3.select(this).style("stroke", "#e3e3e3");
            });

        // .attr("cx", 100)
        // .attr("cy", 300)
        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }

    }

})();