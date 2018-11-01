// Third party includes
const express = require('express');
const router = express.Router();

// Our events helper
const eventsHelper = require('../helpers/events');

// Gets all the events from our event helper
router.get('/', function (req, res, next) {
	eventsHelper.getEvents(events => {
		res.json(events);
	});
});

module.exports = router;