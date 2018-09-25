// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

// Material Icons
import FilterList from '@material-ui/icons/FilterList';
import Sort from '@material-ui/icons/Sort';

// Our custom components
import LibraryCard from './LibraryCard';

// Helpers
import * as libraries from './helpers/libraries';

// Styles: 
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
	padding: {
		padding: `0 ${theme.spacing.unit * 2}px`,
	}
});

class LibraryList extends React.Component {
	state = {
		actions_menu: false,
		actions_menu_anchor: null,
		filter: '',
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
				return libraries.checkLibraryOpen(library, this.props.current_time).open
			});
		let closed_libraries = this.props.libraries
			.filter(library => {
				return !libraries.checkLibraryOpen(library, this.props.current_time).open
			});
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
				<Menu // Menu used for filtering the library list
					id="menu-libraryfilter"
					anchorEl={this.state.filter_menu_anchor}
					open={this.state.filter_menu}
					onClose={this.handleCloseFilterMenu}
				>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: '' })}>All Libraries</MenuItem>
					<Divider />
					<ListSubheader>Filter by Facilities</ListSubheader>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'meetingrooms' })}>Meeting Rooms</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'localandfamilyhistory' })}>Local and Family History</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'navalhistory' })}>Naval History</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'microfilmscanners' })}>Microfilm Scanners</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'dvds' })}>DVDs</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'wifi' })}>WiFi</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'roofterrace' })}>Roof Terrace</MenuItem>
					<MenuItem onClick={(e) => this.setState({ filter_menu: false, filter: 'cafe' })}>Cafe</MenuItem>
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
				<Button className={classes.button} color="secondary" onClick={(e) => this.setState({ sort_menu: true, sort_menu_anchor: e.currentTarget })}>Sort<Sort className={classes.rightIcon} /></Button>
				<Button className={classes.button} color="secondary" onClick={(e) => this.setState({ filter_menu: true, filter_menu_anchor: e.currentTarget })}>{this.state.filter !== '' ? this.state.filter.substring(0, 8) : 'All Libraries'}<FilterList className={classes.rightIcon} /></Button>
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
						// Apply our filter
						if (this.state.filter !== '' && library[this.state.filter] === 'No') show = false;
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
								viewLibrary={this.props.viewLibrary}
							/>)
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