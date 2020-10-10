"use strict";

var User = require("../models/User"); // Error Middleware


var asyncHandler = require("../middleware/async");

var ErrorResponse = require("../utils/errorResponse");

var crypto = require('crypto');

var sendEmail = require("../utils/sendMail"); // @desc    Register a User
// @route   POST /api/v1/auth/register
// @access  Public


exports.register = asyncHandler(function _callee(req, res, next) {
  var _req$body, name, email, password, role, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, role = _req$body.role;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: password,
            role: role
          }));

        case 3:
          user = _context.sent;
          sendTokenResponse(user, 200, res);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Login a User
// @route   POST /api/v1/auth/login
// @access  Public

exports.loginUser = asyncHandler(function _callee2(req, res, next) {
  var _req$body2, email, password, user, isPassword;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Login");
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // check if that is password : LOGIN does not go through model so check manually

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", next(new ErrorResponse('Please provide email or password', 400)));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select('+password'));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", next(new ErrorResponse("User can not be authenticated", 404)));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.signInWithJwt(password));

        case 11:
          isPassword = _context2.sent;

          if (isPassword) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", next(new ErrorResponse("User can not be authenticated", 404)));

        case 14:
          sendTokenResponse(user, 200, res);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Logged in User
// @route   GET /api/v1/auth/me
// @access  Protected

exports.me = asyncHandler(function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context3.sent;
          res.status(200).json({
            success: true,
            user: user
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    Forget Password
// @route   GET /api/v1/auth/forgetPassword
// @access  Protected

exports.forgetPassword = asyncHandler(function _callee4(req, res, next) {
  var user, resetToken, resetUrl, message;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context4.sent;
          console.log(user);

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", next(new ErrorResponse('No User Found with this email', 404)));

        case 6:
          // Get reset token : as we are obtaining a full user model; so we can call it on USER model
          resetToken = user.getResetToken();
          console.log(resetToken); // save those fields

          _context4.next = 10;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 10:
          // create reset URL -Email Function
          resetUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/api/v1/auth/resetpassword/").concat(resetToken);
          message = "You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ".concat(resetUrl);
          _context4.prev = 12;
          _context4.next = 15;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: message
          }));

        case 15:
          res.status(200).json({
            success: true,
            data: 'Email sent'
          });
          _context4.next = 26;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](12);
          console.log(_context4.t0);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context4.next = 25;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 25:
          return _context4.abrupt("return", next(new ErrorResponse('Email could not be sent', 500)));

        case 26:
          res.status(200).json({
            success: true,
            user: user
          });

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[12, 18]]);
}); // @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:token
// @access    Public

exports.resetPassword = asyncHandler(function _callee5(req, res, next) {
  var resetPasswordToken, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // Get hashed token
          resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); // find user by the token

          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new ErrorResponse('Invalid token', 400)));

        case 6:
          // Set new password
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context5.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          sendTokenResponse(user, 200, res);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // Create token custom function

var sendTokenResponse = function sendTokenResponse(user, statusCode, res) {
  var token = user.getJwtToken();
  var options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true // Only accessible by Client side code

  }; // embed token

  var tokenEmbededUser = user.toObject();
  tokenEmbededUser.token = token;
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    // userData: tokenEmbededUser
    token: token
  });
};