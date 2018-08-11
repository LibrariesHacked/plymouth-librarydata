// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import Event from '@material-ui/icons/Event';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({

});

class OpeningHours extends React.Component {
	state = {
		opening_hours_open: false
	}
	render() {
		const { library } = this.props;
		const opening_hours = libraries.getLibraryOpeningHours(library);
		return (
			<List dense={true}>
				<ListItem button onClick={() => this.setState({ opening_hours_open: !this.state.opening_hours_open })}>
					<ListItemIcon>
						<Event />
					</ListItemIcon>
					<ListItemText inset primary="Next week opening hours" />
					{this.state.opening_hours_open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={this.state.opening_hours_open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding dense={true}>
						{opening_hours.map(day => {
							return (
								<ListItem>
									<Avatar>{day.date}</Avatar>
									<ListItemText
										primary={day.day.charAt(0).toUpperCase() + day.day.slice(1) + '. ' + day.hours}
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