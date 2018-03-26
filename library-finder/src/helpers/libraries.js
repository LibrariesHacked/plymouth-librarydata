// Axios for making requests
import axios from 'axios';
import moment from 'moment';

export function getAllLibraries(location, callback) {
	axios.get('/api/libraries')
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};

export function checkLibraryOpen(library) {
	let open = false;
	let current = moment();
	let date = current.format('YYYYMMDD');
	let day = current.format('dddd');
	let hours = library[day];
	let start = hours.split('-')[0];
	let end = hours.split('-')[1];
	if (current.isAfter(moment(date + ' ' + start))) open = true;
	return open;
};