const User = require("../models/User");
// Error Middleware
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");


// @desc    Register a User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {

      const { name, email, password, role } = req.body;

      const user = await User.create({
            name,
            email,
            password,
            role
      })
      // Token
      const token = user.getJwtToken();
      var tokenEmbededUser = user.toObject();
      tokenEmbededUser.token = token;

      res.status(200).json({
            success: true,
            userData: tokenEmbededUser
      })      
});


// @desc    Register a User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {

      const { name, email, password, role } = req.body;

      const user = await User.create({
            name,
            email,
            password,
            role
      })
      // Token
      const token = user.getJwtToken();
      var tokenEmbededUser = user.toObject();
      tokenEmbededUser.token = token;
      
      res.status(200).json({
            success: true,
            userData: tokenEmbededUser
      })      
});

