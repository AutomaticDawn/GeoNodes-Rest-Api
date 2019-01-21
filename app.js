const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const locationRoutes = require('./api/routes/locations');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
 'mongodb://Vlada:'
  + process.env.MONGO_ATLAS_PW
   + '@geonodes-shard-00-00-8donh.mongodb.net:27017,geonodes-shard-00-01-8donh.mongodb.net:27017,geonodes-shard-00-02-8donh.mongodb.net:27017/test?ssl=true&replicaSet=GeoNodes-shard-0&authSource=admin&retryWrites=true', 
	{
		//useMongoClient: true
	}
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((res, req, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
	"Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

//Routes which should handle requests
app.use('/locations', locationRoutes);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;