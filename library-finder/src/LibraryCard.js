// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Material Icons
import LocationOn from '@material-ui/icons/LocationOn';
import MoreVert from '@material-ui/icons/MoreVert';
import DirectionsBike from '@material-ui/icons/DirectionsBike';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';

// Our custom avatars
import LibraryAvatar from './LibraryAvatar';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	leftIcon: {
		marginRight: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	progress: {
		marginRight: theme.spacing.unit
	},
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
							library={library} />
					}
					action={
						<div>
							{this.props.more_option ?
								<div>
									<IconButton onClick={() => this.props.viewLibrary(library.name)}>
										<MoreVert />
									</IconButton>
									<br />
								</div> : null}
							<IconButton onClick={(e) => this.props.goTo([library.longitude, library.latitude])}>
								<LocationOn />
							</IconButton>
						</div>
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
					{library.walking_duration ? Math.round(library.walking_duration / 60) : ''}
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
					{library.cycling_duration ? Math.round(library.cycling_duration / 60) : ''}
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
					{library.driving_duration ? Math.round(library.driving_duration / 60) : ''}
				</Button>
			</Card>
		);
	}
}

LibraryCard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LibraryCard);