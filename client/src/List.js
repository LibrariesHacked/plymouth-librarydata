// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Typography } from '@material-ui/core';

// Material Icons
import * as icons from '@material-ui/icons';
import FilterList from '@material-ui/icons/FilterList';
import Refresh from '@material-ui/icons/Refresh';
import Sort from '@material-ui/icons/Sort';

// Our custom components
import LocationCard from './LocationCard';

// Helpers
import * as locationsHelper from './helpers/locations';

// Styles: 
const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	footer: {
		padding: 10
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	menuItem: {
		'&:focus': {
			backgroundColor: theme.palette.primary.main,
			'& $primary, & $icon': {
				color: theme.palette.common.white,
			},
		},
	},
	padding: {
		padding: `0 ${theme.spacing.unit * 2}px`,
	}
});

class List extends React.Component {
	state = {
		filter: '',
		filter_type: '',
		filter_menu: false,
		filter_menu_anchor: null,
		open_tab: 0,
		sort: 'name',
		sort_menu: false,
		sort_menu_anchor: null
	}

	render() {
		const { classes } = this.props;
		let open_locations = this.props.locations
			.filter(location => {
				let show = true;
				if (this.state.filter !== '' && location[this.state.filter] === 'No') show = false;
				if (!locationsHelper.checkLocationOpen(location).open) show = false;
				return show;
			});
		let closed_locations = this.props.locations
			.filter(location => {
				let show = true;
				if (this.state.filter !== '' && location[this.state.filter] === 'No') show = false;
				if (locationsHelper.checkLocationOpen(location).open) show = false;
				return show;
			});
		let events = [];
		this.props.locations.forEach(location => {
			if (location.events) {
				location.events.forEach(event => {
					if (events.map(ev => ev.toLowerCase()).indexOf(event.title.toLowerCase()) === -1) events.push(event.title);
				});
			}
		});
		return (
			<div>
				<Menu // Menu used to sort
					id="menu-locationsort"
					anchorEl={this.state.sort_menu_anchor}
					open={this.state.sort_menu}
					onClose={() => this.setState({ sort_menu: false, sort_menu_anchor: null })}
				>
					<MenuItem onClick={() => this.setState({ sort_menu: false, sort: 'name' })}>Name</MenuItem>
					<MenuItem onClick={() => this.setState({ sort_menu: false, sort: 'walking' })}>Walking time</MenuItem>
					<MenuItem onClick={() => this.setState({ sort_menu: false, sort: 'cycling' })}>Cycling time</MenuItem>
					<MenuItem onClick={() => this.setState({ sort_menu: false, sort: 'driving' })}>Driving time</MenuItem>
				</Menu>
				<Menu // Menu used for filtering the list
					id="menu-locationfilter"
					anchorEl={this.state.filter_menu_anchor}
					open={this.state.filter_menu}
					onClose={() => this.setState({ filter_menu: false, filter_menu_anchor: null })}
				>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: '' })}>Show All</MenuItem>
					<Divider />
					<ListSubheader disableSticky={true}>Filter by Facilities</ListSubheader>
					{this.props.facilities
						.sort((a, b) => { return a.description.localeCompare(b.description) })
						.map(facility => {
							const Icon = icons[facility.icon];
							return Icon ? (
								<MenuItem
									className={classes.menuItem}
									onClick={() => this.setState({ filter_menu: false, filter: facility.facility_name, filter_type: 'facility' })}>
									<ListItemIcon>
										<Icon />
									</ListItemIcon>
									<ListItemText inset primary={facility.description} />
								</MenuItem>
							) : null;
						})
					}
					{events.length > 0 ?
						<div>
							<ListSubheader disableSticky={true}>Filter by Events</ListSubheader>
							<Divider />
							{
								events.sort().map((event, i) => {
									return <MenuItem key={'mnu_item_' + i} onClick={() => this.setState({ filter_menu: false, filter: event, filter_type: 'event' })}>{event}</MenuItem>
								})
							}
						</div> : null
					}
				</Menu>
				<Tabs
					fullWidth
					value={open_locations.length > 0 ? this.state.open_tab : 1}
					indicatorColor="primary"
					textColor="primary"
					onChange={(event, value) => this.setState({ open_tab: value })}
				>
					<Tab
						disabled={open_locations.length === 0}
						label={
							<Badge className={classes.padding} color="primary" badgeContent={open_locations.length}>
								Open
							</Badge>
						}
					/>
					<Tab
						disabled={closed_locations.length === 0}
						label={
							<Badge className={classes.padding} color="secondary" badgeContent={closed_locations.length}>
								Closed
							</Badge>
						}
					/>
				</Tabs>
				<IconButton>
					<Refresh />
				</IconButton>
				<Button size="small" variant="text" className={classes.button} color="secondary" onClick={(e) => this.setState({ sort_menu: true, sort_menu_anchor: e.currentTarget })}>Sort<Sort className={classes.rightIcon} /></Button>
				<Button size="small" variant="text" className={classes.button} color={this.state.filter === '' ? 'secondary' : 'primary'} onClick={(e) => this.setState({ filter_menu: true, filter_menu_anchor: e.currentTarget })}>{this.state.filter !== '' ? this.state.filter.substring(0, 18) : 'All'}<FilterList className={classes.rightIcon} /></Button>
				{this.props.locations
					.sort((loc_a, loc_b) => {
						if (this.state.sort === 'name') return loc_a.location_name.localeCompare(loc_b.location_name);
						if (this.state.sort === 'walking') return loc_a.walking_duration - loc_b.walking_duration;
						if (this.state.sort === 'cycling') return loc_a.cycling_duration - loc_b.cycling_duration;
						if (this.state.sort === 'driving') return loc_a.driving_duration - loc_b.driving_duration;
						return -1;
					})
					.filter(location => {
						let show = true;
						if (this.state.filter !== '' && this.state.filter_type === 'facility' && location[this.state.filter] === 'No') show = false;
						if (this.state.filter !== '' && this.state.filter_type === 'event' && location.events) {
							let found = false;
							location.events.forEach(event => {
								if (event.title === this.state.filter) found = true;
							});
							show = found;
						}
						if ((this.state.open_tab === 0 && open_locations.length !== 0) && !locationsHelper.checkLocationOpen(location).open) show = false;
						if ((this.state.open_tab === 1 && closed_locations.length !== 0) && locationsHelper.checkLocationOpen(location).open) show = false;
						return show;
					})
					.map(location => {
						return (
							<LocationCard
								key={'crd-location' + location.location_name}
								location={location}
								events={this.props.events.filter(event => event.location === location.location_name)}
								travel_types={this.props.travel_types}
								current_time={this.props.current_time}
								more_option={true}
								isochrones={this.props.isochrones}
								toggleIsochrone={this.props.toggleIsochrone}
								goTo={this.props.goTo}
								viewLocation={this.props.viewLocation}
							/>)
					})}
				<Divider />
				<Typography variant="subtitle2" className={classes.footer}>A #LibraryData project</Typography>
			</div>
		);
	}
}

List.propTypes = {
	classes: PropTypes.object.isRequired,
	locations: PropTypes.array.isRequired
};

export default withStyles(styles)(List);