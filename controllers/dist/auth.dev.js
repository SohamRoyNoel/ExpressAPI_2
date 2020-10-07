"use strict";

var User = require("../models/User"); // Error Middleware


var asyncHandler = require("../middleware/async");

var ErrorResponse = require("../utils/errorResponse"); // @desc    Register a User
// @route   POST /api/v1/auth/register
// @access  Public


exports.register = asyncHandler(function _callee(req, res, next) {
  var _req$body, name, email, password, role, user, token, tokenEmbededUser;

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
          // Token
          token = user.getJwtToken();
          tokenEmbededUser = user.toObject();
          tokenEmbededUser.token = token;
          res.status(200).json({
            success: true,
            userData: tokenEmbededUser
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Login a User
// @route   POST /api/v1/auth/login
// @access  Public

exports.loginUser = asyncHandler(function _callee2(req, res, next) {
  var _req$body2, email, password, user, isPassword, token, tokenEmbededUser;

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
          // Token
          token = user.getJwtToken();
          tokenEmbededUser = user.toObject();
          tokenEmbededUser.token = token;
          res.status(200).json({
            success: true,
            userData: tokenEmbededUser
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
});