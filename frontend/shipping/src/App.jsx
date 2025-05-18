import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import UpgradePlans from "./components/customer-dashboard/plans";
import Dashboard from "./components/customer-dashboard/dashboard";
import axios from "axios";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");

  // <PayPalScriptProvider options={{ "client-id": "AeR1Lb5gdCtQfg_6YW3fzK57h4xK-aOlLLaVK4AYScutG3zZ82xkMw0ZC06HHezF-WaSdEYl454IPhBg" }}>
  //   <App />
  // </PayPalScriptProvider>
 

  useEffect(() => {
     const fetchDashboard = async () => {
    const token = localStorage.getItem("access");
    if (!token) {console.log("No access token found")
       return};

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
      console.error(
        "Error fetching dashboard:",
        err.response?.data || err.message
      );
      setProfile(null);
      setView("login");
    } finally {
      setLoading(false);
    }
  };
    fetchDashboard();
  }, []);

  const handleLoginSuccess = () => {
    fetchDashboard();
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    setProfile(null);
    setView("login");
  };

  return (
    <BrowserRouter>
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
            <Route path="/shipments/create" element={<CreateShipment />} />
            <Route path="/shipments/list" element={<ShipmentList />} />
            <Route
              path="/dashboard"
              element={
                profile ? (
                  <Dashboard profile={profile} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/upgrade-plans"
              element={
                
                  <UpgradePlans onSelectPlan={(plan) => console.log(plan)} />
                
              }/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
