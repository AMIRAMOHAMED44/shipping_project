import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">مرحباً بك في لوحة التحكم</h2>
      <p className="mt-2 text-gray-600">هنا يمكنك إدارة النظام بالكامل</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* بطاقات أو إحصائيات أو جداول */}
      </div>
    </div>
  );
};

export default AdminDashboard;
