const csvjson = require('csvjson');
const request = require('request');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const districts_path = '../data/oa_centroids/oa_centroids_lad11cd_';

// getLocationData: 
module.exports.getLocationDistances = (location, destinations, callback) => {
	// Gotta work out the current OA
	request('https://api.postcodes.io/postcodes?lon=' + location[0] + '&lat=' + location[1], (error, response, body) => {
		let json_result = JSON.parse(body);
		if (json_result && json_result.result && json_result.result.length > 0) {
			let district = json_result.result[0].codes.admin_district;
			// We have a file for each district
			let district_csv = fs.readFileSync(path.join(__dirname, districts_path + district + '.shp.csv'), { encoding: 'utf8' });
			let oas = csvjson.toObject(district_csv, {});
			let oa_points = [];
			let point = turf.point(location);
			oas.forEach(oa => oa_points.push(turf.point([oa.X, oa.Y], { oa_code: oa.oa11cd })));
			let nearest = turf.nearestPoint(point, turf.featureCollection(oa_points));
			let oa_code = nearest.properties.oa_code;
			callback(destinations);
		} else {
			callback(destinations);
		}
	})
}