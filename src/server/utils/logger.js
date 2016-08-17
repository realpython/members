var winston = require('winston');
var path = require('path');

winston.emitErrs = true;

// *** log file *** //
if (process.env.NODE_ENV === 'test') {
  var logFileName = path.join(__dirname, '..', 'logs', 'test-logs.log');
} else {
  var logFileName = path.join(__dirname, '..', 'logs', 'all-logs.log');
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: logFileName,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
      prettyPrint: true
    })
  ],
  exitOnError: false
});

module.exports = logger;

module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
