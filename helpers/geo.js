const { Client } = require('pg')
require('dotenv').load()

// getDistances:
module.exports.getLocationDistances = (location_type, location, destinations, callback) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true
  })

  let coordinates = []

  let query = ''
  let query_vars = [location]

  if (location_type === 'postcode') {
    query = 'select travel_type, location_name, duration, distance, ST_X(ST_Transform(ST_SetSRID(ST_MakePoint(eastings, northings), 27700), 4326)) as longitude, ST_Y(ST_Transform(ST_SetSRID(ST_MakePoint(eastings, northings), 27700), 4326)) as latitude from vw_oadistances od join postcodes p on p.oa_code = od.oa_code where p.postcode_trim = $1'
    query_vars = [location.replace(/\s/g, '')]
  }

  if (location_type === 'coordinates') {
    coordinates = location
    query = 'select travel_type, location_name, duration, distance from vw_oadistances od join oas o on od.oa_code = o.oa11cd where ST_Within(ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 27700), o.geom)'
    query_vars = location
  }

  client.connect((err, res) => {
    if (err) {
      callback({
        coordinates: coordinates,
        destinations: destinations
      })
      return
    }
    client.query(query, query_vars, (err, res) => {
      client.end()
      if (res && res.rows && res.rows.length > 0) {
        res.rows.forEach(trip => {
          if (trip.longitude && trip.latitude) coordinates = [trip.longitude, trip.latitude]
          destinations.forEach(destination => {
            if (destination.location_name === trip.location_name) {
              if (!destination.travel) destination.travel = {}
              destination.travel[trip.travel_type] = {}
              destination.travel[trip.travel_type].duration = trip.duration
              destination.travel[trip.travel_type].distance = trip.distance
            }
          })
        })
      }
      callback({
        coordinates: coordinates,
        destinations: destinations
      })
    })
  })
}
