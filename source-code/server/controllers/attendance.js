const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private (Faculty/Admin)
exports.getAttendanceRecords = async (req, res) => {
  try {
    // Build query
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Attendance.find(JSON.parse(queryStr))
      .populate('course', 'courseCode title')
      .populate('student', 'name email studentId')
      .populate('markedBy', 'name email');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-date');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Attendance.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const attendanceRecords = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      pagination,
      data: attendanceRecords
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private (Student/Faculty/Admin)
exports.getAttendanceRecord = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('course', 'courseCode title')
      .populate('student', 'name email studentId')
      .populate('markedBy', 'name email');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    // Make sure user is the student, faculty, or admin
    if (
      attendance.student._id.toString() !== req.user.id &&
      attendance.markedBy._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this attendance record'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private (Faculty)
exports.createAttendanceRecord = async (req, res) => {
  try {
    // Add faculty to req.body
    req.body.markedBy = req.user.id;

    // Check if course exists and user is faculty for that course
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (course.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to mark attendance for this course'
      });
    }

    // Check if attendance record already exists for this student and date
    const existingRecord = await Attendance.findOne({
      course: req.body.course,
      student: req.body.student,
      date: req.body.date
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        error: 'Attendance record already exists for this student and date'
      });
    }

    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Faculty/Admin)
exports.updateAttendanceRecord = async (req, res) => {
  try {
    let attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    // Make sure user is faculty or admin
    if (attendance.markedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this attendance record'
      });
    }

    attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Faculty/Admin)
exports.deleteAttendanceRecord = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    // Make sure user is faculty or admin
    if (attendance.markedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this attendance record'
      });
    }

    await attendance.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private (Faculty/Admin)
exports.getAttendanceStats = async (req, res) => {
  try {
    const { courseId, studentId, startDate, endDate } = req.query;

    // Build match object
    const match = {};
    if (courseId) match.course = courseId;
    if (studentId) match.student = studentId;
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const stats = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get course-wise attendance
    const courseStats = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$course',
          total: { $sum: 1 },
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
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        courseStats
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}; 