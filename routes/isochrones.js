const express = require('express');
const router = express.Router();
const fs = require('fs');

// Gets an isochrone by library and travel type.
router.get('/', function (req, res, next) {
	let library = req.query.library;
	let travel = req.query.travel;
	let isochrone = JSON.parse(fs.readFileSync('./data/isochrones/' + library + '_isochrone_' + travel + '.json', 'utf8'));
	res.json(isochrone);
});

module.exports = router;