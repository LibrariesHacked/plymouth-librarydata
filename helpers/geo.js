const csvjson = require('csvjson');
const request = require('request');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const districts_path = '../data/oa_centroids/oa_centroids_lad11cd_';
const oa_path = '../data/oa_distances/';

const _this = this;

// GetDistances: 
module.exports.getDistances = (postcode_object, location, destinations) => {
	let district = postcode_object.codes.admin_district;
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
	if (fs.existsSync(path_driving)) {
		let driving_text = fs.readFileSync(path_driving, { encoding: 'utf8' });
		let driving_json = JSON.parse(driving_text);
		if (!driving_json.error) {
			destinations.forEach(destination => {
				driving_json.forEach(drive => {
					if (drive.library === destination.name) {
						destination.driving_duration = drive.duration;
						destination.driving_distance = drive.distance;
					}
				});
			});
		}
	}
	if (fs.existsSync(path_cycling)) {
		let cycling_text = fs.readFileSync(path_cycling, { encoding: 'utf8' });
		let cycling_json = JSON.parse(cycling_text);
		if (!cycling_json.error) {
			destinations.forEach(destination => {
				cycling_json.forEach(cycle => {
					if (cycle.library === destination.name) {
						destination.cycling_duration = cycle.duration;
						destination.cycling_distance = cycle.distance;
					}
				});
			});
		}
	}
	if (fs.existsSync(path_walking)) {
		let walking_text = fs.readFileSync(path_walking, { encoding: 'utf8' });
		let walking_json = JSON.parse(walking_text);
		if (!walking_json.error) {
			destinations.forEach(destination => {
				walking_json.forEach(walk => {
					if (walk.library === destination.name) {
						destination.walking_duration = walk.duration;
						destination.walking_distance = walk.distance;
					}
				});
			});
		}
	}
	return destinations;
}

// GetLocationDistances: 
module.exports.getLocationDistances = (location, destinations, callback) => {
	request('https://api.postcodes.io/postcodes?lon=' + location[0] + '&lat=' + location[1], (error, response, body) => {
		let json_result;
		try {
			json_result = JSON.parse(body);
		} catch (e) { } // Log?
		if (json_result && json_result.result && json_result.result.length > 0) {
			let destinations_processed = _this.getDistances(json_result.result[0], location, destinations);
			callback(destinations_processed);
		} else {
			callback(destinations);
		}
	})
}

// GetPostcodeDistances: 
module.exports.getPostcodeDistances = (postcode, destinations, callback) => {
	request('https://api.postcodes.io/postcodes/' + postcode, (error, response, body) => {
		let json_result = JSON.parse(body);
		if (json_result && json_result.result) {
			let destinations_processed = _this.getDistances(json_result.result, [json_result.result.longitude, json_result.result.latitude], destinations);
			callback(destinations_processed);
		} else {
			callback(destinations);
		}
	})
}
