const express = require('express');
const { 
      register,
      loginUser,
      me,
      forgetPassword,
      resetPassword
} = require('../controllers/auth');

// Bring protect middleware
const { protectRoute } = require('../middleware/auth');

const router = express.Router();

router.route('/register')
.post(register);

router.route('/login')
.post(loginUser);

router.route('/me')
.get(protectRoute, me);

router.route('/forgetPassword')
.get(forgetPassword);

router.route('/resetpassword/:token')
.put(resetPassword);


module.exports = router;