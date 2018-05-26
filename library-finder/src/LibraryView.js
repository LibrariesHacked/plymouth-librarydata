// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Our components
import LibraryCard from './LibraryCard';
import OpeningHours from './OpeningHours';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	progress: {
		marginRight: theme.spacing.unit
	},
});

class LibraryView extends React.Component {
	state = {
		open_tab: 0
	}
	componentDidMount = () => {
	}
	render() {
		const { classes, library, theme } = this.props;
		return (
			<div>
				<LibraryCard
					library={library}
					current_time={this.props.current_time}
					more_option={false}
					isochrones={this.props.isochrones}
					toggleIsochrone={this.props.toggleIsochrone}
					goTo={this.props.goTo}
					viewLibrary={this.props.viewLibrary}
				/>
				<Tabs
					fullWidth
					value={this.state.open_tab}
					indicatorColor="primary"
					textColor="primary"
					onChange={(event, value) => this.setState({ open_tab: value })}
				>
					<Tab label="Details" />
					<Tab label="Stats" />
				</Tabs>
				<OpeningHours
						library={library}
					/>
				{this.state.open_tag === 0 ?
					<OpeningHours
						library={library}
					/>
					: null}
				{this.state.open_tag === 1 ? null : null}
			</div>
		);
	}
}

LibraryView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LibraryView);