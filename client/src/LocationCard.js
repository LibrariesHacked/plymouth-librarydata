// React
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Material Icons
import Business from '@material-ui/icons/Business';
import DirectionsBike from '@material-ui/icons/DirectionsBike';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import Event from '@material-ui/icons/Event';
import LocationOn from '@material-ui/icons/LocationOn';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

// Our custom avatars
import LocationAvatar from './LocationAvatar';

// Helpers
import * as locationsHelper from './helpers/locations';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit / 2,
	},
	card: {
		border: '1px solid #e5e5e5',
		margin: '5px',
		borderRadius: '3px'
	},
	leftIcon: {
	},
	locationAvatar: {
		float: 'right',
		display: 'inline'
	},
	progress: {
		marginRight: theme.spacing.unit / 2
	},
	textMargin: {
		marginLeft: 10,
		marginRight: 10
	}
});

class LocationCard extends React.Component {
	state = {
		expanded: false
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
				<CardMedia
					component="img"
					alt="Library"
					className={classes.media}
					height="120"
					image="https://www.theplymouthdaily.co.uk/sites/default/files/field/image/central%20library%20plymouth.png"
					title="Library"
				/>
				<CardContent>
					<LocationAvatar className={classes.locationAvatar} location={location}/>
					<Typography variant="h5" component="h2">{location.name}</Typography>
					<Typography variant="caption" gutterBottom>
						{
							locationsHelper.checkLocationOpen(location, this.props.current_time).message
						}
					</Typography>
					{Object.keys(current_event).length > 0 ?
						<Chip
							avatar={<Avatar><Event /></Avatar>}
							color="primary"
							label={'Now: ' + current_event.title} /> :
						<Chip
							avatar={<Avatar><Event /></Avatar>}
							label={(Object.keys(next_event).length > 0 ? moment(next_event.date.start_date).format('dddd h:mma') + ': ' + next_event.title : '')} />
					}
				</CardContent>
				<CardActions>
					<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [14], [0], [0])}>
						<MoreHoriz className={classes.leftIcon} />
					</IconButton>
					<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [14], [0], [0])}>
						<LocationOn />
					</IconButton>
					<IconButton onClick={() => this.props.goTo([location.longitude, location.latitude], [18], [90], [120])}>
						<Business />
					</IconButton>
				</CardActions>
				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					<CardActions>
						<Button
							color={
								this.props.isochrones &&
									this.props.isochrones[location.name] &&
									this.props.isochrones[location.name]['foot-walking'] &&
									this.props.isochrones[location.name]['foot-walking'].selected ? 'primary' : 'secondary'}
							className={classes.button}
							aria-label="Directions Isochrone"
							onClick={() => this.props.toggleIsochrone(location.name, 'foot-walking')}>
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
							onClick={() => this.props.toggleIsochrone(location.name, 'cycling-regular')}>
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
							onClick={() => this.props.toggleIsochrone(location.name, 'driving-car')}>
							{this.props.isochrones &&
								this.props.isochrones[location.name] &&
								this.props.isochrones[location.name]['driving-car'] ?
								(this.props.isochrones[location.name]['driving-car'].retrieved ?
									<DirectionsCar className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
								) : <DirectionsCar className={classes.leftIcon} />}
							{location.driving_duration ? moment.duration(location.driving_duration, 'seconds').humanize() : ''}
						</Button>
					</CardActions>
				</Collapse>
			</Card>
		);
	}
}

LocationCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LocationCard);