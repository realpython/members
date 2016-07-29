// *** main dependencies *** //
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var swigExtras = require('swig-extras');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

// *** .env *** //
if (process.env.NODE_ENV !== 'production' || 'staging') {
  require('dotenv').config();
}

// *** routes *** //
var routes = require('./routes/index');
var contactRoutes = require('./routes/contact');
var authRoutes = require('./routes/auth');
var chapterRoutes = require('./routes/chapters');
var lessonRoutes = require('./routes/lessons');
var userRoutes = require('./routes/users');
var messageRoutes = require('./routes/messages');
var searchRoutes = require('./routes/search');
var suggestionRoutes = require('./routes/suggestion');
var adminUserRoutes = require('./routes/admin.users');
var adminMessageRoutes = require('./routes/admin.messages');
var adminChapterRoutes = require('./routes/admin.chapters');
var adminLessonRoutes = require('./routes/admin.lessons');

// *** express instance *** //
var app = express();

// *** view engine *** //
// var swig = new swig.Swig();
swigExtras.useFilter(swig, 'truncate');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// *** config middleware *** //
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client')));

// *** main routes *** //
app.use('/', routes);
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);
app.use('/chapters', chapterRoutes);
app.use('/lessons', lessonRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/search', searchRoutes);
app.use('/suggestions', suggestionRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/messages', adminMessageRoutes);
app.use('/admin/chapters', adminChapterRoutes);
app.use('/admin/lessons', adminLessonRoutes);

// *** error handling *** //
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.customMessage = 'That page cannot be found.';
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  console.error(err.message); // set up error logging
  res.status(err.status || 500);
  res.render('error', {
    message: err.customMessage || 'Something went wrong!',
    error: {}
  });
});

module.exports = app;
