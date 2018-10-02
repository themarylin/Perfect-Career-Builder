(function () {



d3.queue()
    .defer(d3.json, "/api/linkedin")
    .await(ready)

var followers = [];
var beauty = [];
var smile = [];
var age = [];

function ready(error, datapoints) {
    datapoints.forEach(function (d) {
        followers.push(d.attributes.n_followers);
        beauty.push(d.attributes.beauty);
        smile.push(d.attributes.smile);
        age.push(d.attributes.age);
    })
    renderScatter(followers, beauty, smile, age);
}



function renderScatter(x, y1, y2, y3) {
    var trace1 = {
        x: x,
        y: y1,
        mode: 'markers',
        type: 'scatter',
        name: 'Beauty'
    };

    var trace2 = {
        x: x,
        y: y2,
        mode: 'markers',
        type: 'scatter',
        name: 'Smile'
    };

    var trace3 = {
        x: x,
        y: y3,
        mode: 'markers',
        type: 'scatter',
        name: 'Age'
    };

    var layout = {
        title: "DataScientists: # of followers vs category score"
    }

    var data = [trace1, trace2, trace3];

    Plotly.newPlot('scatterPlot', data, layout);
}


})();