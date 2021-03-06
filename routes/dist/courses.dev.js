"use strict";

var express = require('express');

var _require = require('../controllers/courses'),
    getCourses = _require.getCourses,
    getCourse = _require.getCourse,
    addCourse = _require.addCourse,
    updateCourse = _require.updateCourse,
    deleteCourse = _require.deleteCourse; // Bring the Protect auth


var _require2 = require('../middleware/auth'),
    protectRoute = _require2.protectRoute; // mergeParams says to accept redirected route from different controller


var router = express.Router({
  mergeParams: true
});
router.route('/').get(getCourses).post(protectRoute, addCourse); // as it will hit /:bootcampId/courses, will be redirected to CourseRouter

router.route('/:id').get(getCourse).put(protectRoute, updateCourse)["delete"](protectRoute, deleteCourse);
module.exports = router;