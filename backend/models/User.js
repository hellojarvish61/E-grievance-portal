const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    // Account status
    isApproved: {
      type: Boolean,
      default: function () {
        // Auto-approve students
        return this.role === 'student';
      },
    },
    studentId: {
      type: String,
      required: function () {
        return this.role === 'student';
      },
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Computer Science',
        'Mechanical',
        'Civil',
        'Electrical',
        'Electronics',
        'Other',
      ],
    },
    designation: {
      type: String,
      required: function () {
        return this.role === 'teacher';
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);