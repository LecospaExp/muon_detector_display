var url         = require('url'), 
    fs          = require('fs'), 
    // serialport  = require("serialport"),
    express     = require('express'),
    app         = express(),
    path        = require('path'),
    http        = require('http').Server(app),
    io          = require('socket.io')(http), 
    session     = require('express-session'),
    mongoose    = require('mongoose'),
    DBconfig    = require('./config/db'),
    SPconfig    = require('./config/sp'),
    BAROconfig    = require('./config/baro'),
    mongojs     = require('mongojs'),
    db          = mongojs(DBconfig.url, ['events'])
    i18n        = require('./lang/i18n'),
    cookieParser= require('cookie-parser'),
    sharedsession = require("express-socket.io-session");


// connect DB
mongoose.connect(DBconfig.url);

// session
session = session({ 
		secret: 'taiwannumberone', 
		key: 'lecospa',
		resave: true,  
		saveUninitialized: true,
        cookie:{
            maxAge:60*60*24*30 //1 month
        }
	})

// express setup
app.set('port', 9487)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(session)
// app.use(i18n); //multilang

io.use(sharedsession(session, cookieParser()));



http.listen(9487)

var database = require('./database/dbHandler')(app, db)
var socket  = require('./handler/socketHandler.js')(io, database);
var baro    = require('./handler/barometerHandler.js')(socket, BAROconfig, database);
require('./handler/serialPortHandler.js')(socket, database, SPconfig, baro);


var router = require('./router.js')(database);
app.use('/', router);
