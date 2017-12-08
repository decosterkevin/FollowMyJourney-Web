
/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('index', { title: 'Express' });
  
};
exports.journey = function(req, res){

	  res.render('journey', { title: 'Journey' });
	  
	};

