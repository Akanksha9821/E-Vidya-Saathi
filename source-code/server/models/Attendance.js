const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  records: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent'
    },
    excuse: {
      reason: String,
      document: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      reviewedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      reviewDate: Date,
      reviewComment: String
    }
  }],
  markedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Get attendance statistics for a student
AttendanceSchema.statics.getStudentStats = async function(studentId, courseId) {
  const stats = await this.aggregate([
    {
      $match: {
        'course': mongoose.Types.ObjectId(courseId),
        'records.student': mongoose.Types.ObjectId(studentId)
      }
    },
    {
      $unwind: '$records'
    },
    {
      $match: {
        'records.student': mongoose.Types.ObjectId(studentId)
      }
    },
    {
      $group: {
        _id: '$records.status',
        count: { $sum: 1 }
      }
    }
  ]);

  return stats;
};

// Get attendance statistics for a course
AttendanceSchema.statics.getCourseStats = async function(courseId) {
  const stats = await this.aggregate([
    {
      $match: {
        'course': mongoose.Types.ObjectId(courseId)
      }
    },
    {
      $unwind: '$records'
    },
    {
      $group: {
        _id: '$records.status',
        count: { $sum: 1 }
      }
    }
  ]);

  return stats;
};

// Check if attendance is already marked for a date
AttendanceSchema.statics.isMarked = async function(courseId, date) {
  const attendance = await this.findOne({
    course: courseId,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  });

  return !!attendance;
};

module.exports = mongoose.model('Attendance', AttendanceSchema); 