"use strict";

var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    "enum": ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    "default": false
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
}); // Static method to get average of course

CourseSchema.statics.getAverageCost = function _callee(bootcampId) {
  var obj;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Calculating AvG cose');
          _context.next = 3;
          return regeneratorRuntime.awrap(this.aggregate([{
            $match: {
              bootcamp: bootcampId
            }
          }, {
            $group: {
              _id: '$bootcamp',
              averageCost: {
                $avg: '$tuition'
              }
            }
          }]));

        case 3:
          obj = _context.sent;
          console.log('Hakuna : ' + JSON.stringify(obj));
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
          }));

        case 8:
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](5);
          console.log('Some error has occured');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[5, 10]]);
};

CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});
CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model('Course', CourseSchema);