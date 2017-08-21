
////////////////////////////////////////////////////////////////////
// Map Setup
////////////////////////////////////////////////////////////////////

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZXJvd2V1ayIsImEiOiJjajRuemx4Mnoxc2lyMzJvNGYxZjVjdnVpIn0.9aupfG_tYU0SHx3S6ZUqvw';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/daveroweuk/cj6jj9udl6aa62spb93wjrshv', // Using custom 'designer' map style for nautical maps
    center: [-4.1427, 50.4755],
    zoom: 13,
    pitch: 45,
    bearing: -17.6,
    container: 'map'
});

// Have to wait for the map to load before doing anything else.
map.on('load', function () {
    map.addLayer({
        'id': '3d-buildings',
        'source': {
            'type': 'vector',
            'url': 'mapbox://daveroweuk.9uj2a4uw'
        },
        'source-layer': 'PlymouthBuildings-5m5usp',
        'type': 'fill-extrusion',
        'minzoom': 13,
        'paint': {
            'fill-extrusion-color': '#ccc',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'max'
            },
            'fill-extrusion-opacity': 0.6
        }
    });

    // When a click event occurs on a feature in the building layer
    map.on('click', '3d-buildings', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<h4>' + e.features[0].properties.type + '</h4>')
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', '3d-buildings', function () { map.getCanvas().style.cursor = 'pointer'; });
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', '3d-buildings', function () { map.getCanvas().style.cursor = ''; });
});