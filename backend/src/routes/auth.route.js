const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  updateUserProfile,
  sendForgotPasswordOtp,     
  verifyOtpAndResetPassword,
  getMe
} = require('../controllers/auth.controller');



router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authUser, logoutUser);
router.put('/update-profile', authUser, updateUserProfile);
router.post('/forgot-password', sendForgotPasswordOtp);       
router.post('/reset-password-otp', verifyOtpAndResetPassword);
router.get('/me', authUser, getMe);

module.exports = router;