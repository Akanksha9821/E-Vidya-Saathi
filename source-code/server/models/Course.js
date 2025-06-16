const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a course name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Please add a course code'],
    unique: true,
    trim: true,
    maxlength: [20, 'Code cannot be more than 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Please add number of credits'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot be more than 6']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add course capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for attendance records
CourseSchema.virtual('attendance', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

// Check if course is full
CourseSchema.methods.isFull = function() {
  return this.students.length >= this.capacity;
};

// Add student to course
CourseSchema.methods.addStudent = async function(studentId) {
  if (this.isFull()) {
    throw new Error('Course is full');
  }
  if (this.students.includes(studentId)) {
    throw new Error('Student is already enrolled');
  }
  this.students.push(studentId);
  await this.save();
};

// Remove student from course
CourseSchema.methods.removeStudent = async function(studentId) {
  this.students = this.students.filter(
    student => student.toString() !== studentId.toString()
  );
  await this.save();
};

module.exports = mongoose.model('Course', CourseSchema); 