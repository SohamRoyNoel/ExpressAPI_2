const express = require('express');
const { 
      getBootcamp,
       getBootcamps,
       createBootcamps,
       updateBootcamps,
       deleteBootcamps,
       getBootcampsInRadious,
       getBootcampAdvancedFilter,
       getBootcampSelectSort,
       getBootcampPagination,
       getBootcampWithCourse,
       bootcampPhotoUpload
} = require('../controllers/bootcamps')

// Bring the Protect auth
const { protectRoute, authRoles } = require('../middleware/auth');

// include other resource router :: Relation
const courseRouter = require('./courses');


const router = express.Router();

// Re-route into other resource : if ```'/:bootcampId/courses'``` this is the pattern, bootcamp will redirect to course router
router.use('/:bootcampId/courses', courseRouter);


router.route('/')
.get(getBootcamp)
.post(protectRoute, authRoles('publisher','admin'), createBootcamps); // PROVIDE those roles only who are only allowed to perform this action

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious);
router.route('/filter').get(getBootcampAdvancedFilter);
router.route('/SelectSort').get(getBootcampSelectSort);
router.route('/page').get(getBootcampPagination);
router.route('/virtualCourse').get(getBootcampWithCourse); // Virtuals : check model and controller

// JWT protected
router.route('/:id/photo').put(protectRoute, bootcampPhotoUpload);

router.route('/:id')
.get(getBootcamps)
.put(protectRoute, updateBootcamps)
.delete(protectRoute, authRoles('publisher','admin'), deleteBootcamps); // PROVIDE those roles only who are only allowed to perform this action

module.exports = router;