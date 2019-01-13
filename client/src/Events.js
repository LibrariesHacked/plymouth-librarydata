// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

// Material Icons
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Event from '@material-ui/icons/Event';
import OpenInNew from '@material-ui/icons/OpenInNew';

// Style: 
const styles = theme => ({
	chip: {
		margin: theme.spacing.unit / 2
	},
	eventList: {
		backgroundColor: 'white',
		border: '1px solid #e5e5e5',
		margin: 5,
		borderRadius: theme.shape.borderRadius,
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4
	}
});

class Events extends React.Component {
	state = {
		event_open: '',
		categories_inactive: []
	}

	// toggleCategory: 
	toggleCategory = (category) => {
		let categories_inactive = this.state.categories_inactive;
		const index = categories_inactive.indexOf(category);
		if (index === -1) categories_inactive.push(category);
		if (index !== -1) categories_inactive.splice(index, 1);
		this.setState({ categories_inactive: categories_inactive });
	}

	// 
	render() {
		const { classes, events } = this.props;
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
				{categories
					.filter(cat => cat !== 'Libraries')
					.map((cat, z) => {
						const active = (this.state.categories_inactive.indexOf(cat) === -1);
						return (
							<Tooltip title={cat} key={'tt_cat_' + z}>
								<Chip
									avatar={<Avatar>{active ? <Check /> : <Close />}</Avatar>}
									label={cat}
									color={active ? 'primary' : 'default'}
									onClick={() => this.toggleCategory(cat)}
									className={classes.chip}
								/>
							</Tooltip>);
					})}
				<List
					className={classes.eventList}
					component="nav">
					{events
						.filter(event => {
							let show = false;
							event.categories.forEach(cat => {
								if (this.state.categories_inactive.indexOf(cat) === -1 && cat !== 'Libraries') show = true;
							});
							return show;
						})
						.map((event, y) => {
							return (
								<div key={'div_event_' + y}>
									<ListItem button onClick={() => this.setState({ event_open: (this.state.event_open === event.title ? '' : event.title) })}>
										{this.state.event_open === event.title ? <ExpandLess /> : <ExpandMore />}
										<ListItemText
											primary={event.title} />
										<ListItemSecondaryAction>
										<Tooltip title="Go to website">
											<IconButton color="secondary" onClick={() => window.open(event.url)}>
												<OpenInNew />
											</IconButton>
										</Tooltip>
										</ListItemSecondaryAction>
									</ListItem>
									<Collapse in={this.state.event_open === event.title} timeout="auto" unmountOnExit>
										<List component="div" disablePadding>
											{event.dates // Only show the next two months
												.filter(date => moment(date.start_date, 'YYYY-MM-DDTHH:mm:ss+00:00').isBefore(moment().add(2, 'months')))
												.map((date, x) => {
													return (
														<ListItem
															dense
															key={'li_date_' + x}
															className={classes.nested}>
															<ListItemIcon>
																<Event />
															</ListItemIcon>
															<ListItemText
																primary={moment(date.start_date, 'YYYY-MM-DDTHH:mm:ss+00:00').format('ddd Do MMM h:mma')}
															/>
														</ListItem>)
												})}
										</List>
									</Collapse>
								</div>
							)
						})}
				</List>
				<Divider />
			</div>
		);
	}
}

Events.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Events);