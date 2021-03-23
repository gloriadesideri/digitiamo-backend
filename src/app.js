require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require("http");
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');


const conn = mongoose.createConnection(process.env.MONGODB , {useUnifiedTopology: true, useNewUrlParser: true  });

mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
	console.log('We have an error with the database: ' + err);
})

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use(session({
	secret: process.env.SECRET,

}))


const guestRoutes=require('./routes')
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());


app.use(function(err, req, res, next){
	res.sendStatus(404).json({
		id:req.id,
		scheme:req.protocol,
		path:req.path,
		host:req.hostname,
		method:req.method,
		headers:req.headers,
		err:err
	});
	return;
});

//Handle 500
app.use(function(err, req, res, next){
	return res.sendStatus(500).json({
		id:req.id,
		scheme:req.protocol,
		path:req.path,
		host:req.hostname,
		method:req.method,
		headers:req.headers,
		err:err
	});
});

const PORT = process.env.PORT || 3000;
app.use('/', guestRoutes);

// Starting the server
server.listen(PORT, () => console.log('We have a server running on PORT: ' + PORT));
