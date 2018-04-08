const request = require('request');

const events_yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20IN%20('https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D1'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D2'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D3'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D4'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D5')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

module.exports.getFeed = (library_list, callback) => {
	request.get(events_yql, (error, response, body) => {
		library_list.forEach(library => {
			const results = JSON.parse(body);
			library.events = [];
			results.query.results.item.forEach(result => {
				if (library.name == result.title.split(': ')[1]) {
					let event = { title: result.title.split(': ')[0], date: result.date };
					console.log(result);
					library.events.push(event);
				}
			});
		});
		callback(library_list);
	});
}