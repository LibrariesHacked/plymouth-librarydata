// Axios for making requests
import axios from 'axios';

// Moment for using dates and times
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
	// Remove the event data
	var libraries_trimmed = [];
	libraries.forEach(library => {
		libraries_trimmed.push(library);
	});
	libraries_trimmed.forEach(library => {
		delete library.events;
	});

	axios.post('/api/libraries/updatelibrarylocations', { location: location, libraries: libraries_trimmed })
		.then(response => {
			let libraries_updated = libraries;
			if (response && response.data && response.data.length > 0) {
				libraries_updated = response.data;
				libraries_updated.forEach(library => {
					libraries.forEach(old_library => {
						if (old_library.name === library.name) library.events = old_library.events;
					});
				});
			}
			callback(libraries_updated);
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
				message = 'Open ' + current.to(date_time_test);
				x = 7;
			}
		}
	}
	return { open: open, message: message };
};

// getLibraryOpeningHours:
export function getLibraryOpeningHours(library) {
	let opening_hours = [];
	let date = moment();
	for (let x = 0; x < 7; x++) {
		opening_hours.push(
			{
				full: date.format('DD/MM/YYYY'),
				day: date.format('dddd'),
				day_code: date.format('ddd'),
				date: date.format('DD'),
				date_ordinal: date.format('Do'),
				hours: library[date.format('dddd').toLowerCase()]
			}
		)
		date.add('day', 1);
	}
	return opening_hours;
}

// getLibraryTotalOpeningHours:
export function getLibraryTotalOpeningHours(library) {
	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	let total = 0;
	days.forEach(day => {
		total += getLibraryTotalOpeningHoursDay(library, day);
	});
	return total;
}

// getLibraryTotalOpeningHoursDay:
export function getLibraryTotalOpeningHoursDay(library, day) {
	let total = 0;
	let hours = library[day];
	if (hours && hours !== 'closed') {
		let start = hours.split('-')[0];
		let end = hours.split('-')[1];
		total = moment.duration(moment(end, 'hh:mm').diff(moment(start, 'hh:mm'))).asHours();
	}
	return total;
}

// getFacilities:
export function getFacilities(library) {
	let facilities = [];
	console.log(library);
	return [];
}