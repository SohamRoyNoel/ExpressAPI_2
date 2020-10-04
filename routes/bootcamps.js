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
const router = express.Router()

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