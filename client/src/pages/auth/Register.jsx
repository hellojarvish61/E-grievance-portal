import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../utils/constants";

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    studentId: "",
    department: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate role-specific fields
    if (formData.role === "student" && !formData.studentId) {
      setError("Student ID is required");
      return;
    }

    if (formData.role === "teacher" && !formData.designation) {
      setError("Designation is required");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;

      const response = await register(registerData);

      // Check if student (auto-approved) or teacher/admin (needs approval)
      if (formData.role === "student") {
        // Students can login immediately
        loginUser(response.data);
        navigate("/student/dashboard");
      } else {
        // Teachers and Admins need approval
        setSuccess(true);
        setError("");
        // Show approval pending message
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Register to submit and track complaints
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message for Teacher/Admin Registration */}
            {success &&
              (formData.role === "teacher" || formData.role === "admin") && (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
                  <div className="flex items-start">
                    <span className="text-4xl mr-4">✅</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        Registration Submitted Successfully!
                      </h3>
                      <p className="text-green-700 mb-3">
                        Your {formData.role} account has been created and is now
                        pending approval.
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-green-200 mb-3">
                        <p className="text-sm text-gray-700 mb-2 font-semibold">
                          Next Steps:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>✓ An admin will review your request</li>
                          <li>
                            ✓ You'll be notified once approved (usually within
                            24 hours)
                          </li>
                          <li>
                            ✓ After approval, you can login with your
                            credentials
                          </li>
                        </ul>
                      </div>
                      <p className="text-xs text-green-600">
                        💡 Please check back later or contact the admin if you
                        need urgent access
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        Go to Login Page
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Register As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Minimum 6 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Re-enter password"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Fields based on Role */}
              {formData.role === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="STU001"
                  />
                </div>
              )}

              {formData.role === "teacher" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Professor"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
