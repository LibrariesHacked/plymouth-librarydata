// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import * as icons from '@material-ui/icons';

// Helpers
import * as locationsHelper from './helpers/locations';
import { IconButton } from '@material-ui/core';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2
	}
})

class Facilities extends React.Component {
	state = {
	}

	render() {
		const { location } = this.props;
		const facilities = locationsHelper.getFacilities(location);
		return (
			<div>
				<ListSubheader>{'Facilities'}</ListSubheader>
				{facilities.map((facility, x) => {
					const Icon = icons[facility.icon];
					return (
						<Tooltip key={'tt_facility_' + x} title={facility.description}>
							<IconButton>
								{Icon ? <Icon /> : null}
							</IconButton>
						</Tooltip>
					)
				})}
				<Divider />
			</div>
		);
	}
}

Facilities.propTypes = {
	location: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Facilities);