const User = require("../models/User");
// Error Middleware
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const crypto = require('crypto');
const sendEmail = require("../utils/sendMail");


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
      });

      sendTokenResponse(user, 200, res);
});


// @desc    Login a User
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
      console.log("Login");

      const { email, password } = req.body;    
      
      // check if that is password : LOGIN does not go through model so check manually
      if(!email || !password) {
            return next(new ErrorResponse('Please provide email or password', 400));
      }

      // +password as we have to include password, which will be validated with encrypted one
      const user = await User.findOne({ email }).select('+password');

      if(!user){
            return next(new ErrorResponse(`User can not be authenticated`, 404));
      } 

      // check if Password matches
      const isPassword = await user.signInWithJwt(password);

      if(!isPassword){
            return next(new ErrorResponse(`User can not be authenticated`, 404)); 
      }

      sendTokenResponse(user, 200, res);
});

// @desc    Logged in User
// @route   GET /api/v1/auth/me
// @access  Protected
exports.me = asyncHandler(async (req, res, next) => {

      const user = await User.findById(req.user.id);
      res.status(200).json({
            success: true,
            user: user
      })

});

// @desc    Forget Password
// @route   GET /api/v1/auth/forgetPassword
// @access  Protected
exports.forgetPassword = asyncHandler(async (req, res, next) => {

      const user = await User.findOne({ email: req.body.email });
      console.log(user);
      if(!user){
            return next(new ErrorResponse('No User Found with this email', 404));
      }

      // Get reset token : as we are obtaining a full user model; so we can call it on USER model
      const resetToken = user.getResetToken();

      console.log(resetToken);

      // save those fields
      await user.save({ validateBeforeSave: false });

      // create reset URL -Email Function
      const resetUrl = `${req.protocol}://${req.get('host',)}/api/v1/auth/resetpassword/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

      try {
            await sendEmail({
                  email: user.email,
                  subject: 'Password reset token',
                  message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
      } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });
                  return next(new ErrorResponse('Email could not be sent', 500));
            }

            res.status(200).json({
                  success: true,
                  user: user
            })
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:token
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
      // Get hashed token
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      // find user by the token
      const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
            return next(new ErrorResponse('Invalid token', 400));
      }

      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      sendTokenResponse(user, 200, res);
});


// Create token custom function
const sendTokenResponse = (user, statusCode, res) => {

      const token = user.getJwtToken();

      const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 *60 * 1000),
            httpOnly: true // Only accessible by Client side code
      };

      // embed token
      var tokenEmbededUser = user.toObject();
      tokenEmbededUser.token = token;

      res.status(statusCode).cookie('token', token, options)
      .json({
            success: true,
            // userData: tokenEmbededUser
            token: token
      })

}