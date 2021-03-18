const { Client } = require('pg')
require('dotenv').load()

// Get Facilities:
module.exports.getFacilities = (callback) => {
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

  client.connect((err) => {
    if (err) {
      callback([])
      return
    }
    client.query('select * from vw_facilities', (err, res) => {
      client.end()
      if (res && res.rows && res.rows.length > 0) {
        callback(res.rows)
      } else {
        callback([])
      }
    })
  })
}

// Get Travel:
module.exports.getTravel = (callback) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true
  })

  client.connect((err, res) => {
    if (err) {
      callback([])
      return
    }
    client.query('select * from vw_travel', (err, res) => {
      client.end()
      if (res && res.rows && res.rows.length > 0) {
        callback(res.rows)
      } else {
        callback([])
      }
    })
  })
}
