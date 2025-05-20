import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Header";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import AvailableShipments from "./components/availableShipments/AvailableShipments";
import MyShipments from "./components/myShipments/MyShipments";
import MyEarnings from "./components/myEarnings/MyEarnigns";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shipments/create" element={<CreateShipment />} />
              <Route path="/shipments/list" element={<ShipmentList />} />
              <Route
                path="/shipments/available"
                element={<AvailableShipments />}
              />
              <Route path="/shipments/my-shipments" element={<MyShipments />} />
              <Route path="my-earnings" element={<MyEarnings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
