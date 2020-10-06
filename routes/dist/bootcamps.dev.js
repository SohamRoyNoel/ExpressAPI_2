"use strict";

var express = require('express');

var _require = require('../controllers/bootcamps'),
    getBootcamp = _require.getBootcamp,
    getBootcamps = _require.getBootcamps,
    createBootcamps = _require.createBootcamps,
    updateBootcamps = _require.updateBootcamps,
    deleteBootcamps = _require.deleteBootcamps,
    getBootcampsInRadious = _require.getBootcampsInRadious,
    getBootcampAdvancedFilter = _require.getBootcampAdvancedFilter,
    getBootcampSelectSort = _require.getBootcampSelectSort,
    getBootcampPagination = _require.getBootcampPagination,
    getBootcampWithCourse = _require.getBootcampWithCourse,
    bootcampPhotoUpload = _require.bootcampPhotoUpload; // include other resource router :: Relation


var courseRouter = require('./courses');

var router = express.Router(); // Re-route into other resource : if ```'/:bootcampId/courses'``` this is the pattern, bootcamp will redirect to course router

router.use('/:bootcampId/courses', courseRouter);
router.route('/').get(getBootcamp).post(createBootcamps);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious);
router.route('/filter').get(getBootcampAdvancedFilter);
router.route('/SelectSort').get(getBootcampSelectSort);
router.route('/page').get(getBootcampPagination);
router.route('/virtualCourse').get(getBootcampWithCourse); // Virtuals : check model and controller

router.route('/:id/photo').put(bootcampPhotoUpload);
router.route('/:id').get(getBootcamps).put(updateBootcamps)["delete"](deleteBootcamps);
module.exports = router;