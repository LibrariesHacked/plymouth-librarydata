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
	} else {
		// We have to get the next day the library is opening
		for (let x = 0; x < 7; x++) {
			let test_date = current.add(1, 'day');
			let test_day = test_date.format('dddd');
			let hours = library[day];
			if (hours !== 'Closed') {
				message = 'Opening ' + current.to((moment(test_date.format('YYYYMMDD') + ' ' + hours.split('-')[0]), 'YYYYMMDD HH:mm'));
				x = 7;
			}
		}
	}
	return { open: open, message: message };
};
