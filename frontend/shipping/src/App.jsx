import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import UpgradePlans from "./components/customer-dashboard/plans";
import Dashboard from "./components/customer-dashboard/dashboard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./redux/authSlice";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // default true to wait before rendering
  const [view, setView] = useState("home");

  const dispatch = useDispatch();

  const fetchDashboard = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      console.log("No access token found");
      setProfile(null);
      setLoading(false);
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
      dispatch(setCredentials({ user: res.data }));
    } catch (err) {
      console.error("Error fetching dashboard:", err.response?.data || err.message);
      setProfile(null);
      setView("login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLoginSuccess = () => {
    fetchDashboard();
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setProfile(null);
    dispatch(logout());
    setView("login");
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login onLogin={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/shipments/create" element={
              <ProtectedRoute>
                <CreateShipment />
              </ProtectedRoute>
            } />
            <Route path="/shipments/list" element={
              <ProtectedRoute>
                <ShipmentList />
              </ProtectedRoute>
            } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoading={loading} isAuthenticated={!!profile}>
                  <Dashboard profile={profile} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upgrade-plans"
              element={<UpgradePlans onSelectPlan={(plan) => console.log(plan)} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
