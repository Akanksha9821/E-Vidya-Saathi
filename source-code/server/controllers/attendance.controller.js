const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get attendance by date
// @route   GET /api/attendance/:date
// @access  Private
exports.getAttendanceByDate = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({
    date: req.params.date
  }).populate('course', 'name code').populate('student', 'name email');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('course', 'name code')
    .populate('student', 'name email');

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Mark attendance
// @route   POST /api/attendance/course/:courseId
// @access  Private/Faculty
exports.markAttendance = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
  }

  // Create attendance records for each student
  const attendanceRecords = req.body.students.map(student => ({
    course: req.params.courseId,
    student: student.id,
    status: student.status,
    date: req.body.date,
    remarks: student.remarks
  }));

  const attendance = await Attendance.insertMany(attendanceRecords);

  res.status(201).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private/Faculty
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  const course = await Course.findById(attendance.course);
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this attendance record`, 401));
  }

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private/Faculty
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(new ErrorResponse(`Attendance record not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is course faculty
  const course = await Course.findById(attendance.course);
  if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this attendance record`, 401));
  }

  await attendance.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get student attendance
// @route   GET /api/attendance/student/attendance
// @access  Private/Student
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({
    student: req.user.id
  })
    .populate('course', 'name code')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get course attendance
// @route   GET /api/attendance/course/:courseId
// @access  Private/Faculty
exports.getCourseAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({
    course: req.params.courseId
  })
    .populate('student', 'name email')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get attendance stats
// @route   GET /api/attendance/course/:courseId/stats
// @access  Private/Faculty
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({
    course: req.params.courseId
  });

  // Calculate attendance statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length
  };

  // Calculate attendance percentage
  stats.attendancePercentage = (stats.present / stats.total) * 100;

  res.status(200).json({
    success: true,
    data: stats
  });
}); 