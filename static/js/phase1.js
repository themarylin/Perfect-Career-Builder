var mapboxAccessToken = 'pk.eyJ1IjoidGhlbWFyeWxpbiIsImEiOiJjamx3ZHBkMGowdnljM3dsaWgyNzk2NnUxIn0.AI21Pex4MxPnQkSlhvAe_A';
var map = L.map('homemap').setView([37.8, -96], 4);
var geojson;
var zoom = false;
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light',
    maxZoom: 18
}).addTo(map);

//add hover info
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (values) {
    this._div.innerHTML = '<h4>US DataScience Job Market</h4>' + (values ?
        '<b>' + values.name + '</b><br /><br />' + 'Total Jobs Available: ' + values.total_jobs + '<br />' +
        'Number of Jobs for every 1000 jobs: ' + (values.jobs_per_1000).toFixed(2) + '<br />' +
        'Average Annual Salary: $' + (values.a_mean).toFixed(2) :
        'Click on a State');
}

info.addTo(map);

//add color and highlights
function getColor(d) {
    return d > 1000 ? '#0C2C84' :
        d > 500 ? '#225EA8' :
        d > 200 ? '#1D91C0' :
        d > 100 ? '#41B6C4' :
        d > 50 ? '#7FCDBB' :
        d > 20 ? '#C7E9B4' :
        d > 10 ? '#EDF8B1' :
        '#FFFFD9';
}

function densityStyle(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetFeature,
        click: clickState
    })
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function resetFeature(e) {
    var layer = e.target;
    geojson.resetStyle(layer);
}

function renderBoxPlot(d, e) {

    if (e == 'Annual'){
        var trace1 = {
            x: [d.min, d.q25, d.q25, d.median, d.q75, d.q75, d.max],
            type: 'box',
            name: d.name
        };
        var data1 = [trace1];
        var layout = {
            title: e +' Salary Statistics',
            autosize: false,
            height: 250,
            width: "100%",
            xaxis: {
                range: [20000, 200000],
                showticklabels: true
            }
        };
    
        Plotly.newPlot(e, data1, layout);
    }
    else{
        var trace1 = {
            x: [d.hmin, d.hq25, d.hq25, d.hmedian, d.hq75, d.hq75, d.hmax],
            type: 'box',
            name: d.name
        };
        var data1 = [trace1];
        var layout = {
            title: e +' Salary Statistics',
            autosize: false,
            height: 250,
            width: "100%",
            xaxis: {
                range: [0, 100],
                showticklabels: true
            }
        };
    
        Plotly.newPlot(e, data1, layout);
    }
    
}


//on click
function clickState(e) {
    if (!zoom) {
        zoom = true
        var layer = e.target;
        map.fitBounds(layer.getBounds());
        var stateName = layer.feature.properties.name;
        var data = {};
        d3.json("/api/occupationstats").then(function (response) {
            response.forEach(function (s) {
                if (s.attributes.STATE == stateName) {
                    data.name = stateName;
                    data.total_jobs = s.attributes.TOT_EMP;
                    data.a_mean = s.attributes.A_MEAN;
                    data.jobs_per_1000 = s.attributes.JOBS_1000;
                    //This grabs the annual quartile information
                    data.q25 = s.attributes.A_PCT25;
                    data.median = s.attributes.A_MEDIAN;
                    data.q75 = s.attributes.A_PCT75;
                    data.min = s.attributes.A_PCT10;
                    data.max = s.attributes.A_PCT90;
                    //This grabs the hourly quartile information
                    data.hq25 = s.attributes.H_PCT25;
                    data.hmedian = s.attributes.H_MEDIAN;
                    data.hq75 = s.attributes.H_PCT75;
                    data.hmin = s.attributes.H_PCT10;
                    data.hmax = s.attributes.H_PCT90;

                    info.update(data);
                    renderBoxPlot(data, 'Annual');
                    renderBoxPlot(data, "Hourly");
                };
            });
        });
    } else {
        zoom = false;
        map.setView([37.8, -96], 4);
    }

}

//render map
geojson = L.geoJson(statesData, {
    style: densityStyle,
    onEachFeature: onEachFeature
}).addTo(map);