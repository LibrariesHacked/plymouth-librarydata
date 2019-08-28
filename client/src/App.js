// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';

// Colours
import brown from '@material-ui/core/colors/brown';
import deepOrange from '@material-ui/core/colors/deepOrange';

// Material Icons
import ArrowBack from '@material-ui/icons/ArrowBack';
import BarChart from '@material-ui/icons/BarChart';
import Menu from '@material-ui/icons/Menu';

// Use moment for opening hours
import moment from 'moment';

// Custom components
import List from './List';
import Location from './Location';
import LocationAvatar from './LocationAvatar';
import LocationMap from './LocationMap';
import Organisation from './Organisation';
import Search from './Search';

// Helpers
import * as appdataHelper from './helpers/appdata';
import * as eventsHelper from './helpers/events';
import * as geoHelper from './helpers/geo';
import * as locationsHelper from './helpers/locations';
import * as isoHelper from './helpers/isochrones';

const drawerWidth = 330;

const theme = createMuiTheme({
	typography: {
		useNextVariants: true
	},
	palette: {
		primary: deepOrange,
		secondary: brown
	},
	locations: {
		central: 'rgb(143, 212, 0)',
		crownhill: 'rgb(236, 0, 140)',
		devonport: 'rgb(244, 170, 0)',
		efford: 'rgb(0, 120, 201)',
		estover: 'rgb(147, 37, 178)',
		northprospect: 'rgb(39, 189, 190)',
		peverell: 'rgb(0, 105, 62)',
		plympton: 'rgb(158, 27, 50)',
		plymstock: 'rgb(239, 130, 0)',
		southway: 'rgb(0, 58, 105)',
		stbudeaux: 'rgb(77, 48, 145)',
		westpark: 'rgb(233, 85, 37)'
	}
});

