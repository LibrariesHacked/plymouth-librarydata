// React
import { Bar } from 'react-chartjs-2';
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

import * as isoHelper from './helpers/isochrones';

// Style: 
const styles = theme => ({

});

class Stats extends React.Component {
	componentDidMount = () => {
		this.props.getIsochrones(this.props.location);
	}

	render() {
		const { location, isochrones, theme } = this.props;
		return (
			<div>
				{isochrones && isochrones[location.name] ?
					Object.keys(isochrones[location.name])
						.map(travel => {
							let iso_data = isoHelper.getIsochroneData(isochrones[location.name][travel].iso);
							let data_labels = iso_data.map(f => { return (f.value / 60) + ' mins' });
							let data_values = iso_data.map(f => { return f.total_pop });
							return (
								<div>
									<ListSubheader>{(isoHelper.getIsochroneConfig())[travel].display + ' distance population'}</ListSubheader>
									<br />
									<Bar
										data={
											{
												labels: data_labels,
												datasets: [{
													label: 'Population',
													data: data_values,
													backgroundColor: theme.locations[location.name.replace(' Library', '').replace(/ /g, '').toLowerCase()],
													borderColor: 'rgba(255, 255, 255, 1)',
													borderWidth: 1
												}]
											}
										}
										height={150}
										options={{
											maintainAspectRatio: true,
											legend: {
												display: false
											}
										}}
									/>
								</div>
							)
						}) : null}
			</div>
		);
	}
}

Stats.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Stats);