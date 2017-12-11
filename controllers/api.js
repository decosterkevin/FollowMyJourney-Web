
var User = require('../models/user')
var GpsTrack = require('../models/gpsTrack')
var CommentTrack = require('../models/commentTrack')
var Image = require('../models/image')
var crypto = require('crypto');
var shortId = require('short-mongo-id');
exports.tracks = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
				GpsTrack.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec( function(err, replies) {
						res.send(replies);
				});
		}
	   
	});
};
exports.comments = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
				CommentTrack.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec(function(err, replies) {
						res.send(replies);
				});
		}
	   
	});
};
exports.images = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
				Image.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec(function(err, replies) {
						res.send(replies);
				});
		}
	   
	});
};
exports.showUser = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey},'userKey nameTrip nbImages nbComments started ended',function(err, user) {
		console.log(user);
			res.send(user);
	   
	});
};

exports.register = function(req, res) {
	var process = true;
	if (process) {
		var seed = crypto.randomBytes(32,  function(err, buffer) { 
			
			var token = buffer.toString('hex');
			userdetail = {private_token:token }
			var user = new User(userdetail);
			user.userKey = shortId(user._id);
			
			user.save(function (err) {
			    if (err) {
			      console.log(err);
			      return
			    }
			    console.log('New user: ' + user);
			  });
			
			res.send({secret_seed:user.private_token});
		});

	}
	else{
		res.send(404);
	}
	
}

exports.validate= function(req, res)  {
	console.log(req.body)
	console.log(req.headers)
	User.find({private_token: req.body['key']}, function(err, user) {
		if(user != null && user != undefined) {
			res.send(user);	
		}
		else{
			res.send(404);
		}
	   
	});
}