//server

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var config = require('./config.js');
var User = require('./app/models/users');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res){
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res){
	var sam = new User({
		name: 'Samantha Jacobs',
		password: 'soccer1',
		admin: true
	});
	
	sam.save(function(err){
		if(err) throw err;
		
		console.log('User saved successfully');
		res.json({success: true});
	});
});

// apply the routes to our application with the prefix /api
app.use('/api', require('./router'));  

app.listen(port);
console.log('Magic happens at http://localhost:' + port);

