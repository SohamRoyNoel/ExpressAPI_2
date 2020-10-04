"use strict";

var express = require('express');

var _require = require('../controllers/courses'),
    getCourses = _require.getCourses,
    getCourse = _require.getCourse,
    addCourse = _require.addCourse,
    updateCourse = _require.updateCourse,
    deleteCourse = _require.deleteCourse; // mergeParams says to accept redirected route from different controller


var router = express.Router({
  mergeParams: true
});
router.route('/').get(getCourses).post(addCourse); // as it will hit /:bootcampId/courses, will be redirected to CourseRouter

router.route('/:id').get(getCourse).put(updateCourse)["delete"](deleteCourse);
module.exports = router;