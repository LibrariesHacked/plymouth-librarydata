// Axios for making requests
import axios from 'axios';

//
export function getFacilities(callback) {
	axios.get('/api/appdata/facilities')
		.then(response => {
			callback(response.data);
		})
		.catch(err => callback([]));
}

//
export function getTravel(callback) {
	axios.get('/api/appdata/travel')
		.then(response => {
			callback(response.data);
		})
		.catch(err => callback([]));
}