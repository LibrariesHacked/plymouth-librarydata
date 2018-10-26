const request = require('request');

const events_feed = "https://script.google.com/macros/s/AKfycbwYJSz1OgWzXzReiirr8jgwHvQaeyyb0aYOSDFXCFLZrSiZdxbA/exec";

// GetFeed: 
module.exports.getFeed = (library_list, callback) => {
	request.get(events_feed, (error, response, body) => {
		let results = [];
		try {
			results = JSON.parse(body);
		}
		catch(err) {
			//
		}
		library_list.forEach(library => {
			library.events = [];
			results.forEach(result => {
				const feedTitle = result.name;
				const feedLibrary = result.library;
				const dates = result.dates;
				if (feedTitle.length > 0 && library.name === feedLibrary) {
					let event = { title: feedTitle, dates: dates, url: result.url };
					library.events.push(event);
				}
			});
		});
		callback(library_list);
	});
}