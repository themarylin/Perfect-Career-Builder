var states = [];
var totalPos = [];
var totalCom = [];

var companies = [];
var companiesPos = [];
d3.json("/api/numbystate").then(function (response) {
    response.forEach(function (d) {
        states.push(d.state);
        totalPos.push(d.attributes.totalPositions);
        totalCom.push(d.attributes.totalCompanies);
        
        for (var i = 0; i < 10; i++){
            companies.push(d.attributes.companies[i]);
            companiesPos.push(d.attributes.companies[i]);
        }
        
        renderBarChart(states, totalPos, totalCom, 'bar_chart');
        renderBarChart(states, companies, companiesPos, 'bar_chart2');
    });

})

function renderBarChart(x_values, y1, y2, barname) {
    var trace1 = {
        x: x_values,
        y: y1,
        text: y1,
        name: 'Total Positions',
        type: 'bar',
        textposition: 'auto',
        hoverinfo: 'none'
    };

    var trace2 = {
        x: x_values,
        y: y2,
        text: y2,
        name: 'Total Companies',
        type: 'bar',
        textposition: 'auto',
        hoverinfo: 'none'
    };

    var data = [trace1, trace2];

    var layout = {
        barmode: 'group',
        title: '# of Companies vs # of Positions Available per State'
    };

    Plotly.newPlot(barname, data, layout);
}