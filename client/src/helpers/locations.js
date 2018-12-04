// Axios for making requests
import axios from 'axios';

// Moment for using dates and times
import moment from 'moment';

// Facility config for libraries
const facilityConfig = {
	computers: {
		display: 'Computers',
		icon: 'DesktopWindows',
		description: 'Computers for public use'
	},
	wifi: {
		display: 'WiFi',
		icon: 'Wifi',
		description: 'Free Wifi'
	},
	printers: {
		display: 'Printers',
		icon: 'Print',
		description: 'Printers (colour and black/white)'
	},
	photocopiers: {
		display: 'Photocopying',
		icon: 'FileCopy',
		description: 'Photocopiers (colour and black/white)'

	},
	scanners: {
		display: 'Scanners',
		icon: 'Scanner',
		description: 'Scanners'
	},
	meetingrooms: {
		display: 'Meeting rooms',
		icon: 'MeetingRoom',
		description: 'Meeting rooms for hire'
	},
	localandfamilyhistory: {
		display: 'Local and family history',
		icon: 'LocalActivity',
		description: 'Local and family history collection'
	},
	navalhistory: {
		display: 'Naval History',
		icon: 'DirectionsBoat',
		description: 'Local and family history collection'
	},
	microfilmscanners: {
		display: 'Microfilm scanners',
		icon: 'CameraRoll',
		description: 'Microfilm scanners'
	},
	roofterrace: {
		display: 'Roof terrace',
		icon: 'WbSunny',
		description: 'Roof terrace'
	},
	books: {
		display: 'Books',
		icon: 'LibraryBooks',
		description: 'Books for loan'
	},
	dvds: {
		display: 'DVDs',
		icon: 'LocalMovies',
		description: 'DVDs for hire'
	},
	audiobooks: {
		display: 'Audiobooks',
		icon: 'Headset',
		description: 'Audiobooks'
	},
	requestservice: {
		display: 'Request service',
		icon: 'RoomService',
		description: 'Request service'
	},
	cafe: {
		display: 'Cafe',
		icon: 'LocalCafe',
		description: 'Cafe'
	}
};

// getAllLocations: 
export function getAllLocations(position_coords, callback) {
	axios.get('/api/locations?events=true&latitude=' + position_coords[1] + '&longitude=' + position_coords[0])
		.then(response => {
			callback(response.data);
		})
		.catch(err => callback([]));
}

// checkLocationOpen: 
export function checkLocationOpen(location, current) {
	let open = false;
	let date = current.format('YYYYMMDD');
	let day = current.format('dddd').toLowerCase();
	let hours = location[day];
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
		// We have to get the next time the location is opening
		for (let x = 1; x < 8; x++) {
			let test_date = moment(current.format('YYYYMMDD'), 'YYYYMMDD').add(x, 'days');
			let test_day = test_date.format('dddd').toLowerCase();
			let hours = location[test_day];
			if (hours && hours !== 'closed') {
				let test_day = test_date.format('dddd').toLowerCase();
				let test_date_str = test_date.format('YYYYMMDD');
				let test_hours = location[test_day];
				let test_start = test_hours.split('-')[0];
				let date_time_str = test_date_str + ' ' + test_start;
				let date_time_test = moment(date_time_str, 'YYYYMMDD HH:mm');
				message = 'Open ' + current.to(date_time_test);
				x = 7;
			}
		}
	}
	return { open: open, message: message };
}

// getLocationOpeningHours:
export function getLocationOpeningHours(location) {
	let opening_hours = [];
	let date = moment();
	for (let x = 0; x < 7; x++) {
		const start = location[date.format('dddd').toLowerCase()].split('-')[0];
		const end = location[date.format('dddd').toLowerCase()].split('-')[1];
		opening_hours.push(
			{
				full: date.format('DD/MM/YYYY'),
				day: date.format('dddd'),
				day_code: date.format('ddd'),
				date: date.format('DD'),
				date_ordinal: date.format('Do'),
				hours: location[date.format('dddd').toLowerCase()],
				start: moment(start, 'HH:mm').format('ha'),
				end: moment(end, 'HH:mm').format('ha')
			}
		)
		date.add('day', 1);
	}
	return opening_hours;
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
	Object.keys(facilityConfig).forEach(facility => {
		if (location[facility] === 'Yes') facilities.push({ 
			label: facilityConfig[facility].display, 
			icon: facilityConfig[facility].icon,
			description: facilityConfig[facility].description
		});
	});
	return facilities;
}