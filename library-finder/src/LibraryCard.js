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
import DirectionsBike from '@material-ui/icons/DirectionsBike';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';
import LocationOn from '@material-ui/icons/LocationOn';

// Our custom avatars
import LibraryAvatar from './LibraryAvatar';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({
	button: {
		margin: 0,
	},
	leftIcon: {
		marginRight: theme.spacing.unit / 2,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit / 2,
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

class LibraryCard extends React.Component {
	state = {
	}
	componentDidMount = () => {
	}
	render() {
		const { classes, library } = this.props;
		return (
			<Card className={classes.card} elevation={0}>
				<CardHeader
					avatar={
						<LibraryAvatar
							library={library}
							selectLibrary={this.props.more_option ? (() => this.props.viewLibrary(library.name)) : null} />
					}
					action={
						<IconButton onClick={(e) => this.props.goTo([library.longitude, library.latitude])}>
							<LocationOn />
						</IconButton>
					}
					title={library.name}
					subheader={library.address_1 + '. ' + libraries.checkLibraryOpen(library, this.props.current_time).message}
				/>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['foot-walking'] &&
							this.props.isochrones[library.name]['foot-walking'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'foot-walking')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['foot-walking'] ?
						(this.props.isochrones[library.name]['foot-walking'].retrieved ?
							<DirectionsWalk className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsWalk className={classes.leftIcon} />}
					{library.walking_duration ? moment.duration(library.walking_duration, 'seconds').humanize() : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['cycling-regular'] &&
							this.props.isochrones[library.name]['cycling-regular'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'cycling-regular')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['cycling'] ?
						(this.props.isochrones[library.name]['cycling'].retrieved ?
							<DirectionsBike className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsBike className={classes.leftIcon} />}
					{library.cycling_duration ? moment.duration(library.cycling_duration, 'seconds').humanize() : ''}
				</Button>
				<Button
					color={
						this.props.isochrones &&
							this.props.isochrones[library.name] &&
							this.props.isochrones[library.name]['driving-car'] &&
							this.props.isochrones[library.name]['driving-car'].selected ? 'primary' : 'secondary'}
					className={classes.button}
					aria-label="Directions Isochrone"
					onClick={(e) => this.props.toggleIsochrone(library.name, 'driving-car')}>
					{this.props.isochrones &&
						this.props.isochrones[library.name] &&
						this.props.isochrones[library.name]['driving-car'] ?
						(this.props.isochrones[library.name]['driving-car'].retrieved ?
							<DirectionsCar className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
						) : <DirectionsCar className={classes.leftIcon} />}
					{library.driving_duration ? moment.duration(library.driving_duration, 'seconds').humanize() : ''}
				</Button>
			</Card>
		);
	}
}

LibraryCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LibraryCard);