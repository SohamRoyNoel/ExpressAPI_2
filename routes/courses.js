const express = require('express');

const { 
      getCourses
} = require('../controllers/courses')

// mergeParams says to accept redirected route from different controller
const router = express.Router({mergeParams: true});

router.route('/').get(getCourses);

module.exports = router;