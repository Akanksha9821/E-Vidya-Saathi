const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadProfilePicture,
  uploadResume,
  uploadCourseMaterial,
  uploadEventImage,
  deleteFile,
  uploadFile,
  getFile
} = require('../controllers/upload.controller');

// Upload Profile Picture
router.post('/profile-picture', protect, upload.single('image'), uploadProfilePicture);

// Upload Resume
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);

// Upload Course Material
router.post('/course-material', protect, authorize('faculty'), upload.single('material'), uploadCourseMaterial);

// Upload Event Image
router.post('/event-image', protect, authorize('faculty'), upload.single('image'), uploadEventImage);

// Protected routes
router.use(protect);

// File upload routes
router.post('/', uploadFile);
router.get('/:filename', getFile);
router.delete('/:filename', deleteFile);

module.exports = router; 