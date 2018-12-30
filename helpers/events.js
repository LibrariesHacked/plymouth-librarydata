const request = require('request');

const event_url = 'https://script.google.com/macros/s/AKfycbwYJSz1OgWzXzReiirr8jgwHvQaeyyb0aYOSDFXCFLZrSiZdxbA/exec';

// Get Events: Retrieves events from the URL
module.exports.getEvents = (callback) => {
	request.get(event_url, (err, results, body) => {
		let events = [];
		let event_data = [];
		try {
			event_data = JSON.parse(body);
		} catch (err) { }
		event_data.forEach(item => {
			const event_title = item.title;
			const event_location = item.location;
			const dates = item.dates;
			const categories = item.categories;
			const event_url = item.url;
			if (event_title && event_title.length > 0) {
				let event = { title: event_title, location: event_location, categories: categories, url: event_url, dates: dates };
				events.push(event);
			}
		});
		callback(events);
	});
}