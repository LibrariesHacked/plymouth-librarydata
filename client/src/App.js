// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material Icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LocationSearching from '@material-ui/icons/LocationSearching';
import MenuIcon from '@material-ui/icons/Menu';
import MyLocation from '@material-ui/icons/MyLocation';

// Use moment for opening hours
import moment from 'moment';

// Custom components
import List from './List';
import Location from './Location';
import LocationMap from './LocationMap';

// Helpers
import * as locationsHelper from './helpers/locations';
import * as geoHelper from './helpers/geo';
import * as isoHelper from './helpers/isochrones';

const drawerWidth = 380;

const theme = createMuiTheme({
	palette: {
		primary: { main: 'rgb(143,212,0)', contrastText: '#fff' },
		secondary: { main: 'rgb(0,120,201)', contrastText: '#fff' }
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
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: 'rgba(255, 255, 255, 0)'
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -10,
		marginLeft: -10,
	},
	drawerPaper: {
		position: 'relative',
		width: drawerWidth,
		backgroundColor: 'rgba(255, 255, 255, 0.8)'
	},
	flex: {
		flex: 1,
	},
	header: {
		textAlign: 'right',
		padding: 16,
		color: 'rgba(143, 212, 0, 0.6)',
		fontWeight: 700
	},
	map: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: 'calc(100%)'
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	root: {
		height: '100%',
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		width: '100%',
	},
	toolBar: {
		backgroundColor: 'rgba(255, 255, 255, 0)'
	},
	toolbarPadding: theme.mixins.toolbar
};

class App extends Component {
	state = {
		loading: false,
		current_time: moment(),
		current_position: [],
		drawer_open: true,
		isochrones: {},
		location_drawer_open: false,
		locations: [],
		location_name: '',
		list_drawer_open: true,
		position_update_interval: '',
		search_type: 'gps', // gps or postcode.
		time_int: '',
		// Map variables, sent down to the map for updates.
		map_max_bounds: null,
		map_fit_bounds: null,
		map_position: [-4.1429, 50.3732], // Have central as centre
		map_zoom: [12], // Starting zoom level
		map_pitch: [0], // Starting pitch
		map_bearing: [0] // Starting bearing
	}

	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		this.getLocations();

		// Get a new position every minute
		let position_update_interval = setInterval(this.logPosition, 60000);
		this.setState({ position_update_interval: position_update_interval });

		// Update the current time every second. This is used in some views.
		let time_int = setInterval(this.setCurrentTime, 1000);
		this.setState({ time_int: time_int });
	};

	// setCurrentTime: 
	setCurrentTime = () => this.setState({ current_time: moment() });

	// logPosition: Retrieve position from gps
	logPosition = () => {
		this.setState({ loading: true }); // Show the loading indicator
		geoHelper.getCurrentPosition(position => {
			// Update 
		});
	}

	// getLocations:
	getLocations = () => {
		this.setState({ loading: true });
		geoHelper.getCurrentPosition(position => {
			locationsHelper.getAllLocations(position, locations => {
				this.setState({ loading: false, locations: locations });
			});
			// And fit map to bounds.
			this.fitLocationBounds();
		});
	};

	// 
	fitLocationBounds = () => {

	}

	// handleGPS:
	handleGPS = (e) => {

	}

	// getLocationIsochrones: fetches the underlying data for an isochrone
	getLocationIsochrones = (location_name) => {
		this.setState({ loading: true });
		let isochrones = this.state.isochrones;
		let received = [];
		if (isochrones[location_name]) received = Object.keys(isochrones[location_name]);
		if (!isochrones[location_name]) isochrones[location_name] = {};
		isoHelper.getAllLocationIsochrones(location_name, received, isos => {
			isos.forEach(iso => {
				isochrones[location_name][iso.travel] = { retrieved: true, selected: false, iso: iso.iso };
			});
			this.setState({ isochrones: isochrones, loading: false });
		});
	}

	// toggleIsochrone: turns a particular location travel type on or off
	toggleIsochrone = (location_name, travel) => {
		this.setState({ loading: true });
		let isochrones = this.state.isochrones;
		if (!isochrones[location_name]) isochrones[location_name] = {};
		if (!isochrones[location_name][travel]) {
			isochrones[location_name][travel] = { retrieved: false, selected: true, iso: null };
			this.setState({ isochrones: isochrones });
			isoHelper.getLocationIsochronesByType(location_name, [travel], iso => {
				isochrones[location_name][travel] = { retrieved: true, selected: true, iso: iso[0].iso };
				this.setState({ isochrones: isochrones, loading: false });
			});
		} else {
			isochrones[location_name][travel].selected = !isochrones[location_name][travel].selected;
			this.setState({ isochrones: isochrones, loading: false });
		}
	}

	// Renders the main app
	render() {
		const { classes } = this.props;
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="absolute"
						color="default"
						elevation={0}
						className={classes.appBar}>
						<Toolbar className={classes.toolBar}>
							{this.state.list_drawer_open ?
								<Button
									variant="fab"
									disabled={this.state.loading}
									mini
									color="secondary"
									className={classes.menuButton}
									aria-label="Menu"
									onClick={(e) => this.setState({ drawer_open: !this.state.drawer_open, list_drawer_open: true, location_drawer_open: false })}
								>
									{this.state.loading ?
										<CircularProgress
											size={20}
											className={classes.buttonProgress}
										/> : <MenuIcon />}
								</Button> : null
							}
							{this.state.location_drawer_open ?
								<Button variant="fab" mini color="secondary" className={classes.menuButton} aria-label="Menu" onClick={() => this.setState({ drawer_open: true, location_drawer_open: false, list_drawer_open: true })} >
									<ArrowBackIcon />
								</Button> : null
							}
							<Typography variant="title" color="inherit" className={classes.flex}></Typography>
							<Button
								variant="fab"
								mini
								disabled={this.state.current_position.length === 0}
								onClick={this.handleGPS}
								color="primary"
							>
								{this.state.current_position.length > 0 ? <MyLocation /> : <LocationSearching />}
							</Button>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="persistent"
						open={this.state.drawer_open}
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbarPadding}>
							<Typography variant="headline" className={classes.header}>Plymouth Libraries</Typography>
						</div>
						{this.state.list_drawer_open ?
							<List
								locations={this.state.locations}
								isochrones={this.state.isochrones}
								toggleIsochrone={this.toggleIsochrone}
								current_time={this.state.current_time}
								goTo={(position, zoom, pitch, bearing) => this.setState({ map_position: position, map_zoom: zoom, map_pitch: pitch, map_bearing: bearing })}
								viewLocation={(location_name) => this.setState({ drawer_open: true, location_drawer_open: true, location_name: location_name, list_drawer_open: false })}
							/> : null}
						{this.state.location_drawer_open ?
							<Location
								location={this.state.locations.find(location => { return location.name === this.state.location_name })}
								isochrones={this.state.isochrones}
								toggleIsochrone={this.toggleIsochrone}
								current_time={this.state.current_time}
								getIsochrones={(location_name) => this.getLocationIsochrones(location_name)}
								goTo={(position, zoom, pitch, bearing) => this.setState({ map_position: position, map_zoom: zoom, map_pitch: pitch, map_bearing: bearing })}
								close={() => this.setState({ drawer_open: true, location_drawer_open: false, list_drawer_open: true })}
							/> : null}
					</Drawer>
					<LocationMap
						position={this.state.map_position}
						isochrones={this.state.isochrones}
						locations={this.state.locations}
						max_bounds={this.state.map_max_bounds}
						fit_bounds={this.state.map_fit_bounds}
						bearing={this.state.map_bearing}
						pitch={this.state.map_pitch}
						zoom={this.state.map_zoom}
						viewLocation={(location_name) => this.setState({ drawer_open: true, location_drawer_open: true, location_name: location_name, list_drawer_open: false })}
					/>
				</div>
			</MuiThemeProvider >
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);