const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
      //console.log(err.stack);
      let error = { ...err }; // spread operator :: copies all properties from "err" to error
      error.message = err.message;
     
      // Mongoose bad ObjectID
      console.log(err); // contains all value from req param
      if(err.name === 'CastError'){
            const message = `Bootcamp not found with id of ${err.value}`;
            error = new ErrorResponse(message, 404);
      }

      // Mongoose Duplicate Key
      if(err.code === 11000){
            const message = `Duplicate field value entered`;
            error = new ErrorResponse(message, 404);
      }

      // Mongoose Validation Error
      if(err.name === 'ValidationError'){
            const message = Object.values(err.message).map(val => val.message);
            error = new ErrorResponse(message, 400);          
      }
      res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
      });
};

module.exports = errorHandler;