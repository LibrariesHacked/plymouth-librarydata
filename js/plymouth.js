$(function () {

	var services_lookup = {
		Computers: { name: 'Computers', icon: '' },
		WiFi: { name: 'WiFi', icon: '' },
		Printers: { name: 'Computers', icon: '' },
		Photocopiers: { name: 'Photocopiers', icon: '' },
		Scanners: { name: 'Scanners', icon: '' },
		MeetingRooms: { name: 'Meeting rooms', icon: '' },
		LocalAndFamilyHistory: { name: 'Computers', icon: '' },
		NavalHistory: { name: 'Computers', icon: '' },
		MicrofilmScanners: { name: 'Computers', icon: '' },
		RoofTerrace: { name: 'Computers', icon: '' },
		Books: { name: 'Computers', icon: '' },
		DVDs: { name: 'Computers', icon: '' },
		Audiobooks: { name: 'Computers', icon: '' },
		RequestService: { name: 'Computers', icon: '' },
		Cafe: { name: 'Computers', icon: '' },
		Website: { name: 'Computers', icon: '' }
	};

	var colours = {
		central: 'rgb(143,212,0)',
		crownhill: 'rgb(236,0,140)',
		devonport: 'rgb(244,170,0)',
		efford: 'rgb(0,120,201)',
		estover: 'rgb(147,37,178)',
		northprospect: 'rgb(39,189,190)',
		peverell: 'rgb(0,105,62)',
		plympton: 'rgb(158,27,50)',
		plymstock: 'rgb(239,130,0)',
		southway: 'rgb(0,58,105)',
		stbudeaux: 'rgb(77,48,145)',
		westpark: 'rgb(233,85,37)'
	};

	////////////////////////////////////////////////////////////////////
	// Map Setup
	////////////////////////////////////////////////////////////////////
	mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2ZXJvd2V1ayIsImEiOiJjajRuemx4Mnoxc2lyMzJvNGYxZjVjdnVpIn0.9aupfG_tYU0SHx3S6ZUqvw';
	var map = new mapboxgl.Map({
		style: 'mapbox://styles/daveroweuk/cj6jj9udl6aa62spb93wjrshv', // Using custom 'designer' map style for nautical maps (plymouth)
		center: [-4.1, 50.4],
		zoom: 13,
		pitch: 45,
		bearing: -17.6,
		container: 'map'
	});

	// Sidebar toggling
	$(".menu-toggle").click(function (e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});

	$('#btn-gps').on('click', function () {
		navigator.geolocation.getCurrentPosition(function (location) {
			goToNearest(location.coords.longitude, location.coords.latitude);
		});
	});

	// Go to nearest
	var goToNearest = function (longitude, latitude) {
		var point = turf.point([longitude, latitude]);
		var lib_points = $.map(Libraries.libraries, function (library) {
			return turf.point([parseFloat(library.Longitude), parseFloat(library.Latitude)])
		});
		var library_points = turf.featureCollection(lib_points);
		var nearest = turf.nearestPoint(point, library_points);
		map.flyTo({
			center: nearest.geometry.coordinates,
			zoom: 17,
			bearing: 360,
			speed: 0.8,
			curve: 1
		});
	};

	// Find nearest
	$('#btn-search').on('click', function () {
		var postcode = $('#txt-postcode').val();
		if (postcode.length > 3) {
			$.getJSON('https://api.postcodes.io/postcodes/' + postcode, function (data) {
				goToNearest(data.result.longitude, data.result.latitude);
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
				'fill-extrusion-color': [
					'match',
					['get', 'ID'],
					'0D4F70BCC1FF27B3E050A00A568A259B', colours['central'],
					'0D4F70BCBC7027B3E050A00A568A259B', colours['crownhill'],
					'0D4F70C26C6927B3E050A00A568A259B', colours['devonport'],
					'0D4F70C2790C27B3E050A00A568A259B', colours['efford'],
					'0D4F70C2B4AB27B3E050A00A568A259B', colours['estover'],
					'0D4F70C2D6BB27B3E050A00A568A259B', colours['northprospect'],
					'0D4F70C2715927B3E050A00A568A259B', colours['peverell'],
					'0D4F70B79EFA27B3E050A00A568A259B', colours['plympton'],
					'0D4F70C31D6E27B3E050A00A568A259B', colours['plymstock'],
					'0D4F70C2862A27B3E050A00A568A259B', colours['southway'],
					'0D4F7098AB3527B3E050A00A568A259B', colours['stbudeaux'],
					'0D4F70C21F9327B3E050A00A568A259B', colours['westpark'],
					'#CCC'
				],
				"fill-extrusion-height": [
					"interpolate", ["linear"], ["zoom"],
					15, 0,
					15.05, ["get", "max"]
				],
				'fill-extrusion-opacity': 0.8
			}
		});

		// 
		map.on('click', '3d-buildings', function (e) {
		});

		// add the libraries layer
		Libraries.load(function () {
			$.each(Libraries.libraries, function (x, library) {


				// Services icons
				var icons = '';


				// create a HTML element for each feature
				var card = document.createElement('div');
				card.className = 'card';
				var cardBody = document.createElement('div');
				cardBody.className = 'card-body';
				var cardTitle = document.createElement('h4');
				cardTitle.className = 'card-title';
				cardTitle.innerText = library['Library name'];
				var cardSubtitle = document.createElement('h6');
				cardSubtitle.className = 'card-subtitle mb-2 text-muted';
				cardSubtitle.innerText = library.status;
				var eventsList = document.createElement('h6');
				eventsList.className = 'card-subtitle mb-2 text-muted';
				eventsList.innerText = 'Events: ' + library.events.join(', ');
				cardBody.appendChild(cardTitle);
				cardBody.appendChild(cardSubtitle);
				if (library.events && library.events.length > 0) cardBody.appendChild(eventsList);
				card.appendChild(cardBody);
				// make a marker for each feature and add to the map
				new mapboxgl.Marker(card)
					.setLngLat([library.Longitude, library.Latitude])
					.addTo(map);
			});
			// Set up opening hours updates
			setTimeout(function () {
				Libraries.setOpenStatus();
			}, 15000)
		});
	});
});