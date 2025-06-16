const express = require('express');
const router = express.Router();
const {
  protect,
  authorize
} = require('../middleware/auth');
const {
  getStudentMatches,
  getCourseMatches,
  getJobMatches,
  getStudentJobMatches
} = require('../controllers/matching.controller');

// All routes are protected
router.use(protect);

// Student routes
router.get('/student/:studentId', getStudentMatches);
router.get('/student/:studentId/jobs', getStudentJobMatches);

// Faculty routes
router.get('/course/:courseId', authorize('faculty', 'admin'), getCourseMatches);
router.get('/job/:jobId', authorize('faculty', 'admin'), getJobMatches);

module.exports = router; 