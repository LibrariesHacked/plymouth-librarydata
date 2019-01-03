const express = require('express');
const router = express.Router();

const geoHelper = require('../helpers/geo');
const locationHelper = require('../helpers/locations');

// Get. Gets a list of locations
router.get('/', (req, res, next) => {

	// Request parameters
	const client_position = [req.query.longitude, req.query.latitude];
	const postcode = req.query.postcode;

	let location_type = (client_position ? 'coordinates' : 'postcode');
	let location = (client_position ? client_position : postcode);

	locationHelper.getAllLocations(locations => {
		if (location) {
			geoHelper.getLocationsDistances(location_type, location, locations, geo_locations => {
				if (geo_locations) locations = geo_locations;
				res.json(locations);
			});
		} else {
			res.json(locations);
		}

	});
});

module.exports = router;