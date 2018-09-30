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

class ClusterAvatar extends React.Component {
	state = {
	}
	componentDidMount = () => {
	}
	render() {
		const { classes } = this.props;
		return (
			<Avatar
				className={classes.avatar}
				onClick={this.props.selectLibrary}>
				{3}
			</Avatar>
		);
	}
}

ClusterAvatar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ClusterAvatar);