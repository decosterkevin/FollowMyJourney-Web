
var User = require('../models/user')
var GpsTrack = require('../models/gpsTrack')
var CommentTrack = require('../models/commentTrack')
var Image = require('../models/image')
var crypto = require('crypto');
var shortId = require('short-mongo-id');
var crypto = require("crypto");
var fs = require("fs");

exports.tracks = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
			GpsTrack.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec( function(err, replies) {
				res.status(200).send(replies);
			});
		}

	});
};
exports.comments = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
			CommentTrack.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec(function(err, replies) {
				res.status(200).send(replies);
			});
		}

	});
};
exports.images = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey}, function(err, user) {
		if(user != null && user != undefined) {
			Image.find({userKey: userKey}).sort({timestamp: 'ascending'}).exec(function(err, replies) {
				res.status(200).send(replies);
			});
		}

	});
};
exports.showUser = function(req, res) {
	var userKey = req.query.id;
	User.find({userKey: userKey},'userKey nameTrip nbImages nbComments started ended',function(err, user) {
		console.log(user);
		res.status(200).send(user);

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

			res.status(200).send({secret_seed:user.private_token});
		});

	}
	else{
		res.send(404);
	}

}

exports.validate= function(req, res)  {
	User.findOne({private_token: req.headers['key']}, function(err, user) {
		if(user != null && user != undefined) {
			
			
			user.nameTrip = req.headers['param']
			user.save(function (err) {
				if (err) {
					console.log(err);
					return
				}
				console.log('user modified: ' + user);
			});
			
			Image.find({userKey : user.userKey}, 'path name').sort({timestamp: 'ascending'}).exec(function(err, replies) {
				res.status(200).send({user:user, images : replies});
			});
			
		}
		else{
			res.status(404).send('oups, something went wrong');
		}

	});
}





