const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  createUser
} = require('../controllers/auth.controller');

// Public routes
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/updatedetails', updateProfile);
router.put('/updatepassword', updatePassword);

// Admin-only user creation
router.post('/create-user', authorize('admin'), createUser);

module.exports = router; 