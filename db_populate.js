var async = require('async')
var User = require('./models/user')
var GpsTrack = require('./models/gpsTrack')
var CommentTrack = require('./models/commentTrack')
var Image = require('./models/image')
//var gpxParse = require("gpx-parse");
//var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

//var geo =require("./geo.js");
var mongoDB = 'mongodb://dekev:kevin74@ds127506.mlab.com:27506/local_db';
mongoose.connect(mongoDB, { useMongoClient: true });
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//var users = []
//var gpsTracks = []
//var imageTracks = []
//var commentTracks = []

var dateTmp = new Date("2018-03-13T00:00:00.000Z");

Image.find({userKey: "DmzyV1"}, function(err, docs) {
	if (!err){ 
		docs.forEach(function(item) {
			console.log(item)
				// remove it from the array.
				console.log(item._id)
				Image.findOne({"_id" : item._id}, function(err, res) {
					
                	res.coordinates = [res.coordinates[0], -res.coordinates[1], res.coordinates[2]]
                	res.save(function (err) {
						if (err) {
							console.log(err);
							return
						}
						console.log('user modified ');
					});
                });
			
		});
        
    } else {throw err;}
	
});

//function userCreate(userKey, password, started, name_trip, cb) {
//  userdetail = {userKey:userKey , private_token:password, name_trip:name_trip, started: started }
//  var user = new User(userdetail);
//       
//  user.save(function (err) {
//    if (err) {
//      cb(err, null)
//      return
//    }
//    console.log('New user: ' + user);
//    users.push(user)
//    cb(null, user)
//  }  );
//}
//
//function gpsCreate(args, cb) {
//  var gps = new GpsTrack({ userKey: 'abcde',coordinates: [args[0],args[1], args[2]] ,  timestamp: cb});
//       
//  gps.save(function (err) {
////    if (err) {
////      cb(err, null);
////      return;
////    }
//    console.log('New gps: ' + gps);
//    gpsTracks.push(gps)
//    //cb(null, gps);
//  }   );
//}
//
//function imageCreate(userKey, path, comment,w,h, coordinates, cb) {
//
//  var image = new Image({userKey: 'abcde', path: 'https://storage.googleapis.com/tactical-factor-175508.appspot.com/' + path,width:w, height: h, coordinates: coordinates, timestamp: new Date("2016-11-18T05:06:17Z"), comment: comment});    
//  image.save(function (err) {
//    if (err) {
//      cb(err, null)
//      return
//    }
//    console.log('New image: ' + image);
//    imageTracks.push(image)
//    cb(null, image)
//  }  );
//}
//
//
//function commentCreate(userKey, coordinates, timestamp, comment, cb) {
//	
//  var comment = new CommentTrack({userKey, userKey, coordinates: coordinates, timestamp: timestamp, comment: comment});    
//  comment.save(function (err) {
//    if (err) {
//      console.log('ERROR CREATING comment: ' + comment);
//      cb(err, null)
//      return
//    }
//    console.log('New comment: ' + comment);
//    commentTracks.push(comment)
//    cb(null, comment)
//  }  );
//}
//
//
//function createUser(cb) {
//    async.parallel([
//        function(callback) {
//          userCreate('abcde', 'password', new Date(), "myTrip", callback);
//        }
//        ],
//        // optional callback
//        cb);
//}
//
//
//function createImages(cb) {
//    async.parallel([
//        function(callback) {
//          imageCreate('abcde', '01.jpg', 'comment 1',800,600, [6.05501,46.15706,0.0], callback);
//        },
//        function(callback) {
//            imageCreate('abcde', '02.jpg', 'comment 2',800,600, [  6.0484,46.13208,0.0], callback);
//        },
//        function(callback) {
//            imageCreate('abcde', '03.jpg', 'comment 3',800,600, [6.03812,46.11623,0.0], callback);
//        },
//        function(callback) {
//            imageCreate('abcde', '04.jpg', 'comment 4',800,600,[5.763,45.75403,0.0], callback);
//        },
//        function(callback) {
//            imageCreate('abcde', '05.jpg', 'comment 5',800,600,[5.6278,45.60403,0.0], callback);
//        }
//        ,
//        function(callback) {
//            imageCreate('abcde', '06.jpg', 'comment 6',600,900,[5.6178,45.605,0.0], callback);
//        }
//        ],
//        // optional callback
//        cb);
//}
//
//function createComment(cb) {
//    async.parallel([
//        function(callback) {
//        	commentCreate('abcde', [6.757817566394806, 46.401623357087374,386.19997], new Date("2010-01-01T13:09:24Z"), "Let's go", callback);
//        },
//        function(callback) {
//        	commentCreate('abcde',  [6.34848078712821,46.36092050001025,-2.349999], new Date("2010-01-11T13:09:24Z"), "Tire blow up :(", callback);
//        },
//        function(callback) {
//        	commentCreate('abcde', [5.40628002025187, 45.85337002761662,198],new Date("2010-01-21T13:09:24Z"), "Getting tired",callback);
//        }
//        ],
//        // optional callback
//        cb);
//}
//
//
//function createBookInstances(cb) {
//	var asyncTasks = [];
//	coordinates.forEach(function(item) {
//		asyncTasks.push(function(callback) {
//			gpsCreate(item, callback);
//		});
//	});
//	async.parallel(asyncTasks, function() {
//		console.log("Done");
//	});
//}
//
////async.series([
////    createImages
////    
////],
//// optional callback
//function(err, results) {
//    if (err) {
//        console.log('FINAL ERR: '+err);
//    }
//    else {
//        console.log('BOOKInstances: '+bookinstances);
//        
//    }
//    //All done, disconnect from database
//    mongoose.connection.close();
//});
//
//function createBookInstances() {
//	var asyncTasks = [];
//	var date = new Date();
//	for(i = 0; i< coordinates.length; i++) {
//		if(i % 10 == 0) {
//			gpsCreate(coordinates[i], date.setSeconds(date.getSeconds() + 30));
//		}
//		
//	}
//}
//
//createBookInstances()





