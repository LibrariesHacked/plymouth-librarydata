const express = require('express');
const router = express.Router();

const feedHelper = require('../helpers/feed');
const geoHelper = require('../helpers/geo');
const libHelper = require('../helpers/libraries');

// Gets a list of libraries
router.get('/', (req, res, next) => {
	let location = [req.query.longitude, req.query.latitude];
	let postcode = req.query.postcode;
	let libraries = libHelper.getAllLibraries();
	geoHelper.getLocationDistances(location, libraries, new_libs => {
		if (new_libs) {
			feedHelper.getFeed(new_libs, feeds => {
				res.json(feeds);
			});
		} else {
			res.json(libraries);
		}
	});
});

// Receives a set of library data and updates the location distances.
router.post('/updatelibrarylocations', (req, res, next) => {
	let location = req.body.location;
	let libraries = req.body.libraries;
	geoHelper.getLocationDistances(location, libraries, libs => res.json(libs));
});

module.exports = router;