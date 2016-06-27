var express = require('express');
var router = express.Router();

var userQueries = require('../db/queries.users');

if (process.env.NODE_ENV === 'development' || 'testing') {
  // update user to admin
  router.put('/:username/admin', function(req, res, next) {
    var update = req.body;
    if (!('admin' in req.body)) {
      res.status(403);
      res.json({
        message: 'You do not have permission to do that.'
      });
    } else {
      userQueries.getSingleUserByUsername(req.params.username)
      .then(function(user) {
        if (user.length) {
          return userQueries.makeAdmin(req.params.username, req.body.admin)
          .then(function(response) {
            res.json({
              status: 'success',
              message: 'User admin status updated.'
            });
          });
        } else {
          res.status(400);
          res.json({
            message: 'That user does not exist.'
          });
        }
      })
      .catch(function(err) {
        res.status(500);
        res.json({
          message: 'Something went wrong.'
        });
      });
    }
  });
}

module.exports = router;
