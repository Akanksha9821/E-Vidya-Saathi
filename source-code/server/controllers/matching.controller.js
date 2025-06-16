const Interest = require('../models/Interest');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

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