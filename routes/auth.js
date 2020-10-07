const express = require('express');
const { 
      register,
      loginUser,
      me
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


module.exports = router;