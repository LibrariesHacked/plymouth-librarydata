const express = require('express')
const router = express.Router()

const geoHelper = require('../helpers/geo')
const locationHelper = require('../helpers/locations')

// Get. Gets a list of locations
router.get('/', (req, res, next) => {
  // Request parameters
  const client_position = [req.query.longitude, req.query.latitude]
  const postcode = req.query.postcode

  // Response
  const response = {
    success: false,
    coordinates: (client_position || []),
    locations: []
  }

  const location_type = (req.query.longitude ? 'coordinates' : 'postcode')
  const location = (req.query.longitude ? client_position : postcode)

  locationHelper.getAllLocations(locations => {
    if (locations) {
      if (location) {
        geoHelper.getLocationDistances(location_type, location, locations, result => {
          response.success = true
          response.locations = (result.destinations || locations)
          response.coordinates = result.coordinates
          res.json(response)
        })
      } else {
        response.success = true
        response.locations = locations
        res.json(response)
      }
    } else {
      response.success = false
      res.json(response)
    }
  })
})

module.exports = router
