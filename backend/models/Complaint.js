const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Academics',
        'Infrastructure',
        'Hostel',
        'Library',
        'Canteen',
        'Others',
      ],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    // Reference to the student who submitted (for admin only)
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId, // References another document
      ref: 'User', // References User model
      required: true,
    },
    // Assigned teacher/department
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Initially no one assigned
    },
    // Responses from teachers/admin
    responses: [
      {
        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        message: {
          type: String,
          required: true,
        },
        respondedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // For tracking complaint
    trackingId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate tracking ID before saving
complaintSchema.pre('save', function (next) {
  if (!this.trackingId) {
    // Generate unique tracking ID (e.g., GRV-20250127-ABC123)
    this.trackingId = `GRV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next(); // Move to next middleware
});

module.exports = mongoose.model('Complaint', complaintSchema);