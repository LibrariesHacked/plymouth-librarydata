// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

// Material Icons
import FilterList from 'material-ui-icons/FilterList';
import LocationOn from 'material-ui-icons/LocationOn';
import MoreVert from 'material-ui-icons/MoreVert';
import Sort from 'material-ui-icons/Sort';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class LibraryList extends React.Component {
	render() {
		const { classes, width } = this.props;
		return (
			<div>
				<Button className={classes.button} color="secondary">Sort<Sort className={classes.rightIcon} /></Button>
				<Button className={classes.button} color="secondary">Filter<FilterList className={classes.rightIcon} /></Button>
				{this.props.libraries
					.sort((lib_a, lib_b) => {

					})
					.filter(library => {
						return true;
					})
					.map(library => {
						<Card className={classes.card} elevation={0}>
							<CardHeader
								avatar={
									<Avatar aria-label={library.name} className={classes.avatar}>PC</Avatar>
								}
								action={
									<div>
										<IconButton>
											<LocationOn />
										</IconButton>
										<IconButton>
											<MoreVert />
										</IconButton>
									</div>
								}
								title={library.name}
								subheader={library.address}
							/>
						</Card>
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