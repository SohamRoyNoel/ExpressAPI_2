"use strict";

var express = require('express');

var _require = require('../controllers/auth'),
    register = _require.register,
    loginUser = _require.loginUser;

var router = express.Router();
router.route('/register').post(register);
router.route('/login').post(loginUser);
module.exports = router;