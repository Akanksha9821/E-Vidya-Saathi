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
    required: [true, 'Please add a job description']
  },
  location: {
    type: String,
    required: [true, 'Please add a job location'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary range']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  requiredEducation: {
    type: [String],
    required: [true, 'Please add required education']
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    applicationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    coverLetter: String,
    resume: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'placed'],
    default: 'active'
  },
  deadline: {
    type: Date,
    required: [true, 'Please add an application deadline']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for text search
JobSchema.index({ title: 'text', description: 'text', company: 'text' });

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