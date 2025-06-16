const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} = require('../controllers/events');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getEvents);
router.get('/:id', getEvent);

// Routes accessible by faculty and admin
router
  .route('/')
  .post(authorize('faculty', 'admin'), createEvent);

router
  .route('/:id')
  .put(authorize('faculty', 'admin'), updateEvent)
  .delete(authorize('faculty', 'admin'), deleteEvent);

// Event registration routes (students only)
router
  .route('/:id/register')
  .post(authorize('student'), registerForEvent)
  .delete(authorize('student'), unregisterFromEvent);

module.exports = router; 