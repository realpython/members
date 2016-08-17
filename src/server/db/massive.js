var massive = require('massive');
var environment = process.env.NODE_ENV;
var config = require('../../../knexfile.js')[environment];
var connectionString = config.connection;
var massiveInstance = massive.connectSync({
  connectionString: connectionString
});

module.exports = massiveInstance;
