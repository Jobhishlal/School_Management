import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactElement;
  restricted?: boolean;
}

export default function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const adminToken = localStorage.getItem("adminAccessToken");
  const teacherToken = localStorage.getItem("teacherAccessToken");
  const studentToken = localStorage.getItem("studentAccessToken");
  const parentToken = localStorage.getItem("parentAccessToken");
  const genericToken = localStorage.getItem("accessToken");

  const role = localStorage.getItem("role");

  if (restricted) {
    // 1. Check if the LAST ACTIVE role has a valid token and redirect there first.
    if (role === "teacher" && teacherToken) return <Navigate to="/teacher/dashboard" replace />;
    if (role === "students" && studentToken) return <Navigate to="/student/dashboard" replace />;
    if ((role === "super_admin" || role === "sub_admin") && adminToken) return <Navigate to="/dashboard" replace />;
    if (role === "parent" && parentToken) return <Navigate to="/parent/dashboard" replace />;

    // 2. If no matching role, or specific token missing, fallback to ANY valid token found (Order matters here for default priority)
    // We prioritize Admin > Teacher > Student > Parent if ambiguous
    if (adminToken) return <Navigate to="/dashboard" replace />;
    if (teacherToken) return <Navigate to="/teacher/dashboard" replace />;
    if (studentToken) return <Navigate to="/student/dashboard" replace />;
    if (parentToken) return <Navigate to="/parent/dashboard" replace />;

    // 3. Last resort: legacy generic token
    if (genericToken) {
      if (role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
      if (role === "students") return <Navigate to="/student/dashboard" replace />;
      if (role === "parent") return <Navigate to="/parent/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
