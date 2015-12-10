var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var routes = require('./routes');
var session = require('express-session');
var app = express();

// view engine setup
app.set('view engine', 'html');
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    tags: {
      variableStart: '<$',
      variableEnd: '$>'
    }
});

app.use(favicon(path.join(__dirname, 'public/images', 'doesxyz.ico'))); // uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: process.env.APP_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// database client
var db = require('./db');
db(app);

// Routes
routes(app);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// more passport stuff
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// --- ERROR HANDLERS ---
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
