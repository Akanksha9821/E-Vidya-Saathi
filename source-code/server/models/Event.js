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
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'conference', 'competition', 'other'],
    required: true
  },
  date: {
    type: Date,
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
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Capacity must be at least 1']
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  categories: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  requirements: [{
    type: String
  }],
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'link', 'video']
    }
  }],
  feedback: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Check if event is full
EventSchema.methods.isFull = function() {
  return this.participants.length >= this.capacity;
};

// Add participant to event
EventSchema.methods.addParticipant = async function(userId) {
  if (this.isFull()) {
    throw new Error('Event is full');
  }
  if (this.participants.includes(userId)) {
    throw new Error('User is already registered');
  }
  if (new Date() > this.registrationDeadline) {
    throw new Error('Registration deadline has passed');
  }
  this.participants.push(userId);
  await this.save();
};

// Remove participant from event
EventSchema.methods.removeParticipant = async function(userId) {
  this.participants = this.participants.filter(
    participant => participant.toString() !== userId.toString()
  );
  await this.save();
};

// Get event statistics
EventSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalParticipants: { $sum: { $size: '$participants' } }
      }
    }
  ]);

  return stats;
};

module.exports = mongoose.model('Event', EventSchema); 