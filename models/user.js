
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
		userKey: {type : String, default : null},
		private_token: {type : String, default : null},
		nameTrip: {type : String, default : "my Journey Name"},
		nbImages: {type : Number, default : 0},
		nbComments: {type : Number, default : 0},
		started: {type : Date, default : null},
		ended: {type : Date, default : null}
	})
	
module.exports = mongoose.model('User', userSchema);