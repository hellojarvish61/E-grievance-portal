const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addResponse,
  trackComplaint,
  getComplaintStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// Public route - Track complaint by tracking ID
router.get('/track/:trackingId', trackComplaint);

// Protected routes - require login
router.post('/', protect, authorize('student'), submitComplaint);
router.get('/', protect, getAllComplaints);
router.get('/stats', protect, authorize('admin', 'teacher'), getComplaintStats);
router.get('/:id', protect, getComplaintById);

// Admin only routes
router.put('/:id/status', protect, authorize('admin'), updateComplaintStatus);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);

// Teacher and Admin routes
router.post('/:id/response', protect, authorize('teacher', 'admin'), addResponse);

module.exports = router;