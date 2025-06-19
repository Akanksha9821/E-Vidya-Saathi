const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Admin creates a user (student/faculty/admin)
// @route   POST /api/auth/create-user
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role || !department) {
      return next(new ErrorResponse('All fields are required', 400));
    }

    // Validate role
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      return next(new ErrorResponse('Invalid role specified', 400));
    }

    const user = await User.create({ name, email, password, role, department });
    
    res.status(201).json({ 
      status: 'success', 
      data: user 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message)[0];
      return next(new ErrorResponse(message, 400));
    }
    if (err.code === 11000) {
      return next(new ErrorResponse('Email already exists', 400));
    }
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorResponse('Please provide a valid email address', 400));
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate JWT token with role
    const token = user.getSignedJwtTokenWithRole();
    
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return next(new ErrorResponse('Name and email are required', 400));
    }

    const fieldsToUpdate = { name, email };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message)[0];
      return next(new ErrorResponse(message, 400));
    }
    if (err.code === 11000) {
      return next(new ErrorResponse('Email already exists', 400));
    }
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Current password and new password are required', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtTokenWithRole();
    
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(new ErrorResponse('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({ 
        status: 'success', 
        data: 'Email sent' 
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return next(new ErrorResponse('Password is required', 400));
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtTokenWithRole();
    
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    data: {}
  });
}; 