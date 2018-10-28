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
		return name.replace(' Library', '').split(' ').map(word => { return word.substring(0, 1) }).join('');
	}

	componentDidMount = () => {
	}

	render() {
		const { classes, location, theme } = this.props;
		return (
			<Avatar
				aria-label={location.name}
				className={classes.avatar}
				style={{
					backgroundColor: theme.locations[location.name.replace(' Library', '').replace(/ /g, '').toLowerCase()]
				}}
				onClick={this.props.viewLocation}>
				{this.getInitials(location.name)}
			</Avatar>
		);
	}
}

LocationAvatar.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LocationAvatar);