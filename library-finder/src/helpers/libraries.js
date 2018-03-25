// Axios for making requests
import axios from 'axios';

export function getAllLibraries(location, callback) {
	axios.get('/api/libraries')
		.then(libraries => callback([]))
		.catch(error => callback([]));
};