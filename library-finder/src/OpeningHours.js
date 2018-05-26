// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import Event from '@material-ui/icons/Event';
import EventAvailable from '@material-ui/icons/EventAvailable';
import EventBusy from '@material-ui/icons/EventBusy';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({

});

// Days of the week
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

class OpeningHours extends React.Component {
	state = {
		opening_hours_open: false
	}
	render() {
		const { classes, library } = this.props;
		const opening_hours = libraries.getLibraryOpeningHours(library);
		return (
			<List dense={true}>
				<ListItem button onClick={() => this.setState({ opening_hours_open: !this.state.opening_hours_open })}>
					<ListItemIcon>
						<Event />
					</ListItemIcon>
					<ListItemText inset primary="View opening hours" />
					{this.state.opening_hours_open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={this.state.opening_hours_open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding dense={true}>
						{Object.keys(days).map(day => {
							return (
								<ListItem>
									{opening_hours[days[day]] !== 'closed' ?
										<EventAvailable color="primary" /> : <EventBusy />}
									<ListItemText
										primary={days[day].charAt(0).toUpperCase() + days[day].slice(1)}
										secondary={opening_hours[days[day]]}
									/>
								</ListItem>
							)
						})}
					</List>
				</Collapse>
			</List>
		);
	}
}

OpeningHours.propTypes = {
	classes: PropTypes.object.isRequired,
	library: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OpeningHours);