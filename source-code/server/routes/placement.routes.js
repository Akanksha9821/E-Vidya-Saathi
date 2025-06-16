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
  getStudentApplications,
  getFacultyJobs,
  updateApplicationStatus
} = require('../controllers/placement.controller');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Student routes
router.get('/student/applications', getStudentApplications);
router.post('/:id/apply', applyForJob);
router.delete('/:id/apply', withdrawApplication);

// Faculty routes
router.get('/faculty/jobs', authorize('faculty', 'admin'), getFacultyJobs);
router.post('/', authorize('faculty', 'admin'), createJob);
router.put('/:id', authorize('faculty', 'admin'), checkJobPoster, updateJob);
router.delete('/:id', authorize('faculty', 'admin'), checkJobPoster, deleteJob);
router.get('/:id/applications', authorize('faculty', 'admin'), checkJobPoster, getJobApplications);
router.put('/:id/applications/:applicationId', authorize('faculty', 'admin'), checkJobPoster, updateApplicationStatus);

module.exports = router; 