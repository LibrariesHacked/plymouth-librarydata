// React
import { Bar } from 'react-chartjs-2';
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

import * as isoHelper from './helpers/isochrones';

// Style: 
const styles = theme => ({

});

class LibraryStats extends React.Component {
	render() {
		const { library, isochrones, theme } = this.props;
		return (
			<div>
				{isochrones && isochrones[library.name] ?
					Object.keys(isochrones[library.name])
						.map(travel => {
							let iso_data = isoHelper.getIsochroneData(isochrones[library.name][travel].iso);
							let data_labels = iso_data.map(f => { return (f.value / 60) + ' mins' });
							let data_values = iso_data.map(f => { return f.total_pop });
							return (
								<div>
									<ListSubheader>{(isoHelper.getIsochroneConfig())[travel].display + ' distance population'}</ListSubheader>
									<br/>
									<Bar
										data={
											{
												labels: data_labels,
												datasets: [{
													label: 'Population',
													data: data_values,
													backgroundColor: theme.libraries[library.name.replace(' Library', '').replace(/ /g, '').toLowerCase()],
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

LibraryStats.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LibraryStats);