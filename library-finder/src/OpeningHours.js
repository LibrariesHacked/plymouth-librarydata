// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

// Material Icons

// Helpers
import * as libraries from './helpers/libraries';


// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
	},
});

class OpeningHours extends React.Component {
	state = {
	}
	render() {
		const { classes, library } = this.props;
		const opening_hours = libraries.getLibraryOpeningHours(library);
		const hours_total = libraries.getLibraryTotalOpeningHours(library);
		return (
			<div>
				<ListSubheader>{'Open ' + hours_total + ' hours per week'}</ListSubheader>
				<Divider />
				{opening_hours.map((day, x) => {
					return (
						<Chip
							className={classes.chip}
							label={day.day_code + ' ' + day.hours}
							color={x === 0 ? 'primary' : 'secondary'}
							avatar={<Avatar>{day.date}</Avatar>}
						/>
					)
				})}
			</div>
		);
	}
}

OpeningHours.propTypes = {
	classes: PropTypes.object.isRequired,
	library: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OpeningHours);