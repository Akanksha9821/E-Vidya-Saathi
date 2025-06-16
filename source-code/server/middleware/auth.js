const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Job = require('../models/Job');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is the owner of the resource
exports.checkOwnership = (Model) => {
  return async (req, res, next) => {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }

    // Check if user is the owner
    if (resource.user && resource.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

// Check if user is a faculty member for the course
exports.checkFacultyAccess = async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  if (course.faculty.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to access this course'
    });
  }

  next();
};

// Check if user is enrolled in the course
exports.checkEnrollment = async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  if (!course.students.includes(req.user.id)) {
    return res.status(403).json({
      status: 'error',
      message: 'Not enrolled in this course'
    });
  }

  next();
};

// Check if user is the event organizer
exports.checkEventOrganizer = async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({
      status: 'error',
      message: 'Event not found'
    });
  }

  if (event.organizer.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to manage this event'
    });
  }

  next();
};

// Check if user is the job poster
exports.checkJobPoster = async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return res.status(404).json({
      status: 'error',
      message: 'Job posting not found'
    });
  }

  if (job.postedBy.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to manage this job posting'
    });
  }

  next();
}; 