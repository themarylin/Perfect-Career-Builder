var mapboxAccessToken = 'pk.eyJ1IjoidGhlbWFyeWxpbiIsImEiOiJjamx3ZHBkMGowdnljM3dsaWgyNzk2NnUxIn0.AI21Pex4MxPnQkSlhvAe_A';
var map = L.map('mapid').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

L.geoJson(statesData).addTo(map);