var express = require('express');
var router = express.Router();

var authHelpers = require('../../auth/helpers');
var userQueries = require('../../db/queries.users');

// *** get verification status *** //
router.get('/verification', authHelpers.ensureAdmin,
function(req, res, next) {
  var status;
  // check status
  if (parseInt(process.env.CAN_VERIFY) === 1) {
    status = true;
  } else {
    status = false;
  }
  return res.status(200).json({
    status: 'success',
    verified: status
  });
});

// *** toggle verification status *** //
router.get('/verification/toggle', authHelpers.ensureAdmin,
function(req, res, next) {
  // check status
  if (parseInt(process.env.CAN_VERIFY) === 1) {
    process.env.CAN_VERIFY = 0;
  } else {
    process.env.CAN_VERIFY = 1;
  }
  req.flash('messages', {
    status: 'success',
    value: 'Verification status toggled.'
  });
  return res.redirect('/');
});

module.exports = router;
