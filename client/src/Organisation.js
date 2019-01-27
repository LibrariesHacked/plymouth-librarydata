// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { fade } from '@material-ui/core/styles/colorManipulator';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

// Chart JS
import { HorizontalBar } from 'react-chartjs-2';

// Our components

// Helpers
import * as isoHelper from './helpers/isochrones';
import * as locationsHelper from './helpers/locations';

// Style: 
const styles = theme => ({
});

class Organisation extends React.Component {
	componentDidMount = () => {
		// When the component is loaded we trigger the isochrones download
		this.props.locations.forEach(location => {
			this.props.getIsochrones(location.location_name);
		});
	}
	state = {
		open_tab: 0
	}
	render() {
		const { theme, isochrones } = this.props;
		const total_hours = this.props.locations
			.map(loc => locationsHelper.getLocationTotalOpeningHours(loc))
			.reduce((a, b) => a + b, 0);
		const lib_hours = {
			labels: this.props.locations.map(loc => loc.location_name.replace(' Library', '')),
			datasets: [
				{
					backgroundColor: this.props.locations.map(loc => fade(theme.locations[loc.location_name.replace(' Library', '').replace(/ /g, '').toLowerCase()], 0.6)),
					data: this.props.locations.map(loc => locationsHelper.getLocationTotalOpeningHours(loc)),
				}
			]
		};
		return (
			<div>
				<ListSubheader disableSticky>{'Opening hours per week (total ' + total_hours + ')'}</ListSubheader>
				<HorizontalBar
					data={lib_hours}
					height={this.props.locations.length * 30}
					options={{
						maintainAspectRatio: true,
						legend: {
							display: false
						},
						scales: {
							xAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}}
				/>
				{this.props.travel_types.map(travel => {
					// For each travel type we want population within 30 mins
					let loc_values = Object.keys(this.props.isochrones).map(loc => {
						// Each object is a location
						if (this.props.isochrones[loc] && this.props.isochrones[loc][travel.travel_type]) {
							return {
								location: loc,
								properties: isoHelper.getIsochroneData(this.props.isochrones[loc][travel.travel_type].iso).find(p => p.value === 1800)
							}
						}
					}).filter(loc => (loc && loc.location))
					const lib_population = {
						labels: loc_values
							.map(loc => loc.location.replace(' Library', '')),
						datasets: [
							{
								backgroundColor: loc_values.map(loc => fade(theme.locations[loc.location.replace(' Library', '').replace(/ /g, '').toLowerCase()], 0.6)),
								data: loc_values.map(loc => (loc && loc.properties ? loc.properties.total_pop : 0)),
							}
						]
					};
					return (
						<div>
							<ListSubheader disableSticky>{travel.description + ' 30 min population'}</ListSubheader>
							<HorizontalBar
								data={lib_population}
								height={this.props.locations.length * 30}
								options={{
									maintainAspectRatio: true,
									legend: {
										display: false
									},
									scales: {
										xAxes: [{
											ticks: {
												beginAtZero: true
											}
										}]
									}
								}}
							/>
						</div>
					)
				})}
			</div>
		);
	}
}

Organisation.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Organisation);