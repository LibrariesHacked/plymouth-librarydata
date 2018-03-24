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

const drawerWidth = 350;

const theme = createMuiTheme({
	palette: {
		primary: { main: 'rgb(143,212,0)', contrastText: '#fff' },
		secondary: { main: 'rgb(0,120,201)', contrastText: '#fff' }
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
		drawer_open: false
	}
	handleGPS = (e) => {

	}
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
							paper: classes.drawerPaper,
						}}
					>
						<div className={classes.toolbar} />
						<LibraryList />
					</Drawer>
					<main className={classes.content}>
						<div className={classes.libraryMap}>
							<LibraryMap />
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