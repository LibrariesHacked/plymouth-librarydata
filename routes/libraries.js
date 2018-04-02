const express = require('express');
const router = express.Router();

const libHelper = require('../helpers/libraries');
const geoHelper = require('../helpers/geo');

// 
router.get('/', (req, res, next) => {
	let location = [req.query.longitude, req.query.latitude];
	let postcode = req.query.postcode;
	let libraries = libHelper.getAllLibraries();
	geoHelper.getLocationDistances(location, libraries, libs => {
		if (libs) {
			res.json(libs);
		} else {
			res.json([]);
		}
	});
});

module.exports = router;