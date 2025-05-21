import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import UpgradePlans from "./components/customer-dashboard/plans";
import Dashboard from "./components/customer-dashboard/dashboard";
import Payment from "./components/customer-dashboard/payment.jsx"; // Updated to Payment
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ToastContainer />
        <Navbar logout={logout} user={user} />
        <main className="flex-grow">
          <Routes>
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
                  allowedRoles={["customer", "agent", "admin"]}
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
              path="/unauthorized"
              element={<div className="text-center mt-10">Unauthorized Access</div>}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;