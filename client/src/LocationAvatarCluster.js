// React and additional
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	avatar: {
		margin: 0,
		cursor: 'pointer'
	}
});

class LocationAvatarCluster extends React.Component {
	state = {
	}

	componentDidMount = () => {
	}

	render() {
		const { classes } = this.props;
		return (
			<Tooltip title={this.props.points + ' locations'}>
				<Avatar
					className={classes.avatar}>
					{this.props.points}
				</Avatar>
			</Tooltip>
		);
	}
}
 
LocationAvatarCluster.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LocationAvatarCluster);