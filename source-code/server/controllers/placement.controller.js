const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all jobs
// @route   GET /api/placements
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find()
    .populate('postedBy', 'name email')
    .populate('applications.student', 'name email');

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get single job
// @route   GET /api/placements/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate('postedBy', 'name email')
    .populate('applications.student', 'name email');

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Create new job
// @route   POST /api/placements
// @access  Private/Faculty
exports.createJob = asyncHandler(async (req, res, next) => {
  // Add poster to req.body
  req.body.postedBy = req.user.id;

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Update job
// @route   PUT /api/placements/:id
// @access  Private/Faculty
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Delete job
// @route   DELETE /api/placements/:id
// @access  Private/Faculty
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  await job.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Apply for job
// @route   POST /api/placements/:id/apply
// @access  Private/Student
exports.applyForJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Check if student has already applied
  if (job.applications.some(app => app.student.toString() === req.user.id)) {
    return next(new ErrorResponse('Student has already applied for this job', 400));
  }

  // Check if job is still active
  if (!job.isActive()) {
    return next(new ErrorResponse('This job posting is no longer active', 400));
  }

  job.applications.push({
    student: req.user.id,
    applicationDate: Date.now(),
    status: 'pending',
    coverLetter: req.body.coverLetter,
    resume: req.body.resume
  });

  await job.save();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Withdraw application
// @route   DELETE /api/placements/:id/apply
// @access  Private/Student
exports.withdrawApplication = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Check if student has applied
  const applicationIndex = job.applications.findIndex(
    app => app.student.toString() === req.user.id
  );

  if (applicationIndex === -1) {
    return next(new ErrorResponse('Student has not applied for this job', 400));
  }

  job.applications.splice(applicationIndex, 1);
  await job.save();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Get job applications
// @route   GET /api/placements/:id/applications
// @access  Private/Faculty
exports.getJobApplications = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate('applications.student', 'name email');

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    count: job.applications.length,
    data: job.applications
  });
});

// @desc    Get student applications
// @route   GET /api/placements/student/applications
// @access  Private/Student
exports.getStudentApplications = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({
    'applications.student': req.user.id
  }).populate('postedBy', 'name email');

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get faculty jobs
// @route   GET /api/placements/faculty/jobs
// @access  Private/Faculty
exports.getFacultyJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({ postedBy: req.user.id })
    .populate('applications.student', 'name email');

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get all placements
// @route   GET /api/placements
// @access  Public
exports.getPlacements = asyncHandler(async (req, res, next) => {
  const placements = await Job.find({ status: 'placed' })
    .populate('postedBy', 'name email')
    .populate('applications.student', 'name email');

  res.status(200).json({
    success: true,
    count: placements.length,
    data: placements
  });
});

// @desc    Get single placement
// @route   GET /api/placements/:id
// @access  Public
exports.getPlacement = asyncHandler(async (req, res, next) => {
  const placement = await Job.findOne({
    _id: req.params.id,
    status: 'placed'
  })
    .populate('postedBy', 'name email')
    .populate('applications.student', 'name email');

  if (!placement) {
    return next(new ErrorResponse(`Placement not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: placement
  });
});

// @desc    Create new placement
// @route   POST /api/placements
// @access  Private/Employer
exports.createPlacement = asyncHandler(async (req, res, next) => {
  req.body.postedBy = req.user.id;
  req.body.status = 'placed';

  const placement = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: placement
  });
});

// @desc    Update placement
// @route   PUT /api/placements/:id
// @access  Private/Employer
exports.updatePlacement = asyncHandler(async (req, res, next) => {
  let placement = await Job.findOne({
    _id: req.params.id,
    status: 'placed'
  });

  if (!placement) {
    return next(new ErrorResponse(`Placement not found with id of ${req.params.id}`, 404));
  }

  placement = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: placement
  });
});

// @desc    Delete placement
// @route   DELETE /api/placements/:id
// @access  Private/Employer
exports.deletePlacement = asyncHandler(async (req, res, next) => {
  const placement = await Job.findOne({
    _id: req.params.id,
    status: 'placed'
  });

  if (!placement) {
    return next(new ErrorResponse(`Placement not found with id of ${req.params.id}`, 404));
  }

  await placement.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get student placements
// @route   GET /api/placements/student/placements
// @access  Private/Student
exports.getStudentPlacements = asyncHandler(async (req, res, next) => {
  const placements = await Job.find({
    'applications.student': req.user.id,
    'applications.status': 'accepted',
    status: 'placed'
  }).populate('postedBy', 'name email');

  res.status(200).json({
    success: true,
    count: placements.length,
    data: placements
  });
});

// @desc    Get company placements
// @route   GET /api/placements/company/placements
// @access  Private/Employer
exports.getCompanyPlacements = asyncHandler(async (req, res, next) => {
  const placements = await Job.find({
    postedBy: req.user.id,
    status: 'placed'
  }).populate('applications.student', 'name email');

  res.status(200).json({
    success: true,
    count: placements.length,
    data: placements
  });
});

// @desc    Update application status
// @route   PUT /api/placements/:id/applications/:applicationId
// @access  Private/Faculty
exports.updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  const application = job.applications.id(req.params.applicationId);

  if (!application) {
    return next(new ErrorResponse(`Application not found with id of ${req.params.applicationId}`, 404));
  }

  application.status = req.body.status;
  await job.save();

  res.status(200).json({
    success: true,
    data: application
  });
}); 