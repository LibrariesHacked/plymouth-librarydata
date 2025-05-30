// Axios for making requests
import axios from 'axios'

// Moment for using dates and times
import moment from 'moment'

const locale_short = {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '...',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy'
  }
}

const locale_default = {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    ss: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
}

// getAllLocations:
export function getAllLocations (callback) {
  axios.get('/api/locations')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(err => callback({}))
}

// getAllLocationsByCoords:
export function getAllLocationsByCoords (position_coords, callback) {
  axios.get('/api/locations?latitude=' + position_coords[1] + '&longitude=' + position_coords[0])
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(err => callback({}))
}

// getAllLocationsByPostcode:
export function getAllLocationsByPostcode (postcode, callback) {
  // always trim and remove spaces from the postcode
  const postcode_trimmed = postcode.replace(/\s/g, '')
  axios.get('/api/locations?postcode=' + postcode_trimmed)
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(err => callback({}))
}

// getLocationOpeningHours:
export function getLocationOpeningHours (location) {
  const opening_hours = []
  const location_opening_days = location.opening_hours

  // create a lookup for the location days
  const location_lookup = {}
  for (let y = 0; y < location_opening_days.length; y++) {
    const day_code = location_opening_days[y].substring(0, 3)
    const start = location_opening_days[y].substring(4, 9)
    const end = location_opening_days[y].substring(10, 15)
    location_lookup[day_code] = { start: start, end: end }
  }

  const date = moment()
  for (let x = 0; x < 7; x++) {
    opening_hours.push(
      {
        full: date.format('DD/MM/YYYY'),
        day: date.format('dddd'),
        day_code: date.format('ddd'),
        date: date.format('DD'),
        date_ordinal: date.format('Do'),
        hours: (location_lookup[date.format('ddd')] ? location_lookup[date.format('ddd')].start + '-' + location_lookup[date.format('ddd')].end : 'Closed'),
        start: (location_lookup[date.format('ddd')] ? moment(location_lookup[date.format('ddd')].start, 'HH:mm').format('hh:mma') : null),
        end: (location_lookup[date.format('ddd')] ? moment(location_lookup[date.format('ddd')].end, 'HH:mm').format('hh:mma') : null),
        hours_open: (location_lookup[date.format('ddd')] ? moment.duration(moment(location_lookup[date.format('ddd')].end, 'HH:mm').diff(moment(location_lookup[date.format('ddd')].start, 'HH:mm'))).hours() : 0)
      }
    )
    date.add(1, 'day')
  }
  return opening_hours
}

// checkLocationOpen:
export function checkLocationOpen (location) {
  let open = false
  let time = null
  let message = ''
  const opening_hours = getLocationOpeningHours(location)
  const now = moment()
  if (opening_hours[0].full === now.format('DD/MM/YYYY')) { // Open today
    const start = moment(opening_hours[0].full + ' ' + opening_hours[0].start, 'DD/MM/YYYY hh:mma')
    const end = moment(opening_hours[0].full + ' ' + opening_hours[0].end, 'DD/MM/YYYY hh:mma')
    if (now.isAfter(start) && now.isBefore(end)) { // Currently Open
      open = true
      message = 'Open for ' + moment.duration(now.diff(end)).humanize()
      moment.locale('en', locale_short)
      time = moment.duration(now.diff(end)).humanize()
      moment.locale('en', locale_default)
    } else {
      if (now.isBefore(start)) { // Opening today
        message = 'Opening in ' + moment.duration(now.diff(start)).humanize()
        moment.locale('en', locale_short)
        time = moment.duration(now.diff(start)).humanize()
        moment.locale('en', locale_default)
      }
    }
  }
  if (!open && message === '') { //
    let x = 1
    while (x < opening_hours.length && message === '') {
      const start = moment(opening_hours[x].full + ' ' + opening_hours[x].start, 'DD/MM/YYYY ha')
      message = 'Opening in ' + moment.duration(now.diff(start)).humanize()
      moment.locale('en', locale_short)
      time = moment.duration(now.diff(start)).humanize()
      moment.locale('en', locale_default)
      x++
    }
  }
  return { open: open, message: message, time: time }
}

// getLocationTotalOpeningHours:
export function getLocationTotalOpeningHours (location) {
  let total = 0
  const opening_hours = getLocationOpeningHours(location)
  opening_hours.forEach(day => {
    total = total + parseFloat(day.hours_open)
  })
  return total
}

// getLocationTotalOpeningHoursDay:
export function getLocationTotalOpeningHoursDay (location, day) {
  let total = 0
  const opening_hours = getLocationOpeningHours(location)
  opening_hours.forEach(day => {
    if (day === day.day) total = total + parseFloat(day.hours_open)
  })
  return total
}

// getNearestLocation:
export function getNearestLocation (locations) {
  let nearest_location = null
  let duration = 1200
  locations.forEach(location => {
    if (location.travel &&
			location.travel['foot-walking'] &&
			parseInt(location.travel['foot-walking'].duration) < duration) {
      nearest_location = location
      duration = location.travel['foot-walking'].duration
    }
  })
  return nearest_location
}
