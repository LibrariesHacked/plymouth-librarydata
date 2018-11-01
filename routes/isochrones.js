// Third party includes
const express = require('express');
const router = express.Router();

// Our isochrone helper
const isoHelper = require('../helpers/isochrones');

// Gets an isochrone by location and travel type.
router.get('/', function (req, res, next) {
	const location = req.query.location;

	// Which travel types to include
	let include = req.query.include;
	if (include) include = include.split(',');
	if (!include) include = ['cycling-regular', 'driving-car', 'foot-walking'];

	// Which travel types to exclude
	let exclude = req.query.exclude;
	if (exclude) exclude = exclude.split(',');
	if (!exclude) exclude = [];

	// Process Excludes
	exclude.forEach(travel => {
		let index = include.indexOf(travel);
		if (index !== -1) include.splice(index, 1);
	});

	let isochrones = [];
	include.forEach(travel => {
		isochrones.push({ travel: travel, iso: isoHelper.getIsochrone(location, travel) })
	});
	res.json(isochrones);
});

module.exports = router;