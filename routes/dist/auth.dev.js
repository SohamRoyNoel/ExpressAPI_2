"use strict";

var express = require('express');

var _require = require('../controllers/auth'),
    register = _require.register;

var router = express.Router();
router.route('/register').post(register);
module.exports = router;