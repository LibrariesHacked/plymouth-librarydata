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
import LibraryList from './LibraryList';
import LibraryMap from './LibraryMap';
import LibraryView from './LibraryView';

// Helpers
import * as libHelper from './helpers/libraries';
import * as geoHelper from './helpers/geo';
import * as isoHelper from './helpers/isochrones';

const drawerWidth = 350;

const theme = createMuiTheme({
	palette: {
		primary: { main: 'rgb(143,212,0)', contrastText: '#fff' },
		secondary: { main: 'rgb(0,120,201)', contrastText: '#fff' }
	},
	libraries: {
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
	libraryMap: {
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
		current_location: [],
		drawer_open: true,
		isochrones: {},
		library_drawer_open: false,
		libraries: [],
		library_name: '',
		list_drawer_open: true,
		location_update_interval: '',
		search_type: 'gps',
		time_int: '',
		// Map variables, sent down to the map for updates.
		map_max_bounds: null,
		map_fit_bounds: null,
		map_location: [-4.142905038755941, 50.37316282100596], // Plymouth Central Library
		map_zoom: [12], // Starting Zoom level
		map_pitch: [0], // Starting pitch
		map_bearing: [0] // Starting bearing
	}
	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		this.getLibrariesStart();
		// Repeat every minute
		let location_update_interval = setInterval(this.logLocation, 60000);
		this.setState({ location_update_interval: location_update_interval });
		let time_int = setInterval(this.setCurrentTime, 1000);
		this.setState({ time_int: time_int });
	};
	// setCurrentTime: 
	setCurrentTime = () => this.setState({ current_time: moment() });
	// logLocation:
	logLocation = () => {
		this.setState({ loading: true });
		geoHelper.getCurrentLocation(location => {
			libHelper.updateLibraryLocations(location, this.state.libraries, libraries => {
				this.setState({ loading: false, libraries: libraries, current_location: location });
			})
		});
	}
	// getLibrariesStart:
	getLibrariesStart = () => {
		this.setState({ loading: true });
		geoHelper.getCurrentLocation(location => {
			libHelper.getAllLibraries(location, libraries => {
				this.setState({ loading: false, libraries: libraries });
			});
			// And fit map to bounds.
			this.fitLibraryBounds();
		});
	};
	fitLibraryBounds = () => {

	}
	// handleGPS:
	handleGPS = (e) => {

	}
	// getLibraryIsochrone: fetches the underlying data for a library isochrone
	getLibraryIsochrones = (library) => {
		this.setState({ loading: true });
		let isochrones = this.state.isochrones;
		let received = [];
		if (isochrones[library.name]) received = Object.keys(isochrones[library.name]);
		if (!isochrones[library.name]) isochrones[library.name] = {};
		isoHelper.getAllLibraryIsochrones(library, received, isos => {
			isos.forEach(iso => {
				isochrones[library.name][iso.travel] = { retrieved: true, selected: false, iso: iso.iso };
			});
			this.setState({ isochrones: isochrones, loading: false });
		});
	}
	// toggleIsochrone: turns a particular library and travel type on or off
	toggleIsochrone = (library, travel) => {
		this.setState({ loading: true });
		let isochrones = this.state.isochrones;
		if (!isochrones[library]) isochrones[library] = {};
		if (!isochrones[library][travel]) {
			isochrones[library][travel] = { retrieved: false, selected: true, iso: null };
			this.setState({ isochrones: isochrones });
			isoHelper.getLibraryIsochronesByType(library, [travel], iso => {
				isochrones[library][travel] = { retrieved: true, selected: true, iso: iso[0].iso };
				this.setState({ isochrones: isochrones, loading: false });
			});
		} else {
			isochrones[library][travel].selected = !isochrones[library][travel].selected;
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
									onClick={(e) => this.setState({ drawer_open: !this.state.drawer_open, list_drawer_open: true, library_drawer_open: false })}
								>
									{this.state.loading ?
										<CircularProgress
											size={20}
											className={classes.buttonProgress}
										/> : <MenuIcon />}
								</Button> : null
							}
							{this.state.library_drawer_open ?
								<Button variant="fab" mini color="secondary" className={classes.menuButton} aria-label="Menu" onClick={() => this.setState({ drawer_open: true, library_drawer_open: false, list_drawer_open: true })} >
									<ArrowBackIcon />
								</Button> : null
							}
							<Typography variant="title" color="inherit" className={classes.flex}></Typography>
							<Button
								variant="fab"
								mini
								disabled={this.state.current_location.length === 0}
								onClick={this.handleGPS}
								color="primary"
							>
								{this.state.current_location.length > 0 ? <MyLocation /> : <LocationSearching />}
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
							<LibraryList
								libraries={this.state.libraries}
								isochrones={this.state.isochrones}
								toggleIsochrone={this.toggleIsochrone}
								current_time={this.state.current_time}
								goTo={(location) => this.setState({ map_location: location })}
								viewLibrary={(library_name) => this.setState({ drawer_open: true, library_drawer_open: true, library_name: library_name, list_drawer_open: false })}
							/> : null}
						{this.state.library_drawer_open ?
							<LibraryView
								library={this.state.libraries.find(library => { return library.name === this.state.library_name })}
								isochrones={this.state.isochrones}
								toggleIsochrone={this.toggleIsochrone}
								current_time={this.state.current_time}
								getIsochrones={(library) => this.getLibraryIsochrones(library)}
								goTo={(location) => this.setState({ map_location: location })}
								close={() => this.setState({ drawer_open: true, library_drawer_open: false, list_drawer_open: true })}
							/> : null}
					</Drawer>
					<LibraryMap
						location={this.state.map_location}
						isochrones={this.state.isochrones}
						libraries={this.state.libraries}
						max_bounds={this.state.map_max_bounds}
						fit_bounds={this.state.map_fit_bounds}
						bearing={this.state.map_bearing}
						pitch={this.state.map_pitch}
						zoom={this.state.map_zoom}
						viewLibrary={(library_name) => this.setState({ drawer_open: true, library_drawer_open: true, library_name: library_name, list_drawer_open: false })}
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