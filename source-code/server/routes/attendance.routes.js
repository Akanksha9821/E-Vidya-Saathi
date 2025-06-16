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
  getAttendanceByDate,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  getCourseAttendance,
  getAttendanceStats
} = require('../controllers/attendance.controller');

// Protected routes
router.use(protect);

// Student routes
router.get('/student/attendance', authorize('student'), getStudentAttendance);

// Faculty routes
router.get('/course/:courseId', authorize('faculty'), checkFacultyAccess, getCourseAttendance);
router.get('/course/:courseId/stats', authorize('faculty'), checkFacultyAccess, getAttendanceStats);
router.post('/course/:courseId', authorize('faculty'), checkFacultyAccess, markAttendance);
router.put('/:id', authorize('faculty'), updateAttendance);
router.delete('/:id', authorize('faculty'), deleteAttendance);

module.exports = router; 