import React, { useState, useEffect } from "react";
import api from "../../services/api";

const UserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/pending");
      setPendingUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pending users");
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName, role) => {
    if (
      !window.confirm(
        `Are you sure you want to approve ${userName} as ${role}?`
      )
    ) {
      return;
    }

    setProcessing(userId);
    try {
      await api.put(`/users/${userId}/approve`);
      alert(`✅ ${userName} has been approved successfully!`);
      fetchPendingUsers(); // Refresh list
    } catch (err) {
      alert(
        "Failed to approve user: " +
          (err.response?.data?.message || "Please try again")
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId, userName, role) => {
    if (
      !window.confirm(
        `Are you sure you want to REJECT and DELETE ${userName}'s ${role} registration? This action cannot be undone.`
      )
    ) {
      return;
    }

    setProcessing(userId);
    try {
      await api.delete(`/users/${userId}/reject`);
      alert(`❌ ${userName}'s registration has been rejected and deleted.`);
      fetchPendingUsers(); // Refresh list
    } catch (err) {
      alert(
        "Failed to reject user: " +
          (err.response?.data?.message || "Please try again")
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading pending requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">👥 User Approval Center</h1>
          <p className="text-orange-100 text-lg">
            Review and approve teacher/admin registration requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Pending Requests
                </p>
                <p className="text-4xl font-bold text-orange-600 mt-2">
                  {pendingUsers.length}
                </p>
              </div>
              <div className="text-5xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Teachers Pending
                </p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {pendingUsers.filter((u) => u.role === "teacher").length}
                </p>
              </div>
              <div className="text-5xl">👨‍🏫</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Admins Pending
                </p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  {pendingUsers.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="text-5xl">👑</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Pending Users List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-white">
            <h2 className="text-2xl font-bold">Pending Registrations</h2>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-8xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-500 text-lg">
                No pending registration requests at the moment
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingUsers.map((user) => (
                <div
                  key={user._id}
                  className="px-6 py-6 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                            user.role === "teacher"
                              ? "bg-gradient-to-br from-purple-600 to-pink-600"
                              : "bg-gradient-to-br from-red-600 to-orange-600"
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            {user.name}
                            <span
                              className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                                user.role === "teacher"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.role === "teacher"
                                ? "👨‍🏫 TEACHER"
                                : "👑 ADMIN"}
                            </span>
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Registered{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <span className="mr-2">📧</span>
                          <span className="text-sm text-gray-700">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🏛️</span>
                          <span className="text-sm text-gray-700">
                            {user.department}
                          </span>
                        </div>
                        {user.role === "teacher" && user.designation && (
                          <div className="flex items-center">
                            <span className="mr-2">💼</span>
                            <span className="text-sm text-gray-700">
                              {user.designation}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="mr-2">🕐</span>
                          <span className="text-sm text-gray-700">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() =>
                          handleApprove(user._id, user.name, user.role)
                        }
                        disabled={processing === user._id}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg transform hover:-translate-y-0.5"
                      >
                        {processing === user._id ? (
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
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="mr-2">✅</span>
                            Approve
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleReject(user._id, user.name, user.role)
                        }
                        disabled={processing === user._id}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                      >
                        <span className="flex items-center">
                          <span className="mr-2">❌</span>
                          Reject
                        </span>
                      </button>
                    </div>
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

export default UserApproval;
