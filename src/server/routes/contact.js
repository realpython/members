var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** contact *** //
router.get('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var userID = req.user.id;
  // get all side bar data
  routeHelpers.getSideBarData(userID)
  .then(function(data) {
    var renderObject = {
      title: 'Textbook LMS - contact',
      pageTitle: 'Contact',
      user: req.user,
      sortedChapters: data.sortedChapters,
      completedArray: data.completed,
      messages: req.flash('messages')
    };
    return res.render('contact', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

router.post('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var emailSubject = req.body.subject;
  var emailMessage = req.body.message;
  var userID = req.user.id;
  var userEmail = req.user.email;
  // nodemailer
  // TODO: update for staging
  var transport = {
    name: 'minimal',
    version: '0.1.0',
    send: function (mail, callback) {
      var input = mail.message.createReadStream();
      input.pipe(process.stdout);
      input.on('end', function () {
        callback(null, true);
      });
    }
  };
  var transporter = nodemailer.createTransport(transport);
  var mailOptions = {
    from: userEmail,
    to: 'test',
    subject: emailSubject,
    text: emailMessage
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (!error) {
      req.flash('messages', {
        status: 'success',
        value: 'Message sent.'
      });
      res.redirect('/');
    } else {
      return next(error);
    }
  });
});

module.exports = router;
