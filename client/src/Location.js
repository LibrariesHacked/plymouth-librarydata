// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Our components
import Events from './Events';
import Facilities from './Facilities';
import LocationCard from './LocationCard';
import Stats from './Stats';
import OpeningHours from './OpeningHours';

// Style: 
const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	progress: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	}
});

class Location extends React.Component {
	state = {
		open_tab: 0
	}
	render() {
		const { location } = this.props;
		return (
			<div>
				<LocationCard
					location={location}
					current_time={this.props.current_time}
					more_option={false}
					isochrones={this.props.isochrones}
					toggleIsochrone={this.props.toggleIsochrone}
					goTo={this.props.goTo}
					viewLocation={this.props.viewLocation}
				/>
				<Tabs
					fullWidth
					value={this.state.open_tab}
					indicatorColor="primary"
					textColor="primary"
					onChange={(e, value) => this.setState({ open_tab: value })}
				>
					<Tab label="Details" />
					<Tab label="Stats" />
				</Tabs>
				{this.state.open_tab === 0 ?
					<div>
						<Facilities location={location} />
						<OpeningHours location={location} />
						<Events  location={location} />
					</div> : null}
				{this.state.open_tab === 1 ? 
					<Stats
						getIsochrones={this.props.getIsochrones}
						location={this.props.location}
						isochrones={this.props.isochrones}
					/>: null}
			</div>
		);
	}
}

Location.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Location);