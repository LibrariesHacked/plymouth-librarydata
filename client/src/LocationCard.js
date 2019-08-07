// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material Icons
import Business from '@material-ui/icons/Business';
import LocationOn from '@material-ui/icons/LocationOn';

// Icons
import * as icons from '@material-ui/icons';

// Our custom avatars
import LocationAvatar from './LocationAvatar';

// Helpers
import * as locationsHelper from './helpers/locations';

const styles = theme => ({
	avatar: {
		paddingRight: 10
	},
	card: {
		border: '1px solid #e5e5e5',
		margin: 10,
		borderRadius: theme.shape.borderRadius
	},
	cardHeader: {
		display: 'flex'
	},
	flex: {
		flex: 1
	},
	locationHeader: {
		marginLeft: 10
	},
	message: {
    	color: theme.palette.text.secondary,
		fontFamily: theme.typography.fontFamily,
		fontWeight: theme.typography.fontWeightMedium,
		fontSize: theme.typography.pxToRem(14),
	},
	progress: {
		marginRight: theme.spacing.unit / 2
	},
	title: {
		fontSize: 14
	}
});

class LocationCard extends React.Component {
	state = {
		expanded: false
	}
	render() {
		const { classes, location, events } = this.props;
		let current_event = {};
		let next_event = {};
		let event_message = 'No events coming up';
		if (events) {
			events
				.forEach(event => {
					// Loop through times.
					event.dates.forEach(date => {
						// Is it currently happening?
						if (
							moment(date.start_date).isBefore(this.props.current_time) &&
							moment(date.end_date).isAfter(this.props.current_time)
						) {
							current_event = event;
							event_message = current_event.title + ' ' + moment(date.end_date).fromNow();
						}
						// Set next event
						if (moment(date.start_date).isAfter(this.props.current_time)) {
							if (Object.keys(next_event).length === 0) {
								next_event = event;
								next_event.date = date;
								event_message = next_event.title + ' ' + moment(date.start_date).fromNow();
							} else {
								if (next_event.date.start_date > date.start_date) {
									next_event = event;
									next_event.date = date;
									event_message = next_event.title + ' ' + moment(date.start_date).fromNow();
								}
							}
						}
					});
				});
		}
		const event_available = ((Object.keys(current_event).length > 0 || Object.keys(next_event).length > 0) ? true : false);
		// travel time string
		let travel_messages = {};
		let travel_durations = {};
		if (this.props.travel_types && location.travel && Object.keys(location.travel).length > 0) {
			this.props.travel_types.forEach(travel => {
				if (location.travel[travel.travel_type]) {
					const duration = parseInt(location.travel[travel.travel_type].duration);
					const duration_human = moment.duration(duration, 'minutes').humanize();
					travel_messages[travel.travel_type] = (duration_human + ' ' + travel.description.toLowerCase());
					travel_durations[travel.travel_type] = duration;
				}
			});
		}
		const location_opening = locationsHelper.checkLocationOpen(location);
		return (
			<Card className={classes.card} elevation={0}>
				<CardContent>
					<div className={classes.cardHeader}>
						<div className={classes.avatar}>
							<LocationAvatar location={location} viewLocation={() => this.props.viewLocation(location.location_name)} />
						</div>
						<Typography className={classes.locationHeader} variant="h6" color="secondary" gutterBottom>{location.location_name}</Typography>
					</div>
					<Typography className={classes.message}>{location_opening.message + '. ' + event_message}</Typography>
				</CardContent>
				<CardActions disableActionSpacing>
					<Tooltip title="Move to location position">
						<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [12], [0], [0])}>
							<LocationOn />
						</IconButton>
					</Tooltip>
					<Tooltip title="Show building">
						<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [18], [90], [120])}>
							<Business />
						</IconButton>
					</Tooltip>
					{
						this.props.travel_types.map(travel => {
							const Icon = icons[travel.icon];
							return (
								<Tooltip
									title={travel_messages && travel_messages[travel.travel_type] ?
										travel_messages[travel.travel_type] : ''}>
									<IconButton
										color={
											this.props.isochrones &&
												this.props.isochrones[location.location_name] &&
												this.props.isochrones[location.location_name][travel.travel_type] &&
												this.props.isochrones[location.location_name][travel.travel_type].selected ? 'primary' : 'default'}
										onClick={() => this.props.toggleIsochrone(location.location_name, travel.travel_type)}>
										<Badge
											invisible={travel_durations && travel_durations[travel.travel_type] ? false : true}
											variant={travel_durations && travel_durations[travel.travel_type] && travel_durations[travel.travel_type] <= 60 ? 'standard' : 'dot'}
											badgeContent={travel_durations && travel_durations[travel.travel_type] ? travel_durations[travel.travel_type] : null}
											color="secondary"
											max={60}>
											{this.props.isochrones &&
												this.props.isochrones[location.location_name] &&
												this.props.isochrones[location.location_name][travel.travel_type] ?
												(this.props.isochrones[location.location_name][travel.travel_type].retrieved ?
													<Icon /> : <CircularProgress className={classes.progress} size={30} />
												) : <Icon />}
										</Badge>
									</IconButton>
								</Tooltip>)
						})
					}
				</CardActions>
			</Card>
		);
	}
}

LocationCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LocationCard);