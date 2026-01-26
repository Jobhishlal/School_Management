import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const path = location.pathname;

  let isAuthenticated = false;


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
    path.startsWith("/Announcement") ||
    path.startsWith("/instituteprofile") ||
    path.startsWith("/Announcement") ||
    path.startsWith("/leave-management")
  ) {
    const token = localStorage.getItem("adminAccessToken");
    const role = localStorage.getItem("role");
    if (token || (role === "super_admin" || role === "sub_admin") && localStorage.getItem("accessToken")) {
      isAuthenticated = true;
    }
  } else if (path.startsWith("/teacher")) {
    const token = localStorage.getItem("teacherAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/student")) {
    const token = localStorage.getItem("studentAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/parent")) {
    const token = localStorage.getItem("parentAccessToken");
    if (token) isAuthenticated = true;
  } else if (path.startsWith("/meeting")) {
    const token = localStorage.getItem('adminAccessToken') ||
      localStorage.getItem('teacherAccessToken') ||
      localStorage.getItem('studentAccessToken') ||
      localStorage.getItem('parentAccessToken') ||
      localStorage.getItem('accessToken');
    if (token) isAuthenticated = true;
  } else {
    const token = localStorage.getItem("accessToken");
    if (token) isAuthenticated = true;
  }

  console.log("PrivateRoute checking path:", path, "isAuthenticated:", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (path === "/login") {
    const role = localStorage.getItem("role");
    switch (role) {
      case "students":
        return <Navigate to="/student/dashboard" replace />;
      case "parent":
        return <Navigate to="/parent/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
