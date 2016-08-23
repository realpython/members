var express = require('express');
var router = express.Router();

var authHelpers = require('../../auth/helpers');
var adminRouteHelpers = require('./_helpers_admin');
var userQueries = require('../../db/queries.users');
var lessonQueries = require('../../db/queries.lessons');
var codeQueries = require('../../db/queries.codes');
var lessonAndUserQueries = require('../../db/queries.users_lessons');

// *** get all users *** //
router.get('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Admin', 'Users'];
  // get all users
  return userQueries.getUsers()
  .then(function(users) {
    // get all unused and active verify codes
    // TODO: update to return only id and verify_code from sql query?
    return codeQueries.getActiveUnunsedCodes()
    .then(function(codes) {
      // parse verify codes
      var parsedVerifyCodes = adminRouteHelpers.parseVerifyCodes(codes);
      var renderObject = {
        title: 'Textbook LMS - admin',
        pageTitle: 'Users',
        user: req.user,
        users: users,
        verifyCodes: parsedVerifyCodes,
        breadcrumbs: breadcrumbs,
        messages: req.flash('messages')
      };
      return res.render('admin/users', renderObject);
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** get single user *** //
router.get('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  var userID = parseInt(req.params.id);
  return userQueries.getSingleUser(userID)
  .then(function(user) {
    if (user.length) {
      var userObject = user[0];
      // get verify code id
      if (userObject.verify_code) {
        return codeQueries.getCodeFromVerifyCode(userObject.verify_code)
        .then(function(code) {
          if (code.length) {
            userObject.verify_code_id = code[0].id;
            return res.status(200).json({
              status: 'success',
              data: userObject
            });
          } else {
            return res.status(500).json({
              message: 'Something went wrong.'
            });
          }
        })
        .catch(function(err) {
          return res.status(500).json({
            message: 'Something went wrong.'
          });
        });
      } else {
        userObject.verify_code_id = null;
        return res.status(200).json({
          status: 'success',
          data: userObject
        });
      }
    } else {
      return res.status(500).json({
        message: 'Something went wrong.'
      });
    }
  })
  .catch(function(err) {
    return res.status(500).json({
      message: 'Something went wrong.'
    });
  });
});

// *** add new user *** //
router.post('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var user = {
    github_username: payload.githubUsername,
    github_id: payload.githubID,
    github_display_name: payload.githubDisplayName,
    github_access_token: payload.githubToken,
    github_avatar: payload.githubAvatar || 'https://avatars.io/static/default_128.jpg',
    email: payload.email,
    admin: payload.admin || false,
    verified: payload.verified || false,
    verify_code: payload.verifyCode || null,
    active: payload.active || true
  };
  if (user.verify_code === '') {
    user.verify_code = null;
  }
  // if verified is true, then verify code must not be null
  if (user.verified && user.verify_code === null) {
    req.flash('messages', {
      status: 'danger',
      value: 'If verified is active then there must be a verified code.'
    });
    return res.redirect('/admin/users');
  // if verify code is not null, then verified must be true
  } else if (!user.verified && user.verify_code !== null) {
    req.flash('messages', {
      status: 'danger',
      value: 'If verified code is not null then verified must be active.'
    });
    return res.redirect('/admin/users');
  // if verified is true and verify code is not null, (1) get verify code from id and (2) ensure verify code is correct - exists and used is false
  } else if (user.verified && user.verify_code) {
    return codeQueries.getCodeFromID(parseInt(user.verify_code))
    .then(function(code) {
      if (!code.length) {
        req.flash('messages', {
          status: 'danger',
          value: 'Verification code is incorrect.'
        });
        return res.redirect('/admin/users');
      } else {
        user.verify_code = code[0].verify_code;
        // TODO: refactor into a function
        return userQueries.addUser(user)
        .then(function(addedUser) {
          if (addedUser.length) {
            var userID = parseInt(addedUser[0].id);
            // update users_lessons
            // 1 - get all lessons
            return lessonQueries.getAllLessons()
            .then(function(lessons) {
              // 2 - update users_lessons
              lessons.forEach(function(lesson) {
                return lessonAndUserQueries.addRow({
                  user_id: userID,
                  lesson_id: lesson.id
                })
                .then(function(results) {
                  // console.log(results);
                });
              });
              // update codes
              return codeQueries.updateCodeFromVerifyCode(user.verify_code)
              .then(function(results) {
                req.flash('messages', {
                  status: 'success',
                  value: 'User added.'
                });
                return res.redirect('/admin/users');
              });
            });
          }
        })
        .catch(function(err) {
          // TODO: be more specific with the errors
          return next(err);
        });
      }
    });
  }
  // TODO: refactor into a function
  return userQueries.addUser(user)
  .then(function(addedUser) {
    if (addedUser.length) {
      var userID = parseInt(addedUser[0].id);
      // update users_lessons
      // 1 - get all lessons
      return lessonQueries.getAllLessons()
      .then(function(lessons) {
        // 2 - update users_lessons
        lessons.forEach(function(lesson) {
          return lessonAndUserQueries.addRow({
            user_id: userID,
            lesson_id: lesson.id
          })
          .then(function(results) {
            // console.log(results);
          });
        });
        // update codes
        return codeQueries.updateCodeFromVerifyCode(user.verify_code)
        .then(function(results) {
          req.flash('messages', {
            status: 'success',
            value: 'User added.'
          });
          return res.redirect('/admin/users');
        });
      });
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** update user *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var userID = parseInt(req.params.id);
  var payload = req.body;
  var userObject = {
    github_username: payload.githubUsername,
    github_id: payload.githubID,
    github_display_name: payload.githubDisplayName,
    github_access_token: payload.githubToken,
    github_avatar: payload.githubAvatar,
    email: payload.email,
    admin: payload.admin,
    active: payload.active
  };
  // TODO: update payload => verify_code to verify_code_id
  var verifyCodeID = payload.verify_code;
  if (verifyCodeID === '') {
    verifyCodeID = null;
  }
  // if verified is true, then verify code id must not be null
  if (payload.verified === 'true' && verifyCodeID === null) {
    // TODO: handle error better
    return res.status(500).json({
      message: 'If verified is active then there must be a verified code.'
    });
  }
  // if verify code id is not null, then verified must be true
  if (payload.verified === 'false' && verifyCodeID !== null) {
    return res.status(500).json({
      message: 'If verified code is not null then verified must be active.'
    });
  }
  // get verify code from verify code id
  if (verifyCodeID) {
    return codeQueries.getCodeFromID(verifyCodeID)
    .then(function(code) {
      if (code.length) {
        userObject.verify_code = code[0].verify_code;
        userObject.verified = true;
        // check if user already has a code
        return userQueries.getSingleUserByID(userID)
        .then(function(user) {
          if (user) {
            // if code
            if (user[0].verify_code) {
              // check if code is different
              if (user[0].verify_code === code[0].verify_code) {
                // no - then it must be unused
                // is code unused and active?
                codeQueries.getActiveUnunsedCodesFromVerifyCode(
                  code[0].verify_code)
                .then(function(results) {
                  if (results) {
                    // yes - update user
                    return userQueries.updateUser(userID, userObject)
                    .then(function(user) {
                      if (user.length) {
                        return res.status(200).json({
                          status: 'success',
                          message: 'User updated.'
                        });
                      } else {
                        return res.status(500).json({
                          message: 'Something went wrong.'
                        });
                      }
                    })
                    .catch(function(err) {
                      return res.status(500).json({
                        message: 'Something went wrong.'
                      });
                    });
                  } else {
                    // no - throw error
                    return res.status(500).json({
                      message: 'Something went wrong.'
                    });
                  }
                });
              } else {
                // yes - update user
                return userQueries.updateUser(userID, userObject)
                .then(function(user) {
                  if (user.length) {
                    // mark old code to inactive
                    return codeQueries.markCodeInactiveFromVerifyCode(
                      user[0].verify_code)
                    .then(function(updatedCode) {
                      if (updatedCode.length) {
                        return userQueries.updateUser(userID, userObject)
                        .then(function(user) {
                          if (user.length) {
                            return res.status(200).json({
                              status: 'success',
                              message: 'User updated.'
                            });
                          } else {
                            return res.status(500).json({
                              message: 'Something went wrong.'
                            });
                          }
                        })
                        .catch(function(err) {
                          return res.status(500).json({
                            message: 'Something went wrong.'
                          });
                        });
                      } else {
                        return res.status(500).json({
                          message: 'Something went wrong.'
                        });
                      }
                    });
                  } else {
                    return res.status(500).json({
                      message: 'Something went wrong.'
                    });
                  }
                })
                .catch(function(err) {
                  return res.status(500).json({
                    message: 'Something went wrong.'
                  });
                });
              }
            } else {
              // if no code, then update the user
              // TODO: functionalize this code
              return userQueries.updateUser(userID, userObject)
              .then(function(user) {
                if (user.length) {
                  return res.status(200).json({
                    status: 'success',
                    message: 'User updated.'
                  });
                } else {
                  return res.status(500).json({
                    message: 'Something went wrong.'
                  });
                }
              })
              .catch(function(err) {
                return res.status(500).json({
                  message: 'Something went wrong.'
                });
              });
            }
          } else {
            return res.status(500).json({
              message: 'Something went wrong.'
            });
          }
        });
      } else {
        return res.status(500).json({
          message: 'Something went wrong.'
        });
      }
    });
  } else {
    return userQueries.updateUser(userID, userObject)
    .then(function(user) {
      if (user.length) {
        return res.status(200).json({
          status: 'success',
          message: 'User updated.'
        });
      } else {
        return res.status(500).json({
          message: 'Something went wrong.'
        });
      }
    })
    .catch(function(err) {
      return res.status(500).json({
        message: 'Something went wrong.'
      });
    });
  }
});

// *** deactivate user *** //
router.get('/:userID/deactivate', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var userID = parseInt(req.params.userID);
  return userQueries.deactivateUser(userID)
  .then(function(user) {
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User deactivated.'
      });
      return res.redirect('/admin/users');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That user does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** unverify user *** //
router.get('/:userID/unverify', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var userID = parseInt(req.params.userID);
  return userQueries.unverifyUser(userID)
  .then(function(user) {
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User unverified.'
      });
      return res.redirect('/admin/users');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That user does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
