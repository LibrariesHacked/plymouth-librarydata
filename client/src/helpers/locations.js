// Axios for making requests
import axios from 'axios';

// Moment for using dates and times
import moment from 'moment';

// getAllLocations: 
export function getAllLocations(position_coords, callback) {
	axios.get('/api/locations?latitude=' + position_coords[1] + '&longitude=' + position_coords[0])
		.then(response => {
			callback(response.data);
		})
		.catch(err => callback([]));
}

// getLocationOpeningHours:
export function getLocationOpeningHours(location) {
	let opening_hours = [];
	const location_opening_days = location.opening_hours;

	// create a lookup for the location days
	let location_lookup = {};
	for (let y = 0; y < location_opening_days.length; y++) {
		const day_code = location_opening_days[y].substring(0, 2);
		const start = location_opening_days[y].substring(5, 10);
		const end = location_opening_days[y].substring(11, 16);
		location_lookup[day_code] = { start: start, end: end };
	}

	let date = moment();
	for (let x = 0; x < 7; x++) {
		opening_hours.push(
			{
				full: date.format('DD/MM/YYYY'),
				day: date.format('dddd'),
				day_code: date.format('ddd'),
				date: date.format('DD'),
				date_ordinal: date.format('Do'),
				hours: location[date.format('dddd').toLowerCase()],
				start: (location_lookup[date.format('ddd')] ? moment(location_lookup[date.format('ddd')].start, 'HH:mm').format('ha') : 'Closed'),
				end: (location_lookup[date.format('ddd')] ? moment(location_lookup[date.format('ddd')].end, 'HH:mm').format('ha') : '')
			}
		)
		date.add('day', 1);
	}
	return opening_hours;
}

// checkLocationOpen: 
export function checkLocationOpen(location) {
	let open = false;
	let message = '';
	const opening_hours = getLocationOpeningHours(location);
	const now = moment();
	if (opening_hours[0].full === now.format('DD/MM/YYYY')) { // Open today
		let start = moment(opening_hours[0].full + ' ' + opening_hours[0].start, 'DD/MM/YYYY ha');
		let end = moment(opening_hours[0].full + ' ' + opening_hours[0].end, 'DD/MM/YYYY ha');

		if (now.isAfter(start) && now.isBefore(end)) { // Currently Open
			open = true;
			message = 'Closing in ' + moment.duration(end.diff(start)).humanize();
		} else {
			if (now.isBefore(start)) { // Opening today
				message = 'Opening in ' + moment.duration(now.diff(start)).humanize()
			}
		}
	}
	if (open === false && message === '') { // 
		let x = 1;
		while (x < opening_hours.length && message === '') {
			let start = moment(opening_hours[x].full + ' ' + opening_hours[x].start, 'DD/MM/YYYY ha');
			message = 'Opening in ' + moment.duration(now.diff(start)).humanize();
			x++;
		}
	}
	return { open: open, message: message };
}

// getLocationTotalOpeningHours:
export function getLocationTotalOpeningHours(location) {
	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	let total = 0;
	days.forEach(day => {
		total += getLocationTotalOpeningHoursDay(location, day);
	});
	return total;
}

// getLocationTotalOpeningHoursDay:
export function getLocationTotalOpeningHoursDay(location, day) {
	let total = 0;
	return total;
	let hours = location[day];
	if (hours && hours !== 'closed') {
		let start = hours.split('-')[0];
		let end = hours.split('-')[1];
		total = moment.duration(moment(end, 'hh:mm').diff(moment(start, 'hh:mm'))).asHours();
	}
	return total;
}

// getFacilities:
export function getFacilities(location) {
	let facilities = [];

	return facilities;
}