const Course = require("../models/Course");
// Error Middleware
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");


// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
      
      let query;
      if(req.params.bootcampId){
            query = Course.find({bootcamp: req.params.bootcampId});
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

      const courses = await query;

      res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
})      

});

// @desc    Get a courses
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
        

      const courses = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
      });

      if(!courses){
            return next(new ErrorResponse(`No course is found on ${req.params.id}`), 404);
      }

      res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
})      

});

// @desc    Add a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {

      // Course has a dependency on Bootcamp. So, add a bootcamp to the course model manually
      req.body.bootcamp = req.params.bootcampId;

      // check if that bootcamp id exists
      const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
      if(!bootcamp){
            return next(new ErrorResponse(`No bootcamp is found on ${req.params.bootcampId}`), 404);
      }

      const courses = await Course.create(req.body);

      res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
})      

});

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

      // check if that Course id exists
      let course = await Course.findById(req.params.id);
    
      if(!course){
            return next(new ErrorResponse(`No Course is found on ${req.params.id}`), 404);
      }

      course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
      })

      res.status(200).json({
      success: true,
      count: course.length,
      data: course
})      

});


// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

      // check if that bootcamp id exists
      const course = await Course.findById(req.params.id);
    
      if(!course){
            return next(new ErrorResponse(`No Course is found on ${req.params.id}`), 404);
      }

      await course.remove();     

      res.status(200).json({
      success: true,
      count: course.length,
      data: course
})      

});
















