const express = require('express');
const router = express.Router();
const fs = require('fs');

// Gets an isochrone by location and travel type.
router.get('/', function (req, res, next) {
	let location = req.query.location;
	let travel = req.query.travel;
	if (travel) travel = travel.split(',');
	if (!travel) travel = ['cycling-regular', 'driving-car', 'foot-walking'];
	let received = req.query.received;
	if (received) received = received.split(',');
	if (!received) received = [];

	received.forEach(travel_received => {
		let index = travel.indexOf(travel_received);
		if (index !== -1) travel.splice(index, 1);
	});

	let isochrones = [];
	travel.forEach(travel_type => {
		isochrones.push({ travel: travel_type, iso:  JSON.parse(fs.readFileSync('./data/isochrones/' + location + '_isochrone_' + travel_type + '.json', 'utf8')) })
	});
	res.json(isochrones);
});

module.exports = router;