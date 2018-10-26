// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Helpers
import * as libraries from './helpers/libraries';
import { Typography } from '@material-ui/core';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
	}
});

class OpeningHours extends React.Component {
	state = {
		event_open: ''
	}
	render() {
		const { classes, library } = this.props;
		const events = library.events || [];
		return (
			<div>
				<List
					component="nav"
					subheader={<ListSubheader component="div">{'Events'}</ListSubheader>}
				>
					{events.map((event) => {
						return (
							<div>
								<ListItem button onClick={(e) => this.setState({ event_open: (this.state.event_open === event.title ? '' : event.title) })}>
									<ListItemText primary={event.title} />
									{this.state.event_open === event.title ? <ExpandLess /> : <ExpandMore />}
								</ListItem>
								<Collapse in={this.state.event_open === event.title} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{event.dates.map(date => {
											return (<ListItem button className={classes.nested}>
												<ListItemText 
													primary={moment(date.start_date).format('DD/MM/YYYY hh:mm')} 
													secondary={'Until ' + moment(date.end_date).format('DD/MM/YYYY hh:mm')}
												/>
											</ListItem>)
										})}
									</List>
								</Collapse>
							</div>
						)
					})}
				</List>
			</div>
		);
	}
}

OpeningHours.propTypes = {
	classes: PropTypes.object.isRequired,
	library: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OpeningHours);