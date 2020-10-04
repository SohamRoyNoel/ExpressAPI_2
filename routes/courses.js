const express = require('express');

const { 
      getCourses,
      getCourse,
      addCourse,
      updateCourse,
      deleteCourse
} = require('../controllers/courses')

// mergeParams says to accept redirected route from different controller
const router = express.Router({mergeParams: true});

router.route('/')
.get(getCourses)
.post(addCourse); // as it will hit /:bootcampId/courses, will be redirected to CourseRouter

router.route('/:id')
.get(getCourse)
.put(updateCourse)
.delete(deleteCourse);




module.exports = router;