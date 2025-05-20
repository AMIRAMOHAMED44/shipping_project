import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isLoading, isAuthenticated }) {
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}
