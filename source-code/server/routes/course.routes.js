const express = require('express');
const router = express.Router();
const {
  protect,
  authorize,
  checkFacultyAccess,
  checkEnrollment
} = require('../middleware/auth');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  removeStudent,
  getEnrolledStudents,
  getFacultyCourses,
  getStudentCourses
} = require('../controllers/course.controller');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.use(protect);

// Student routes
router.get('/student/enrolled', getStudentCourses);
router.post('/:id/enroll', enrollStudent);
router.delete('/:id/enroll', removeStudent);

// Faculty routes
router.get('/faculty/courses', authorize('faculty', 'admin'), getFacultyCourses);
router.post('/', authorize('faculty', 'admin'), createCourse);
router.put('/:id', authorize('faculty', 'admin'), checkFacultyAccess, updateCourse);
router.delete('/:id', authorize('faculty', 'admin'), checkFacultyAccess, deleteCourse);
router.get('/:id/students', authorize('faculty', 'admin'), checkFacultyAccess, getEnrolledStudents);

module.exports = router; 