// Third party includes
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Our routes 
const events = require('./routes/events');
const isochrones = require('./routes/isochrones');
const locations = require('./routes/locations');

// Set port to be 8080 for development, or the process environment for production/dev.
const port = process.env.PORT || 8080;

// Allow cross origin
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Allow us to read JSON as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API routes
app.use('/api/events', events);
app.use('/api/isochrones', isochrones);
app.use('/api/locations', locations);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.use('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Listen for requests
app.listen(port);