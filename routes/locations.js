const express = require('express');
const router = express.Router();

const eventsHelper = require('../helpers/events');
const geoHelper = require('../helpers/geo');
const locationHelper = require('../helpers/locations');

// Gets a list of locations
router.get('/', (req, res, next) => {
	const client_location = [req.query.longitude, req.query.latitude];
	const postcode = req.query.postcode;
	const events = req.query.events || false;
	let locations = locationHelper.getAllLocations();
	
	if (postcode && postcode !== '') {
		geoHelper.getPostcodeDistances(postcode, locations, geo_locations => {
			if (geo_locations && events) { 
				eventsHelper.getEvents(locations, locations_events => {
					res.json(locations_events);
				});
			} else {
				res.json(locations);
			}
		});
	} else {
		geoHelper.getLocationDistances(client_location, locations, geo_locations => {
			if (geo_locations && events) { 
				eventsHelper.getEvents(locations, locations_events => {
					res.json(locations_events);
				});
			} else {
				res.json(locations);
			}
		});
	}
});

module.exports = router;