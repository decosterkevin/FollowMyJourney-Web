var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var imageSchema= new mongoose.Schema({
		userKey: String,
		path: String,
		name: String,
		width: Number,
		height: Number,
		coordinates: [Number],
		timestamp: Date,
		comment: String
});


module.exports = mongoose.model('Image', imageSchema);

