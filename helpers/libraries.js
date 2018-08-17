const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');

const libraries_path = '../data/libraries/libraries.csv';

// GetAllLibraries: 
module.exports.getAllLibraries = () => {
	let lib_csv = fs.readFileSync(path.join(__dirname, libraries_path), { encoding: 'utf8' });
	let libraries = csvjson.toObject(lib_csv, { quote: '"' });
	return libraries;
}
