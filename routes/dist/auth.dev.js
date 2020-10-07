"use strict";

var express = require('express');

var _require = require('../controllers/auth'),
    register = _require.register,
    loginUser = _require.loginUser,
    me = _require.me; // Bring protect middleware


var _require2 = require('../middleware/auth'),
    protectRoute = _require2.protectRoute;

var router = express.Router();
router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/me').get(protectRoute, me);
module.exports = router;