import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === "/login") {
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
