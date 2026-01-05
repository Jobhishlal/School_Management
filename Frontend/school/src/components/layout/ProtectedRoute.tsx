import { Navigate, useLocation } from "react-router-dom";
import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  let isAuthenticated = false;

  if (path.startsWith("/teacher")) {
    if (localStorage.getItem("teacherAccessToken")) isAuthenticated = true;
  } else if (path.startsWith("/student") || path.startsWith("/student-dashboard")) {
    if (localStorage.getItem("studentAccessToken")) isAuthenticated = true;
  } else if (path.startsWith("/parent")) {
    if (localStorage.getItem("parentAccessToken")) isAuthenticated = true;
  } else {
    // Admin or default
    if (localStorage.getItem("adminAccessToken") || localStorage.getItem("accessToken")) isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}