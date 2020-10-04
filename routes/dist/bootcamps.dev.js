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
    getBootcampPagination = _require.getBootcampPagination;

var router = express.Router();
router.route('/').get(getBootcamp).post(createBootcamps);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious);
router.route('/filter').get(getBootcampAdvancedFilter);
router.route('/SelectSort').get(getBootcampSelectSort);
router.route('/page').get(getBootcampPagination);
router.route('/:id').get(getBootcamps).put(updateBootcamps)["delete"](deleteBootcamps);
module.exports = router;