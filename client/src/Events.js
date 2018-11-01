// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Material Icons
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Event from '@material-ui/icons/Event';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2,
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4,
	}
});

class Events extends React.Component {
	state = {
		event_open: ''
	}

	render() {
		const { classes, location } = this.props;
		const events = location.events || [];
		const categories = [];
		events.forEach(event => {
			if (event.categories) {
				event.categories.forEach(cat => {
					if (categories.indexOf(cat) === -1) categories.push(cat);
				});
			}
		});
		return (
			<div>
				<ListSubheader component="div">{'Events'}</ListSubheader>
				{categories.filter(cat => cat !== 'Libraries').map(cat => {
					return <Chip label={cat} className={classes.chip} />
				})}
				<List
					component="nav"
				>
					{events.map((event) => {
						return (
							<div>
								<ListItem button onClick={() => this.setState({ event_open: (this.state.event_open === event.title ? '' : event.title) })}>
									<ListItemText
										primary={event.title}
									/>
									{this.state.event_open === event.title ? <ExpandLess /> : <ExpandMore />}
								</ListItem>
								<Collapse in={this.state.event_open === event.title} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{event.dates.map(date => {
											return (
												<ListItem dense className={classes.nested}>
													<ListItemIcon>
														<Event />
													</ListItemIcon>
													<ListItemText
														primary={moment(date.start_date).format('ddd do MMM h:mma')}
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