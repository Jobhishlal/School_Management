import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const path = location.pathname;

  let isAuthenticated = false;

  // Check authentication based on route prefix
  // Check authentication based on route prefix
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/teachers") ||
    path.startsWith("/student-management") ||
    path.startsWith("/classbaseview") ||
    path.startsWith("/timetable-management") ||
    path.startsWith("/finance-management") ||
    path.startsWith("/expense-management") ||
    path.startsWith("/instituteprofile") ||
    path.startsWith("/Announcement")
  ) {
    const token = localStorage.getItem("adminAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/teacher")) {
    const token = localStorage.getItem("teacherAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/student") || path.startsWith("/student-dashboard")) {
    const token = localStorage.getItem("studentAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/parent")) {
    const token = localStorage.getItem("parentAccessToken");
    if (token) isAuthenticated = true;
  } else {
    // Fallback for generic routes or unknown paths
    const token = localStorage.getItem("accessToken");
    if (token) isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle redirect if already logged in but trying to access login (though this logic might be better in PublicRoute)
  if (path === "/login") {
    const role = localStorage.getItem("role"); // This might still be ambiguous if multiple logged in, but login page is generic
    switch (role) {
      case "students":
        return <Navigate to="/student-dashboard" replace />;
      case "parent":
        return <Navigate to="/parent/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
