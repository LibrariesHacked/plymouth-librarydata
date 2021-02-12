// Axios for making requests
import axios from 'axios'

//
export function getEvents (callback) {
  axios.get('/api/events/')
    .then(response => {
      callback(response.data)
    })
    .catch(err => callback([]))
}
