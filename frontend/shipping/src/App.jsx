import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import UpgradePlans from "./components/customer-dashboard/plans";
import Dashboard from "./components/customer-dashboard/dashboard";
import Payment from "./components/customer-dashboard/payment.jsx";
import AvailableShipments from "./components/availableShipments/AvailableShipments.jsx";
import MyEarnings from "./components/myEarnings/MyEarnigns.jsx";
import MyShipments from "./components/myShipments/MyShipments.jsx";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin imports
import AdminLogin from "./pages/AdminAuth/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Customers from "./pages/Admin/Customers";
import Agents from "./pages/Admin/Agents";
import Shipments from "./pages/Admin/Shipments";
import Pricing from "./pages/Admin/Pricing";
import Finance from "./pages/Admin/Finance";
import Messages from "./pages/Admin/Messages";
import AdminLayout from "./Layouts/AdminLayout";

// هنا بتستورد ProtectedRoute مرة وحدة فقط
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);

  // شرط لاظهار Navbar و Footer فقط في صفحات المستخدم العادي (غير صفحات الأدمن)
  const showUserLayout = !window.location.pathname.startsWith("/admin");

  // شرط لتحديد هل الأدمن مسجل دخول
  const isAdminLoggedIn = isAuthenticated && user?.role === "admin";

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        {showUserLayout && <Navbar logout={logout} user={user} />}
        <main className="flex-grow">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["admin"]}
                >
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="agents" element={<Agents />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="finance" element={<Finance />} />
              <Route path="messages" element={<Messages />} />
            </Route>

            {/* Redirect root / to admin dashboard if admin logged in, else to user login */}
            <Route
              path="/"
              element={
                isAdminLoggedIn ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/shipments/create"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["customer", "agent"]}
                >
                  <CreateShipment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/list"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["customer", "agent"]}
                >
                  <ShipmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["customer"]}
                >
                  <Dashboard profile={user} logout={logout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["customer"]}
                >
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upgrade-plans"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["customer"]}
                >
                  <UpgradePlans onSelectPlan={(plan) => console.log(plan)} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/available-shipments"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["agent"]}
                >
                  <AvailableShipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/my-earnings"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["agent"]}
                >
                  <MyEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/my-shipments"
              element={
                <ProtectedRoute
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  allowedRoles={["agent"]}
                >
                  <MyShipments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={<div className="text-center mt-10 text-teal-700">Unauthorized Access</div>}
            />
          </Routes>
        </main>
        {showUserLayout && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;
