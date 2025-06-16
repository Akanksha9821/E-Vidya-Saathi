const express = require('express');
const router = express.Router();
const {
  protect,
  authorize,
  checkJobPoster
} = require('../middleware/auth');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  withdrawApplication,
  getJobApplications,
  getMyApplications
} = require('../controllers/job.controller');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Student routes
router.get('/applications/my', getMyApplications);
router.post('/:id/apply', authorize('student'), applyForJob);
router.delete('/:id/withdraw', authorize('student'), withdrawApplication);

// Employer routes
router.post('/', authorize('employer'), createJob);
router.put('/:id', authorize('employer'), checkJobPoster, updateJob);
router.delete('/:id', authorize('employer'), checkJobPoster, deleteJob);
router.get('/:id/applications', authorize('employer'), checkJobPoster, getJobApplications);

module.exports = router; 