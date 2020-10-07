const jwt = require('jsonwebtoken');
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// protect route : will be added to the ROUTES method
exports.protectRoute = asyncHandler(async (req, res, next) => {

      let token;
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // extract token
            token = req.headers.authorization.split(' ')[1];

      }
      // else if(req.cookies.token){
            // token = req.cookies.token;
      // }

      // make sure token exists
      if(!token){
            return next(new ErrorResponse('Not authorized', 401));
      }

      try {
            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(JSON.stringify(decoded));
            req.user = await User.findById(decoded.id);
            next();
      } catch (error) {
            return next(new ErrorResponse('Unexpected Error', 401));
      }

});

// Check Role Permissions : applied on BOOTCAMP routes
exports.authRoles = (...roles) =>{
      return (req, res, next) => {
            if(!roles.includes(req.user.role)){
                  return next(new ErrorResponse('Not authorized to perform this action', 403));
            }
            next();
      }
}