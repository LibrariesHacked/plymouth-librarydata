// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import AppBar from 'material-ui/AppBar';
import CssBaseline from 'material-ui/CssBaseline';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// Material Icons
import MenuIcon from 'material-ui-icons/Menu';
import MyLocation from 'material-ui-icons/MyLocation';

// Custom components
import LibraryList from './LibraryList';
import LibraryMap from './LibraryMap';
import PostcodeSearch from './PostcodeSearch';

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
		central: 'rgb(143,212,0)',
		crownhill: 'rgb(236,0,140)',
		devonport: 'rgb(244,170,0)',
		efford: 'rgb(0,120,201)',
		estover: 'rgb(147,37,178)',
		northprospect: 'rgb(39,189,190)',
		peverell: 'rgb(0,105,62)',
		plympton: 'rgb(158,27,50)',
		plymstock: 'rgb(239,130,0)',
		southway: 'rgb(0,58,105)',
		stbudeaux: 'rgb(77,48,145)',
		westpark: 'rgb(233,85,37)'
	}
});

const styles = {
	root: {
		height: '100%'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		minWidth: 0
	},
	drawerPaper: {
		position: 'relative',
		width: drawerWidth,
	},
	flex: {
		flex: 1,
	},
	libraryMap: {
		position: 'absolute',
		top: 63,
		width: '100%',
		height: 'calc(100% - 63px)'
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	toolbar: theme.mixins.toolbar
};

class App extends Component {
	state = {
		location_update_interval: '',
		map_location: [],
		drawer_open: true,
		libraries: [],
		isochrones: {}
	}
	// componentDidMount: sets up data and any logging
	componentDidMount = () => {
		this.getLibrariesStart();
		// Repeat every minute
		let location_update_interval = setInterval(this.logLocation, 60000);
		this.setState({ location_update_interval: location_update_interval });
	};
	// logLocation:
	logLocation = () => {
		geoHelper.getCurrentLocation(location => libHelper.updateLibraryLocations(location, this.state.libraries, libraries => this.setState({ libraries: libraries })));
	}
	// getLibrariesStart:
	getLibrariesStart = () => {
		geoHelper.getCurrentLocation(location => libHelper.getAllLibraries(location, libraries => this.setState({ libraries: libraries })));
	}
	// handleGPS:
	handleGPS = (e) => {

	}
	// toggleIsochrone: turns a particular library and travel type on or off
	toggleIsochrone = (library, travel) => {
		let isochrones = this.state.isochrones;
		if (!isochrones[library]) isochrones[library] = {};
		if (!isochrones[library][travel]) {
			isochrones[library][travel] = { retrieved: false, selected: true, iso: null };
			this.setState({ isochrones: isochrones });
			isoHelper.getLibraryIsochrone(library, travel, iso => {
				isochrones[library][travel] = { retrieved: true, selected: true, iso: iso };
				this.setState({ isochrones: isochrones });
			});
		} else {
			isochrones[library][travel].selected = !isochrones[library][travel].selected;
			this.setState({ isochrones: isochrones });
		}
	}
	// Renders the main app
	render() {
		const { classes } = this.props;
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="absolute" color="primary" elevation={0} className={classes.appBar}>
						<Toolbar>
							<IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={(e) => this.setState({ drawer_open: !this.state.drawer_open })} >
								<MenuIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>Libraries</Typography>
							<PostcodeSearch />
							<IconButton
								onClick={this.handleGPS}
								color="inherit"
							>
								<MyLocation />
							</IconButton>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="persistent"
						open={this.state.drawer_open}
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<LibraryList
							libraries={this.state.libraries}
							isochrones={this.state.isochrones}
							toggleIsochrone={this.toggleIsochrone}
							goTo={(location) => this.setState({ map_location: location })} />
					</Drawer>
					<main className={classes.content}>
						<div className={classes.libraryMap}>
							<LibraryMap
								location={this.state.map_location}
								isochrones={this.state.isochrones}
								libraries={this.state.libraries} />
						</div>
					</main>
				</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);