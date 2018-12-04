// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Helpers
import * as locationsHelper from './helpers/locations';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
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
				<ListSubheader>{'Opening hours'}</ListSubheader>
				{opening_hours.map((day, x) => {
					return (
						<Chip
							key={'chp_openinghour_' + x}
							className={classes.chip}
							label={day.day_code + ' ' + (day.hours === 'closed' ? ' closed' : (day.start + ' - ' + day.end))}
							color={day.hours === 'closed' ? 'default' : (x === 0 ? 'primary' : 'secondary')}
							avatar={<Avatar>{day.date}</Avatar>}
						/>
					)
				})}
				<br/>
				<Typography variant="caption">{hours_total + ' per week'}</Typography>
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