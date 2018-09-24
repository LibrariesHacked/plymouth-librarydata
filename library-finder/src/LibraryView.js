// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Our components
import LibraryCard from './LibraryCard';
import LibraryStats from './LibraryStats';
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

class LibraryView extends React.Component {
	state = {
		open_tab: 0
	}
	componentDidMount = () => {
		// We need to get all the library isochrones
		this.props.getIsochrones(this.props.library);
	}
	render() {
		const { library } = this.props;
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
					onChange={(e, value) => this.setState({ open_tab: value })}
				>
					<Tab label="Details" />
					<Tab label="Stats" />
				</Tabs>
				{this.state.open_tab === 0 ?
					<OpeningHours
						library={library}
					/> : null}
				{this.state.open_tab === 1 ? 
					<LibraryStats
						library={this.props.library}
						isochrones={this.props.isochrones}
					/>: null}
			</div>
		);
	}
}

LibraryView.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LibraryView);