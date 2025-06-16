const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  company: {
    name: {
      type: String,
      required: [true, 'Please add company name'],
      trim: true,
      maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    }
  },
  position: {
    title: {
      type: String,
      required: [true, 'Please add position title'],
      trim: true,
      maxlength: [100, 'Position title cannot be more than 100 characters']
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      required: [true, 'Please specify position type']
    },
    description: {
      type: String,
      required: [true, 'Please add position description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    requirements: [{
      type: String,
      required: [true, 'Please add at least one requirement']
    }],
    responsibilities: [{
      type: String,
      required: [true, 'Please add at least one responsibility']
    }],
    salary: {
      min: {
        type: Number,
        required: [true, 'Please specify minimum salary']
      },
      max: {
        type: Number,
        required: [true, 'Please specify maximum salary']
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    location: {
      type: String,
      required: [true, 'Please specify job location']
    }
  },
  application: {
    deadline: {
      type: Date,
      required: [true, 'Please specify application deadline']
    },
    process: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      required: [true, 'Please specify application process']
    },
    documents: [{
      type: String,
      required: [true, 'Please specify required documents']
    }]
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'on-hold'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who posted the job']
  },
  applications: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewed', 'selected', 'rejected'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    documents: [{
      name: String,
      url: String,
      type: String
    }],
    feedback: {
      type: String,
      maxlength: [500, 'Feedback cannot be more than 500 characters']
    },
    interview: {
      date: Date,
      type: {
        type: String,
        enum: ['online', 'offline', 'phone']
      },
      location: String,
      notes: String
    }
  }],
  statistics: {
    totalApplications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    interviewed: {
      type: Number,
      default: 0
    },
    selected: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
PlacementSchema.index({ 'company.name': 1 });
PlacementSchema.index({ 'position.title': 1 });
PlacementSchema.index({ status: 1 });
PlacementSchema.index({ 'application.deadline': 1 });

module.exports = mongoose.model('Placement', PlacementSchema); 