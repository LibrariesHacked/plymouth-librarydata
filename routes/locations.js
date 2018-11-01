// Third party includes
const express = require('express');
const router = express.Router();

// Our helpers
const eventsHelper = require('../helpers/events');
const geoHelper = require('../helpers/geo');
const locationHelper = require('../helpers/locations');

// Get. Gets a list of locations
router.get('/', (req, res, next) => {

	// Request parameters
	const client_position = [req.query.longitude, req.query.latitude];
	const events = req.query.events || false;
	const postcode = req.query.postcode;

	// 
	let locations = locationHelper.getAllLocations();

	if (postcode && postcode !== '') {
		geoHelper.getPostcodeDistances(postcode, locations, geo_locations => {
			if (geo_locations) locations = geo_locations;
			if (events) {
				eventsHelper.getEvents(event_list => {
					if (event_list && event_list.length > 0) locations = eventsHelper.addEventsToLocations(event_list, locations);
					res.json(locations);
				});
			} else {
				res.json(locations);
			}
		});
	} else {
		geoHelper.getLocationDistances(client_position, locations, geo_locations => {
			if (geo_locations) locations = geo_locations;
			if (events) {
				eventsHelper.getEvents(event_list => {
					if (event_list && event_list.length > 0) locations = eventsHelper.addEventsToLocations(event_list, locations);
					res.json(locations);
				});
			} else {
				res.json(locations);
			}
		});
	}
});

module.exports = router;