
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
   , nib = require('nib')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
;
var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var compression = require('compression');
var helmet = require('helmet');
var mongoDB;
if(process.env.MONGODB_URI !== 'undefined') {
	mongoDB = process.env.MONGODB_URI;
}
else {
	var config = require('./config.json');
	mongoDB = 'mongodb://'+ config.username+':' +config.password+'@ds127506.mlab.com:27506/local_db';
}


var app = express();


mongoose.connect(mongoDB, { useMongoClient: true });
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

function compile(str, path) {
	  return stylus(str)
	    .set('filename', path)
	    .use(nib());
	}
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(compression()); 
app.use(helmet());
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(stylus.middleware(
		  { src: __dirname + '/public'
		  , compile: compile
		  }
		))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Handle 404
app.use(function(req, res) {
    res.status(400);
   res.render('404.jade', {title: '404: File Not Found'});
});

var api = require('./controllers/api.js');
app.get('/', routes.index);
app.get('/journey', routes.journey);
app.get('/images', api.images);
app.get('/tracks', api.tracks);
app.get('/comments', api.comments);
app.get('/user', api.showUser);
app.get('/register', api.register);
app.get('/validate', api.validate);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

