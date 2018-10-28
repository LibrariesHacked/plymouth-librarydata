// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
	}
});

class Events extends React.Component {
	state = {
		event_open: ''
	}

	render() {
		const { classes, location } = this.props;
		const events = location.events || [];
		return (
			<div>
				<List
					component="nav"
					subheader={<ListSubheader component="div">{'Events'}</ListSubheader>}
				>
					{events.map((event) => {
						return (
							<div>
								<ListItem button onClick={() => this.setState({ event_open: (this.state.event_open === event.title ? '' : event.title) })}>
									<ListItemText primary={event.title} />
									{this.state.event_open === event.title ? <ExpandLess /> : <ExpandMore />}
								</ListItem>
								<Collapse in={this.state.event_open === event.title} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{event.dates.map(date => {
											return (<ListItem button className={classes.nested}>
												<ListItemText
													primary={moment(date.start_date).format('DD/MM/YYYY HH:mm')}
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

Events.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Events);