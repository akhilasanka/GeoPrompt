var express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose=require('mongoose')
//Passport authentication
var passport = require('passport');

const requireUser = passport.authenticate('user', {session: false});

mongoose.connect('mongodb+srv://user:user@geoprompt.w1li0.mongodb.net/geoprompt?retryWrites=true&w=majority',{ useNewUrlParser: true , poolSize: 10 }, function(err) {
  if (err) throw err;
  else {
      console.log('Successfully connected to MongoDB');
  }
})

app.use(
	session({
		secret: "cmpe295b_geoprompt_node",
		resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
		saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
		duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
		activeDuration: 5 * 60 * 1000,
	})
);

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,OPTIONS,POST,PUT,DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
	);
	res.setHeader("Cache-Control", "no-cache");
	next();
});

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:8081", credentials: true }));

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

app.get("/test", function (req, res) {
	res.send("Hello World!");
});

app.use(passport.initialize());
require('./src/config/passport')(passport);

var basePath = '/geoprompt';
var taskRoutes = require('./src/routes/Task');
var locationRoutes = require('./src/routes/Location');
var userRoutes = require('./src/routes/User');

app.use(basePath, userRoutes);
app.use(basePath, requireUser, taskRoutes);
app.use(basePath, requireUser, locationRoutes);

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
