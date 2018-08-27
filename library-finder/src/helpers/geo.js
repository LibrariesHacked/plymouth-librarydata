// getCurrentLocation: 
export function getCurrentLocation(callback) {
	var options = {
		enableHighAccuracy: true,
		timeout: 3000,
		maximumAge: 0
	};
	navigator.geolocation.getCurrentPosition((pos) => {
		callback([pos.coords.longitude, pos.coords.latitude]);
	}, err => {
		callback([]);
	}, options);
};