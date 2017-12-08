
var mongoose = require('mongoose');


	var commentTrack = new mongoose.Schema({
		userKey: String,
		coordinates: [Number],
		Timestamp: mongoose.Schema.Types.Date,
		comment: String
	});
	
module.exports = mongoose.model('CommentTrack', commentTrack);