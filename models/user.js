
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
		userKey: String,
		private_token: String,
		nameTrip: String,
		started: Date,
		ended: {type : Date, default : null}
	})
	
module.exports = mongoose.model('User', userSchema);