var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

	var gpsTrack = new mongoose.Schema({
		userKey: String,
		coordinates: [Number],
		timestamp: mongoose.Schema.Types.Date
	});
	
module.exports = mongoose.model('GpsTrack', gpsTrack);