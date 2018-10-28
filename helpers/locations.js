const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');

const locations_path = '../data/libraries/libraries.csv';

// getAllLocations: 
module.exports.getAllLocations = () => {
	let csv = fs.readFileSync(path.join(__dirname, locations_path), { encoding: 'utf8' });
	let locations = csvjson.toObject(csv, { quote: '"' });
	return locations;
}
