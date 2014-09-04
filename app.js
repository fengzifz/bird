
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: settings.cookieSecret,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
    db: new MongoStore({
        db: settings.db
    })
}));

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

// 路由配置
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Export app
module.exports = app;