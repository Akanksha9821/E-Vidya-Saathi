const User = require('../models/User');
const Course = require('../models/Course');
const Interest = require('../models/Interest');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get student-course matches
// @route   GET /api/matching/student/:studentId
// @access  Private
exports.getStudentMatches = asyncHandler(async (req, res, next) => {
  const student = await User.findById(req.params.studentId);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.studentId}`, 404));
  }

  // Get student's interests
  const interests = await Interest.find({ user: student._id })
    .populate('course');

  // Get recommended courses based on interests
  const recommendedCourses = await Course.find({
    _id: { $nin: interests.map(i => i.course._id) },
    category: { $in: interests.map(i => i.course.category) }
  }).limit(5);

  res.status(200).json({
    success: true,
    data: {
      interests: interests.map(i => i.course),
      recommended: recommendedCourses
    }
  });
});

// @desc    Get course-student matches
// @route   GET /api/matching/course/:courseId
// @access  Private/Faculty
exports.getCourseMatches = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
  }

  // Get students interested in this course
  const interestedStudents = await Interest.find({ course: course._id })
    .populate('user');

  // Get recommended students based on course requirements
  const recommendedStudents = await User.find({
    _id: { $nin: interestedStudents.map(i => i.user._id) },
    role: 'student',
    interests: { $in: [course.category] }
  }).limit(5);

  res.status(200).json({
    success: true,
    data: {
      interested: interestedStudents.map(i => i.user),
      recommended: recommendedStudents
    }
  });
});

// @desc    Get job-student matches
// @route   GET /api/matching/job/:jobId
// @access  Private/Faculty
exports.getJobMatches = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.jobId}`, 404));
  }

  // Get students who match job requirements
  const matchingStudents = await User.find({
    role: 'student',
    skills: { $in: job.requiredSkills },
    'education.degree': { $in: job.requiredEducation }
  }).limit(10);

  res.status(200).json({
    success: true,
    count: matchingStudents.length,
    data: matchingStudents
  });
});

// @desc    Get student-job matches
// @route   GET /api/matching/student/:studentId/jobs
// @access  Private/Student
exports.getStudentJobMatches = asyncHandler(async (req, res, next) => {
  const student = await User.findById(req.params.studentId);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.studentId}`, 404));
  }

  // Get jobs matching student's profile
  const matchingJobs = await Job.find({
    requiredSkills: { $in: student.skills },
    requiredEducation: { $in: [student.education.degree] }
  }).limit(10);

  res.status(200).json({
    success: true,
    count: matchingJobs.length,
    data: matchingJobs
  });
});

// @desc    Get student interests
// @route   GET /api/matching/interests
// @access  Private/Student
exports.getStudentInterests = asyncHandler(async (req, res, next) => {
  let interest = await Interest.findOne({ student: req.user.id });

  if (!interest) {
    interest = await Interest.create({
      student: req.user.id,
      categories: [],
      preferences: {
        preferredTime: [],
        preferredLocation: [],
        notificationPreferences: {
          email: true,
          push: true
        }
      }
    });
  }

  res.status(200).json({
    success: true,
    data: interest
  });
});

// @desc    Update student interests
// @route   PUT /api/matching/interests
// @access  Private/Student
exports.updateStudentInterests = asyncHandler(async (req, res, next) => {
  let interest = await Interest.findOne({ student: req.user.id });

  if (!interest) {
    interest = await Interest.create({
      student: req.user.id,
      ...req.body
    });
  } else {
    interest = await Interest.findOneAndUpdate(
      { student: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
  }

  res.status(200).json({
    success: true,
    data: interest
  });
});

// @desc    Get event recommendations
// @route   GET /api/matching/recommendations
// @access  Private/Student
exports.getEventRecommendations = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findOne({ student: req.user.id });

  if (!interest) {
    return next(new ErrorResponse('Please set up your interests first', 400));
  }

  // Get events matching student's interests
  const events = await Event.find({
    category: { $in: interest.categories.map(cat => cat.name) },
    date: { $gte: new Date() }
  }).populate('organizer', 'name email');

  // Sort events by relevance score
  const scoredEvents = events.map(event => {
    const score = calculateRelevanceScore(event, interest);
    return { ...event.toObject(), relevanceScore: score };
  });

  scoredEvents.sort((a, b) => b.relevanceScore - a.relevanceScore);

  res.status(200).json({
    success: true,
    count: scoredEvents.length,
    data: scoredEvents
  });
});

// @desc    Track event interaction
// @route   POST /api/matching/interactions
// @access  Private/Student
exports.trackEventInteraction = asyncHandler(async (req, res, next) => {
  const interest = await Interest.findOne({ student: req.user.id });

  if (!interest) {
    return next(new ErrorResponse('Please set up your interests first', 400));
  }

  interest.eventInteractions.push({
    event: req.body.eventId,
    type: req.body.type,
    timestamp: Date.now()
  });

  await interest.save();

  res.status(200).json({
    success: true,
    data: interest
  });
});

// @desc    Get similar events
// @route   GET /api/matching/similar/:eventId
// @access  Private/Faculty
exports.getSimilarEvents = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.eventId}`, 404));
  }

  const similarEvents = await Event.find({
    _id: { $ne: event._id },
    category: event.category,
    date: { $gte: new Date() }
  }).populate('organizer', 'name email');

  res.status(200).json({
    success: true,
    count: similarEvents.length,
    data: similarEvents
  });
});

// @desc    Get interest statistics
// @route   GET /api/matching/stats
// @access  Private/Faculty
exports.getInterestStats = asyncHandler(async (req, res, next) => {
  const stats = await Interest.aggregate([
    {
      $unwind: '$categories'
    },
    {
      $group: {
        _id: '$categories.name',
        count: { $sum: 1 },
        avgSkillLevel: { $avg: '$categories.skillLevel' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
});

// Helper function to calculate relevance score
const calculateRelevanceScore = (event, interest) => {
  let score = 0;

  // Category match
  const categoryMatch = interest.categories.find(
    cat => cat.name === event.category
  );
  if (categoryMatch) {
    score += 10;
    score += categoryMatch.skillLevel * 2;
  }

  // Time preference match
  const eventTime = new Date(event.date).getHours();
  if (interest.preferences.preferredTime.includes(eventTime)) {
    score += 5;
  }

  // Location preference match
  if (interest.preferences.preferredLocation.includes(event.location)) {
    score += 5;
  }

  // Recent interaction boost
  const recentInteraction = interest.eventInteractions
    .filter(interaction => interaction.type === 'view')
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (recentInteraction) {
    const daysSinceInteraction = (Date.now() - recentInteraction.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceInteraction < 7) {
      score += 3;
    }
  }

  return score;
}; 