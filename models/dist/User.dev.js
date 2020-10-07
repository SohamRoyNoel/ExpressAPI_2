"use strict";

var crypto = require('crypto');

var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  role: {
    type: String,
    "enum": ['user', 'publisher'],
    "default": 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  //   confirmEmailToken: String,
  //   isEmailConfirmed: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   twoFactorCode: String,
  //   twoFactorCodeExpire: Date,
  //   twoFactorEnable: {
  //     type: Boolean,
  //     default: false,
  //   },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}); // encrypt password

UserSchema.pre('save', function _callee(next) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 2:
          salt = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, salt));

        case 5:
          this.password = _context.sent;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // JWT Generator - Called from Controller

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}; // Match user entered password to the hashed password to the db


UserSchema.methods.signInWithJwt = function _callee2(enteredPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPassword, this.password));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

module.exports = mongoose.model('User', UserSchema);