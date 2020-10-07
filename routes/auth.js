const express = require('express');
const { 
      register,
      loginUser
} = require('../controllers/auth');

const router = express.Router();

router.route('/register')
.post(register);

router.route('/login')
.post(loginUser);


module.exports = router;