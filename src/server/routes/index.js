var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');

router.get('/', function(req, res, next) {
  var renderObject = {
    title: 'Textbook LMS',
    user: req.user,
    messages: req.flash('messages')
  };
  res.render('index', renderObject);
});

router.get('/ping', function(req, res, next) {
  res.send('pong!');
});

router.get('/dashboard', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  res.render('dashboard', {
    user: req.user,
    messages: req.flash('messages')
  });
});

module.exports = router;
