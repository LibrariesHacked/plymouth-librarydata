const request = require('request');

const event_url = "https://script.google.com/macros/s/AKfycbwYJSz1OgWzXzReiirr8jgwHvQaeyyb0aYOSDFXCFLZrSiZdxbA/exec";

// GetFeed: Takes in an array of locations and adds events for them.
module.exports.getEvents = (locations, callback) => {
	request.get(event_url, (err, res, body) => {
		let results = [];
		try {
			results = JSON.parse(body);
		} catch (err) { }
		locations.forEach(location => {
			location.events = [];
			results.forEach(result => {
				const event_title = result.name;
				const event_location = result.location;
				const dates = result.dates;
				if (event_title.length > 0 && location.name === event_location) {
					let event = { title: event_title, dates: dates, url: result.url };
					location.events.push(event);
				}
			});
		});
		callback(locations);
	});
}