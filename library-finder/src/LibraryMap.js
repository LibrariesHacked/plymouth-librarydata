import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';

// Mapbox GL
import ReactMapboxGl from 'react-mapbox-gl';
import { Cluster } from 'react-mapbox-gl';
import { GeoJSONLayer } from 'react-mapbox-gl';
import { Layer } from 'react-mapbox-gl';
import { Marker } from 'react-mapbox-gl';
import { RotationControl } from 'react-mapbox-gl';
import { Source } from 'react-mapbox-gl';
import { ZoomControl } from 'react-mapbox-gl';

import LibraryAvatar from './LibraryAvatar';

const styles = {};

const Map = ReactMapboxGl({
	accessToken: 'pk.eyJ1IjoiZGF2ZXJvd2V1ayIsImEiOiJjajRuemx4Mnoxc2lyMzJvNGYxZjVjdnVpIn0.9aupfG_tYU0SHx3S6ZUqvw',
	minZoom: 7,
	maxZoom: 18,
	scrollZoom: true,
	interactive: true,
	dragRotate: true,
	attributionControl: true
});

class LibraryMap extends Component {
	state = {
		fitBounds: [],
		center: [-4.1432586, 50.3732736],
		zoom: [16],
		pitch: [90],
		bearing: [0]
	};
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.location.length > 0 && nextProps.location !== this.state.center) {
			this.setState({
				center: nextProps.location,
				zoom: [20],
				pitch: 160,
				bearing: [90]
			});
		}
	}
	// clusterLibraries
	clusterLibraries = (coordinates) => (
		<Marker coordinates={coordinates}>C</Marker>
	)
	// render
	render() {
		const { theme } = this.props;
		return (
			<div>
				<Map
					style='mapbox://styles/mapbox/light-v9'
					center={this.state.center}
					zoom={this.state.zoom}
					pitch={this.state.pitch}
					bearing={this.state.bearing}
					fitBounds={this.state.bounds}
					containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, position: 'absolute' }}
					onClick={this.mapClick}
				>
					<Source
						id='buildings_source'
						tileJsonSource={{
							type: 'vector',
							url: 'mapbox://daveroweuk.9uj2a4uw'
						}}
					/>
					<Layer
						id='3d-buildings'
						type='fill-extrusion'
						sourceId='buildings_source'
						sourceLayer='PlymouthBuildings-5m5usp'
						minZoom={16}
						paint={{
							'fill-extrusion-color': [
								'match',
								['get', 'ID'],
								'0D4F70BCC1FF27B3E050A00A568A259B', theme.libraries.central,
								'0D4F70C084A527B3E050A00A568A259B', theme.libraries.crownhill,
								'0D4F70C2C5A727B3E050A00A568A259B', theme.libraries.devonport,
								'0D4F70C2790D27B3E050A00A568A259B', theme.libraries.efford,
								'0D4F70B79A2A27B3E050A00A568A259B', theme.libraries.estover,
								'0D4F70C2440A27B3E050A00A568A259B', theme.libraries.northprospect,
								'0D4F70C2EEE527B3E050A00A568A259B', theme.libraries.peverell,
								'0D4F70B7594D27B3E050A00A568A259B', theme.libraries.plympton,
								'0D4F70C31D6E27B3E050A00A568A259B', theme.libraries.plymstock,
								'0D4F70C2862A27B3E050A00A568A259B', theme.libraries.southway,
								'0D4F709BDA5D27B3E050A00A568A259B', theme.libraries.stbudeaux,
								'0D4F70C21F9327B3E050A00A568A259B', theme.libraries.westpark,
								'#CCCCCC'
							],
							'fill-extrusion-height': { 'type': 'identity', 'property': 'max' },
							'fill-extrusion-opacity': 0.7
						}}
					/>
					{Object.keys(this.props.isochrones).map(library => { // Each library
						return Object.keys(this.props.isochrones[library]).map(travel => { // Each travel method
							return (this.props.isochrones[library][travel].selected ?
								<GeoJSONLayer
									data={this.props.isochrones[library][travel].iso}
									lineLayout={{
									}}
									fillPaint={{
										"fill-color": theme.libraries.peverell,
										"fill-opacity": 0.2
									}}
								/> : null)
						})
					})}
					<Cluster ClusterMarkerFactory={this.clusterLibraries}>
						{
							this.props.libraries.map((library, key) =>
								<Marker
									key={'lib_' + key}
									style={styles.marker}
									coordinates={[library.longitude, library.latitude]}>
									<LibraryAvatar library={library} />
								</Marker>
							)
						}
					</Cluster>
					<ZoomControl />
					<RotationControl />
				</Map>
			</div>
		);
	}
}

LibraryMap.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(LibraryMap);