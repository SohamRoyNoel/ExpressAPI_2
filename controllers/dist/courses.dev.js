"use strict";

var Course = require("../models/Course"); // Error Middleware


var asyncHandler = require("../middleware/async");

var ErrorResponse = require("../utils/errorResponse");

var Bootcamp = require("../models/Bootcamp"); // @desc    Get all courses
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
            // to find only courses
            // query = Course.find();
            // query = Course.find().populate('bootcamp'); // Returns courses along with full Bootcamp instead of Bootcamp id (creates a relational map)
            // Returns a specific field instead of full bootcamp model
            // Reverse populate is called VIRTUALIZATION : populate course in bootcamp
            query = Course.find().populate({
              path: 'bootcamp',
              select: 'name description'
            });
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
}); // @desc    Get a courses
// @route   GET /api/v1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(function _callee2(req, res, next) {
  var courses;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
          }));

        case 2:
          courses = _context2.sent;

          if (courses) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorResponse("No course is found on ".concat(req.params.id)), 404));

        case 5:
          res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Add a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.addCourse = asyncHandler(function _callee3(req, res, next) {
  var bootcamp, courses;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // Course has a dependency on Bootcamp. So, add a bootcamp to the course model manually
          req.body.bootcamp = req.params.bootcampId; // check if that bootcamp id exists

          _context3.next = 3;
          return regeneratorRuntime.awrap(Bootcamp.findById(req.params.bootcampId));

        case 3:
          bootcamp = _context3.sent;

          if (bootcamp) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new ErrorResponse("No bootcamp is found on ".concat(req.params.bootcampId)), 404));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(Course.create(req.body));

        case 8:
          courses = _context3.sent;
          res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(function _callee4(req, res, next) {
  var course;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Course.findById(req.params.id));

        case 2:
          course = _context4.sent;

          if (course) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new ErrorResponse("No Course is found on ".concat(req.params.id)), 404));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(Course.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 7:
          course = _context4.sent;
          res.status(200).json({
            success: true,
            count: course.length,
            data: course
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(function _callee5(req, res, next) {
  var course;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Course.findById(req.params.id));

        case 2:
          course = _context5.sent;

          if (course) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new ErrorResponse("No Course is found on ".concat(req.params.id)), 404));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(course.remove());

        case 7:
          res.status(200).json({
            success: true,
            count: course.length,
            data: course
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});