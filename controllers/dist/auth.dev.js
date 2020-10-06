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
}); // @desc    Register a User
// @route   GET /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(function _callee2(req, res, next) {
  var _req$body2, name, email, password, role, user, token, tokenEmbededUser;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, role = _req$body2.role;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: password,
            role: role
          }));

        case 3:
          user = _context2.sent;
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
          return _context2.stop();
      }
    }
  });
});