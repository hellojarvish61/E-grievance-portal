import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  CATEGORIES,
} from "../../utils/constants";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters and modals
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  // Loading states
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, statsRes, teachersRes, pendingRes] =
        await Promise.all([
          api.get("/complaints"),
          api.get("/complaints/stats"),
          api.get("/users/teachers"),
          api.get("/users/pending"), // NEW
        ]);

      setComplaints(complaintsRes.data.data);
      setStats(statsRes.data.data);
      setTeachers(teachersRes.data.data);
      setPendingUsersCount(pendingRes.data.count); // NEW

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  // Assign complaint to teacher
  const handleAssignComplaint = async () => {
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }

    setAssigning(true);
    try {
      await api.put(`/complaints/${selectedComplaint._id}/assign`, {
        teacherId: selectedTeacher,
      });

      await fetchData();
      setShowAssignModal(false);
      setSelectedComplaint(null);
      setSelectedTeacher("");
      alert("✅ Complaint assigned successfully!");
    } catch (err) {
      alert(
        "Failed to assign complaint: " +
          (err.response?.data?.message || "Please try again")
      );
    } finally {
      setAssigning(false);
    }
  };

  // Update complaint status
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      alert("Please select a status");
      return;
    }

    setUpdatingStatus(true);
    try {
      await api.put(`/complaints/${selectedComplaint._id}/status`, {
        status: selectedStatus,
      });

      await fetchData();
      setShowStatusModal(false);
      setSelectedComplaint(null);
      setSelectedStatus("");
      alert("✅ Status updated successfully!");
    } catch (err) {
      alert(
        "Failed to update status: " +
          (err.response?.data?.message || "Please try again")
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatch = filter === "all" || complaint.status === filter;
    const categoryMatch =
      categoryFilter === "all" || complaint.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Calculate statistics
  const adminStats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    highPriority: complaints.filter((c) => c.priority === "high").length,
    unassigned: complaints.filter((c) => !c.assignedTo).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard 👑</h1>
              <p className="text-indigo-100 text-lg mb-2">
                Complete oversight and management of all complaints
              </p>
              <p className="text-indigo-200 text-sm">
                Welcome, {user.name} • Full System Access
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm">
                ⚙️
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {/* Pending Approvals Alert */}
        {pendingUsersCount > 0 && (
          <div className="mb-6">
            <Link
              to="/admin/user-approval"
              className="block bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-xl p-6 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mr-4 backdrop-blur-sm animate-pulse">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {pendingUsersCount} Pending User Approval
                      {pendingUsersCount > 1 ? "s" : ""}
                    </h3>
                    <p className="text-orange-100">
                      Click here to review and approve teacher/admin
                      registration requests
                    </p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-5xl font-bold">→</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-blue-100 text-xs font-medium mb-1">Total</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.total}
                </p>
                <p className="text-blue-100 text-xs">All complaints</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                📊
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-yellow-100 text-xs font-medium mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.pending}
                </p>
                <p className="text-yellow-100 text-xs">Needs review</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                ⏳
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-purple-100 text-xs font-medium mb-1">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.inProgress}
                </p>
                <p className="text-purple-100 text-xs">Working</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                🔄
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-green-100 text-xs font-medium mb-1">
                  Resolved
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.resolved}
                </p>
                <p className="text-green-100 text-xs">Closed</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                ✅
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-red-100 text-xs font-medium mb-1">
                  High Priority
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.highPriority}
                </p>
                <p className="text-red-100 text-xs">Urgent</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                🔴
              </div>
            </div>
          </div>

          <div className="group hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative z-10">
                <p className="text-gray-100 text-xs font-medium mb-1">
                  Unassigned
                </p>
                <p className="text-3xl font-bold text-white mb-1">
                  {adminStats.unassigned}
                </p>
                <p className="text-gray-100 text-xs">Need action</p>
              </div>
              <div className="absolute bottom-1 right-1 text-4xl opacity-20">
                👤
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📂</span>
                Complaints by Category
              </h3>
              <div className="space-y-3">
                {stats.byCategory.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1">
                      <span className="font-medium text-gray-700 w-32">
                        {cat._id}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(cat.count / adminStats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800 text-lg ml-2">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Priority Distribution
              </h3>
              <div className="space-y-4">
                {stats.byPriority.map((priority) => (
                  <div
                    key={priority._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {priority._id === "high"
                          ? "🔴"
                          : priority._id === "medium"
                          ? "🟡"
                          : "🟢"}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 capitalize">
                          {priority._id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {Math.round(
                            (priority.count / adminStats.total) * 100
                          )}
                          % of total
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                      {priority.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filters */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Filter by Status:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "all"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({adminStats.total})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "pending"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending ({adminStats.pending})
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "in-progress"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  In Progress ({adminStats.inProgress})
                </button>
                <button
                  onClick={() => setFilter("resolved")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === "resolved"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Resolved ({adminStats.resolved})
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Filter by Category:
              </p>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3">📋</span>
              All Complaints
              <span className="ml-3 text-sm font-normal opacity-90">
                ({filteredComplaints.length} showing)
              </span>
            </h2>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-8xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500 text-lg">
                {filter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No complaints have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="px-6 py-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200"
                >
                  {/* Complaint Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
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

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full">
                          <span className="mr-1">📂</span>
                          {complaint.category}
                        </span>

                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            STATUS_CONFIG[complaint.status].color
                          }`}
                        >
                          {STATUS_CONFIG[complaint.status].label}
                        </span>

                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
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

                        {complaint.assignedTo ? (
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            <span className="mr-1">👤</span>
                            Assigned to {complaint.assignedTo.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full animate-pulse">
                            <span className="mr-1">⚠️</span>
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Student Info (Admin can see real identity) */}
                      {/* Student Info - Now Anonymous for Admin too */}
                      {/* Anonymity Status Card */}
                      <div className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mr-4 backdrop-blur-sm">
                              🔒
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-1">
                                Complete Anonymity Enabled
                              </h3>
                              <p className="text-purple-100">
                                All student identities are protected. You're
                                viewing {complaints.length} anonymous
                                complaints.
                              </p>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">🔖</span>
                        Tracking ID:
                        <span className="font-mono font-semibold ml-1 text-gray-700">
                          {complaint.trackingId}
                        </span>
                      </p>
                    </div>

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

                  {/* Responses */}
                  {complaint.responses && complaint.responses.length > 0 && (
                    <div className="mt-4 pl-6 border-l-4 border-indigo-400 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-r-lg mb-4">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">💬</span>
                        Responses ({complaint.responses.length})
                      </p>
                      <div className="space-y-3">
                        {complaint.responses.map((response, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100"
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

                  {/* Admin Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowAssignModal(true);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md transform hover:-translate-y-0.5"
                    >
                      <span className="mr-2">👤</span>
                      {complaint.assignedTo ? "Reassign" : "Assign to Teacher"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setSelectedStatus(complaint.status);
                        setShowStatusModal(true);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md transform hover:-translate-y-0.5"
                    >
                      <span className="mr-2">🔄</span>
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform scale-100 transition-transform">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">👤</span>
              Assign Complaint
            </h3>
            <p className="text-gray-600 mb-6">
              Select a teacher to handle this complaint
            </p>

            {/* Show current assignment if exists */}
            {selectedComplaint?.assignedTo && (
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Currently Assigned To:
                </p>
                <p className="text-blue-900">
                  {selectedComplaint.assignedTo.name} -{" "}
                  {selectedComplaint.assignedTo.designation}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Teacher
              </label>

              {teachers.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ No teachers registered yet. Please register teachers
                    first.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Select a Teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.designation} (
                      {teacher.department})
                    </option>
                  ))}
                </select>
              )}

              {selectedTeacher && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ Selected:{" "}
                    {teachers.find((t) => t._id === selectedTeacher)?.name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAssignComplaint}
                disabled={
                  assigning || !selectedTeacher || teachers.length === 0
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {assigning ? (
                  <span className="flex items-center justify-center">
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
                    Assigning...
                  </span>
                ) : selectedComplaint?.assignedTo ? (
                  "Reassign Complaint"
                ) : (
                  "Assign Complaint"
                )}
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedComplaint(null);
                  setSelectedTeacher("");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform scale-100 transition-transform">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">🔄</span>
              Update Status
            </h3>
            <p className="text-gray-600 mb-6">
              Change the status of this complaint
            </p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Select New Status
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="status"
                    value="pending"
                    checked={selectedStatus === "pending"}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-2">⏳</span>
                  <div>
                    <p className="font-semibold text-gray-800">Pending</p>
                    <p className="text-xs text-gray-500">Waiting for review</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="status"
                    value="in-progress"
                    checked={selectedStatus === "in-progress"}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-2">🔄</span>
                  <div>
                    <p className="font-semibold text-gray-800">In Progress</p>
                    <p className="text-xs text-gray-500">Being worked on</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="status"
                    value="resolved"
                    checked={selectedStatus === "resolved"}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-2xl mr-2">✅</span>
                  <div>
                    <p className="font-semibold text-gray-800">Resolved</p>
                    <p className="text-xs text-gray-500">
                      Issue has been fixed
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {updatingStatus ? "Updating..." : "Update Status"}
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedComplaint(null);
                  setSelectedStatus("");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
