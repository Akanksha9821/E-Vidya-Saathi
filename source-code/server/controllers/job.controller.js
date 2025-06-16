const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find()
    .populate('postedBy', 'name email company')
    .populate('applications.student', 'name email');

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate('postedBy', 'name email company')
    .populate('applications.student', 'name email');

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Employer
exports.createJob = asyncHandler(async (req, res, next) => {
  // Add employer to req.body
  req.body.postedBy = req.user.id;

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is job poster
  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this job`, 401));
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
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is job poster
  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this job`, 401));
  }

  await job.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private/Student
exports.applyForJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Check if already applied
  if (job.applications.some(app => app.student.toString() === req.user.id)) {
    return next(new ErrorResponse('You have already applied for this job', 400));
  }

  job.applications.push({
    student: req.user.id,
    status: 'pending',
    resume: req.body.resume,
    coverLetter: req.body.coverLetter,
    appliedAt: Date.now()
  });

  await job.save();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Withdraw application
// @route   DELETE /api/jobs/:id/withdraw
// @access  Private/Student
exports.withdrawApplication = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Check if applied
  const applicationIndex = job.applications.findIndex(
    app => app.student.toString() === req.user.id
  );

  if (applicationIndex === -1) {
    return next(new ErrorResponse('You have not applied for this job', 400));
  }

  job.applications.splice(applicationIndex, 1);
  await job.save();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Get job applications
// @route   GET /api/jobs/:id/applications
// @access  Private/Employer
exports.getJobApplications = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate('applications.student', 'name email');

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is job poster
  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view applications for this job`, 401));
  }

  res.status(200).json({
    success: true,
    count: job.applications.length,
    data: job.applications
  });
});

// @desc    Get my applications
// @route   GET /api/jobs/applications/my
// @access  Private/Student
exports.getMyApplications = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({
    'applications.student': req.user.id
  }).populate('postedBy', 'name email company');

  const applications = jobs.map(job => ({
    job: {
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type
    },
    application: job.applications.find(app => app.student.toString() === req.user.id)
  }));

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
}); 