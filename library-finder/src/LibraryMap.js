import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from 'material-ui/styles';

// Mapbox GL
import ReactMapboxGl from 'react-mapbox-gl';
import { Cluster } from 'react-mapbox-gl';
import { Layer } from 'react-mapbox-gl';
import { Marker } from 'react-mapbox-gl';
import { RotationControl } from 'react-mapbox-gl';
import { Source } from 'react-mapbox-gl';
import { ZoomControl } from 'react-mapbox-gl';

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

const map_url = 'mapbox://styles/daveroweuk/cj6jj9udl6aa62spb93wjrshv';

const bounds = [
	[-4.204694, 50.346906],
	[-4.087277, 50.411567]
];

const colours = {
	central: 'rgb(143,212,0)',
	crownhill: 'rgb(236,0,140)',
	devonport: 'rgb(244,170,0)',
	efford: 'rgb(0,120,201)',
	estover: 'rgb(147,37,178)',
	northprospect: 'rgb(39,189,190)',
	peverell: 'rgb(0,105,62)',
	plympton: 'rgb(158,27,50)',
	plymstock: 'rgb(239,130,0)',
	southway: 'rgb(0,58,105)',
	stbudeaux: 'rgb(77,48,145)',
	westpark: 'rgb(233,85,37)'
};

class LibraryMap extends Component {
	state = {
		maxBounds: bounds,
		fitBounds: [],
		center: [-4.1432586, 50.3732736],
		zoom: [14],
		pitch: [90],
		bearing: [0]
	};
	render() {
		return (
			<div>
				<Map
					style={map_url}
					center={this.state.center}
					zoom={this.state.zoom}
					pitch={this.state.pitch}
					bearing={this.state.bearing}
					maxBounds={this.state.maxBounds}
					fitBounds={this.state.bounds}
					containerStyle={{ top: 0, bottom: 0, right: 0, left: 0, position: 'absolute' }}
					onClick={this.handleMapClick}
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
						layerOptions={{
							'minzoom': 14
						}}
						paint={{
							'fill-extrusion-color': [
								'match',
								['get', 'ID'],
								'0D4F70BCC1FF27B3E050A00A568A259B', colours['central'],
								'0D4F70BCBC7027B3E050A00A568A259B', colours['crownhill'],
								'0D4F70C26C6927B3E050A00A568A259B', colours['devonport'],
								'0D4F70C2790C27B3E050A00A568A259B', colours['efford'],
								'0D4F70C2B4AB27B3E050A00A568A259B', colours['estover'],
								'0D4F70C2D6BB27B3E050A00A568A259B', colours['northprospect'],
								'0D4F70C2715927B3E050A00A568A259B', colours['peverell'],
								'0D4F70B79EFA27B3E050A00A568A259B', colours['plympton'],
								'0D4F70C31D6E27B3E050A00A568A259B', colours['plymstock'],
								'0D4F70C2862A27B3E050A00A568A259B', colours['southway'],
								'0D4F7098AB3527B3E050A00A568A259B', colours['stbudeaux'],
								'0D4F70C21F9327B3E050A00A568A259B', colours['westpark'],
								'#CCCCCC'
							],
							'fill-extrusion-height': { 'type': 'identity', 'property': 'max' },
							'fill-extrusion-opacity': 0.8
						}}
					/>
				</Map>
			</div>
		);
	}
}

LibraryMap.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LibraryMap);