const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getInterests,
  getInterest,
  createInterest,
  updateInterest,
  deleteInterest,
  getUserInterests,
  getCourseInterests
} = require('../controllers/interest.controller');

// Public routes
router.get('/', getInterests);
router.get('/:id', getInterest);

// Protected routes
router.use(protect);

// User routes
router.get('/user/interests', getUserInterests);
router.post('/', createInterest);
router.put('/:id', updateInterest);
router.delete('/:id', deleteInterest);

// Faculty routes
router.get('/course/:courseId', authorize('faculty', 'admin'), getCourseInterests);

module.exports = router; 