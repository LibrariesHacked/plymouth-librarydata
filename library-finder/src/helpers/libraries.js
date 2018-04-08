// Axios for making requests
import axios from 'axios';
import moment from 'moment';

// getAllLibraries: 
export function getAllLibraries(location, callback) {
	axios.get('/api/libraries?latitude=' + location[1] + '&longitude=' + location[0])
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};

// updateLibraryLocations: 
export function updateLibraryLocations(location, libraries, callback) {
	axios.post('/api/libraries/updatelibrarylocations', { location: location, libraries: libraries })
		.then(response => {
			callback(response.data);
		})
		.catch(error => callback([]));
};

// checkLibraryOpen: 
export function checkLibraryOpen(library, current) {
	let open = false;
	let date = current.format('YYYYMMDD');
	let day = current.format('dddd').toLowerCase();
	let hours = library[day];
	let start = hours.split('-')[0];
	let end = hours.split('-')[1];
	let test_start = moment(date + ' ' + start, 'YYYYMMDD HH:mm');
	let test_end = moment(date + ' ' + end, 'YYYYMMDD HH:mm');
	if (current.isAfter(test_start) && current.isBefore(test_end)) open = true;

	let message = '';
	if (open) {
		message = 'Closing ' + current.to(test_end);
		if (moment.duration(test_end.diff(current, 'minutes')) < 5) message = 'Quick! ' + message;
	} else {
		// We have to get the next time the library is opening
		for (let x = 1; x < 8; x++) {
			let test_date = moment(current.format('YYYYMMDD'), 'YYYYMMDD').add(x, 'days');
			let test_day = test_date.format('dddd').toLowerCase();
			let hours = library[test_day];
			if (hours && hours !== 'closed') {
				let test_day = test_date.format('dddd').toLowerCase();
				let test_date_str = test_date.format('YYYYMMDD');
				let test_hours = library[test_day];
				let test_start = test_hours.split('-')[0];
				let date_time_str = test_date_str + ' ' + test_start;
				let date_time_test = moment(date_time_str, 'YYYYMMDD HH:mm');
				message = 'Opening ' + current.to(date_time_test);
				x = 7;
			}
		}
	}
	return { open: open, message: message };
};
