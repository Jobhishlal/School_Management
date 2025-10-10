import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: JSX.Element;
  restricted?: boolean; 
}

export default function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (restricted && token) {
    switch (role) {
      case "admin":
        return <Navigate to="/dashboard" replace />;
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      case "parent":
        return <Navigate to="/parent/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}
