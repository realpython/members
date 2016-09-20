(function() {

  'use strict';

  const massive = require('massive');
  const environment = process.env.NODE_ENV;
  const config = require('../../../knexfile.js')[environment];
  const connectionString = config.connection;
  const massiveInstance = massive.connectSync({connectionString});

  module.exports = massiveInstance;

}());
