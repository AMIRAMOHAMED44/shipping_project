import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem('access'); 
//   const location = useLocation();
//   if (!token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//   return children;
// }