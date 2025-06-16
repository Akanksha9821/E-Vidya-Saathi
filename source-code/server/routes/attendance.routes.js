const express = require('express');
const router = express.Router();
const {
  protect,
  authorize,
  checkFacultyAccess,
  checkEnrollment
} = require('../middleware/auth');
const {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  getCourseAttendance,
  getAttendanceStats
} = require('../controllers/attendance.controller');

// All routes are protected
router.use(protect);

// Student routes
router.get('/student', getStudentAttendance);

// Faculty routes
router.get('/course/:courseId', authorize('faculty', 'admin'), checkFacultyAccess, getCourseAttendance);
router.post('/course/:courseId', authorize('faculty', 'admin'), checkFacultyAccess, markAttendance);
router.put('/:id', authorize('faculty', 'admin'), checkFacultyAccess, updateAttendance);
router.get('/stats/:courseId', authorize('faculty', 'admin'), checkFacultyAccess, getAttendanceStats);

module.exports = router; 