import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Navbar from "./components/Header/Header.jsx";
import CreateShipment from "./components/shipments/CreateShipment.jsx";
import ShipmentList from "./components/shipments/ShipmentList.jsx";
import UpgradePlans from "./components/customer-dashboard/plans.jsx";
import Dashboard from "./components/customer-dashboard/dashboard.jsx";
import Payment from "./components/customer-dashboard/payment.jsx"; 
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error("ErrorBoundary caught:", error);
      setHasError(true);
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please refresh the page.</div>;
  }

  return children;
}

function App() {
  const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
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
                path="/upgrade-plans"
                element={
                  <ProtectedRoute
                    isLoading={isLoading}
                    isAuthenticated={isAuthenticated}
                    allowedRoles={["customer"]}
                  >
                    <UpgradePlans />
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
                path="/unauthorized"
                element={<div className="text-center mt-10">Unauthorized Access</div>}
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} /> 
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;