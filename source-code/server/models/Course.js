const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Engineering',
      'Business',
      'Arts',
      'Languages',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Please add a level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: Number,
    required: [true, 'Please add a duration in weeks']
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
  modules: [{
    title: {
      type: String,
      required: [true, 'Please add a module title']
    },
    description: String,
    content: String,
    resources: [{
      title: String,
      type: String,
      url: String
    }],
    assignments: [{
      title: String,
      description: String,
      dueDate: Date,
      submissions: [{
        student: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        submissionDate: Date,
        content: String,
        grade: Number,
        feedback: String
      }]
    }]
  }],
  schedule: {
    startDate: Date,
    endDate: Date,
    sessions: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      location: String
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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

// Add index for text search
CourseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', CourseSchema); 