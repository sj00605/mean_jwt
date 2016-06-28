var express = require('express');
var app = express();
var config = require('./config.js');
var User = require('./app/models/users');
var jwt = require('jsonwebtoken');
//API routes

var apiRoutes = express.Router();
app.set('superSecret', config.secret);
// route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token
apiRoutes.post('/authenticate', function(req, res){
	
	User.findOne({
		name: req.body.name
	}, function (err, user){
		if(err) throw err;
		
		if(!user){
			res.json({success: false, message: 'Authentication failed. User not found.'});
		}else if (user){
			
			if(user.password != req.body.password){
				res.json({success: false, message: 'Authentication failed. Wrong Password'});
			}else{
				
				var token = jwt.sign(user, app.get('superSecret'),{
					expiresInMinutes: 1440
				});
				
				res.json({
					success: true,
					message: 'Enjoy your token',
					token: token
				});
			}
		}
	});
});

apiRoutes.use(function(req, res, next){
	
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	//decode token
	if(token){
		
		jwt.verify(token, app.get('superSecret'), function(err, decoded){
			if(err){
				return res.json({sucess: false, message: 'Failed to authenticate token.'});
			}else{
				req.decoded = decoded;
				next();
			}
		});
	}else{
		// if there is no token
		// return an error
		//no next so we get stopped here
		
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 

module.exports = apiRoutes;