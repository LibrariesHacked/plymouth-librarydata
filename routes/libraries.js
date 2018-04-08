const express = require('express');
const router = express.Router();

const libHelper = require('../helpers/libraries');
const geoHelper = require('../helpers/geo');
const feedHelper = require('../helpers/feed');

// 
router.get('/', (req, res, next) => {
	let location = [req.query.longitude, req.query.latitude];
	let postcode = req.query.postcode;
	let libraries = libHelper.getAllLibraries();
	geoHelper.getLocationDistances(location, libraries, libs => {
		if (libs) {
			feedHelper.getFeed(libs, feeds => {
				res.json(feeds);
			});
		} else {
			res.json([]);
		}
	});
});

router.post('/updatelibrarylocations', (req, res, next) => {
	let location = req.body.location;
	let libraries = req.body.libraries;
	geoHelper.getLocationDistances(location, libraries, libs => res.json(libs));
});

module.exports = router;