"use strict";

var fs = require('fs');

var mongoose = require('mongoose');

var dotenv = require('dotenv'); // Load ENV


dotenv.config({
  path: './config/config.env'
}); // Load models

var Bootcamp = require('./models/Bootcamp');

var Course = require('./models/Course');

var User = require('./models/User'); // Connect to DB


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}); // Read JSON files

var bootcamps = JSON.parse(fs.readFileSync("".concat(__dirname, "/_data/bootcamps.json"), 'utf-8'));
var Courses = JSON.parse(fs.readFileSync("".concat(__dirname, "/_data/courses.json"), 'utf-8'));
var Users = JSON.parse(fs.readFileSync("".concat(__dirname, "/_data/users.json"), 'utf-8')); // Import into DB

var importData = function importData() {
  return regeneratorRuntime.async(function importData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Bootcamp.create(bootcamps));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(Course.create(Courses));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.create(Users));

        case 7:
          console.log('Data Imported...');
          process.exit();
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Delete data


var deleteData = function deleteData() {
  return regeneratorRuntime.async(function deleteData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Bootcamp.deleteMany());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Course.deleteMany());

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.deleteMany());

        case 7:
          console.log('Data Destroyed...');
          process.exit();
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}