// Axios for making requests
import axios from 'axios';

// getIsochroneConfig
export function getIsochroneConfig() {
	return {
		'foot-walking': {
			display: 'Walking'
		},
		'cycling-regular': {
			display: 'Cycling'
		},
		'driving-car': {
			display: 'Driving'
		}
	};
};

// getLibraryIsochronesByType:Gets isochrones for a particular library and travel type.
export function getLibraryIsochronesByType(library, travel, callback) {
	axios.get('/api/isochrones?library=' + library + '&travel=' + travel.join(','))
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};

// getAllLibraryIsochrones: Gets all isochrones for a library except those already received
export function getAllLibraryIsochrones(library, received, callback) {
	axios.get('/api/isochrones?library=' + library.name + '&received=' + received.join(','))
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};

// getIsochroneData: 
export function getIsochroneData(isochrone) {
	let data = [];
	if (isochrone && isochrone.features) {
		data = isochrone.features.map(feature => {
			return feature.properties;
		})
	}
	return data;
};