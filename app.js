const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const libraries = require('./routes/libraries');

const app = express();

// Set port to be 8080 for development, or the environment for deployment.
const port = process.env.PORT || 8080;

// Allow cross origin
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// Web service routes
app.use('/api/libraries', libraries);

// React app for all other requests
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/library-finder/build/index.html'));
});

// Listen for requests
app.listen(port);