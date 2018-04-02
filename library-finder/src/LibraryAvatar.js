// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	avatar: {
		margin: 10,
	},
	colorDefault: {
		backgroundColor: '#FFFFFF',
	}
});

class LibraryAvatar extends React.Component {
	state = {
	}
	getLibraryInitials = (name) => {
		return name.replace(' Library', '').split(' ').map(word => { return word.substring(0, 1) }).join('');
	}
	componentDidMount = () => {
	}
	render() {
		const { classes, library, theme } = this.props;
		return (
			<Avatar
				aria-label={library.name}
				className={classes.avatar}
				style={{
					backgroundColor: theme.libraries.central
				}}>
				{this.getLibraryInitials(library.name)}
			</Avatar>
		);
	}
}

LibraryAvatar.propTypes = {
	classes: PropTypes.object.isRequired,
	library: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LibraryAvatar);