// React and additional
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	avatar: {
		margin: 0,
		cursor: 'pointer'
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
			<Avatar
				aria-label={location.location_name}
				className={classes.avatar}
				style={{
					backgroundColor: (theme.locations[location_name] ? theme.locations[location_name] : '#ccc')
				}}
				onClick={this.props.viewLocation}>
				{this.getInitials(location.location_name)}
			</Avatar>
		);
	}
}

LocationAvatar.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LocationAvatar);