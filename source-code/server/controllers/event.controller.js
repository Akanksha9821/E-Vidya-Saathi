const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find()
    .populate('organizer', 'name email')
    .populate('registrations.student', 'name email');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email')
    .populate('registrations.student', 'name email');

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Faculty
exports.createEvent = asyncHandler(async (req, res, next) => {
  // Add organizer to req.body
  req.body.organizer = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Faculty
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Faculty
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  await event.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private/Student
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  // Check if student is already registered
  if (event.registrations.some(reg => reg.student.toString() === req.user.id)) {
    return next(new ErrorResponse('Student is already registered for this event', 400));
  }

  // Check if event is full
  if (event.registrations.length >= event.capacity) {
    return next(new ErrorResponse('Event is already full', 400));
  }

  event.registrations.push({
    student: req.user.id,
    registrationDate: Date.now(),
    status: 'registered'
  });

  await event.save();

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private/Student
exports.unregisterFromEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  // Check if student is registered
  const registrationIndex = event.registrations.findIndex(
    reg => reg.student.toString() === req.user.id
  );

  if (registrationIndex === -1) {
    return next(new ErrorResponse('Student is not registered for this event', 400));
  }

  event.registrations.splice(registrationIndex, 1);
  await event.save();

  res.status(200).json({
    success: true,
    data: event
  });
});

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private/Faculty
exports.getEventRegistrations = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('registrations.student', 'name email');

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: event.registrations.length,
    data: event.registrations
  });
});

// @desc    Get student events
// @route   GET /api/events/student/registered
// @access  Private/Student
exports.getStudentEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find({
    'registrations.student': req.user.id
  }).populate('organizer', 'name email');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// @desc    Get organizer events
// @route   GET /api/events/organizer/events
// @access  Private/Faculty
exports.getOrganizerEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find({ organizer: req.user.id })
    .populate('registrations.student', 'name email');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
}); 