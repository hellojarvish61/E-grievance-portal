const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getAllStudents,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Admin only routes
router.get('/teachers', protect, authorize('admin'), getAllTeachers);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/pending', protect, authorize('admin'), getPendingUsers); // NEW
router.get('/', protect, authorize('admin'), getAllUsers);

// Approval routes
router.put('/:id/approve', protect, authorize('admin'), approveUser); // NEW
router.delete('/:id/reject', protect, authorize('admin'), rejectUser); // NEW

module.exports = router;