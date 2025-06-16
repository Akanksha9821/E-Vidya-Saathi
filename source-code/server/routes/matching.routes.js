const express = require('express');
const router = express.Router();
const {
  protect,
  authorize
} = require('../middleware/auth');
const {
  getStudentInterests,
  updateStudentInterests,
  getEventRecommendations,
  trackEventInteraction,
  getSimilarEvents,
  getInterestStats
} = require('../controllers/matching.controller');

// All routes are protected
router.use(protect);

// Student routes
router.get('/interests', getStudentInterests);
router.put('/interests', updateStudentInterests);
router.get('/recommendations', getEventRecommendations);
router.post('/interactions', trackEventInteraction);

// Faculty routes
router.get('/similar/:eventId', authorize('faculty', 'admin'), getSimilarEvents);
router.get('/stats', authorize('faculty', 'admin'), getInterestStats);

module.exports = router; 