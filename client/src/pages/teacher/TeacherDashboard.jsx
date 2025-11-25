import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/constants";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, in-progress, resolved

  // Fetch complaints and stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, statsRes] = await Promise.all([
        api.get("/complaints"),
        api.get("/complaints/stats"),
      ]);

      setComplaints(complaintsRes.data.data);
      setStats(statsRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  // Submit response
  const handleSubmitResponse = async (complaintId) => {
    if (!responseMessage.trim()) {
      alert("Please enter a response message");
      return;
    }

    setSubmittingResponse(true);

    try {
      await api.post(`/complaints/${complaintId}/response`, {
        message: responseMessage,
      });

      // Refresh data
      await fetchData();

      setResponseMessage("");
      setSelectedComplaint(null);
      alert("✅ Response submitted successfully!");
    } catch (err) {
      alert(
        "Failed to submit response: " +
          (err.response?.data?.message || "Please try again")
      );
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === "all") return true;
    return complaint.status === filter;
  });

  // Calculate teacher-specific stats
  const teacherStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    highPriority: complaints.filter((c) => c.priority === "high").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {user.name}! 👨‍🏫
              </h1>
              <p className="text-purple-100 text-lg">
                Review and respond to student complaints
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">💼</span>
                  <span>{user.designation}</span>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Total Assigned
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {teacherStats.total}
                </p>
                <p className="text-blue-100 text-xs">All complaints</p>
              </div>
              <div className="absolute bottom-2 right-2 text-5xl opacity-20">
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
                  {teacherStats.pending}
                </p>
                <p className="text-yellow-100 text-xs">Needs review</p>
              </div>
              <div className="absolute bottom-2 right-2 text-5xl opacity-20">
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
                  {teacherStats.inProgress}
                </p>
                <p className="text-purple-100 text-xs">Working on it</p>
              </div>
              <div className="absolute bottom-2 right-2 text-5xl opacity-20">
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
                  {teacherStats.resolved}
                </p>
                <p className="text-green-100 text-xs">Completed</p>
              </div>
              <div className="absolute bottom-2 right-2 text-5xl opacity-20">
                ✅
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <p className="text-red-100 text-sm font-medium mb-2">
                  High Priority
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  {teacherStats.highPriority}
                </p>
                <p className="text-red-100 text-xs">Urgent issues</p>
              </div>
              <div className="absolute bottom-2 right-2 text-5xl opacity-20">
                🔴
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            All ({teacherStats.total})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "pending"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            Pending ({teacherStats.pending})
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "in-progress"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            In Progress ({teacherStats.inProgress})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === "resolved"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
            }`}
          >
            Resolved ({teacherStats.resolved})
          </button>
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

        {/* Complaints List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📝</span>
              Assigned Complaints
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({filteredComplaints.length}{" "}
                {filter !== "all" ? filter : "total"})
              </span>
            </h2>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-8xl mb-4">
                {filter === "all"
                  ? "📭"
                  : filter === "pending"
                  ? "⏳"
                  : filter === "in-progress"
                  ? "🔄"
                  : "✅"}
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No {filter !== "all" ? filter : ""} complaints
              </h3>
              <p className="text-gray-500 text-lg">
                {filter === "all"
                  ? "You don't have any complaints assigned yet."
                  : `No complaints are currently ${filter}.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="px-6 py-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
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
                        {complaint.description}
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

                        {/* Anonymous Badge */}
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full shadow-sm">
                          <span className="mr-1">🔒</span>
                          Anonymous Student
                        </span>
                      </div>

                      {/* Tracking ID */}
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">🔖</span>
                        Tracking ID:
                        <span className="font-mono font-semibold ml-1 text-gray-700">
                          {complaint.trackingId}
                        </span>
                      </p>
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
                    </div>
                  </div>

                  {/* Previous Responses */}
                  {complaint.responses && complaint.responses.length > 0 && (
                    <div className="mt-4 pl-6 border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-r-lg">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">💬</span>
                        Previous Responses ({complaint.responses.length})
                      </p>
                      <div className="space-y-3">
                        {complaint.responses.map((response, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-purple-100"
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
                                {new Date(response.respondedAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Form */}
                  {selectedComplaint?._id === complaint._id ? (
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">✍️</span>
                        Add Your Response
                      </h4>
                      <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Type your response here... Provide helpful information or updates about this complaint."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      />
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleSubmitResponse(complaint._id)}
                          disabled={
                            submittingResponse || !responseMessage.trim()
                          }
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                        >
                          {submittingResponse ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-2"
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
                            "📤 Submit Response"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(null);
                            setResponseMessage("");
                          }}
                          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg transform hover:-translate-y-0.5"
                      >
                        <span className="mr-2">💬</span>
                        Add Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
