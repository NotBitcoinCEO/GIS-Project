mapboxgl.accessToken = 'pk.eyJ1Ijoia2Nyb24yNCIsImEiOiJjamNwMHBhdmcyZmE4MnFwZjNydzRmcW84In0.hAnR4LlM7F4HcKJAfG-hNw';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-71.303282, 44.271101],
    zoom: 1,
    pitch: 0,
    bearing: 0,
    hash: true,
    container: 'map'
});

map.addControl(new mapboxgl.NavigationControl());
 
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
    
map.on('load', function () {
  var layers = ['0.0-3.9', '4.0-6.9', '7.0+'];
  var colors = ['green', 'yellow', 'red'];
  
  for (i = 0; i < layers.length; i++) {
  var layer = layers[i];
  var color = colors[i];
  var item = document.createElement('div');
  var key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  var value = document.createElement('span');
  value.innerHTML = layer;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
}
  
  map.addSource('earthquake', { type: 'geojson', data: url });
  map.addLayer({
            'id': 'earthquake',
            'type': 'circle',
            'source': 'earthquake',
            'paint': {
                'circle-color': {
                    property: 'mag',
                    type: 'interval',
                    stops: [
                        [0, 'green'],
                        [4, 'yellow'],
                        [7, 'red']
                      
                    ]
                },
                'circle-radius': {
                    property: 'mag',
                    base: 3,
                    type: 'interval',
                    stops: [
                        [0, 3],
                        [4, 8],
                        [7, 20]
                    ]
                },
                'circle-opacity': 0.5,
                'circle-blur': 0.5
            },
            'filter': ['>=', 'mag', 1]
        }, 'waterway-label');

 
   map.on('click', 'earthquake', function (e) {
        var t = new Date(e.features[0].properties.time) //converts milliseconds from epoch to date  
        new mapboxgl.Popup()                    
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML('<h3>Earthquake Details</h3>' + 
                    '<li>Time: <b>' + t + '</b></li>' +
                    '<li>Magnitude: <b>' + e.features[0].properties.mag + '</b></li>' + 
                    '<li>Location: <b>' + e.features[0].properties.place + '</b></li>' +         
                    '<li>Additional Details: <b>' + '<a href="' +  e.features[0].properties.url + '" target="_blank"> USGS Site</a>' + '</b></li>' +
                    '</ul>')
            .addTo(map);
    });

   
});  