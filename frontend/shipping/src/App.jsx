import { useState, useEffect } from "react";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/customer-dashboard/dashboard";
import axios from "axios";

function App() {
  const [view, setView] = useState("register");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/account/", {
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

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold cursor-pointer" onClick={() => setView("dashboard")}>
          ShippingCo
        </div>

        <div className="flex items-center gap-4">
          {!profile && (
            <>
              <button
                onClick={() => setView("register")}
                className={`px-4 py-2 rounded ${view === "register" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Register
              </button>
              <button
                onClick={() => setView("login")}
                className={`px-4 py-2 rounded ${view === "login" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Login
              </button>
            </>
          )}

          {profile && (
  <>
    <button
      onClick={() => setView("dashboard")}
      className={`px-3 py-1 rounded ${view === "dashboard" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
    >
      Dashboard
    </button>
    <button
      onClick={() => setView("create")}
      className={`px-3 py-1 rounded ${view === "create" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
    >
      Create Shipment
    </button>
    <button
      onClick={() => setView("list")}
      className={`px-3 py-1 rounded ${view === "list" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
    >
      Shipment List
    </button>
    <span className="mx-2">|</span>
    <span>Hi, <strong>{profile.user}</strong></span>
    <span>
      Plan: <strong>{profile.current_plan ? profile.current_plan.name : "Free"}</strong>
    </span>
    <button
      onClick={() => setView("upgrade-plans")}
      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      Upgrade Plan
    </button>
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  </>
)}

        </div>
      </nav>

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        {loading && <div className="text-center mt-10">Loading...</div>}

        {!loading && view === "register" && <Register />}
        {!loading && view === "login" && <Login onLogin={handleLoginSuccess} />}
        {!loading && view === "create" && <CreateShipment />}
        {!loading && view === "list" && <ShipmentList />}
        {!loading && view === "dashboard" && profile && (
          <>
            <h2 className="text-2xl font-bold mb-4">Welcome, {profile.user}</h2>

            {profile.current_plan ? (
              <>
                <p className="mb-2"><strong>Current Plan:</strong> {profile.current_plan.name}</p>
                <p className="mb-2"><strong>Price:</strong> ${profile.current_plan.price}</p>
                <p className="mb-2"><strong>Features:</strong> {profile.current_plan.features}</p>
                <p className="mb-2"><strong>Weight Limit:</strong> {profile.current_plan.weight_limit}kg</p>
              </>
            ) : (
              <p className="mb-2 text-red-600">No current plan assigned</p>
            )}

            <p className="mb-4"><strong>Plan Expiry:</strong> {profile.plan_expiry || "N/A"}</p>

            <button
              onClick={() => setView("upgrade-plans")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Upgrade Plan
            </button>
          </>
        )}

        {/* Placeholder for Upgrade Plans Page */}
        {!loading && view === "upgrade-plans" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Upgrade Plans Page (Under Construction)</h2>
            <button
              onClick={() => setView("dashboard")}
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
