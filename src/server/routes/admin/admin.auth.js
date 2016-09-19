const express = require('express');
const router = express.Router();

const authHelpers = require('../../auth/helpers');
const userQueries = require('../../db/queries.users');

// *** get verification status *** //
router.get(
  '/verification',
  authHelpers.ensureAdmin,
  getVerificationStatus
);

// *** toggle verification status *** //
router.get(
  '/verification/toggle',
  authHelpers.ensureAdmin,
  toggleVerificationStatus
);

function getVerificationStatus(req, res, next) {
  let status = false;
  // check status
  if (parseInt(process.env.CAN_VERIFY) === 1) status = true;
  return res.status(200).json({
    status: 'success',
    verified: status
  });
}

function toggleVerificationStatus(req, res, next) {
  process.env.CAN_VERIFY = 1;
  // check status
  if (parseInt(process.env.CAN_VERIFY) === 1) process.env.CAN_VERIFY = 0;
  req.flash('messages', {
    status: 'success',
    value: 'Verification status toggled.'
  });
  return res.redirect('/');
}

module.exports = router;
