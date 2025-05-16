import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/users/login/", {
        email,
        password,
      });

      const { access, refresh } = res.data;

      if (access && refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        console.log("Access Token:", access);
        console.log("Refresh Token:", refresh);
        alert("Login successful");
        onLogin?.(); // Optional callback
      } else {
        alert("Login failed: Tokens missing");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 space-y-4 max-w-md mx-auto bg-white shadow-lg rounded-lg border border-teal-100"
    >
      <h2 className="text-2xl font-bold text-teal-800 text-center">Login</h2>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full transition"
      >
        Login
      </button>
    </form>
  );
}
