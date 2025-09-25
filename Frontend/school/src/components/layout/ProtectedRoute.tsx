import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type {RootState}  from '../../store/index'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}