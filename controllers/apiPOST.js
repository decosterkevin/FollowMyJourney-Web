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
	var reqBody = req.body;
	var secretKey = reqBody.secretKey;
	var param = reqBody.comment;
	var date = reqBody.date;
	var coor = reqBody.coordinates;
	User.findOne({private_token: secretKey}, function(err, user) {
		
		if (err || user == undefined || user == null) {
	        res.status(500).send(err);
	    }  
		else {
			var com = new CommentTrack({userKey: user.userKey ,coordinates: [coor.lat, coor.lon, coor.elev], Timestamp: new Date(date), comment: param});
			user.nbComments =  user.nbComments +1;
			com.save(function (err) {
			    if (err) {
			      console.log(err);
			      res.status(500).send(err);
			      return
			    }
			    console.log('New comment for user ' + user.id);
			  });
			
			user.save(function (err) {
			    if (err) {
			      console.log(err);
			      res.status(500).send(err);
			      return
			    }
			    console.log('user modified ' + user.id);
			  });
			
			res.status(200).send();
			
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
	
	User.findOne({private_token: secretKey}, function(err, user) {
		if (err || user == undefined || user == null) {
	        res.status(500).send(err);
	    }  
		else {
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
				    console.log('user modified ' + user.id);
				  });
				res.status(200).send();
			}
	});
	
}

exports.uploadGPS = function(req, res) {
	var reqBody = req.body;
	var secretKey = reqBody.secretKey;
	var gps = reqBody.coordinates;
	var date = reqBody.date;
	console.log(gps);
	User.findOne({private_token: secretKey}, function(err, user) {
		if (err || user == undefined || user == null) {
	        res.status(500).send(err);
	    }  
		else {
				
				for(i=0; i< gps.length; i++) {
					var item = gps[i];
					var lat = item.lat;
					var lon = item.lon;
					var elev = item.elev;
					var d = item.date;
					var speed = item.speed
					var gpsTmp = new GpsTrack({ userKey: user.userKey,coordinates: [lat, lon, elev],  timestamp: new Date(d), speed: speed });
					gpsTmp.save(function (err) {
				    	if(err) {
				    		console.log(err);
				    		res.status(500).send(err);
				    		return
				    	}
				    	 console.log('error gps add: id' +user.id);
						 res.status(200).send();
				    	
					});
				}
				   
			}   
		});
}


exports.deleteFile = function(req,res) {
	var reqBody = req.body;
	var secretKey = reqBody.secretKey;
	var name = reqBody.name;
	User.findOne({private_token: secretKey}, function(err, user) {
		
		if (err || user == undefined || user == null) {
	        res.status(500).send(err);
	    } 
		else {
			Image.findOne({userKey: user.userKey, name: name}, function(err, img) {
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
exports.testSigned = function(req, res) {
	var bucketName='tactical-factor-175508.appspot.com'
		const Storage = require('@google-cloud/storage');
	// Creates a client
	const storage = new Storage();
	var now = new Date();
	const options = {
			action: 'write',
			expires: Date.now() + 3600*1000,
			contentType: "image/jpeg"
		};
	var filename = "test.jpg"
	storage
	.bucket(bucketName)
	.file(filename)
	.getSignedUrl(options)
	.then(results => {
		var url = results[0];
		console.log(url)
		.catch(err => {
			res.status(404).send();
		});
	});
}

exports.uploadFile= function(req, res) {
	var reqBody = req.body;
	var bucketName='tactical-factor-175508.appspot.com'
	const Storage = require('@google-cloud/storage');
	// Creates a client
	const storage = new Storage();
	const options = {
			action: 'write',
			expires: Date.now() + 3600*1000,
			contentType: "image/jpeg"
		};
	
	var filename=reqBody.filename
	var secretKey = reqBody.secretKey;
	var path = 'https://storage.googleapis.com/' + bucketName + '/';
	var timestamp = new Date(reqBody.date);
	var coordinates = reqBody.coordinates;
	var comment = reqBody.comment;
	var w = reqBody.width;
	var h = reqBody.height;
	var date = reqBody.date;
	User.findOne({private_token: secretKey}, function(err, user) {
		if(err || user == null || user == undefined) {
			res.status(404).send();
		}
		else {
			// Get a signed URL for the file
			console.log("user find")
			storage
			.bucket(bucketName)
			.file(filename)
			.getSignedUrl(options)
			.then(results => {
				var url = results[0];
				
				var image = new Image({userKey: user.userKey, path: path ,name: filename, width:w, height: h, coordinates: [coordinates.lat, coordinates.lon, coordinates.elev], timestamp: new Date(date), comment: comment});    
				image.save(function (err) {
				    if (err) {
				      console.log(err);
				      res.status(500).send(err);
				      return
				    }
				});
				res.status(200).send({url:url});
				console.log(url)
				.catch(err => {
					res.status(404).send();
				});
			});
		}
	});
}

