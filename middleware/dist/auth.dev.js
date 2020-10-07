"use strict";

var jwt = require('jsonwebtoken');

var asyncHandler = require("../middleware/async");

var ErrorResponse = require("../utils/errorResponse");

var User = require("../models/User"); // protect route : will be added to the ROUTES method


exports.protectRoute = asyncHandler(function _callee(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // extract token
            token = req.headers.authorization.split(' ')[1];
          } // else if(req.cookies.token){
          // token = req.cookies.token;
          // }
          // make sure token exists


          if (token) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new ErrorResponse('Not authorized', 401)));

        case 3:
          _context.prev = 3;
          // verify the token
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(JSON.stringify(decoded));
          _context.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          req.user = _context.sent;
          next();
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          return _context.abrupt("return", next(new ErrorResponse('Unexpected Error', 401)));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 12]]);
}); // Check Role Permissions : applied on BOOTCAMP routes

exports.authRoles = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to perform this action', 403));
    }

    next();
  };
};