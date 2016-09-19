const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const authHelpers = require('../auth/helpers');
const chapterQueries = require('../db/queries.chapters');
const routeHelpers = require('./_helpers');

// *** contact *** //
router.get('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  getContact
);

function getContact(req, res, next) {
  const userID = req.user.id;
  // get all side bar data
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) return next(err);
    const renderObject = {
      title: 'Textbook LMS - contact',
      pageTitle: 'Contact',
      user: req.user,
      sortedChapters: data.sortedChapters,
      completedArray: data.completed,
      messages: req.flash('messages')
    };
    return res.render('contact', renderObject);
  });
}

router.post('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  const emailSubject = req.body.subject;
  const emailMessage = req.body.message;
  const userID = req.user.id;
  const userEmail = req.user.email;
  // nodemailer
  // TODO: update for staging
  const transport = {
    name: 'minimal',
    version: '0.1.0',
    send: function (mail, callback) {
      const input = mail.message.createReadStream();
      input.pipe(process.stdout);
      input.on('end', function () {
        callback(null, true);
      });
    }
  };
  const transporter = nodemailer.createTransport(transport);
  const mailOptions = {
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
