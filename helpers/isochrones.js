const fs = require('fs')

// getIsochrone: Returns an isochrone from file storage.
module.exports.getIsochrone = (location, travel) => {
  return JSON.parse(fs.readFileSync('./data/isochrones/' + location + '_isochrone_' + travel + '.json', 'utf8'))
}
