// React and additional
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	avatar: {
		cursor: 'pointer'
	},
	outline: {
		border: '1px solid #e5e5e5',
		backgroundColor: fade(theme.palette.common.white, 0.8),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.9),
		},
		borderRadius: theme.shape.borderRadius,
		padding: 2
	},
	noOutline: {
		padding: 0,
		margin: 0
	}
});

class LocationAvatar extends React.Component {
	state = {
	}

	getInitials = (name) => {
		let initials = 'LI';
		if (name && name.length > 2) {
			initials = name.replace(' Library', '').split(' ').map(word => { return word.substring(0, 1) }).join('');
		}
		return initials
	}

	componentDidMount = () => {
	}

	render() {
		const { classes, location, theme } = this.props;
		let location_name = '';
		if (location.location_name && location.location_name.length > 0) location_name = location.location_name.replace(' Library', '').replace(/ /g, '').toLowerCase()
		return (
			<div className={this.props.nearest ? classes.outline : classes.noOutline}>
				<Tooltip title={this.props.nearest ? ('Nearest: ' + location.location_name) : location.location_name}>
					<Avatar
						aria-label={location.location_name}
						className={classes.avatar}
						style={{
							backgroundColor: (theme.locations[location_name] ? theme.locations[location_name] : '#ccc')
						}}
						onClick={this.props.viewLocation}>
						{this.getInitials(location.location_name)}
					</Avatar>
				</Tooltip>
			</div>
		);
	}
}

LocationAvatar.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LocationAvatar);