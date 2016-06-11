var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/ping', function(req, res, next) {
  res.send('pong!');
});

router.get('/dashboard', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  res.send('dashboard!');
});

module.exports = router;
