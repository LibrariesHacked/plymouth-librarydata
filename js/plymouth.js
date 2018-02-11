$(function () {
    ////////////////////////////////////////////////////////////////////
    // Map Setup
    ////////////////////////////////////////////////////////////////////


    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZXJvd2V1ayIsImEiOiJjajRuemx4Mnoxc2lyMzJvNGYxZjVjdnVpIn0.9aupfG_tYU0SHx3S6ZUqvw';
    var map = new mapboxgl.Map({
        style: 'mapbox://styles/daveroweuk/cj6jj9udl6aa62spb93wjrshv', // Using custom 'designer' map style for nautical maps
        center: [-4.1, 50.4],
        zoom: 13,
        pitch: 45,
        bearing: -17.6,
        container: 'map'
    });

    // Sidebar
    $(".menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // Find nearest
    $('#btn-search').on('click', function () {
        var postcode = $('#txt-postcode').val();
        if (postcode.length > 3) {
            $.getJSON('https://api.postcodes.io/postcodes/' + postcode, function (data) {
                var postcode_point = turf.point([data.result.longitude, data.result.latitude]);
                var lib_points = $.map(Libraries.libraries, function (library) {
                    return turf.point([parseFloat(library.Longitude), parseFloat(library.Latitude)])
                });
                var library_points = turf.featureCollection(lib_points);
                var nearest = turf.nearestPoint(postcode_point, library_points);
                map.flyTo({
                    center: nearest.geometry.coordinates,
                    zoom: 17,
                    bearing: 360,
                    speed: 0.8,
                    curve: 1
                });
            });
        }
    });

    // Have to wait for the map to load before doing anything else.
    map.on('load', function () {

        // add the 3D buildings layer
        map.addLayer({
            'id': '3d-buildings',
            'source': {
                'type': 'vector',
                'url': 'mapbox://daveroweuk.9uj2a4uw'
            },
            'source-layer': 'PlymouthBuildings-5m5usp',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#ccc',
                'fill-extrusion-height': {
                    'type': 'identity',
                    'property': 'max'
                },
                'fill-extrusion-opacity': 0.8
            }
        });


        // add the libraries layer
        Libraries.load(function () {
            $.each(Libraries.libraries, function (x, library) {
                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';
                el.innerHTML = '<p><i class="fa fa-building"></i>&nbsp;<span class="badge badge-success">' + library['Library name'] + '</span></p>'

                // make a marker for each feature and add to the map
                new mapboxgl.Marker(el)
                    .setLngLat([library.Longitude, library.Latitude])
                    .addTo(map);
            });
        });
    });
});