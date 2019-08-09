// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';

// Material Icons
import * as icons from '@material-ui/icons';
import FilterList from '@material-ui/icons/FilterList';
import Sort from '@material-ui/icons/Sort';

// Our custom components
import LocationCard from './LocationCard';

// Styles: 
const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
	menuItem: {
		'&:focus': {
			backgroundColor: theme.palette.primary.main
		}
	},
	padding: {
		padding: `0 ${theme.spacing.unit * 2}px`,
	},
	tab: {
		minWidth: 0
	}
});

class List extends React.Component {
	state = {
		sort: 'name',
		sort_menu: false,
		sort_menu_anchor: null
	}

	render() {
		const { classes, locations, filter, filter_menu, filter_menu_anchor, open_tab } = this.props;
		let events = [];
		this.props.events.forEach(event => {
			if (events.map(ev => ev.toLowerCase()).indexOf(event.title.toLowerCase()) === -1) events.push(event.title);
		});
		const open_locations = locations.filter(location => location.currently_open.open).length;
		const closed_locations = locations.filter(location => !location.currently_open.open).length;
		return (
			<div>
				<Menu // Menu used to sort
					id="menu-locationsort"
					anchorEl={this.state.sort_menu_anchor}
					open={this.state.sort_menu}
					onClose={() => this.setState({ sort_menu: false, sort_menu_anchor: null })}
				>
					<MenuItem onClick={() => this.setState({ sort_menu: false, sort: 'name' })}>Name</MenuItem>
				</Menu>
				<Menu // Menu used for filtering the list
					id="menu-locationfilter"
					anchorEl={filter_menu_anchor}
					open={filter_menu}
					onClose={() => this.props.closeFilterMenu()}
				>
					<MenuItem onClick={(e) => this.props.setFilter('')}>Show All</MenuItem>
					<Divider />
					<ListSubheader disableSticky={true}>Filter by Facilities</ListSubheader>
					{this.props.facilities
						.sort((a, b) => { return a.description.localeCompare(b.description) })
						.map(facility => {
							const Icon = icons[facility.icon];
							return Icon ? (
								<MenuItem
									key={'itm-' + facility.facility_name.replace(/\s/g, '')}
									className={classes.menuItem}
									onClick={() => this.props.setFilter(facility.facility_name, 'facility')}>
									<ListItemIcon>
										<Icon />
									</ListItemIcon>
									<ListItemText primary={facility.description} />
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
									return <MenuItem key={'mnu_item_' + i} onClick={() => this.props.setFilter(event, 'event')}>{event}</MenuItem>
								})
							}
						</div> : null
					}
				</Menu>
				<Tabs
					variant="standard"
					scrollButtons="off"
					value={open_locations > 0 ? open_tab : 1}
					indicatorColor="secondary"
					textColor="secondary"
					onChange={(event, value) => this.props.changeTab(value)}
				>
					<Tab
						disabled={open_locations === 0}
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color='default'
								badgeContent={open_locations}>
								Open
							</Badge>
						}
					/>
					<Tab
						disabled={closed_locations === 0}
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color={'default'}
								badgeContent={closed_locations}>
								Closed
							</Badge>
						}
					/>
					<Tab
						disabled={closed_locations === 0 || open_locations === 0}
						className={classes.tab}
						label={
							<Badge
								className={classes.padding}
								color={'default'}
								badgeContent={closed_locations + open_locations}>
								All
							</Badge>
						}
					/>
				</Tabs>
				<Tooltip title={'Sort locations'}>
					<Button size="small" variant="text" className={classes.button} color="secondary" onClick={(e) => this.setState({ sort_menu: true, sort_menu_anchor: e.currentTarget })}>Sort<Sort className={classes.rightIcon} /></Button>
				</Tooltip>
				<Tooltip title={'Filter locations'}>
					<Button size="small" variant="text" className={classes.button} color={filter === '' ? 'secondary' : 'primary'} onClick={(e) => this.props.openFilter(e.currentTarget)}>{filter !== '' ? filter.substring(0, 20) : 'Filter'}<FilterList className={classes.rightIcon} /></Button>
				</Tooltip>
				{locations
					.sort((loc_a, loc_b) => {
						if (this.state.sort === 'name') return loc_a.location_name.localeCompare(loc_b.location_name);
						return -1;
					})
					.filter(location => {
						let show = true;
						if ((open_tab === 0 && open_locations !== 0) && !location.currently_open.open) show = false;
						if ((open_tab === 1 && closed_locations !== 0) && location.currently_open.open) show = false;
						return show;
					})
					.map(location => {
						return (
							<LocationCard
								key={'crd-location-' + location.location_name.replace(/\s/g, '')}
								location={location}
								events={this.props.events.filter(event => event.location === location.location_name)}
								travel_types={this.props.travel_types}
								current_time={this.props.current_time}
								more_option={true}
								isochrones={this.props.isochrones}
								toggleIsochrone={this.props.toggleIsochrone}
								goTo={this.props.goTo}
								viewLocation={this.props.viewLocation}
								filter={this.props.filter}
								filter_type={this.props.filter_type}
							/>)
					})}
			</div>
		);
	}
}

List.propTypes = {
	classes: PropTypes.object.isRequired,
	locations: PropTypes.array.isRequired
};

export default withStyles(styles)(List);