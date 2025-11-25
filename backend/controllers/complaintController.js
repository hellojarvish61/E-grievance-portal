const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Submit a new complaint (Student only)
// @route   POST /api/complaints
// @access  Private (Student)
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description and category',
      });
    }

    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'medium', // Default to medium if not provided
      submittedBy: req.user.id, // From protect middleware (logged in user)
    });

    // Populate submittedBy field with user details
    await complaint.populate('submittedBy', 'name email studentId department');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all complaints (Different access for different roles)
// @route   GET /api/complaints
// @access  Private
// @desc    Get all complaints (Different access for different roles)
// @route   GET /api/complaints
// @access  Private
exports.getAllComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === 'student') {
      // Students can only see their own complaints
      complaints = await Complaint.find({ submittedBy: req.user.id })
        .populate('submittedBy', 'name email studentId department')
        .populate('assignedTo', 'name email designation department')
        .populate('responses.respondedBy', 'name role')
        .sort({ createdAt: -1 }); // Latest first
    } else if (req.user.role === 'teacher') {
      // Teachers can see complaints in their department or assigned to them
      complaints = await Complaint.find({
        $or: [
          { assignedTo: req.user.id }, // Assigned to this teacher
        ],
      })
        .populate('assignedTo', 'name email designation department')
        .populate('responses.respondedBy', 'name role')
        .sort({ createdAt: -1 });

      // Remove student identity for teachers (keep anonymous)
      complaints = complaints.map((complaint) => {
        const complaintObj = complaint.toObject();
        complaintObj.submittedBy = 'Anonymous Student'; // Hide student identity
        return complaintObj;
      });
    } else if (req.user.role === 'admin') {
      // Admins can see all complaints but students remain anonymous
      complaints = await Complaint.find()
        .populate('assignedTo', 'name email designation department')
        .populate('responses.respondedBy', 'name role')
        .sort({ createdAt: -1 });

      // Make students anonymous for admin too
      complaints = complaints.map((complaint) => {
        const complaintObj = complaint.toObject();
        complaintObj.submittedBy = {
          _id: complaint.submittedBy, // Keep ID for tracking purposes
          name: 'Anonymous Student',
          email: 'anonymous@student.com',
          studentId: 'ANONYMOUS',
          department: 'Anonymous',
        };
        return complaintObj;
      });
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res) => {
  try {
    let complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email designation department')
      .populate('responses.respondedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check access rights
    if (req.user.role === 'student') {
      // Students can only view their own complaints
      if (complaint.submittedBy._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this complaint',
        });
      }
    } else if (req.user.role === 'teacher') {
      // Teachers see anonymous complaints
      const complaintObj = complaint.toObject();
      complaintObj.submittedBy = 'Anonymous Student';
      complaint = complaintObj;
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true } // Return updated document
    )
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email designation department');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Assign complaint to teacher (Admin only)
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
exports.assignComplaint = async (req, res) => {
  try {
    const { teacherId } = req.body;

    // Check if teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID',
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: teacherId, status: 'in-progress' },
      { new: true, runValidators: true }
    )
      .populate('submittedBy', 'name email studentId department')
      .populate('assignedTo', 'name email designation department');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Add response to complaint (Teacher/Admin)
// @route   POST /api/complaints/:id/response
// @access  Private (Teacher/Admin)
exports.addResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a response message',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if teacher is assigned to this complaint
    if (req.user.role === 'teacher') {
      if (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to this complaint',
        });
      }
    }

    // Add response
    complaint.responses.push({
      respondedBy: req.user.id,
      message,
    });

    await complaint.save();

    // Populate the complaint
    await complaint.populate('responses.respondedBy', 'name role');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get complaints by tracking ID (Public - for students to track)
// @route   GET /api/complaints/track/:trackingId
// @access  Public
exports.trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      trackingId: req.params.trackingId,
    })
      .populate('assignedTo', 'name designation department')
      .populate('responses.respondedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found with this tracking ID',
      });
    }

    // Hide student identity
    const complaintObj = complaint.toObject();
    complaintObj.submittedBy = 'Anonymous';

    res.status(200).json({
      success: true,
      data: complaintObj,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get analytics/stats (Admin/Teacher)
// @route   GET /api/complaints/stats
// @access  Private (Admin/Teacher)
exports.getComplaintStats = async (req, res) => {
  try {
    // Total complaints
    const totalComplaints = await Complaint.countDocuments();

    // Status-wise count
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Category-wise count
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Priority-wise count
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent complaints (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentComplaints = await Complaint.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalComplaints,
        byStatus: statusStats,
        byCategory: categoryStats,
        byPriority: priorityStats,
        lastSevenDays: recentComplaints,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};