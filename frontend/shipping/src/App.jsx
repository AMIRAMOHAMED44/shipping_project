import { useState } from "react";
import CreateShipment from "./components/shipments/CreateShipment";
import ShipmentList from "./components/shipments/ShipmentList";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {
  const [view, setView] = useState("register");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex gap-3 mb-6 justify-center">
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
        <button
          onClick={() => setView("create")}
          className={`px-4 py-2 rounded ${view === "create" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Create Shipment
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${view === "list" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
        >
          Shipment List
        </button>
      </div>

      {view === "register" && <Register />}
      {view === "login" && <Login onLogin={() => console.log("User logged in!")} />}
      {view === "create" && <CreateShipment />}
      {view === "list" && <ShipmentList />}
    </div>
  );
}

export default App;
