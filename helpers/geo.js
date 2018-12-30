const { Client } = require('pg');
require('dotenv').load();

// getDistances: 
module.exports.getLocationsDistances = (location_type, location, destinations, callback) => {

	const client = new Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT,
		ssl: true
	});

	let query = '';
	let query_vars = [location];

	if (location_type === 'postcode') {
		query = 'select travel_type, location_name, duration, distance from vw_oadistances od join postcode p on p.oa_code = od.oa_code where p.postcode_trim = $1';
		vars = [location];
	}

	if (location_type === 'coordinates') {
		query = 'select travel_type, location_name, duration, distance from vw_oadistances od join oas o on od.oa_code = o.oa11cd where ST_Within(ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 27700), o.geom)';
		vars = [location[0], location[1]];
	}

	client.connect();
	client.query(query, query_vars, (err, res) => {
		client.end();
		if (res && res.rows && res.rows.length > 0) {
			res.rows.forEach(trip => {
				destinations.forEach(destination => {
					if (destination.location_name === trip.location_name) {
						destination[trip.travel_type + '_duration'] = trip.duration;
						destination[trip.travel_type + '_distance'] = trip.distance;
					}
				});
			});
		}
		callback(destinations);
	});
}