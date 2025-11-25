import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { CATEGORIES, PRIORITY } from "../../utils/constants";

const SubmitComplaint = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/complaints", formData);

      setSuccess(true);
      setTrackingId(response.data.data.trackingId);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit complaint. Please try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  // Character count for description
  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/student/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <span className="text-5xl">📝</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Submit a Complaint
          </h1>
          <p className="text-gray-600 text-lg">
            Let us know about any issues you're facing. We're here to help!
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-5xl">✅</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Complaint Submitted Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your complaint has been registered and will be reviewed
                    shortly.
                  </p>

                  {/* Tracking ID Card */}
                  <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">
                      Your Tracking ID:
                    </p>
                    <div className="flex items-center justify-between bg-gray-50 rounded px-4 py-3">
                      <code className="text-lg font-bold text-gray-800 font-mono">
                        {trackingId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(trackingId);
                          alert("Tracking ID copied to clipboard!");
                        }}
                        className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Save this ID to track your complaint status
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setTrackingId("");
                      }}
                      className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      Submit Another Complaint
                    </button>
                    <Link
                      to="/student/dashboard"
                      className="px-6 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-50 transition border-2 border-green-300 shadow-md"
                    >
                      View All Complaints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="flex items-center">
              <span className="text-3xl mr-4">⚠️</span>
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">📋</span>
              Complaint Details
            </h2>
            <p className="text-blue-100 mt-1">
              Please provide as much detail as possible
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">✍️</span>
                Complaint Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Brief summary of your complaint"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Category and Priority in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📂</span>
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm bg-white"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  Priority Level
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm bg-white"
                >
                  <option value="low">🟢 Low - Minor issue</option>
                  <option value="medium">🟡 Medium - Moderate concern</option>
                  <option value="high">🔴 High - Urgent issue</option>
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📄</span>
                Detailed Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                maxLength={maxDescriptionLength}
                placeholder="Explain your complaint in detail. Include dates, locations, and any other relevant information..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  💡 Provide specific details for faster resolution
                </p>
                <p
                  className={`text-xs font-semibold ${
                    descriptionLength > maxDescriptionLength * 0.9
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {descriptionLength}/{maxDescriptionLength} characters
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Important Information:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      Your identity will remain anonymous to everyone except
                      administrators
                    </li>
                    <li>
                      You'll receive a tracking ID to monitor your complaint
                      status
                    </li>
                    <li>
                      We aim to respond to all complaints within 24-48 hours
                    </li>
                    <li>
                      You'll be notified when there are updates on your
                      complaint
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">📤</span>
                    Submit Complaint
                  </span>
                )}
              </button>

              <Link
                to="/student/dashboard"
                className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all duration-300 text-center shadow-md"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Tips for Better Complaints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="mr-2">✓</span>
              <p>Be specific about dates, times, and locations</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✓</span>
              <p>Include any relevant reference numbers or IDs</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✓</span>
              <p>Describe the issue clearly and concisely</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✓</span>
              <p>Mention any previous attempts to resolve the issue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
