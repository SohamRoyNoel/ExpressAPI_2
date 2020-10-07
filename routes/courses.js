const express = require('express');

const { 
      getCourses,
      getCourse,
      addCourse,
      updateCourse,
      deleteCourse
} = require('../controllers/courses')

// Bring the Protect auth
const { protectRoute } = require('../middleware/auth');


// mergeParams says to accept redirected route from different controller
const router = express.Router({mergeParams: true});


router.route('/')
.get(getCourses)
.post(protectRoute, addCourse); // as it will hit /:bootcampId/courses, will be redirected to CourseRouter

router.route('/:id')
.get(getCourse)
.put(protectRoute, updateCourse)
.delete(protectRoute, deleteCourse);


module.exports = router;