const styles = {
	appBar: {
		backgroundColor: 'rgba(255, 255, 255, 0)',
		zIndex: theme.zIndex.drawer + 1
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -10,
		marginLeft: -10
	},
	drawerPaper: {
		position: 'relative',
		width: drawerWidth,
		backgroundColor: 'rgba(255, 255, 255, 0.9)'
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	root: {
		height: '100%',
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		width: '100%'
	},
	toolbarPadding: theme.mixins.toolbar
};

class App extends Component {
	state = {
		// We either maintain data by GPS or by postcode search
		search_type: '',
		// Tracking of position and time
		current_time: moment(),
		time_update_interval: '',
		current_position: [],
		gps_available: false,
		position_update_interval: '',
		// The locations displayed in the system.
		locations: [],
		location_name: '',
		location_isochrones: {},
		// App Data
		facilities: [],
		travel_types: [],
		// Event data
		events: [],
		// Map variables, sent down to the map for updates.
		map_fit_bounds: null,
		map_position: [-4.1429, 50.3732],
		map_zoom: [12],
		map_pitch: [0],
		map_bearing: [0],
		// UI display variables
		loading: false,
		gps_loading: true,
		postcode_loading: true,
		main_drawer_open: true,
		list_drawer_open: true,
		location_drawer_open: false,
		organisation_drawer_open: false,
		// Location filtering
		filter: '',
		filter_type: '',
		filter_menu: false,
		filter_menu_anchor: null,
		open_tab: 0
	}

	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		this.getFacilities();
		this.getTravel();
		this.getEvents();

		this.getLocations('', false);

		let time_update_interval = setInterval(this.setCurrentTime, 30000);
		this.setState({ time_update_interval: time_update_interval });
	}

	// logPosition: Retrieve position from gps
	logPosition = (fit = false) => {
		this.setState({ loading: true, gps_loading: true });
		geoHelper.getCurrentPosition(position => {
			this.setState({ current_position: position, gps_loading: false, gps_available: (position.length > 0) });
			this.getLocations('gps', fit);
		});
	}

	// setCurrentTime: 
	setCurrentTime = () => this.setState({ current_time: moment() });

	// getLocations:
	getLocations = (search_type, fit = false, postcode = '') => {

		if (this.state.current_position && search_type !== 'postcode') {
			locationsHelper.getAllLocationsByCoords(this.state.current_position, results => {
				this.setState({ loading: false, locations: (results.locations || []) });
				if (fit) this.fitNearest();
			});
		} else if (search_type === 'postcode') {
			locationsHelper.getAllLocationsByPostcode(postcode, results => {
				this.setState({ loading: false, postcode_loading: false, locations: (results.locations || []), current_position: results.coordinates });
				if (fit) this.fitNearest();
			});
		} else { // Just get all the locations
			locationsHelper.getAllLocations(results => {
				this.setState({ loading: false, locations: (results.locations || []) });
				if (fit) this.fitBounds();
			});
		}
	};

	// getFacilities:
	getFacilities = () => appdataHelper.getFacilities(facilities => this.setState({ facilities: facilities }));

	// getTravel:
	getTravel = () => appdataHelper.getTravel(travel => this.setState({ travel_types: travel }));

	// getEvents:
	getEvents = () => eventsHelper.getEvents(events => this.setState({ events: events }));

	// toggleGPS
	toggleGPS = () => {
		// If we're already tracking GPS then turn this off
		if (this.state.search_type === 'gps') {
			clearInterval(this.state.position_update_interval);
			this.setState({ search_type: '', postcode: '', position_update_interval: null });
		} else {
			let position_update_interval = setInterval(this.logPosition, 10000);
			this.setState({ position_update_interval: position_update_interval, search_type: 'gps', postcode: '' });
			this.logPosition(true);
		}
	}

	// postcodeSearch
	postcodeSearch = (postcode) => {
		// If we're already tracking GPS then turn this off
		let new_state = { search_type: 'postcode', loading: true, postcode_loading: true };
		if (this.state.search_type === 'gps') {
			clearInterval(this.state.position_update_interval);
			new_state.position_update_interval = null;
		}
		this.setState(new_state);
		this.getLocations('postcode', true, postcode.toUpperCase());
	}

	// fitBounds
	fitBounds = () => {
		// If we fit to bounds we fit to all the locations
		var bounds = [];
		this.state.locations.forEach(location => {
			bounds.push([location.longitude, location.latitude])
		});
		this.setState({ map_fit_bounds: bounds });
	}

	// fitNearest: 
	fitNearest = () => {
		const nearest = locationsHelper.getNearestLocation(this.filterLocations(this.state.locations));
		if (nearest) {
			const current = this.state.current_position;
			const bounds = [current, [nearest.longitude, nearest.latitude]];
			this.setState({ map_fit_bounds: bounds });
		}
	}

	// getLocationIsochrones: fetches the underlying data for an isochrone
	getLocationIsochrones = (location_name) => {
		this.setState({ loading: true });
		let isochrones = this.state.location_isochrones;
		let received = [];
		if (isochrones[location_name]) received = Object.keys(isochrones[location_name]);
		if (!isochrones[location_name]) isochrones[location_name] = {};
		isoHelper.getAllLocationIsochrones(location_name, received, isos => {
			isos.forEach(iso => {
				isochrones[location_name][iso.travel] = { retrieved: true, selected: false, iso: iso.iso };
			});
			this.setState({ location_isochrones: isochrones, loading: false });
		});
	}

	// toggleIsochrone: turns a particular location travel type on or off
	toggleIsochrone = (location_name, travel) => {
		this.setState({ loading: true });
		let isochrones = this.state.location_isochrones;
		if (!isochrones[location_name]) isochrones[location_name] = {};
		if (!isochrones[location_name][travel]) {
			isochrones[location_name][travel] = { retrieved: false, selected: true, iso: null };
			this.setState({ isochrones: isochrones });
			isoHelper.getLocationIsochronesByType(location_name, [travel], iso => {
				isochrones[location_name][travel] = { retrieved: true, selected: true, iso: iso[0].iso };
				this.setState({ location_isochrones: isochrones, loading: false });
			});
		} else {
			isochrones[location_name][travel].selected = !isochrones[location_name][travel].selected;
			this.setState({ location_isochrones: isochrones, loading: false });
		}
	}

	filterLocations = (locations) => {
		return locations
			.filter(location => {
				let show = true;
				if (this.state.filter !== '' && this.state.filter_type === 'facility' && location.facilities.indexOf(this.state.filter) === -1) show = false;
				if (this.state.filter !== '' && this.state.filter_type === 'event' && this.state.events) {
					let found = false;
					this.state.events.forEach(event => {
						if (event.title === this.state.filter && event.location === location.location_name) found = true;
					});
					show = found;
				}
				return show;
			});
	}

	// Renders the main app
	render() {
		const { classes } = this.props;
		let locations = this.state.locations;
		locations.forEach(location => {
			location.currently_open = locationsHelper.checkLocationOpen(location);
		});
		locations = this.filterLocations(locations);
		const nearest_location = locationsHelper.getNearestLocation(locations);
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="absolute"
						color="default"
						elevation={0}
						className={classes.appBar}>
						<Toolbar>
							{this.state.list_drawer_open ?
								<Tooltip title={this.state.main_drawer_open ? 'Close list' : 'Open list'} aria-label="Menu">
									<Fab
										size="small"
										disabled={this.state.loading}
										color="secondary"
										className={classes.menuButton}
										aria-label="Menu"
										onClick={() => this.setState({ main_drawer_open: !this.state.main_drawer_open, list_drawer_open: true, location_drawer_open: false })}
									>
										{this.state.loading ?
											<CircularProgress
												color="secondary"
												size={20}
												className={classes.buttonProgress}
											/> : <Menu />}
									</Fab>
								</Tooltip>
								: null
							}
							{this.state.location_drawer_open || this.state.organisation_drawer_open ?
								<Tooltip title="Go back" aria-label="Back">
									<Fab
										size="small"
										color="secondary"
										className={classes.menuButton}
										aria-label="Back"
										onClick={() => this.setState({ main_drawer_open: true, location_drawer_open: false, organisation_drawer_open: false, list_drawer_open: true })} >
										<ArrowBack />
									</Fab>
								</Tooltip> : null
							}
							<span className={classes.flex}></span>
							<Search
								search_type={this.state.search_type}
								gps_available={this.state.gps_available}
								toggleGPS={this.toggleGPS}
								postcodeSearch={this.postcodeSearch}
							/>
							{locations && locations.length > 0 && nearest_location != null ?
								<LocationAvatar
									nearest={true}
									location={nearest_location}
									viewLocation={() => this.setState({ main_drawer_open: true, organisation_drawer_open: false, location_drawer_open: true, location_name: nearest_location.location_name, list_drawer_open: false })}
								/> : null
							}
							<Tooltip title={'Stats'}>
								<IconButton className={classes.button} color={'primary'} onClick={() => this.setState({ main_drawer_open: true, organisation_drawer_open: true, list_drawer_open: false })}><BarChart /></IconButton>
							</Tooltip>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="persistent"
						open={this.state.main_drawer_open}
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbarPadding}></div>
						{this.state.list_drawer_open ?
							<List
								filter={this.state.filter}
								filter_type={this.state.filter_type}
								filter_menu={this.state.filter_menu}
								filter_menu_anchor={this.state.filter_menu_anchor}
								open_tab={this.state.open_tab}
								current_time={this.state.current_time}
								locations={locations}
								facilities={this.state.facilities}
								travel_types={this.state.travel_types}
								events={this.state.events}
								isochrones={this.state.location_isochrones}
								toggleIsochrone={this.toggleIsochrone}
								goTo={(position, zoom, pitch, bearing) => this.setState({ map_position: position, map_zoom: zoom, map_pitch: pitch, map_bearing: bearing })}
								openFilter={(anchor) => this.setState({ filter_menu: true, filter_menu_anchor: anchor })}
								changeTab={(tab) => this.setState({ open_tab: tab })}
								viewLocation={(location_name) => this.setState({ main_drawer_open: true, location_drawer_open: true, location_name: location_name, list_drawer_open: false })}
								setFilter={(filter, filter_type) => this.setState({ filter: filter, filter_type: filter_type, filter_menu: false, filter_menu_anchor: null })}
								closeFilterMenu={() => this.setState({ filter_menu: false, filter_menu_anchor: null })}
							/> : null}
						{this.state.location_drawer_open ?
							<Location
								current_time={this.state.current_time}
								facilities={this.state.facilities}
								location={this.state.locations.find(location => { return location.location_name === this.state.location_name })}
								travel_types={this.state.travel_types}
								events={this.state.events.filter(event => event.location === this.state.location_name)}
								isochrones={this.state.location_isochrones}
								toggleIsochrone={this.toggleIsochrone}
								getIsochrones={(location_name) => this.getLocationIsochrones(location_name)}
								goTo={(position, zoom, pitch, bearing) => this.setState({ map_position: position, map_zoom: zoom, map_pitch: pitch, map_bearing: bearing })}
								close={() => this.setState({ main_drawer_open: true, location_drawer_open: false, list_drawer_open: true })}
							/> : null}
						{this.state.organisation_drawer_open ?
							<Organisation
								locations={this.state.locations}
								current_time={this.state.current_time}
								travel_types={this.state.travel_types}
								isochrones={this.state.location_isochrones}
								getIsochrones={(location_name) => this.getLocationIsochrones(location_name)}
								close={() => this.setState({ main_drawer_open: true, organisation_drawer_open: false, list_drawer_open: true })}
							/> : null}
					</Drawer>
					<LocationMap
						open_tab={this.state.open_tab}
						current_position={this.state.current_position}
						search_type={this.state.search_type}
						position={this.state.map_position}
						isochrones={this.state.location_isochrones}
						locations={locations}
						fit_bounds={this.state.map_fit_bounds}
						bearing={this.state.map_bearing}
						pitch={this.state.map_pitch}
						zoom={this.state.map_zoom}
						viewLocation={(location_name) => this.setState({ main_drawer_open: true, organisation_drawer_open: false, location_drawer_open: true, location_name: location_name, list_drawer_open: false })}
					/>
				</div>
			</MuiThemeProvider >
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App);