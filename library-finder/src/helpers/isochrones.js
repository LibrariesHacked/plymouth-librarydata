// Axios for making requests
import axios from 'axios';

// getLibraryIsochrone:
export function getLibraryIsochrone(library, travel, callback) {
	axios.get('/api/isochrones?library=' + library + '&travel=' + travel)
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};