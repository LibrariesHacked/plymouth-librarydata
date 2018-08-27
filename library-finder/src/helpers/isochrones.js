// Axios for making requests
import axios from 'axios';

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
	axios.get('/api/isochrones?library=' + library + '&received=' + received.join(','))
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};
