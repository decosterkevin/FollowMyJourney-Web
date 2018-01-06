var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

	var gpsTrack = new mongoose.Schema({
		userKey: String,
		coordinates: [Number],
		timestamp: mongoose.Schema.Types.Date,
		speed: {type : Number, default : -1},
	});
	
module.exports = mongoose.model('GpsTrack', gpsTrack);