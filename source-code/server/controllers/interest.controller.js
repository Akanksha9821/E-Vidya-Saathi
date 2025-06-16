const Interest = require('../models/interest');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Show interest in a course
// @route   POST /api/v1/interests
// @access  Private
exports.showInterest = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if course exists
  const course = await Course.findById(req.body.course);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.body.course}`, 404));
  }

  // Check if user has already shown interest
  const existingInterest = await Interest.findOne({
    user: req.user.id,
    course: req.body.course
  });

  if (existingInterest) {
    return next(new ErrorResponse('You have already shown interest in this course', 400));
  }

  const interest = await Interest.create(req.body);

  res.status(201).json({
    success: true,
    data: interest
  });
});

// @desc    Get all interests
// @route   GET /api/interests
// @access  Public
exports.getInterests = asyncHandler(async (req, res, next) => {
  const interests = await Interest.find()
    .populate('user', 'name email')
    .populate('course', 'title description');

  res.status(200).json({
    success: true,
    count: interests.length,
    data: interests
  });
});

// @desc    Get single interest
// @route   GET /api/interests/:id
// @access  Public
exports.getInterest = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findById(req.params.id)
    .populate('user', 'name email')
    .populate('course', 'title description');

  if (!interest) {
    return next(new ErrorResponse(`Interest not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: interest
  });
});

// @desc    Create new interest
// @route   POST /api/interests
// @access  Private
exports.createInterest = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if course exists
  const course = await Course.findById(req.body.course);
  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.body.course}`, 404));
  }

  // Check if user already has an interest in this course
  const existingInterest = await Interest.findOne({
    user: req.user.id,
    course: req.body.course
  });

  if (existingInterest) {
    return next(new ErrorResponse('User already has an interest in this course', 400));
  }

  const interest = await Interest.create(req.body);

  res.status(201).json({
    success: true,
    data: interest
  });
});

// @desc    Update interest
// @route   PUT /api/interests/:id
// @access  Private
exports.updateInterest = asyncHandler(async (req, res, next) => {
  let interest = await Interest.findById(req.params.id);

  if (!interest) {
    return next(new ErrorResponse(`Interest not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is interest owner
  if (interest.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this interest`, 401));
  }

  interest = await Interest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: interest
  });
});

// @desc    Delete interest
// @route   DELETE /api/interests/:id
// @access  Private
exports.deleteInterest = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findById(req.params.id);

  if (!interest) {
    return next(new ErrorResponse(`Interest not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is interest owner
  if (interest.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this interest`, 401));
  }

  await interest.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get interests for a user
// @route   GET /api/interests/user/interests
// @access  Private
exports.getUserInterests = asyncHandler(async (req, res, next) => {
  const interests = await Interest.find({ user: req.user.id })
    .populate('course', 'title description');

  res.status(200).json({
    success: true,
    count: interests.length,
    data: interests
  });
});

// @desc    Get interests for a course
// @route   GET /api/interests/course/:courseId
// @access  Private
exports.getCourseInterests = asyncHandler(async (req, res, next) => {
  const interests = await Interest.find({ course: req.params.courseId })
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: interests.length,
    data: interests
  });
}); 