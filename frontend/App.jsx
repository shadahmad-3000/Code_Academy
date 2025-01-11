import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext.jsx";
import Preloader from "@/views/Preloader.jsx";

import Login from "@/views/auth/Login.jsx";
import Register from "@/views/auth/Register.jsx";
import AdminLayout from "@/layouts/Admin.jsx";
import CompleteRegistration from "@/views/auth/CompleteRegistration.jsx";
import Verification from "@/views/auth/Verification.jsx"; // new component

import Dashboard from "@/views/Dashboard.jsx";
import CodingContests from "@/views/CodingContests.jsx";
import Messages from "@/views/Messages.jsx";

import UserManagement from "@/views/admin/UserManagement.jsx";
import ManagingOpportunities from "@/views/admin/ManagingOpportunities.jsx"
import Profile from "@/views/Profile.jsx";
import Account from "@/views/Account.jsx";
import ContestManagement from "@/views/admin/ContestManagement.jsx";

import Assignments from "@/views/student/Assignments.jsx";
import Opportunities from "@/views/student/Opportunities.jsx"

import AssignmentsManagement from "@/views/teacher/AssignmentsManagement.jsx";
import UploadNotes from "@/views/teacher/UploadNotes.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isRegistrationComplete, verified } = useAuth();

  if (loading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!isRegistrationComplete) {
    return <Navigate to="/complete-registration" />;
  }

  if (!verified) {
    return <Navigate to="/verification" />;
  }

  return children;
};

function App() {
  const { loading, user, isRegistrationComplete, verified } = useAuth();

  if (loading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Route public - Login */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        <Route
          path="/signup"
          element={
            user ? <Navigate to="/dashboard" /> : <Register />
          }
        />

        <Route
          path="/complete-registration"
          element={
            !user ? (
              <Navigate to="/" />
            ) : isRegistrationComplete ? (
              <Navigate to="/dashboard" />
            ) : (
              <CompleteRegistration />
            )
          }
        />

        <Route
          path="/verification"
          element={
            !user ? (
              <Navigate to="/" />
            ) : !isRegistrationComplete ? (
              <Navigate to="/complete-registration" />
            ) : verified ? (
              <Navigate to="/dashboard" />
            ) : (
              <Verification />
            )
          }
        />

        {/*  */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/*  */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />
        </Route>

        {/* */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="contests" element={<CodingContests />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>

        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="assignments" element={<AssignmentsManagement />} />
          <Route path="upload-notes" element={<UploadNotes />} />
        </Route>

        {/* Route as administrator */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="contests" element={<ContestManagement />} />
          <Route path="opportunities" element={<ManagingOpportunities />} />
        </Route>

        {/* */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;