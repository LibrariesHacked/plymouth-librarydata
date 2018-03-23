import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import CssBaseline from 'material-ui/CssBaseline';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

// Custom components
import LibraryMap from './LibraryMap';

const styles = {
	root: {
		height: '100%'
	},
	libraryMap: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		height: 'calc(100% - 63px)'
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	}
};

const theme = createMuiTheme({
	palette: {
		primary: { main: 'rgb(143,212,0)', contrastText: '#fff' },
		secondary: { main: 'rgb(0,120,201)', contrastText: '#fff' }
	}
});

class App extends Component {
	render() {
		const { classes } = this.props;
		return (
			<MuiThemeProvider theme={theme}>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="static" color="primary" elevation={0}>
						<Toolbar>
							<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
								<MenuIcon />
							</IconButton>
							<Typography variant="title" color="inherit">
								Plymouth Libraries
          				</Typography>
						</Toolbar>
					</AppBar>
					<div className={classes.libraryMap}>
						<LibraryMap />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);