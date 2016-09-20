((appConfig) => {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const swig = require('swig');
  const swigExtras = require('swig-extras');
  const session = require('express-session');
  const flash = require('connect-flash');
  const passport = require('passport');
  const morgan = require('morgan');

  // *** .env *** //
  if (process.env.NODE_ENV !== 'production' || 'staging') {
    require('dotenv').config();
  }

  appConfig.init = (app, express) => {

    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }

    // *** view engine *** //
    // const swig = new swig.Swig();
    swigExtras.useFilter(swig, 'truncate');
    swigExtras.useFilter(swig, 'markdown');
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, '..', 'views'));

    // *** config middleware *** //
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
