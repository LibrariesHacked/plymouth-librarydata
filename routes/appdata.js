const express = require('express');
const router = express.Router();

const appDataHelper = require('../helpers/appdata');

// 
router.get('/facilities', (req, res, next) => {
	appDataHelper.getFacilities(facilities => {
		res.json(facilities);
	});
});

// 
router.get('/travel', (req, res, next) => {
	appDataHelper.getTravel(travel => {
		res.json(travel);
	});
});


module.exports = router;