// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import * as icons from '@material-ui/icons';

// Style: 
const styles = theme => ({
})

class Facilities extends React.Component {
	render() {
		const { location } = this.props;
		let facilities = [];
		if (location.facilities) {
			location.facilities.forEach(facility => {
				this.props.facilities.forEach(def => {
					if (def.facility_name === facility) {
						facilities.push({ name: facility, icon: def.icon, description: def.description });
					}
				});
			});
		}
		return (
			<div>
				<ListSubheader disableSticky>{'Facilities'}</ListSubheader>
				{facilities.map((facility, x) => {
					const Icon = icons[facility.icon];
					return (
						<Tooltip key={'tt_facility_' + x} disableHoverListener title={facility.description}>
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