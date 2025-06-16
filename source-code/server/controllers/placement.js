const Placement = require('../models/Placement');

// @desc    Get all placements
// @route   GET /api/placements
// @access  Private (Admin)
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
      .populate('student', 'name email department studentId');

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
      query = query.sort('-applicationDate');
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
// @access  Private (Student/Admin)
exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('student', 'name email department studentId');

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement record not found'
      });
    }

    // Make sure user is the student or admin
    if (placement.student._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this placement record'
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

// @desc    Create new placement record
// @route   POST /api/placements
// @access  Private (Student)
exports.createPlacement = async (req, res) => {
  try {
    // Add student to req.body
    req.body.student = req.user.id;

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

// @desc    Update placement record
// @route   PUT /api/placements/:id
// @access  Private (Student/Admin)
exports.updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement record not found'
      });
    }

    // Make sure user is the student or admin
    if (placement.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this placement record'
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

// @desc    Delete placement record
// @route   DELETE /api/placements/:id
// @access  Private (Student/Admin)
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: 'Placement record not found'
      });
    }

    // Make sure user is the student or admin
    if (placement.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this placement record'
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

// @desc    Get placement statistics
// @route   GET /api/placements/stats
// @access  Private (Admin)
exports.getPlacementStats = async (req, res) => {
  try {
    const stats = await Placement.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package.ctc' }
        }
      }
    ]);

    const companyStats = await Placement.aggregate([
      {
        $group: {
          _id: '$company.name',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package.ctc' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        topCompanies: companyStats
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}; 