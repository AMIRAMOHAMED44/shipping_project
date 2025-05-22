import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
import ProtectedRoute from "./components/Admin/ProtectedRoute";

// User imports (from your friends' project)
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import UpgradePlans from "./components/customer-dashboard/plans";
import Dashboard from "./components/customer-dashboard/dashboard";

function App() {
  // Admin auth check (simple example based on localStorage token presence)
  const isAdminLoggedIn = localStorage.getItem("isLoggedIn");

  // User state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        console.log("No access token found");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/account/account/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
        setView("dashboard");
      } catch (err) {
        console.error("Error fetching dashboard:", err.response?.data || err.message);
        setProfile(null);
        setView("login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLoginSuccess = () => {
    // Refetch profile on user login success
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/account/account/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setView("dashboard");
      } catch {
        setProfile(null);
        setView("login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setProfile(null);
    setView("login");
  };

  return (
    <Router>
      {/* Navbar and Footer only for user-facing pages */}
      {/* Admin pages use AdminLayout which presumably includes its own layout */}
      {!window.location.pathname.startsWith("/admin") && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
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

          {/* Redirect root / to admin dashboard if admin logged in */}
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
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shipments/create" element={<CreateShipment />} />
          <Route path="/shipments/list" element={<ShipmentList />} />
          <Route
            path="/dashboard"
            element={profile ? <Dashboard profile={profile} /> : <Navigate to="/login" />}
          />
          <Route path="/upgrade-plans" element={<UpgradePlans onSelectPlan={(plan) => console.log(plan)} />} />
        </Routes>
      </main>
      {!window.location.pathname.startsWith("/admin") && <Footer />}
    </Router>
  );
}

export default App;
