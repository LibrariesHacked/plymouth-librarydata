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
import Menu, { MenuItem } from 'material-ui/Menu';
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

class LibraryList extends React.Component {
	state = {
		open_tab: 0,
		sort: 'name',
		sort_menu: false,
		sort_menu_anchor: null,
		actions_menu: false,
		actions_menu_anchor: null,
		filter: '',
		filter_menu: false,
		filter_menu_anchor: null,
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
				<Menu // Menu used to sort libraries
					id="menu-librarysort"
					anchorEl={this.state.sort_menu_anchor}
					open={this.state.sort_menu}
					onClose={(e) => this.setState({ sort_menu: false, sort_menu_anchor: null })}
				>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'name' })}>Library name</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'walking' })}>Walking time</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'cycling' })}>Cycling time</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'driving' })}>Driving time</MenuItem>
				</Menu>
				<Menu // Menu used for actions on the library list 
					id="menu-libraryactions"
					anchorEl={this.state.actions_menu_anchor}
					open={this.state.actions_menu}
					onClose={(e) => this.setState({ actions_menu: false, actions_menu_anchor: null })}
				>
					<MenuItem>View details</MenuItem>
				</Menu>
				<Menu // Menu used for filtering the library list
					id="menu-libraryfilter"
					anchorEl={this.state.filter_menu_anchor}
					open={this.state.filter_menu}
					onClose={this.handleCloseFilterMenu}
				>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: '' })}>All</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'meetingrooms' })}>Meeting Rooms</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'localandfamilyhistory' })}>Local and Family History</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'navalhistory' })}>Naval History</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'microfilmscanners' })}>Microfilm Scanners</MenuItem>
				</Menu>
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
				<Button className={classes.button} color="secondary" onClick={(e) => this.setState({ sort_menu: true, sort_menu_anchor: e.currentTarget })}>Sort<Sort className={classes.rightIcon} /></Button>
				<Button className={classes.button} color="secondary" onClick={(e) => this.setState({ filter_menu: true, filter_menu_anchor: e.currentTarget })}>{this.state.filter !== '' ? this.state.filter : 'Filter'}<FilterList className={classes.rightIcon} /></Button>
				{this.props.libraries
					.sort((lib_a, lib_b) => {
						if (this.state.sort === 'name') return lib_a.name.localeCompare(lib_b.name);
						if (this.state.sort === 'walking') return lib_a.walking_duration - lib_b.walking_duration;
						if (this.state.sort === 'cycling') return lib_a.cycling_duration - lib_b.cycling_duration;
						if (this.state.sort === 'driving') return lib_a.driving_duration - lib_b.driving_duration;
						return -1;
					})
					.filter(library => {
						let show = true;
						// May be filtered out
						if (this.state.filter !== '' && library[this.state.filter] === 'No') show = false;
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
												<IconButton onClick={(e) => this.setState({ actions_menu: true, actions_menu_anchor: e.currentTarget })}>
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
									<Button
										color={
											this.props.isochrones &&
												this.props.isochrones[library.name] &&
												this.props.isochrones[library.name]['walking'] &&
												this.props.isochrones[library.name]['walking'].selected ? 'primary' : 'secondary'}
										className={classes.button}
										aria-label="Directions Isochrone"
										onClick={(e) => this.props.toggleIsochrone(library.name, 'walking')}>
										{this.props.isochrones &&
											this.props.isochrones[library.name] &&
											this.props.isochrones[library.name]['walking'] ?
											(this.props.isochrones[library.name]['walking'].retrieved ?
												<DirectionsWalk className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
											) : <DirectionsWalk className={classes.leftIcon} />}
										{library.walking_duration ? Math.round(library.walking_duration / 60) : ''}
									</Button>
									<Button
										color={
											this.props.isochrones &&
												this.props.isochrones[library.name] &&
												this.props.isochrones[library.name]['cycling'] &&
												this.props.isochrones[library.name]['cycling'].selected ? 'primary' : 'secondary'}
										className={classes.button}
										aria-label="Directions Isochrone"
										onClick={(e) => this.props.toggleIsochrone(library.name, 'cycling')}>
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
												this.props.isochrones[library.name]['driving'] &&
												this.props.isochrones[library.name]['driving'].selected ? 'primary' : 'secondary'}
										className={classes.button}
										aria-label="Directions Isochrone"
										onClick={(e) => this.props.toggleIsochrone(library.name, 'driving')}>
										{this.props.isochrones &&
											this.props.isochrones[library.name] &&
											this.props.isochrones[library.name]['driving'] ?
											(this.props.isochrones[library.name]['driving'].retrieved ?
												<DirectionsCar className={classes.leftIcon} /> : <CircularProgress className={classes.progress} size={30} />
											) : <DirectionsCar className={classes.leftIcon} />}
										{library.driving_duration ? Math.round(library.driving_duration / 60) : ''}
									</Button>
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