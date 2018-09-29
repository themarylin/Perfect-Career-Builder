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

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
}
info.addTo(map);

//add color to the map
function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
        d > 100 ? '#FC4E2A' :
        d > 50 ? '#FD8D3C' :
        d > 20 ? '#FEB24C' :
        d > 10 ? '#FED976' :
        '#FFEDA0';
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
        mouseout: resetHighlight
    })
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}




//this is where I add everything to the map. 
//statesData is currently a json file located in my directories, but I need to be able to query data using python flask, and return a json.
//this will probably require me to use d3.json and find the url. 
geojson = L.geoJson(statesData, {
    style: densityStyle,
    onEachFeature: onEachFeature
}).addTo(map);