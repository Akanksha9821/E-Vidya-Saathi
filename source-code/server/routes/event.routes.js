const express = require('express');
const router = express.Router();
const {
  protect,
  authorize,
  checkEventOrganizer
} = require('../middleware/auth');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventRegistrations,
  getStudentEvents,
  getOrganizerEvents
} = require('../controllers/event.controller');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.use(protect);

// Student routes
router.get('/student/registered', getStudentEvents);
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', unregisterFromEvent);

// Organizer routes
router.get('/organizer/events', authorize('faculty', 'admin'), getOrganizerEvents);
router.post('/', authorize('faculty', 'admin'), createEvent);
router.put('/:id', authorize('faculty', 'admin'), checkEventOrganizer, updateEvent);
router.delete('/:id', authorize('faculty', 'admin'), checkEventOrganizer, deleteEvent);
router.get('/:id/registrations', authorize('faculty', 'admin'), checkEventOrganizer, getEventRegistrations);

module.exports = router; 