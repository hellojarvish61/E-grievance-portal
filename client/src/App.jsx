import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage"; // NEW
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrackComplaint from "./pages/TrackComplaint";
import UserApproval from "./pages/admin/UserApproval";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} /> {/* NEW */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackComplaint />} />
            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <>
                    <Navbar />
                    <StudentDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/submit-complaint"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <>
                    <Navbar />
                    <SubmitComplaint />
                  </>
                </ProtectedRoute>
              }
            />
            {/* Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <>
                    <Navbar />
                    <TeacherDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <>
                    <Navbar />
                    <AdminDashboard />
                  </>
                </ProtectedRoute>
              }
            />
            {/* User Approval Route */}
            <Route
              path="/admin/user-approval"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <>
                    <Navbar />
                    <UserApproval />
                  </>
                </ProtectedRoute>
              }
            />
            {/* 404 - Redirect to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
