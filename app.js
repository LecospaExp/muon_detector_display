var url         = require('url'), 
    fs          = require('fs'), 
    serialport  = require("serialport"),
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
    cookieParser= require('cookie-parser')

// connect DB
mongoose.connect(DBconfig.url);

// express setup
app.set('port', 9487)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'taiwannumberone', key: 'lecospa'}));
// app.use(i18n); //multilang

var router = require('./router.js')();
app.use('/', router);

http.listen(9487)


var socket  = require('./handler/socketHandler.js')(io);
var baro    = require('./handler/barometerHandler.js')(socket, BAROconfig);
// require('./handler/serialPortHandler.js')(socket, db, SPconfig, baro);


