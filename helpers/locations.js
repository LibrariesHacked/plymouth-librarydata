const { Client } = require('pg')
require('dotenv').load()

// Get All Locations:
module.exports.getAllLocations = (callback) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
      rejectUnauthorized: false
    }
  })

  client.connect((err, res) => {
    if (err) {
      callback([])
      return
    }
    client.query('select * from vw_locations', (err, res) => {
      client.end()
      if (res && res.rows && res.rows.length > 0) {
        callback(res.rows)
      } else {
        callback([])
      }
    })
  })
}
