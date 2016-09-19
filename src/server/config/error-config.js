(function (errorConfig) {

  errorConfig.init = function (app) {

    // var logger = require('../utils/logger.js');

    // *** error handling *** //
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.customMessage = 'Sorry. That page cannot be found.';
      err.status = 404;
      next(err);
    });

    app.use(function(err, req, res, next) {
      // console.log('error', err.customMessage, err);
      res.status(err.status || 500);
      res.render('error', {
        message: err.customMessage || 'Something went wrong!',
        error: {}
      });
    });

  };

})(module.exports);
