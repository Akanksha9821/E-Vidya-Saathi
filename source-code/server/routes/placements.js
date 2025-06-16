const express = require('express');
const {
  getPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
  applyForPlacement,
  updateApplicationStatus
} = require('../controllers/placements');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getPlacements);
router.get('/:id', getPlacement);

// Routes accessible by faculty and admin
router
  .route('/')
  .post(authorize('faculty', 'admin'), createPlacement);

router
  .route('/:id')
  .put(authorize('faculty', 'admin'), updatePlacement)
  .delete(authorize('faculty', 'admin'), deletePlacement);

// Application routes
router.post('/:id/apply', authorize('student'), applyForPlacement);
router.put('/:id/applications/:applicationId', authorize('faculty', 'admin'), updateApplicationStatus);

module.exports = router; 