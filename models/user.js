
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
		userKey: String,
		private_token: String,
		nameTrip: String,
		nbImages: {type : Number, default : 0},
		nbComments: {type : Number, default : 0},
		started: Date,
		ended: {type : Date, default : null}
	})
	
module.exports = mongoose.model('User', userSchema);