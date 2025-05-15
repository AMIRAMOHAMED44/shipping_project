import React, { useState } from "react";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  const [view, setView] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "home" && <Home setView={setView} />}
      {view === "login" && <Login onLogin={() => setView("home")} />}
      {view === "register" && <Register />}
    </div>
  );
}

export default App;
