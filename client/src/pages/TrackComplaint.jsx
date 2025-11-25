import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../utils/constants";

const TrackComplaint = () => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);
    setComplaint(null);

    try {
      const response = await api.get(`/complaints/track/${trackingId.trim()}`);
      setComplaint(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Complaint not found. Please check your tracking ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "in-progress":
        return "🔄";
      case "resolved":
        return "✅";
      default:
        return "📋";
    }
  };

  // Get progress percentage
  const getProgressPercentage = (status) => {
    switch (status) {
      case "pending":
        return 33;
      case "in-progress":
        return 66;
      case "resolved":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-6xl">🔍</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Track Your Complaint</h1>
          <p className="text-xl text-blue-100 mb-6">
            Enter your tracking ID to check the status of your complaint
          </p>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="inline-flex items-center text-blue-100 hover:text-white transition group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>Back to Login</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🔖</span>
                Enter Tracking ID
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g., GRV-1234567890-ABC123"
                  required
                  className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition shadow-sm font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !trackingId.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">🔍</span>
                      Track Complaint
                    </span>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="mr-1">💡</span>
                You received this tracking ID when you submitted your complaint
              </p>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && searched && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="flex items-center">
              <span className="text-4xl mr-4">❌</span>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-1">
                  Complaint Not Found
                </h3>
                <p className="text-red-700">{error}</p>
                <p className="text-red-600 text-sm mt-2">
                  Please check your tracking ID and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Overview Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Current Status
                  </p>
                  <h2 className="text-4xl font-bold flex items-center">
                    <span className="mr-3 text-5xl">
                      {getStatusIcon(complaint.status)}
                    </span>
                    {STATUS_CONFIG[complaint.status].label}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm mb-1">Priority</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-bold ${
                      complaint.priority === "high"
                        ? "bg-red-500"
                        : complaint.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {complaint.priority === "high"
                      ? "🔴"
                      : complaint.priority === "medium"
                      ? "🟡"
                      : "🟢"}{" "}
                    {PRIORITY_CONFIG[complaint.priority].label}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white bg-opacity-20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${getProgressPercentage(complaint.status)}%`,
                  }}
                >
                  <span className="text-xs font-bold text-blue-600">
                    {getProgressPercentage(complaint.status)}%
                  </span>
                </div>
              </div>

              {/* Status Steps */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div
                  className={
                    complaint.status === "pending" ||
                    complaint.status === "in-progress" ||
                    complaint.status === "resolved"
                      ? "opacity-100"
                      : "opacity-40"
                  }
                >
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm font-medium">Submitted</p>
                </div>
                <div
                  className={
                    complaint.status === "in-progress" ||
                    complaint.status === "resolved"
                      ? "opacity-100"
                      : "opacity-40"
                  }
                >
                  <div className="text-3xl mb-2">🔄</div>
                  <p className="text-sm font-medium">In Progress</p>
                </div>
                <div
                  className={
                    complaint.status === "resolved"
                      ? "opacity-100"
                      : "opacity-40"
                  }
                >
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm font-medium">Resolved</p>
                </div>
              </div>
            </div>

            {/* Complaint Details Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="mr-3">📋</span>
                  Complaint Details
                </h3>
              </div>

              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Title
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {complaint.title}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Description
                  </p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {complaint.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-purple-600 mb-1">
                      Category
                    </p>
                    <p className="text-lg font-bold text-purple-900 flex items-center">
                      <span className="mr-2">📂</span>
                      {complaint.category}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-600 mb-1">
                      Submitted On
                    </p>
                    <p className="text-lg font-bold text-blue-900 flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-600 mb-1">
                      Tracking ID
                    </p>
                    <p className="text-sm font-bold text-green-900 font-mono break-all">
                      {complaint.trackingId}
                    </p>
                  </div>
                </div>

                {/* Assigned To */}
                {complaint.assignedTo && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-blue-700 mb-2">
                      Assigned To
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        {complaint.assignedTo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          {complaint.assignedTo.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {complaint.assignedTo.designation} -{" "}
                          {complaint.assignedTo.department}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Responses Section */}
            {complaint.responses && complaint.responses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-5 border-b border-green-200">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-3">💬</span>
                    Responses ({complaint.responses.length})
                  </h3>
                </div>

                <div className="p-8 space-y-4">
                  {complaint.responses.map((response, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Response Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {response.respondedBy.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {response.respondedBy.name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {response.respondedBy.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center bg-white px-3 py-1 rounded-full">
                          <span className="mr-1">🕐</span>
                          {formatDate(response.respondedAt)}
                        </span>
                      </div>

                      {/* Response Message */}
                      <p className="text-gray-800 leading-relaxed bg-white p-4 rounded-lg">
                        {response.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Responses Yet */}
            {(!complaint.responses || complaint.responses.length === 0) && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">⏳</span>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-800 mb-1">
                      No Responses Yet
                    </h4>
                    <p className="text-yellow-700">
                      Your complaint is being reviewed. You'll see responses
                      here once available.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setComplaint(null);
                  setTrackingId("");
                  setSearched(false);
                }}
                className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition shadow-md"
              >
                Track Another Complaint
              </button>
            </div>
          </div>
        )}

        {/* Info Section - Only show when no results */}
        {!complaint && !loading && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">💡</span>
              How Tracking Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  1️⃣
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Submit Your Complaint
                  </h4>
                  <p className="text-gray-600 text-sm">
                    When you submit a complaint, you'll receive a unique
                    tracking ID
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  2️⃣
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Save Your Tracking ID
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Keep this ID safe to check your complaint status anytime
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  3️⃣
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Track Progress
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Enter your tracking ID here to see real-time updates
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  4️⃣
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Get Updates</h4>
                  <p className="text-gray-600 text-sm">
                    View responses and status changes as they happen
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
