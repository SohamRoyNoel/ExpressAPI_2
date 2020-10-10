"use strict";

var express = require('express');

var _require = require('../controllers/auth'),
    register = _require.register,
    loginUser = _require.loginUser,
    me = _require.me,
    forgetPassword = _require.forgetPassword,
    resetPassword = _require.resetPassword; // Bring protect middleware


var _require2 = require('../middleware/auth'),
    protectRoute = _require2.protectRoute;

var router = express.Router();
router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/me').get(protectRoute, me);
router.route('/forgetPassword').get(forgetPassword);
router.route('/resetpassword/:token').put(resetPassword);
module.exports = router;