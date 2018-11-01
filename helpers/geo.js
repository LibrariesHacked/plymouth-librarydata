const csvjson = require('csvjson');
const request = require('request');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const districts_path = '../data/oa_centroids/oa_centroids_lad11cd_';
const postcodes_url = 'https://api.postcodes.io/postcodes';
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

	const transports = ['driving-car', 'cycling-regular', 'foot-walking'];
	transports.forEach(transport => {
		let path_transport = path.join(__dirname, oa_path + oa_code + '_' + transport + '.json');
		if (fs.existsSync(path_transport)) {
			let text = fs.readFileSync(path_transport, { encoding: 'utf8' });
			let transport_json = JSON.parse(text);
			if (!transport_json.error) {
				destinations.forEach(destination => {
					transport_json.forEach(trip => {
						if (trip.location === destination.name) {
							destination[transport + '_duration'] = trip.duration;
							destination[transport + '_distance'] = trip.distance;
						}
					});
				});
			}
		}
	});
	return destinations;
}

// GetLocationDistances: Takes in a Lat/Lng and retrieves the distance to each location.
module.exports.getLocationDistances = (location, destinations, callback) => {
	request(postcodes_url + '?lon=' + location[0] + '&lat=' + location[1], (err, res, body) => {
		let json_result;
		try {
			json_result = JSON.parse(body);
		} catch (e) { }
		if (json_result && json_result.result && json_result.result.length > 0) {
			let destinations_processed = _this.getDistances(json_result.result[0], location, destinations);
			callback(destinations_processed);
		} else {
			callback(destinations);
		}
	})
}

// GetPostcodeDistances: Takes in a postcode and retrieves the distance to each library.
module.exports.getPostcodeDistances = (postcode, destinations, callback) => {
	request(postcodes_url + postcode, (err, res, body) => {
		let json_result = JSON.parse(body);
		if (json_result && json_result.result) {
			let destinations_processed = _this.getDistances(json_result.result, [json_result.result.longitude, json_result.result.latitude], destinations);
			callback(destinations_processed);
		} else {
			callback(destinations);
		}
	})
}