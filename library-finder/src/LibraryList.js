// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import Tabs, { Tab } from 'material-ui/Tabs';

// Material Icons
import FilterList from 'material-ui-icons/FilterList';
import LocationOn from 'material-ui-icons/LocationOn';
import MoreVert from 'material-ui-icons/MoreVert';
import Sort from 'material-ui-icons/Sort';

// Helpers
import * as libraries from './helpers/libraries';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class LibraryList extends React.Component {
	state = {
		open_tab: 0
	}
	render() {
		const { classes, width } = this.props;
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
					<Tab label="All" />
				</Tabs>
				<Button className={classes.button} color="secondary">Sort<Sort className={classes.rightIcon} /></Button>
				<Button className={classes.button} color="secondary">Filter<FilterList className={classes.rightIcon} /></Button>
				{this.props.libraries
					.sort((lib_a, lib_b) => {
						return lib_a < lib_b;
					})
					.filter(library => {
						let show = true;
						if (this.state.open_tab === 0 && !libraries.checkLibraryOpen(library)) show = false;
						return show;
					})
					.map(library => {
						return (
							<Card className={classes.card} elevation={0}>
								<CardHeader
									avatar={
										<Avatar aria-label={library['Library name']} className={classes.avatar}>{library['Library name'].replace(' Library', '').split(' ').map(word => { return word.substring(0, 1) }).join('')}</Avatar>
									}
									action={
										<div>
											<IconButton onClick={(e) => this.props.goTo([library.Longitude, library.Latitude])}>
												<LocationOn />
											</IconButton>
											<IconButton>
												<MoreVert />
											</IconButton>
										</div>
									}
									title={library['Library name']}
									subheader={library['address line 1']}
								/>
							</Card>)
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