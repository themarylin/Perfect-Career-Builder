var states = [];
var totalPos = [];
var totalCom = [];

//this is the first chart that shows a comparison of states
d3.json("/api/numbystate").then(function (response) {
    response.forEach(function (d) {
        states.push(d.state);
        totalPos.push(d.attributes.totalPositions);
        totalCom.push(d.attributes.totalCompanies);

        renderBarChart(states, totalPos, totalCom, 'bar_chart');
    });

})

//this builds the bar chart for the first half of html
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

//initial bottom charts
function initial(state) {
    var selector = d3.select("#selDataset");
    var companies = [];
    var companiesPos = [];

    d3.json("/api/numbystate").then(function (response) {
        response.forEach(function (d) {
            selector
                .append("option")
                .text(d.state)
                .property("value", d.state);

            const firstSample = state;
            if (d.state == firstSample) {
                for (i = 0; i < 10; i++) {
                    companies.push(d.attributes.companies[i].name);
                    companiesPos.push(d.attributes.companies[i].pos);
                };
                renderBarChart2(companies, companiesPos, 'bar_chart2', firstSample);
            };
        });

    })
}

function optionChanged(newSample) {
    var companies = [];
    var companiesPos = [];

    d3.json("/api/numbystate").then(function (response) {
        response.forEach(function (d) {
            if (d.state == newSample) {
                for (i = 0; i < 10; i++) {
                    companies.push(d.attributes.companies[i].name);
                    companiesPos.push(d.attributes.companies[i].pos);
                };
                renderBarChart2(companies, companiesPos, 'bar_chart2', newSample);
            };
        });
    });
}



function renderBarChart2(x_values, y1, barname, state) {
    var trace1 = {
        x: x_values,
        y: y1,
        text: y1,
        name: 'Positions Posted',
        type: 'bar',
        textposition: 'auto'
    };

    var data = [trace1];

    var layout = {
        barmode: 'group',
        title: `Top 10 Companies in ${state}`,
        margin: {
            b: 150,
            l: 50,
            r: 150
        },
        autosize: false,
        height:600,
        width:950
    };

    Plotly.newPlot(barname, data, layout);
}

initial(states[0]);