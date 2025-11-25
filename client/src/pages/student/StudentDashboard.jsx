import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import StatCard from "../../components/StatCard";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/constants";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch complaints when component loads
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints");
      setComplaints(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to fetch complaints");
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Gradient */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Track and manage all your complaints in one place
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">🎓</span>
                  <span>Student ID: {user.studentId}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🏛️</span>
                  <span>{user.department}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm">
                📊
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Total Complaints
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {stats.total}
                </p>
                <p className="text-blue-100 text-xs">All time submissions</p>
              </div>
              <div className="absolute bottom-2 right-2 text-6xl opacity-20">
                📋
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-yellow-100 text-sm font-medium mb-2">
                  Pending
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {stats.pending}
                </p>
                <p className="text-yellow-100 text-xs">Awaiting review</p>
              </div>
              <div className="absolute bottom-2 right-2 text-6xl opacity-20">
                ⏳
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-purple-100 text-sm font-medium mb-2">
                  In Progress
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {stats.inProgress}
                </p>
                <p className="text-purple-100 text-xs">Being resolved</p>
              </div>
              <div className="absolute bottom-2 right-2 text-6xl opacity-20">
                🔄
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-green-100 text-sm font-medium mb-2">
                  Resolved
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {stats.resolved}
                </p>
                <p className="text-green-100 text-xs">Successfully closed</p>
              </div>
              <div className="absolute bottom-2 right-2 text-6xl opacity-20">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Submit New Complaint Button - Enhanced */}
        <div className="mb-8">
          <Link
            to="/student/submit-complaint"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">
              ➕
            </span>
            <span className="text-lg">Submit New Complaint</span>
            <span className="ml-3 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Complaints List - Enhanced */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📝</span>
              My Complaints
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({complaints.length} total)
              </span>
            </h2>
          </div>

          {complaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-8xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No complaints yet
              </h3>
              <p className="text-gray-500 text-lg mb-6">
                You haven't submitted any complaints yet. Start by submitting
                your first one!
              </p>
              <Link
                to="/student/submit-complaint"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                <span className="mr-2">➕</span>
                Submit First Complaint
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="px-6 py-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer"
                  onClick={() =>
                    setSelectedComplaint(
                      selectedComplaint?._id === complaint._id
                        ? null
                        : complaint
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Title with Icon */}
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">
                          {complaint.status === "resolved"
                            ? "✅"
                            : complaint.status === "in-progress"
                            ? "🔄"
                            : "⏳"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800">
                          {complaint.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {selectedComplaint?._id === complaint._id
                          ? complaint.description
                          : complaint.description.length > 120
                          ? complaint.description.substring(0, 120) + "..."
                          : complaint.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {/* Category Badge */}
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full shadow-sm">
                          <span className="mr-1">📂</span>
                          {complaint.category}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            STATUS_CONFIG[complaint.status].color
                          }`}
                        >
                          {STATUS_CONFIG[complaint.status].label}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            PRIORITY_CONFIG[complaint.priority].color
                          }`}
                        >
                          <span className="mr-1">
                            {complaint.priority === "high"
                              ? "🔴"
                              : complaint.priority === "medium"
                              ? "🟡"
                              : "🟢"}
                          </span>
                          {PRIORITY_CONFIG[complaint.priority].label}
                        </span>

                        {/* Assigned Badge */}
                        {complaint.assignedTo && (
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full shadow-sm">
                            <span className="mr-1">👤</span>
                            Assigned to {complaint.assignedTo.name}
                          </span>
                        )}
                      </div>

                      {/* Tracking ID with Copy Button */}
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500 flex items-center">
                          <span className="mr-1">🔖</span>
                          Tracking ID:
                          <span className="font-mono font-semibold ml-1 text-gray-700">
                            {complaint.trackingId}
                          </span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(complaint.trackingId);
                            alert("Tracking ID copied!");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>

                    {/* Date Card */}
                    <div className="text-right ml-4 bg-gray-50 rounded-lg px-4 py-2 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Submitted</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {new Date(complaint.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(complaint.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Responses Section - Enhanced */}
                  {selectedComplaint?._id === complaint._id &&
                    complaint.responses &&
                    complaint.responses.length > 0 && (
                      <div className="mt-6 pl-6 border-l-4 border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-r-lg">
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">💬</span>
                          Responses ({complaint.responses.length})
                        </p>
                        <div className="space-y-3">
                          {complaint.responses.map((response, index) => (
                            <div
                              key={index}
                              className="bg-white p-4 rounded-lg shadow-sm border border-blue-100"
                            >
                              <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                                {response.message}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center">
                                  <span className="mr-1">👤</span>
                                  <span className="font-semibold text-gray-700">
                                    {response.respondedBy.name}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span className="capitalize px-2 py-1 bg-gray-100 rounded">
                                    {response.respondedBy.role}
                                  </span>
                                </span>
                                <span className="flex items-center">
                                  <span className="mr-1">🕐</span>
                                  {new Date(
                                    response.respondedAt
                                  ).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Expand/Collapse Indicator */}
                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-400 font-medium">
                      {selectedComplaint?._id === complaint._id
                        ? "▲ Click to collapse"
                        : "▼ Click to expand"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
