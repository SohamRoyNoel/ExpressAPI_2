"use strict";

var mongoose = require('mongoose');

var slugify = require('slugify');

var geocoder = require('../utils/geocoder');

var BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Add an name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more then 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  website: {
    type: String,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use a valid URL with HTTP or HTTPS']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      "enum": ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    "enum": ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other']
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    "default": 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    "default": false
  },
  jobAssistance: {
    type: Boolean,
    "default": false
  },
  jobGuarantee: {
    type: Boolean,
    "default": false
  },
  acceptGi: {
    type: Boolean,
    "default": false
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}, {
  // Reverse populate: add courses along with bootcamp
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
}); // Geocode & create location field

BootcampSchema.pre('save', function _callee(next) {
  var loc;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(geocoder.geocode(this.address));

        case 2:
          loc = _context.sent;
          this.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName,
            city: loc[0].city,
            state: loc[0].stateCode,
            zipcode: loc[0].zipcode,
            country: loc[0].countryCode
          }; // Do not save address in DB

          this.address = undefined;
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // Cascade delete : remove courses if bootcamp is removed

BootcampSchema.pre('remove', function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Courses being removed from bootcamp ".concat(this._id));
          _context2.next = 3;
          return regeneratorRuntime.awrap(this.model('Course').deleteMany({
            bootcamp: this._id
          }));

        case 3:
          // as every course has a boot camp id
          next();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
}); // Reverse populate with virtuals

BootcampSchema.virtual('courses', {
  ref: 'Course',
  // Model name
  localField: '_id',
  // set primary key to bootcamp
  foreignField: 'bootcamp',
  // set foreign key to Course
  justOne: false // As we need array of all courses associated to the bootcamp

});
module.exports = mongoose.model('Bootcamp', BootcampSchema);