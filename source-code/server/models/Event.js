const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    required: [true, 'Please add an event type'],
    enum: ['Workshop', 'Seminar', 'Conference', 'Hackathon', 'Other']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Academic',
      'Career',
      'Technical',
      'Cultural',
      'Sports',
      'Other'
    ]
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  time: {
    start: {
      type: String,
      required: [true, 'Please add a start time']
    },
    end: {
      type: String,
      required: [true, 'Please add an end time']
    }
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add a capacity']
  },
  registrations: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  resources: [{
    title: String,
    type: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for text search
EventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', EventSchema); 