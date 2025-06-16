const express = require('express');
const {
  getAttendanceRecords,
  getAttendanceRecord,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  getAttendanceStats
} = require('../controllers/attendance');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by faculty and admin
router
  .route('/')
  .get(authorize('faculty', 'admin'), getAttendanceRecords)
  .post(authorize('faculty', 'admin'), createAttendanceRecord);

router
  .route('/:id')
  .get(authorize('student', 'faculty', 'admin'), getAttendanceRecord)
  .put(authorize('faculty', 'admin'), updateAttendanceRecord)
  .delete(authorize('faculty', 'admin'), deleteAttendanceRecord);

// Get attendance statistics
router.get('/stats', authorize('faculty', 'admin'), getAttendanceStats);

module.exports = router; 