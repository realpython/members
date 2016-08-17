// *** logger config *** //
var logger = require('./utils/logger.js');

// *** express instance *** //
var express = require('express');
var app = express();

// *** express config *** //
if (process.env.NODE_ENV === 'test') {
  var appConfig = require('./config/test-config.js');
  appConfig.init(app, express);
} else {
  logger.info('Configuring Express...');
  var appConfig = require('./config/main-config.js');
  appConfig.init(app, express);
  logger.info('Express configured!');
}

// *** route config *** //
if (process.env.NODE_ENV !== 'test') {
  logger.info('Configuring routes...');
}
var routeConfig = require('./config/route-config.js');
routeConfig.init(app);

// *** error config *** //
if (process.env.NODE_ENV !== 'test') {
  logger.info('Configuring error handling...');
}
var errorConfig = require('./config/error-config.js');
errorConfig.init(app);

module.exports = app;
