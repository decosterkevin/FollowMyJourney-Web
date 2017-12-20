var User = require('../models/user')
var GpsTrack = require('../models/gpsTrack')
var CommentTrack = require('../models/commentTrack')
var Image = require('../models/image')
var crypto = require('crypto');
var shortId = require('short-mongo-id');

/**
 * http://usejsdoc.org/
 */

exports.uploadComment =  function(req, res) {
	var reqBody = JSON.parse(req.body);
	var secretKey = reqBody.secretKey;
	var param = reqBody.comment;
	var date = reqBody.date;
	var coordinates = reqBody.coordinates;
	User.find({private_token: secretKey}, function(err, user) {
		if(user != null && user != undefined) {
			var com = new CommentTrack({userKey: user.userKey ,coordinates: coordinates, Timestamp: new Date(date), comment: param});
			user.nbComments =  user.nbComments +1;
			com.save(function (err) {
			    if (err) {
			      console.log(err);
			      return
			    }
			    console.log('New comment for user ' + user.id);
			  });
			
			user.save(function (err) {
			    if (err) {
			      console.log(err);
			      return
			    }
			    console.log('user modified ' + user.id);
			  });
			
			res.status(200).send();
			
		}
		else{
			res.status(404).send();
		}
	   
	});
	
};
exports.uploadJourneyStatus =  function(req, res) {
	console.log(req.body);
	console.log(req.header)
	var reqBody = req.body;
	var secretKey = reqBody.secretKey;
	var status = reqBody.status;
	var date = reqBody.date;
	
	User.find({private_token: secretKey}, function(err, user) {
		if (err) {
	        res.status(500).send(err);
	    } 
		else {
			if(user != null && user != undefined) {
				if(status == "stop") {
					user.ended = new Date(date);
				}
				else if(status == "start") {
					user.started = new Date(date);
				}
				user.save(function (err) {
				    if (err) {
				      console.log(err);
				      res.status(500).send(err);
				      return
				    }
				    console.log('New comment for user ' + user);
				  });
				res.status(200).send();
			}
			else{
				res.status(404).send(err);
			}
		
		}
	});
	
}

exports.uploadGPS = function(req, res) {
	var reqBody = JSON.parse(req.body);
	var secretKey = reqBody.secretKey;
	var gps = reqBody.gpsTracks;
	var date = reqBody.date;
	
	User.find({private_token: secretKey}, function(err, user) {
		if (err) {
	        res.status(500).send(err);
	    } 
		else {
			if(user != null && user != undefined) {
				gps.forEach(function(item) {
					var gps = new GpsTrack({ userKey: user.userKey,coordinates: [item.lat, item.lon, item.elev],  timestamp: new Date(item.date)});
				    gps.save(function (err) {
				    	if(err) {
				    		console.log('error gps add: id' +user.id);
				    		res.status(500).send(err);
				    		return
				    	}
				    	
					});
				    
				});
				
				res.status(500).send(err);
			}
		}
	});
}
exports.deleteFile = function(req,res) {
	var reqBody = JSON.parse(req.body);
	var secretKey = reqBody.secretKey;
	var name = reqBody.name;
	User.find({private_token: secretKey}, function(err, user) {
		if (err || user == undefined || user == null) {
	        res.status(500).send(err);
	    } 
		else {
			Image.find({userKey: user.userKey, name: name}, function(err, img) {
				if(err || img == null || img == undefined) {
		    		console.log('error gps add: id' +user.id);
		    		res.status(500).send(err);
		    	}
				else {
					img.remove();
					res.status(200).send(err);
				}
			});
		}
	});
}

exports.uploadFile= function(req, res) {
	var reqBody = JSON.parse(req.body);
	var bucketName='factor-175508.appspot.com'
	const Storage = require('@google-cloud/storage');
	// Creates a client
	const storage = new Storage();
	const options = {
		action: 'write',
		expires: new Date().getTime()+3600,
	};
	
	var filename=reqBody.filename
	var secretKey = reqBody.secretKey;
	var path = 'https://storage.googleapis.com/' + bucketName + '/';
	var timestamp = new Date(reqBody.date);
	var coordinates = reqBody.coordinates;
	var comment = reqBody.comment;
	var w = reqBody.width;
	var h = reqBody.height;
	User.find({private_token: secretKey}, function(err, user) {
		if(err || user == null || user == undefined) {
			res.status(404).send();
		}
		else {
			// Get a signed URL for the file
			storage
			.bucket(bucketName)
			.file(filename)
			.getSignedUrl(options)
			.then(results => {
				const url = results[0];
				var image = new Image({userKey: user.userKey, path: path ,name: filename, width:w, height: h, coordinates: coordinates, timestamp: date, comment: comment});    
				image.save(function (err) {
				    if (err) {
				      console.log(err);
				      res.status(500).send(err);
				      return
				    }
				res.status(200).send({url:url});
				console.log(`The signed url for ${filename} is ${url}.`);
				})
				.catch(err => {
					console.error('ERROR:', err);
					res.status(404).send();
				});
			});
		}
	});
}

