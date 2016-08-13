(function (appConfig) {

  // *** main dependencies *** //
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var swig = require('swig');
  var swigExtras = require('swig-extras');
  var session = require('express-session');
  var flash = require('connect-flash');
  var passport = require('passport');
  var morgan = require('morgan');

  // *** .env *** //
  if (process.env.NODE_ENV !== 'production' || 'staging') {
    require('dotenv').config();
  }

  appConfig.init = function (app, express) {

    var logger = require('../utils/logger.js');

    // *** view engine *** //
    logger.debug('Setting \'Swig\' as view engine');
    // var swig = new swig.Swig();
    swigExtras.useFilter(swig, 'truncate');
    swigExtras.useFilter(swig, 'markdown');
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, '..', 'views'));

    // *** config middleware *** //
    logger.debug('Setting configuration middleware');
    logger.debug('Overriding \'Express\' logger');
    app.use(morgan('combined', {
      stream: logger.stream
    }));
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
    app.use(express.static(path.join(__dirname, '..', '..', 'client')));

  };

})(module.exports);
