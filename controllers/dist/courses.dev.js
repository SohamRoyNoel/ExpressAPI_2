"use strict";

var Course = require("../models/Course"); // Error Middleware


var asyncHandler = require("../middleware/async"); // @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public


exports.getCourses = asyncHandler(function _callee(req, res, next) {
  var query, courses;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.params.bootcampId) {
            query = Course.find({
              bootcamp: req.params.bootcampId
            });
          } else {
            query = Course.find();
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(query);

        case 3:
          courses = _context.sent;
          res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});