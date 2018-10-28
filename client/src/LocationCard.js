// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import Business from '@material-ui/icons/Business';
import DirectionsBike from '@material-ui/icons/DirectionsBike';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import LocationOn from '@material-ui/icons/LocationOn';

// Our custom avatars
import LocationAvatar from './LocationAvatar';

// Helpers
import * as locationsHelper from './helpers/locations';

const styles = theme => ({
	button: {
		margin: 0,
	},
	leftIcon: {
		marginRight: theme.spacing.unit / 2,
	},
	progress: {
		marginRight: theme.spacing.unit / 2
	},
	card: {
		border: '1px solid #e5e5e5',
		margin: '5px',
		borderRadius: '3px'
	}
});

class LocationCard extends React.Component {
	state = {
	}

	render() {
		const { classes, location } = this.props;
		let current_event = {};
		let next_event = {};
		if (location.events) {
			location.events
				.forEach(event => {
					// Loop through times.
					event.dates.forEach(date => {
						// Is it currently happening?
						if (
							moment(date.start_date).isBefore(moment()) &&
							moment(date.endDate).isAfter(moment())
						) {
							current_event = event;
						}
						// Set next event
						if (Object.keys(next_event).length === 0) {
							next_event = event;
							next_event.date = date;
						} else {
							if (next_event.date.start_date > date.start_date) {
								next_event = event;
								next_event.date = date;
							}
						}
					});
				});
		}
		return (
			<Card className={classes.card} elevation={0}>
				<CardHeader
					avatar={
						<LocationAvatar
							location={location}
							viewLocation={this.props.more_option ? (() => this.props.viewLocation(location.name)) : null} />
					}
					action={
						<div>
							<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [14], [0], [0])}>
								<LocationOn />
							</IconButton>
							<br />
							<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [18], [90], [120])}>
								<Business />
							</IconButton>
						</div>
					}
					title={location.name}
					subheader={
						location.address_1 + '. ' +
						locationsHelper.checkLocationOpen(location, this.props.current_time).message + '. ' +
						(Object.keys(current_event).length > 0 ? 'Currently hosting ' + current_event.name + '. ' : '') +
						(Object.keys(next_event).length > 0 ? 'Next up, ' + next_event.title + '. ' : '')
					}
				/>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[location.name] &&
							this.props.isochrones[location.name]['foot-walking'] &&
							this.props.isochrones[location.name]['foot-walking'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(location.name, 'foot-walking')}>
					{this.props.isochrones &&
						this.props.isochrones[location.name] &&
						this.props.isochrones[location.name]['foot-walking'] ?
						(this.props.isochrones[location.name]['foot-walking'].retrieved ?
							<DirectionsWalk className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsWalk className={classes.leftIcon} />}
					{location.walking_duration ? moment.duration(location.walking_duration, 'seconds').humanize() : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[location.name] &&
							this.props.isochrones[location.name]['cycling-regular'] &&
							this.props.isochrones[location.name]['cycling-regular'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(location.name, 'cycling-regular')}>
					{this.props.isochrones &&
						this.props.isochrones[location.name] &&
						this.props.isochrones[location.name]['cycling'] ?
						(this.props.isochrones[location.name]['cycling'].retrieved ?
							<DirectionsBike className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsBike className={classes.leftIcon} />}
					{location.cycling_duration ? moment.duration(location.cycling_duration, 'seconds').humanize() : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[location.name] &&
							this.props.isochrones[location.name]['driving-car'] &&
							this.props.isochrones[location.name]['driving-car'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(location.name, 'driving-car')}>
					{this.props.isochrones &&
						this.props.isochrones[location.name] &&
						this.props.isochrones[location.name]['driving-car'] ?
						(this.props.isochrones[location.name]['driving-car'].retrieved ?
							<DirectionsCar className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsCar className={classes.leftIcon} />}
					{location.driving_duration ? moment.duration(location.driving_duration, 'seconds').humanize() : ''}
				</Button>
			</Card>
		);
	}
}

LocationCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LocationCard);