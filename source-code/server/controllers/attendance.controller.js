const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get student attendance
// @route   GET /api/attendance/student
// @access  Private/Student
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({ student: req.user.id })
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
  const attendance = await Attendance.find({ course: req.params.courseId })
    .populate('student', 'name email')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: attendance.length,
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

  // Create attendance records for all students
  const attendanceRecords = course.students.map(student => ({
    course: req.params.courseId,
    student,
    date: req.body.date || Date.now(),
    status: req.body.status || 'present',
    remarks: req.body.remarks
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

  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats/:courseId
// @access  Private/Faculty
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.courseId}`, 404));
  }

  const stats = await Attendance.aggregate([
    {
      $match: { course: course._id }
    },
    {
      $group: {
        _id: '$student',
        totalClasses: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
          }
        },
        absent: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        },
        late: {
          $sum: {
            $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $unwind: '$student'
    },
    {
      $project: {
        _id: 1,
        student: {
          name: 1,
          email: 1
        },
        totalClasses: 1,
        present: 1,
        absent: 1,
        late: 1,
        attendancePercentage: {
          $multiply: [
            { $divide: ['$present', '$totalClasses'] },
            100
          ]
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
}); 