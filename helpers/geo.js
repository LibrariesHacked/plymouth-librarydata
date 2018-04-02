const csvjson = require('csvjson');
const request = require('request');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const districts_path = '../data/oa_centroids/oa_centroids_lad11cd_';
const oa_path = '../data/oa_distances/';

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

			let path_driving = path.join(__dirname, oa_path + oa_code + '_driving.json');
			let path_cycling = path.join(__dirname, oa_path + oa_code + '_cycling.json');
			let path_walking = path.join(__dirname, oa_path + oa_code + '_walking.json');
			if (fs.existsSync(path_driving) && fs.existsSync(path_cycling) && fs.existsSync(path_walking)) {
				let driving_csv = fs.readFileSync(path_driving, { encoding: 'utf8' });
				let driving = csvjson.toObject(driving_csv, {});
				let cycling_csv = fs.readFileSync(path_cycling, { encoding: 'utf8' });
				let cycling = csvjson.toObject(cycling_csv, {});
				let walking_csv = fs.readFileSync(path_walking, { encoding: 'utf8' });
				let walking = csvjson.toObject(walking_csv, {});
			}
			callback(destinations);
		} else {
			callback(destinations);
		}
	})
}