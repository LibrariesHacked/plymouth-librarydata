// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as locationsHelper from './helpers/locations';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2
	}
});

class OpeningHours extends React.Component {
	state = {
	}

	render() {
		const { classes, location } = this.props;
		const opening_hours = locationsHelper.getLocationOpeningHours(location);
		const hours_total = locationsHelper.getLocationTotalOpeningHours(location);
		return (
			<div>
				<ListSubheader disableSticky>{'Open ' + hours_total + ' hours per week'}</ListSubheader>
				{opening_hours.map((day, x) => {
					return (
						<Chip
							key={'chp_openinghour_' + x}
							className={classes.chip}
							label={day.day_code + ' ' + (day.hours)}
							color={day.hours === 'Closed' ? 'default' : (x === 0 ? 'primary' : 'secondary')}
							avatar={<Avatar>{day.date}</Avatar>}
							variant="outlined"
						/>
					)
				})}
				<Divider />
			</div>
		);
	}
}

OpeningHours.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OpeningHours);