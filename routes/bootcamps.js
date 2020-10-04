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
       getBootcampPagination
} = require('../controllers/bootcamps')

// include other resource router :: Relation
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource : if ```'/:bootcampId/courses'``` this is the pattern, bootcamp will redirect to course router
router.use('/:bootcampId/courses', courseRouter);


router.route('/')
.get(getBootcamp)
.post(createBootcamps);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious);
router.route('/filter').get(getBootcampAdvancedFilter);
router.route('/SelectSort').get(getBootcampSelectSort);
router.route('/page').get(getBootcampPagination);

router.route('/:id')
.get(getBootcamps)
.put(updateBootcamps)
.delete(deleteBootcamps);

module.exports = router;