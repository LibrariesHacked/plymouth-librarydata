// React
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

// Material Icons
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
	input: {
		font: 'inherit',
		padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit * 9}px`,
		border: 0,
		display: 'block',
		verticalAlign: 'middle',
		whiteSpace: 'normal',
		background: 'none',
		margin: 0,
		color: 'inherit',
		width: '100%',
		'&:focus': {
			outline: 0,
		}
	},
	root: {
		fontFamily: theme.typography.fontFamily,
		position: 'relative',
		marginRight: theme.spacing.unit * 2,
		marginLeft: theme.spacing.unit,
		borderRadius: 2,
		background: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			background: fade(theme.palette.common.white, 0.25),
		},
		'& $input': {
			transition: theme.transitions.create('width'),
			width: 200,
			'&:focus': {
				width: 250
			}
		}
	},
	search: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
});

class PostcodeSearch extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<div className={classes.search}>
					<SearchIcon />
				</div>
				<input
					id="docsearch-input"
					ref={node => {
						this.input = node;
					}}
					className={classes.input}
				/>
			</div>
		);
	}
}

PostcodeSearch.propTypes = {
	classes: PropTypes.object.isRequired,
	width: PropTypes.string.isRequired,
};

export default withStyles(styles)(PostcodeSearch);