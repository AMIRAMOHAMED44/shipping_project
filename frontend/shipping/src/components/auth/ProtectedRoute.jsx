// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import AuthContext from "../../context/AuthContext.jsx";
// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { isAuthenticated, isLoading, user } = useContext(AuthContext);

//   if (isLoading) return <div className="text-center mt-10">Loading...</div>;

//   if (!isAuthenticated) return <Navigate to="/login" />;

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/unauthorized" />;
//   }
  

//   return children;
// }

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function ProtectedRoute({ isLoading, isAuthenticated, allowedRoles, children }) {
  const { user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}