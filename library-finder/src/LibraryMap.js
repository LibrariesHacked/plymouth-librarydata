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
import { Source } from 'react-mapbox-gl';

// Custom components
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
	// selectLibrary:
	selectLibrary = (library) => {

	}
	// render
	render() {
		const { theme } = this.props;
		return (
			<div>
				<Map
					style='https://s3-eu-west-1.amazonaws.com/tiles.os.uk/styles/open-zoomstack-light/style.json'
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
					{Object.keys(this.props.isochrones).map(library => { // Each library isochrone set
						return Object.keys(this.props.isochrones[library])
							.filter(travel => {
								return this.props.isochrones[library][travel].selected
							})
							.map(travel => { // Each travel method
								return (
									<span>
										<GeoJSONLayer // Shows the shaded polygons
											data={this.props.isochrones[library][travel].iso}
											fillPaint={{
												'fill-opacity': 0.1,
												'fill-antialias': true,
												'fill-color': theme.libraries[library.replace(' Library', '').replace(/ /g, '').toLowerCase()]
											}}
										/>
										<GeoJSONLayer // Shows the outlines of the distances
											data={this.props.isochrones[library][travel].iso}
											linePaint={{
												'line-opacity': 0.4,
												'line-width': 2,
												'line-color': theme.libraries[library.replace(' Library', '').replace(/ /g, '').toLowerCase()]
											}}
										/>
										<GeoJSONLayer // Shows the distances labels
											data={this.props.isochrones[library][travel].iso}
											symbolLayout={{
												'text-field': ['concat', ['to-string', ['/', ['get', 'value'], 60]], ' mins'],
												'text-font': ['Source Sans Pro Bold'],
												'symbol-placement': 'line',
												'text-allow-overlap': false,
												'text-padding': 2,
												'text-max-angle': 90,
												'text-size': {
													'base': 1.2,
													'stops': [[8, 12], [22, 30]]
												},
												'text-letter-spacing': 0.1
											}}
											symbolPaint={{
												'text-halo-color': 'rgba(255, 255, 255, 0.8)',
												'text-halo-width': 8,
												'text-halo-blur': 3,
												"text-color": theme.libraries[library.replace(' Library', '').replace(/ /g, '').toLowerCase()]
											}}
										/>
									</span>)
							})
					})}
					<Cluster ClusterMarkerFactory={this.clusterLibraries}>
						{
							this.props.libraries.map((library, key) =>
								<Marker
									key={'lib_' + key}
									style={styles.marker}
									coordinates={[library.longitude, library.latitude]}>
									<LibraryAvatar
										library={library}
										selectLibrary={() => this.props.viewLibrary(library.name)} />
								</Marker>
							)
						}
					</Cluster>
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