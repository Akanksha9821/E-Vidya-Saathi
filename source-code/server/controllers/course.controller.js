const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find().populate('faculty', 'name email');
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('faculty', 'name email')
    .populate('students', 'name email');

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Faculty
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Add faculty to req.body
  req.body.faculty = req.user.id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Faculty
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Faculty
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course`, 401));
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Enroll student in course
// @route   PUT /api/courses/:id/enroll
// @access  Private/Student
exports.enrollStudent = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Check if student is already enrolled
  if (course.students.includes(req.user.id)) {
    return next(new ErrorResponse('Student is already enrolled in this course', 400));
  }

  course.students.push(req.user.id);
  await course.save();

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Remove student from course
// @route   PUT /api/courses/:id/remove
// @access  Private/Faculty
exports.removeStudent = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to remove students from this course`, 401));
  }

  // Check if student is enrolled
  if (!course.students.includes(req.body.studentId)) {
    return next(new ErrorResponse('Student is not enrolled in this course', 400));
  }

  course.students = course.students.filter(
    student => student.toString() !== req.body.studentId
  );
  await course.save();

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Get enrolled students
// @route   GET /api/courses/:id/students
// @access  Private/Faculty
exports.getEnrolledStudents = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('students', 'name email');

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view students in this course`, 401));
  }

  res.status(200).json({
    success: true,
    count: course.students.length,
    data: course.students
  });
});

// @desc    Get faculty courses
// @route   GET /api/courses/faculty
// @access  Private/Faculty
exports.getFacultyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ faculty: req.user.id })
    .populate('students', 'name email');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get student courses
// @route   GET /api/courses/student/enrolled
// @access  Private/Student
exports.getStudentCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ students: req.user.id })
    .populate('faculty', 'name email');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
}); 