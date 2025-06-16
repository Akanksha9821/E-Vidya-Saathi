const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Course = require('../models/Course');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Upload profile picture
// @route   POST /api/upload/profile-picture
// @access  Private
exports.uploadProfilePicture = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const user = await User.findById(req.user.id);

  // Delete old profile picture if exists
  if (user.profilePicture) {
    await cloudinary.uploader.destroy(user.profilePicture.publicId);
  }

  // Update user profile picture
  user.profilePicture = {
    url: req.file.path,
    publicId: req.file.filename
  };

  await user.save();

  res.status(200).json({
    success: true,
    data: user.profilePicture
  });
});

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private/Student
exports.uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const user = await User.findById(req.user.id);

  // Delete old resume if exists
  if (user.resume) {
    await cloudinary.uploader.destroy(user.resume.publicId);
  }

  // Update user resume
  user.resume = {
    url: req.file.path,
    publicId: req.file.filename
  };

  await user.save();

  res.status(200).json({
    success: true,
    data: user.resume
  });
});

// @desc    Upload course material
// @route   POST /api/upload/course-material
// @access  Private/Faculty
exports.uploadCourseMaterial = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const course = await Course.findById(req.body.courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.body.courseId}`, 404));
  }

  // Add material to course
  course.materials.push({
    title: req.body.title,
    description: req.body.description,
    file: {
      url: req.file.path,
      publicId: req.file.filename
    }
  });

  await course.save();

  res.status(200).json({
    success: true,
    data: course.materials[course.materials.length - 1]
  });
});

// @desc    Upload event image
// @route   POST /api/upload/event-image
// @access  Private/Faculty
exports.uploadEventImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const event = await Event.findById(req.body.eventId);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.body.eventId}`, 404));
  }

  // Delete old image if exists
  if (event.image) {
    await cloudinary.uploader.destroy(event.image.publicId);
  }

  // Update event image
  event.image = {
    url: req.file.path,
    publicId: req.file.filename
  };

  await event.save();

  res.status(200).json({
    success: true,
    data: event.image
  });
});

// @desc    Delete file
// @route   DELETE /api/upload/:publicId
// @access  Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const result = await cloudinary.uploader.destroy(req.params.publicId);

  if (result.result !== 'ok') {
    return next(new ErrorResponse('Error deleting file', 400));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  res.status(200).json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename
    }
  });
});

// @desc    Get file
// @route   GET /api/upload/:filename
// @access  Private
exports.getFile = asyncHandler(async (req, res, next) => {
  const file = await cloudinary.api.resource(req.params.filename);

  if (!file) {
    return next(new ErrorResponse('File not found', 404));
  }

  res.status(200).json({
    success: true,
    data: file
  });
});
