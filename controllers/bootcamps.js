const Bootcamp = require("../models/Bootcamp");
const geocoder = require('../utils/geocoder');
// Error Middleware
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// Path module
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
      
      const bootcamp = await Bootcamp.find();
      res.status(200).json({
            success: true,
            data: bootcamp
      })      
});

// @desc    Get all bootcamps BY VIRTUALS : list of courses (check bootcamp model)
// @route   GET /api/v1/bootcamps/course
// @access  Public
exports.getBootcampWithCourse = asyncHandler(async (req, res, next) => {
      
      const bootcamp = await Bootcamp.find().populate('courses');
      res.status(200).json({
            success: true,
            data: bootcamp
      })      
});

// @desc      Search By multiple different query params
// @routes    Possible Routes
//            GET api/v1/bootcamps/filter?averageCost[lte]=10000 or api/v1/bootcamps/filter?averageCost[gte]=10000
//            GET api/v1/bootcamps/filter?averageCost[gte]=10000&location.city=Boston
//            GET api/v1/bootcamps/filter?careers[in]=Business
// @access    Public
exports.getBootcampAdvancedFilter = asyncHandler(async (req, res, next) => {

      let query;
      let queryString = JSON.stringify(req.query);
      queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); // '\b' stands for open boundary :: in mongoDB filtration is done by $, So just concat it
      query = Bootcamp.find(JSON.parse(queryString));
      // console.log(queryString);
      const bootcamp = await query;

      res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
      })      
});

// @desc      Select: selects a specific field(exclude other); 
// @routes    Possible Routes
//            select - GET api/v1/bootcamps/SelectSort?select=name, description  
//            select - GET api/v1/bootcamps/SelectSort?select=name, description&housing=true  
//            sort   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=name   
//            sortReverse   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=-name               
// @access    Public
exports.getBootcampSelectSort = asyncHandler(async (req, res, next) => {

      let query;
      const requestQuery = {...req.query};

      // Fields to exclude
      const removeFields  = ["select", "sort"];
      // Loop over removeFields and delete them from query
      removeFields.forEach(param => delete requestQuery[param]);

      let queryString = JSON.stringify(requestQuery);
      queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
      query = Bootcamp.find(JSON.parse(queryString));

      // Select Fields
      // On URl : api/v1/bootcamps/filter?select=name, description
      // Accepted by mongoose : query.select('name description')
      if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
      }
      // Sort Fields
      if(req.query.sort){
            // Custom sort
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
      } else {
            // Default sort by date
            query = query.sort('-createdAt');
      }

      // console.log(queryString);
      const bootcamp = await query;  
      
      res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
      })      
});

// @desc      Pagination upon select-sort; 
// @routes    Possible Routes
//            select - GET api/v1/bootcamps/page?page=1  
//            select - GET api/v1/bootcamps/page?page=1&limit=2 
//            sort   - GET api/v1/bootcamps/page?page=1&limit=2&select=name  
//            sortReverse   - GET api/v1/bootcamps/SelectSort?select=name, description,createdAt&sort=-name               
// @access    Public
exports.getBootcampPagination = asyncHandler(async (req, res, next) => {

      let query;
      const requestQuery = {...req.query};

      // Fields to exclude
      const removeFields  = ["select", "sort", "page", "limit"];
      // Loop over removeFields and delete them from query
      removeFields.forEach(param => delete requestQuery[param]);

      let queryString = JSON.stringify(requestQuery);
      queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
      query = Bootcamp.find(JSON.parse(queryString));

      // Select Fields
      // On URl : api/v1/bootcamps/filter?select=name, description
      // Accepted by mongoose : query.select('name description')
      if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
      }
      // Sort Fields
      if(req.query.sort){
            // Custom sort
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
      } else {
            // Default sort by date
            query = query.sort('-createdAt');
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 2;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await Bootcamp.countDocuments();

      query = query.skip(startIndex).limit(limit);


      // console.log(queryString);
      const bootcamp = await query;  

      // Pagination Result : if there is no previous page dont show that, same for next
      const pagination = {};
      if(endIndex < total){
            pagination.next = {
                  page: page + 1,
                  limit

            }
      }

      // Previous link
      if(startIndex > 0) {
            pagination.prev = {
                  page: page - 1,
                  limit
            }
      }

      // Next link
      res.status(200).json({
            success: true,
            count: bootcamp.length,
            pagination: pagination,
            data: bootcamp
      })      
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
      
      const bootcamp = await Bootcamp.findById(req.params.id);
      if(!bootcamp){
            // Has to return in order to continue with next request
            return next(error); 
      }
      res.status(200).json({
            success: true,
            data: bootcamp
      })    
      
})

// @desc    Create new Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
      // Add user to request Body
      req.body.user = req.user.id;

      // check for published bootcamp
      const hasBootcamp = await Bootcamp.findOne({ user: req.user.id });

     // Only Admin can insert multiple Bootcamps
     if(hasBootcamp && req.user.role != 'admin'){
           return next(new ErrorResponse('You already have one bootcamp', 403));
     }

      //console.log(req.body);
      const bootcamp = await Bootcamp.create(req.body);
      res.status(201).json({
            success: true,
            data: bootcamp
      })      
})

// @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
      // res.status(200).json({  success:true, data: { msg: `Update bootcamps ${req.params.id}` }  })
      const bootcamp = await Bootcamp
            .findByIdAndUpdate(
                  req.params.id,
                        req.body,
                  {
                        new: true, // To return updated data
                        runValidators: true  // Run validator explicitly 
                  }
            );
      if(!bootcamp){  
            return next(error);
      }
      res.status(200).json({
            success: true,
            data: bootcamp
      }) 
})

// @desc    Delete Bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
      // When you want to delete only a bootcamp by ID
      // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

      // Cascade delete feature :: use middleware in bootcamp model
      const bootcamp = await Bootcamp.findById(req.params.id);

      if(!bootcamp){   
            return next(error);
      }

      // Delete bootcamp along with course
      bootcamp.remove();

      res.status(200).json({
            success: true,
            data: bootcamp
      })    
})

// @desc    location
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadious = asyncHandler(async (req, res, next) => {
      const { zipcode, distance } = req.params;
      
      const loc = await geocoder.geocode(zipcode);   
      const lat = loc[0].latitude;
      const lng = loc[0].longitude;

      // calculate radius 
      const radius = distance / 6378; // Radius will be counted in KM
      const bootcamps = await Bootcamp.find({
            location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
      });
      
      res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
      })    
})

// @desc    Upload photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

      const bootcamp = await Bootcamp.findById(req.params.id);

      if(!bootcamp){   
            return next(error);
      }

      // Check if the file exists
      if(!req.files){
            return next(new ErrorResponse('Please upload a file', 400));
      }

      const file = req.files.file;
      // check mime type; ifImage
      if(!file.mimetype.startsWith('image')){
            return next(new ErrorResponse('This is not an image file', 400));
      }
      // Check file size
      if(!file.size > process.env.MAX_FILE_UPLOAD){
            return next(new ErrorResponse(`Image is fatter then expected ${process.env.MAX_FILE_UPLOAD}`, 400));
      }

      // Create custom file name with extension 
      file.name= `photo_${bootcamp._id}${path.parse(file.name).ext}`; //photo_5d725a1b7b292f5f8ceff788.png

      // move the file to server location
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                  console.log(err);
                  return next(new ErrorResponse('Problem with file response', 500));
            }

            await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

            res.status(200).json({
                  success:200,
                  data: file.name
            })
      })
      
})