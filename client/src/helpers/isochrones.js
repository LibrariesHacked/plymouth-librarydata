// Axios for making requests
import axios from 'axios'

// getLocationIsochronesByType:Gets isochrones for a particular location and travel type.
export function getLocationIsochronesByType (location_name, travel, callback) {
  axios.get('/api/isochrones?location=' + location_name + '&include=' + travel.join(','))
    .then(response => {
      callback(response.data)
    })
    .catch(() => callback([]))
};

// getAllLocationIsochrones: Gets all isochrones for a location except those already received
export function getAllLocationIsochrones (location_name, received, callback) {
  axios.get('/api/isochrones?location=' + location_name + '&exclude=' + received.join(','))
    .then(response => {
      callback(response.data)
    })
    .catch(() => callback([]))
};

// getIsochroneData:
export function getIsochroneData (isochrone) {
  let data = []
  if (isochrone && isochrone.features) {
    data = isochrone.features.map(feature => {
      return feature.properties
    })
  }
  return data
};
