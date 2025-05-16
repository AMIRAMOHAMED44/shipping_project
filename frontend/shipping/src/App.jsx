import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer/Footer"
import Navbar from "./components/Header/Header";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
function App() {

  return (
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shipments/create" element={<CreateShipment />} />
              <Route path="/shipments/list" element={<ShipmentList />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
  );
}

export default App;
