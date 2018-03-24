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
import Filter from 'material-ui-icons/Filter';
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
				<Button className={classes.button} color="secondary">Filter<Filter className={classes.rightIcon} /></Button>
				<Card className={classes.card} elevation={0}>
					<CardHeader
						avatar={
							<Avatar aria-label="Recipe" className={classes.avatar}>PC</Avatar>
						}
						action={
							<IconButton>
								<MoreVert />
							</IconButton>
						}
						title="Shrimp and Chorizo Paella"
						subheader="September 14, 2016"
					/>
				</Card>
			</div>
		);
	}
}

LibraryList.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LibraryList);