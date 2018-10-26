// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Material Icons
import FilterList from '@material-ui/icons/FilterList';
import Refresh from '@material-ui/icons/Refresh';
import Sort from '@material-ui/icons/Sort';

// Our custom components
import LibraryCard from './LibraryCard';

// Helpers
import * as libraries from './helpers/libraries';
import { Typography } from '@material-ui/core';

// Styles: 
const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	footer: {
		padding: 10
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
	padding: {
		padding: `0 ${theme.spacing.unit * 2}px`,
	}
});

class LibraryList extends React.Component {
	state = {
		actions_menu: false,
		actions_menu_anchor: null,
		filter: '',
		filter_type: '',
		filter_menu: false,
		filter_menu_anchor: null,
		library_name: '',
		open_tab: 0,
		sort: 'name',
		sort_menu: false,
		sort_menu_anchor: null
	}
	render() {
		const { classes } = this.props;
		let open_libraries = this.props.libraries
			.filter(library => {
				let show = true;
				if (this.state.filter !== '' && library[this.state.filter] === 'No') show = false;
				if (!libraries.checkLibraryOpen(library, this.props.current_time).open) show = false;
				return show;
			});
		let closed_libraries = this.props.libraries
			.filter(library => {
				let show = true;
				if (this.state.filter !== '' && library[this.state.filter] === 'No') show = false;
				if (libraries.checkLibraryOpen(library, this.props.current_time).open) show = false;
				return show;
			});
		let events = [];
		this.props.libraries.forEach(library => {
			if (library.events) {
				library.events.forEach(event => {
					if (events.indexOf(event.title) === -1) events.push(event.title);
				});
			}
		});
		return (
			<div>
				<Menu // Menu used to sort libraries
					id="menu-librarysort"
					anchorEl={this.state.sort_menu_anchor}
					open={this.state.sort_menu}
					onClose={() => this.setState({ sort_menu: false, sort_menu_anchor: null })}
				>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'name' })}>Library name</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'walking' })}>Walking time</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'cycling' })}>Cycling time</MenuItem>
					<MenuItem onClick={(e) => this.setState({ sort_menu: false, sort: 'driving' })}>Driving time</MenuItem>
				</Menu>
				<Menu // Menu used for filtering the library list
					id="menu-libraryfilter"
					anchorEl={this.state.filter_menu_anchor}
					open={this.state.filter_menu}
					onClose={() => this.setState({ filter_menu: false, filter_menu_anchor: null })}
				>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: '' })}>All Libraries</MenuItem>
					<Divider />
					<ListSubheader disableSticky={true}>Filter by Facilities</ListSubheader>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'meetingrooms', filter_type: 'facility' })}>Meeting Rooms</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'localandfamilyhistory', filter_type: 'facility' })}>Local and Family History</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'navalhistory', filter_type: 'facility' })}>Naval History</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'microfilmscanners', filter_type: 'facility' })}>Microfilm Scanners</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'dvds', filter_type: 'facility' })}>DVDs</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'wifi', filter_type: 'facility' })}>WiFi</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'roofterrace', filter_type: 'facility' })}>Roof Terrace</MenuItem>
					<MenuItem onClick={() => this.setState({ filter_menu: false, filter: 'cafe', filter_type: 'facility' })}>Cafe</MenuItem>
					{events.length > 0 ? 
						<div>
							<ListSubheader disableSticky={true}>Filter by Events</ListSubheader>
							<Divider/>
							{
								events.sort().map(event => {
									return <MenuItem onClick={() => this.setState({ filter_menu: false, filter: event, filter_type: 'event' })}>{event}</MenuItem>
								})
							}
						</div> : null
					}
				</Menu>
				<Tabs
					fullWidth
					value={open_libraries.length > 0 ? this.state.open_tab : 1}
					indicatorColor="primary"
					textColor="primary"
					onChange={(event, value) => this.setState({ open_tab: value })}
				>
					<Tab
						disabled={open_libraries.length === 0}
						label={
							<Badge className={classes.padding} color="primary" badgeContent={open_libraries.length}>
								Open
							</Badge>
						}
					/>
					<Tab
						disabled={closed_libraries.length === 0}
						label={
							<Badge className={classes.padding} color="secondary" badgeContent={closed_libraries.length}>
								Closed
							</Badge>
						}
					/>
				</Tabs>
				<IconButton><Refresh /></IconButton>
				<Button size="small" variant="flat" className={classes.button} color="secondary" onClick={(e) => this.setState({ sort_menu: true, sort_menu_anchor: e.currentTarget })}>Sort<Sort className={classes.rightIcon} /></Button>
				<Button size="small" variant="flat" className={classes.button} color={this.state.filter === '' ? 'secondary' : 'primary'} onClick={(e) => this.setState({ filter_menu: true, filter_menu_anchor: e.currentTarget })}>{this.state.filter !== '' ? this.state.filter.substring(0, 18) : 'All Libraries'}<FilterList className={classes.rightIcon} /></Button>
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
						if (this.state.filter !== '' && this.state.filter_type === 'facility' && library[this.state.filter] === 'No') show = false;
						if (this.state.filter !== '' && this.state.filter_type === 'event' && library.events) {
							let found = false;
							library.events.forEach(event => {
								if (event.title === this.state.filter) found = true;
							});
							show = found;
						}
						if ((this.state.open_tab === 0 && open_libraries.length !== 0) && !libraries.checkLibraryOpen(library, this.props.current_time).open) show = false;
						if ((this.state.open_tab === 1 && closed_libraries.length !== 0) && libraries.checkLibraryOpen(library, this.props.current_time).open) show = false;
						return show;
					})
					.map(library => {
						return (
							<LibraryCard
								key={'crd-library' + library.name}
								library={library}
								current_time={this.props.current_time}
								more_option={true}
								isochrones={this.props.isochrones}
								toggleIsochrone={this.props.toggleIsochrone}
								goTo={this.props.goTo}
								zoomTo={this.props.zoomTo}
								viewLibrary={this.props.viewLibrary}
							/>)
					})}
				<Divider />
				<Typography variant="body1" className={classes.footer}>A #LibraryData project</Typography>
			</div>
		);
	}
}

LibraryList.propTypes = {
	classes: PropTypes.object.isRequired,
	libraries: PropTypes.array.isRequired
};

export default withStyles(styles)(LibraryList);