const Placement = require('../models/Placement');

// @desc    Get all placements
// @route   GET /api/placements
// @access  Private
exports.getPlacements = async (req, res) => {
  try {
    // Build query
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Placement.find(JSON.parse(queryStr))
      .populate('postedBy', 'name email')
      .populate('applications.student', 'name email studentId');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Placement.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const placements = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: placements.length,
      pagination,
      data: placements
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single placement
// @route   GET /api/placements/:id
// @access  Private
exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('applications.student', 'name email studentId');

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create placement
// @route   POST /api/placements
// @access  Private (Faculty/Admin)
exports.createPlacement = async (req, res) => {
  try {
    // Add user to req.body
    req.body.postedBy = req.user.id;

    const placement = await Placement.create(req.body);

    res.status(201).json({
      success: true,
      data: placement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update placement
// @route   PUT /api/placements/:id
// @access  Private (Faculty/Admin)
exports.updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }

    // Make sure user is placement poster or admin
    if (placement.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this placement'
      });
    }

    placement = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete placement
// @route   DELETE /api/placements/:id
// @access  Private (Faculty/Admin)
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }

    // Make sure user is placement poster or admin
    if (placement.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this placement'
      });
    }

    await placement.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Apply for placement
// @route   POST /api/placements/:id/apply
// @access  Private (Student)
exports.applyForPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }

    // Check if placement is open
    if (placement.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'This placement is not accepting applications'
      });
    }

    // Check if deadline has passed
    if (new Date(placement.application.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Application deadline has passed'
      });
    }

    // Check if student has already applied
    const hasApplied = placement.applications.some(
      app => app.student.toString() === req.user.id
    );

    if (hasApplied) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this placement'
      });
    }

    // Add application
    placement.applications.push({
      student: req.user.id,
      documents: req.body.documents
    });

    // Update statistics
    placement.statistics.totalApplications += 1;

    await placement.save();

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/placements/:id/applications/:applicationId
// @access  Private (Faculty/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement not found'
      });
    }

    // Make sure user is placement poster or admin
    if (placement.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update application status'
      });
    }

    // Find the application
    const application = placement.applications.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Update application status and feedback
    application.status = req.body.status;
    if (req.body.feedback) {
      application.feedback = req.body.feedback;
    }

    // Update interview details if provided
    if (req.body.interview) {
      application.interview = req.body.interview;
    }

    // Update statistics
    placement.statistics[application.status] += 1;

    await placement.save();

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}; 