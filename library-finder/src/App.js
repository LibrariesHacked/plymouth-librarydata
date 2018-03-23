import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import CssBaseline from 'material-ui/CssBaseline';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const styles = {
	root: {
		flexGrow: 1,
	}
};

class App extends Component {
	render() {
		return (
			<div>
				<CssBaseline />
				<AppBar position="static" color="default" elevation={0}>
					<Toolbar>
						<Typography variant="title" color="inherit">
							Plymouth Libraries
          				</Typography>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);