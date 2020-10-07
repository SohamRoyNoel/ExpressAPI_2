"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Bootcamp = require("../models/Bootcamp");

var geocoder = require('../utils/geocoder'); // Error Middleware


var asyncHandler = require("../middleware/async");

var ErrorResponse = require("../utils/errorResponse"); // Path module


var path = require('path'); // @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public


exports.getBootcamp = asyncHandler(function _callee(req, res, next) {
  var bootcamp;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.find());

        case 2:
          bootcamp = _context.sent;
          res.status(200).json({
            success: true,
            data: bootcamp
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Get all bootcamps BY VIRTUALS : list of courses (check bootcamp model)
// @route   GET /api/v1/bootcamps/course
// @access  Public

exports.getBootcampWithCourse = asyncHandler(function _callee2(req, res, next) {
  var bootcamp;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.find().populate('courses'));

        case 2:
          bootcamp = _context2.sent;
          res.status(200).json({
            success: true,
            data: bootcamp
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc      Search By multiple different query params
// @routes    Possible Routes
//            GET api/v1/bootcamps/filter?averageCost[lte]=10000 or api/v1/bootcamps/filter?averageCost[gte]=10000
//            GET api/v1/bootcamps/filter?averageCost[gte]=10000&location.city=Boston
//            GET api/v1/bootcamps/filter?careers[in]=Business
// @access    Public

exports.getBootcampAdvancedFilter = asyncHandler(function _callee3(req, res, next) {
  var query, queryString, bootcamp;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          queryString = JSON.stringify(req.query);
          queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, function (match) {
            return "$".concat(match);
          }); // '\b' stands for open boundary :: in mongoDB filtration is done by $, So just concat it

          query = Bootcamp.find(JSON.parse(queryString)); // console.log(queryString);

          _context3.next = 5;
          return regeneratorRuntime.awrap(query);

        case 5:
          bootcamp = _context3.sent;
          res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc      Select: selects a specific field(exclude other); 
// @routes    Possible Routes
//            select - GET api/v1/bootcamps/SelectSort?select=name, description  
//            select - GET api/v1/bootcamps/SelectSort?select=name, description&housing=true  
//            sort   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=name   
//            sortReverse   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=-name               
// @access    Public

exports.getBootcampSelectSort = asyncHandler(function _callee4(req, res, next) {
  var query, requestQuery, removeFields, queryString, fields, sortBy, bootcamp;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          requestQuery = _objectSpread({}, req.query); // Fields to exclude

          removeFields = ["select", "sort"]; // Loop over removeFields and delete them from query

          removeFields.forEach(function (param) {
            return delete requestQuery[param];
          });
          queryString = JSON.stringify(requestQuery);
          queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, function (match) {
            return "$".concat(match);
          });
          query = Bootcamp.find(JSON.parse(queryString)); // Select Fields
          // On URl : api/v1/bootcamps/filter?select=name, description
          // Accepted by mongoose : query.select('name description')

          if (req.query.select) {
            fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
          } // Sort Fields


          if (req.query.sort) {
            // Custom sort
            sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
          } else {
            // Default sort by date
            query = query.sort('-createdAt');
          } // console.log(queryString);


          _context4.next = 10;
          return regeneratorRuntime.awrap(query);

        case 10:
          bootcamp = _context4.sent;
          res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc      Pagination upon select-sort; 
// @routes    Possible Routes
//            select - GET api/v1/bootcamps/page?page=1  
//            select - GET api/v1/bootcamps/page?page=1&limit=2 
//            sort   - GET api/v1/bootcamps/page?page=1&limit=2&select=name  
//            sortReverse   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=-name               
// @access    Public

exports.getBootcampPagination = asyncHandler(function _callee5(req, res, next) {
  var query, requestQuery, removeFields, queryString, fields, sortBy, page, limit, startIndex, endIndex, total, bootcamp, pagination;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          requestQuery = _objectSpread({}, req.query); // Fields to exclude

          removeFields = ["select", "sort", "page", "limit"]; // Loop over removeFields and delete them from query

          removeFields.forEach(function (param) {
            return delete requestQuery[param];
          });
          queryString = JSON.stringify(requestQuery);
          queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, function (match) {
            return "$".concat(match);
          });
          query = Bootcamp.find(JSON.parse(queryString)); // Select Fields
          // On URl : api/v1/bootcamps/filter?select=name, description
          // Accepted by mongoose : query.select('name description')

          if (req.query.select) {
            fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
          } // Sort Fields


          if (req.query.sort) {
            // Custom sort
            sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
          } else {
            // Default sort by date
            query = query.sort('-createdAt');
          } // Pagination


          page = parseInt(req.query.page, 10) || 1;
          limit = parseInt(req.query.limit, 10) || 2;
          startIndex = (page - 1) * limit;
          endIndex = page * limit;
          _context5.next = 14;
          return regeneratorRuntime.awrap(Bootcamp.countDocuments());

        case 14:
          total = _context5.sent;
          query = query.skip(startIndex).limit(limit); // console.log(queryString);

          _context5.next = 18;
          return regeneratorRuntime.awrap(query);

        case 18:
          bootcamp = _context5.sent;
          // Pagination Result : if there is no previous page dont show that, same for next
          pagination = {};

          if (endIndex < total) {
            pagination.next = {
              page: page + 1,
              limit: limit
            };
          } // Previous link


          if (startIndex > 0) {
            pagination.prev = {
              page: page - 1,
              limit: limit
            };
          } // Next link


          res.status(200).json({
            success: true,
            count: bootcamp.length,
            pagination: pagination,
            data: bootcamp
          });

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public

exports.getBootcamps = asyncHandler(function _callee6(req, res, next) {
  var bootcamp;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.findById(req.params.id));

        case 2:
          bootcamp = _context6.sent;

          if (bootcamp) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(error));

        case 5:
          res.status(200).json({
            success: true,
            data: bootcamp
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private

exports.createBootcamps = asyncHandler(function _callee7(req, res, next) {
  var hasBootcamp, bootcamp;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          // Add user to request Body
          req.body.user = req.user.id; // check for published bootcamp

          _context7.next = 3;
          return regeneratorRuntime.awrap(Bootcamp.findOne({
            user: req.user.id
          }));

        case 3:
          hasBootcamp = _context7.sent;

          if (!(hasBootcamp && req.user.role != 'admin')) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", next(new ErrorResponse('You already have one bootcamp', 403)));

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(Bootcamp.create(req.body));

        case 8:
          bootcamp = _context7.sent;
          res.status(201).json({
            success: true,
            data: bootcamp
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamps = asyncHandler(function _callee8(req, res, next) {
  var bootcamp;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.findById(req.params.id));

        case 2:
          bootcamp = _context8.sent;

          if (bootcamp) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", next(error));

        case 5:
          if (!(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", next(new ErrorResponse('You are not authorized to update this bootcamp', 403)));

        case 7:
          _context8.next = 9;
          return regeneratorRuntime.awrap(Bootcamp.findOneAndUpdate(req.params.id, req.body, {
            "new": true,
            // To return updated data
            runValidators: true // Run validator explicitly 

          }));

        case 9:
          bootcamp = _context8.sent;
          res.status(200).json({
            success: true,
            data: bootcamp
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  });
}); // @desc    Delete Bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private

exports.deleteBootcamps = asyncHandler(function _callee9(req, res, next) {
  var bootcamp;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.findById(req.params.id));

        case 2:
          bootcamp = _context9.sent;

          if (bootcamp) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", next(error));

        case 5:
          if (!(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", next(new ErrorResponse('You are not authorized to update this bootcamp', 403)));

        case 7:
          // Delete bootcamp along with course
          bootcamp.remove();
          res.status(200).json({
            success: true,
            data: bootcamp
          });

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  });
}); // @desc    location
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private

exports.getBootcampsInRadious = asyncHandler(function _callee10(req, res, next) {
  var _req$params, zipcode, distance, loc, lat, lng, radius, bootcamps;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$params = req.params, zipcode = _req$params.zipcode, distance = _req$params.distance;
          _context10.next = 3;
          return regeneratorRuntime.awrap(geocoder.geocode(zipcode));

        case 3:
          loc = _context10.sent;
          lat = loc[0].latitude;
          lng = loc[0].longitude; // calculate radius 

          radius = distance / 6378; // Radius will be counted in KM

          _context10.next = 9;
          return regeneratorRuntime.awrap(Bootcamp.find({
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius]
              }
            }
          }));

        case 9:
          bootcamps = _context10.sent;
          res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
          });

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  });
}); // @desc    Upload photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private

exports.bootcampPhotoUpload = asyncHandler(function _callee12(req, res, next) {
  var bootcamp, file;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(Bootcamp.findById(req.params.id));

        case 2:
          bootcamp = _context12.sent;

          if (bootcamp) {
            _context12.next = 5;
            break;
          }

          return _context12.abrupt("return", next(error));

        case 5:
          if (req.files) {
            _context12.next = 7;
            break;
          }

          return _context12.abrupt("return", next(new ErrorResponse('Please upload a file', 400)));

        case 7:
          file = req.files.file; // check mime type; ifImage

          if (file.mimetype.startsWith('image')) {
            _context12.next = 10;
            break;
          }

          return _context12.abrupt("return", next(new ErrorResponse('This is not an image file', 400)));

        case 10:
          if (!(!file.size > process.env.MAX_FILE_UPLOAD)) {
            _context12.next = 12;
            break;
          }

          return _context12.abrupt("return", next(new ErrorResponse("Image is fatter then expected ".concat(process.env.MAX_FILE_UPLOAD), 400)));

        case 12:
          // Create custom file name with extension 
          file.name = "photo_".concat(bootcamp._id).concat(path.parse(file.name).ext); //photo_5d725a1b7b292f5f8ceff788.png
          // move the file to server location

          file.mv("".concat(process.env.FILE_UPLOAD_PATH, "/").concat(file.name), function _callee11(err) {
            return regeneratorRuntime.async(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    if (!err) {
                      _context11.next = 3;
                      break;
                    }

                    console.log(err);
                    return _context11.abrupt("return", next(new ErrorResponse('Problem with file response', 500)));

                  case 3:
                    _context11.next = 5;
                    return regeneratorRuntime.awrap(Bootcamp.findByIdAndUpdate(req.params.id, {
                      photo: file.name
                    }));

                  case 5:
                    res.status(200).json({
                      success: 200,
                      data: file.name
                    });

                  case 6:
                  case "end":
                    return _context11.stop();
                }
              }
            });
          });

        case 14:
        case "end":
          return _context12.stop();
      }
    }
  });
});