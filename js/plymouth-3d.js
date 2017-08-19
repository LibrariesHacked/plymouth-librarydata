mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZXJvd2V1ayIsImEiOiJjajRuemx4Mnoxc2lyMzJvNGYxZjVjdnVpIn0.9aupfG_tYU0SHx3S6ZUqvw';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-4.1427, 50.4755],
    zoom: 13,
    pitch: 45,
    bearing: -17.6,
    container: 'map'
});

// the 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function () {
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 13,
        'paint': {
            'fill-extrusion-color': {
                'property': 'building_type',
                'type': 'categorical',
                'stops': [['restaurant', '#ccc']]
            },
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .6
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', '3d-buildings', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<h4>' + e.features[0].properties.type + '</h4>')
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    //map.on('mouseenter', '3d-buildings', function () {
    //    map.getCanvas().style.cursor = 'pointer';
    //});

    // Change it back to a pointer when it leaves.
    //map.on('mouseleave', '3d-buildings', function () {
    //    map.getCanvas().style.cursor = '';
    //});

});