const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  requirements: [{
    type: String,
    required: true
  }],
  responsibilities: [{
    type: String,
    required: true
  }],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    resume: {
      type: String,
      required: true
    },
    coverLetter: String,
    appliedAt: {
      type: Date,
      default: Date.now
    },
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    reviewComment: String,
    interviewDate: Date,
    interviewLocation: String,
    interviewType: {
      type: String,
      enum: ['online', 'onsite', 'phone']
    }
  }],
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
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

// Check if job posting is active
JobSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.deadline;
};

// Add application to job
JobSchema.methods.addApplication = async function(application) {
  if (!this.isActive()) {
    throw new Error('Job posting is not active');
  }
  if (this.applications.some(app => app.student.toString() === application.student.toString())) {
    throw new Error('Student has already applied for this job');
  }
  this.applications.push(application);
  await this.save();
};

// Update application status
JobSchema.methods.updateApplicationStatus = async function(applicationId, status, reviewData) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  application.status = status;
  if (reviewData) {
    application.reviewedBy = reviewData.reviewedBy;
    application.reviewDate = new Date();
    application.reviewComment = reviewData.comment;
    if (reviewData.interview) {
      application.interviewDate = reviewData.interview.date;
      application.interviewLocation = reviewData.interview.location;
      application.interviewType = reviewData.interview.type;
    }
  }
  await this.save();
};

// Get job statistics
JobSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalApplications: { $sum: { $size: '$applications' } },
        avgSalary: {
          $avg: { $avg: ['$salary.min', '$salary.max'] }
        }
      }
    }
  ]);

  return stats;
};

module.exports = mongoose.model('Job', JobSchema); 