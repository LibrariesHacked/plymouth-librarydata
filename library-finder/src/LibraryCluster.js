// React and additional
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	avatar: {
		margin: 10
	},
	colorDefault: {
		backgroundColor: '#FFFFFF'
	}
});

class LibraryCluster extends React.Component {
	state = {
	}
	componentDidMount = () => {
	}
	render() {
		const { classes, number, theme } = this.props;
		return (
			<Avatar
				aria-label={'Cluster of libraries'}
				className={classes.avatar}
				style={{
					backgroundColor: theme.libraries['stbudeaux']
				}}>
				{number}
			</Avatar>
		);
	}
}

LibraryCluster.propTypes = {
};

export default withStyles(styles, { withTheme: true })(LibraryCluster);