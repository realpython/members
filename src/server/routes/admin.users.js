var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var userQueries = require('../db/queries.users');

router.get('/users', authHelpers.ensureAdmin,
function(req, res, next) {
  // get all users
  userQueries.getUsers()
  .then(function(users) {
    var renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Users',
      user: req.user,
      users: users,
      messages: req.flash('messages')
    };
    res.render('admin/users', renderObject);
  })
  .catch(function(err) {
    next(err);
  });
});

module.exports = router;
