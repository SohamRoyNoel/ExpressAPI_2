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
    bootcampPhotoUpload = _require.bootcampPhotoUpload; // Bring the Protect auth


var _require2 = require('../middleware/auth'),
    protectRoute = _require2.protectRoute,
    authRoles = _require2.authRoles; // include other resource router :: Relation


var courseRouter = require('./courses');

var router = express.Router(); // Re-route into other resource : if ```'/:bootcampId/courses'``` this is the pattern, bootcamp will redirect to course router

router.use('/:bootcampId/courses', courseRouter);
router.route('/').get(getBootcamp).post(protectRoute, authRoles('publisher', 'admin'), createBootcamps); // PROVIDE those roles only who are only allowed to perform this action

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious);
router.route('/filter').get(getBootcampAdvancedFilter);
router.route('/SelectSort').get(getBootcampSelectSort);
router.route('/page').get(getBootcampPagination);
router.route('/virtualCourse').get(getBootcampWithCourse); // Virtuals : check model and controller
// JWT protected

router.route('/:id/photo').put(protectRoute, bootcampPhotoUpload);
router.route('/:id').get(getBootcamps).put(protectRoute, updateBootcamps)["delete"](protectRoute, authRoles('publisher', 'admin'), deleteBootcamps); // PROVIDE those roles only who are only allowed to perform this action

module.exports = router;