// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

// Helpers
import * as libraries from './helpers/libraries';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
	}
});

class Facilities extends React.Component {
	state = {
	}
	render() {
		const { classes, library } = this.props;
		const facilities = libraries.getFacilities(library);
		return (
			<div>
				<ListSubheader>{'Facilities'}</ListSubheader>
				<Divider />
				{facilities.map((day, x) => {
					return (
						<Chip
							className={classes.chip}
							label={day.day_code + ' ' + day.hours}
							color={x === 0 ? 'primary' : 'secondary'}
						/>
					)
				})}
			</div>
		);
	}
}

Facilities.propTypes = {
	classes: PropTypes.object.isRequired,
	library: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Facilities);