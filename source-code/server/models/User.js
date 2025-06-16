const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin', 'employer'],
    default: 'student'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  facultyId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    bio: String,
    avatar: String,
    phone: String,
    address: String,
    education: [{
      degree: String,
      field: String,
      institution: String,
      year: Number
    }],
    skills: [String],
    interests: [String],
    social: {
      linkedin: String,
      github: String,
      twitter: String
    }
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual populate
UserSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'students',
  justOne: false
});

UserSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'registrations.student',
  justOne: false
});

UserSchema.virtual('jobApplications', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'applications.student',
  justOne: false
});

module.exports = mongoose.model('User', UserSchema); 