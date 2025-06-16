const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: [true, 'Please specify your level']
  },
  goals: {
    type: String,
    required: [true, 'Please describe your learning goals']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from showing interest in the same course multiple times
InterestSchema.index({ user: 1, course: 1 }, { unique: true });

// Check if the model exists before creating a new one
const Interest = mongoose.models.Interest || mongoose.model('Interest', InterestSchema);

module.exports = Interest; 