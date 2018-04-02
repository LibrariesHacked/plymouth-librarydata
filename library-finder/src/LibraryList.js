// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from 'material-ui/Avatar';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

// Material Icons
import FilterList from 'material-ui-icons/FilterList';
import LocationOn from 'material-ui-icons/LocationOn';
import MoreVert from 'material-ui-icons/MoreVert';
import Sort from 'material-ui-icons/Sort';
import DirectionsBike from 'material-ui-icons/DirectionsBike';
import DirectionsCar from 'material-ui-icons/DirectionsCar';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';

// Our custom avatars
import LibraryAvatar from './LibraryAvatar';

// Helpers
import * as libraries from './helpers/libraries';

// Use moment for opening hours
import moment from 'moment';


const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	progress: {
		margin: theme.spacing.unit * 2,
	},
});

class LibraryList extends React.Component {
	state = {
		open_tab: 0,
		sort: 'name',
		current_time: moment(),
		time_int: ''
	}
	setCurrentTime = () => {
		this.setState({ current_time: moment() });
	}
	componentDidMount = () => {
		let time_int = setInterval(this.setCurrentTime, 15000);
		this.setState({ time_int: time_int });
	}
	render() {
		const { classes } = this.props;
		return (
			<div>
				<Tabs
					fullWidth
					value={this.state.open_tab}
					indicatorColor="primary"
					textColor="primary"
					onChange={(event, value) => this.setState({ open_tab: value })}
				>
					<Tab label="Open" />
					<Tab label="Closed" />
				</Tabs>
				<Button className={classes.button} color="secondary">Sort<Sort className={classes.rightIcon} /></Button>
				<Button className={classes.button} color="secondary">Filter<FilterList className={classes.rightIcon} /></Button>
				{this.props.libraries
					.sort((lib_a, lib_b) => {
						if (this.state.sort === 'name') return lib_a.name.localeCompare(lib_b.name)
						return -1;
					})
					.filter(library => {
						let show = true;
						if (this.state.open_tab === 0 && !libraries.checkLibraryOpen(library, this.state.current_time).open) show = false;
						if (this.state.open_tab === 1 && libraries.checkLibraryOpen(library, this.state.current_time).open) show = false;
						return show;
					})
					.map(library => {
						return (
							<div>
								<Card className={classes.card} elevation={0}>
									<CardHeader
										avatar={
											<LibraryAvatar
												library={library} />
										}
										action={
											<div>
												<IconButton onClick={(e) => this.props.goTo([library.longitude, library.latitude])}>
													<LocationOn />
												</IconButton>
												<IconButton>
													<MoreVert />
												</IconButton>
											</div>
										}
										title={library.name}
										subheader={library.address_1}
									/>
									<CardContent>
										<Typography>{libraries.checkLibraryOpen(library, this.state.current_time).message}</Typography>
									</CardContent>
									<IconButton className={classes.button} aria-label="Directions Isochrone" onClick={(e) => this.props.toggleIsochrone(library.name, 'walking')}>
										{this.props.isochrones &&
											this.props.isochrones[library.name] &&
											this.props.isochrones[library.name]['walking'] ?
											(this.props.isochrones[library.name]['walking'].retrieved ?
												(this.props.isochrones[library.name]['walking'].selected ? <DirectionsWalk color="primary" /> : <DirectionsWalk />) : <CircularProgress className={classes.progress} size={30} />
											) : <DirectionsWalk />}
									</IconButton>
									<IconButton className={classes.button} aria-label="Directions Isochrone" onClick={(e) => this.props.toggleIsochrone(library.name, 'cycling')}>
										{this.props.isochrones &&
											this.props.isochrones[library.name] &&
											this.props.isochrones[library.name]['cycling'] ?
											(this.props.isochrones[library.name]['cycling'].retrieved ?
												(this.props.isochrones[library.name]['cycling'].selected ? <DirectionsBike color="primary" /> : <DirectionsBike />) : <CircularProgress className={classes.progress} size={30} />
											) : <DirectionsBike />}
									</IconButton>
									<IconButton className={classes.button} aria-label="Directions Isochrone" onClick={(e) => this.props.toggleIsochrone(library.name, 'driving')}>
										{this.props.isochrones &&
											this.props.isochrones[library.name] &&
											this.props.isochrones[library.name]['driving'] ?
											(this.props.isochrones[library.name]['driving'].retrieved ?
												(this.props.isochrones[library.name]['driving'].selected ? <DirectionsCar color="primary" /> : <DirectionsCar />) : <CircularProgress className={classes.progress} size={30} />
											) : <DirectionsCar />}
									</IconButton>
								</Card>
								<Divider />
							</div>)
					})}
			</div>
		);
	}
}

LibraryList.propTypes = {
	classes: PropTypes.object.isRequired,
	libraries: PropTypes.object.isRequired,
};

export default withStyles(styles)(LibraryList);