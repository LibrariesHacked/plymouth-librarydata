import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

// Material icons
import LocationSearching from '@material-ui/icons/LocationSearching';
import MyLocation from '@material-ui/icons/MyLocation';

const styles = theme => ({
	divider: {
		width: 1,
		height: 28,
		margin: 8,
	},
	search: {
		position: 'relative',
		border: '1px solid #e5e5e5',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.75),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.9),
		},
		marginLeft: 0,
		marginRight: theme.spacing.unit,
		display: 'flex'
	},
	iconButton: {
		padding: 10,
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 2,
		[theme.breakpoints.up('sm')]: {
			width: 100
		}
	}
});

class Search extends React.Component {
	state = {
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.search}>
				<InputBase
					placeholder="Postcode"
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					value={this.props.postcode}
					onChange={(e) => this.props.updatePostcode(e.target.value)}
				/>
				<IconButton
					className={classes.iconButton}
					onClick={() => this.props.postcodeSearch()}>
					<SearchIcon />
				</IconButton>
				<Divider className={classes.divider} />
				{this.props.gps_available ?
					<IconButton
						className={classes.iconButton}
						color="primary"
						onClick={() => this.props.toggleGPS()}
					>
						{this.props.gps_available && this.props.search_type === 'gps' ? <MyLocation /> : <LocationSearching />}
					</IconButton> : null}
			</div>
		);
	}
}

Search.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);