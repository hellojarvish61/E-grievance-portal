// Complaint categories
export const CATEGORIES = [
  'Academics',
  'Infrastructure',
  'Hostel',
  'Library',
  'Canteen',
  'Others',
];

// Complaint status
export const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
};

// Status labels with colors
export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800',
  },
};

// Priority levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Priority labels with colors
export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800',
  },
  medium: {
    label: 'Medium',
    color: 'bg-orange-100 text-orange-800',
  },
  high: {
    label: 'High',
    color: 'bg-red-100 text-red-800',
  },
};

// Departments
export const DEPARTMENTS = [
  'Computer Science',
  'Mechanical',
  'Civil',
  'Electrical',
  'Electronics',
  'Other',
];

// User roles
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};