const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addStudent,
  removeStudent
} = require('../controllers/course');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('faculty', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('faculty', 'admin'), updateCourse)
  .delete(protect, authorize('faculty', 'admin'), deleteCourse);

router
  .route('/:id/students')
  .post(protect, authorize('faculty', 'admin'), addStudent);

router
  .route('/:id/students/:studentId')
  .delete(protect, authorize('faculty', 'admin'), removeStudent);

module.exports = router; 