const express     = require('express');
const app         = express();

const cors        = require('cors');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const passport	  = require('passport');
const path        = require('path');

const config      = require('./config/database'); // get db config file
const User        = require('./models/user'); // get the mongoose model

const port        = process.env.PORT || 8085;
const jwt         = require('jwt-simple');

const routes      = require('./routes/routes');

// Use bluebird for new promises
mongoose.Promise = require('bluebird');

// CORS Middleware
app.use(cors());

// Body Pars Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Midlleware
app.use(passport.initialize());
app.use(passport.session());

// log to console
app.use(morgan('dev'));

// Route (GET http://localhost:3000)
app.use(express.static(path.join(__dirname, 'public')));

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// connect the api routes under /api/*
app.use('/api/', routes);

//Start the server
app.listen(port, function () {
    console.log('App listening on port: ', port)
});
