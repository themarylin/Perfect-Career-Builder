var mapboxAccessToken = 'pk.eyJ1IjoidGhlbWFyeWxpbiIsImEiOiJjamx3ZHBkMGowdnljM3dsaWgyNzk2NnUxIn0.AI21Pex4MxPnQkSlhvAe_A';
var map = L.map('homemap').setView([37.8, -96], 4);
var geojson;

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
        'Hover over a State');
}

info.addTo(map);

//add color to the map
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
        mouseout: resetHighlight,
    })
}

function resetHighlight(e) {
    map.setView([37.8, -96], 4);
    geojson.resetStyle(e.target);
    info.update();
}

function highlightFeature(e) {
    var layer = e.target;
    var stateName = layer.feature.properties.name;
    var data = {};
    d3.json("/api/occupationstats").then(function (response) {
        response.forEach(function (s) {
            if (s.attributes.STATE == stateName) {
                data.name = stateName;
                data.total_jobs = s.attributes.TOT_EMP;
                data.a_mean = s.attributes.A_MEAN;
                data.jobs_per_1000 = s.attributes.JOBS_1000;
                info.update(data);
            };
        });
    });
    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
}

//this is where I add everything to the map. 
//statesData is currently a json file located in my directories, but I need to be able to query data using python flask, and return a json.
//this will probably require me to use d3.json and find the url. 
geojson = L.geoJson(statesData, {
    style: densityStyle,
    onEachFeature: onEachFeature
}).addTo(map);