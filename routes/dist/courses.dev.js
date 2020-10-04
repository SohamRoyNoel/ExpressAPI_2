"use strict";

var express = require('express');

var _require = require('../controllers/courses'),
    getCourses = _require.getCourses; // mergeParams says to accept redirected route from different controller


var router = express.Router({
  mergeParams: true
});
router.route('/').get(getCourses);
module.exports = router;