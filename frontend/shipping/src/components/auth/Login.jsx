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
    <form onSubmit={handleLogin} className="p-4 space-y-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold">Login</h2>
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input w-full border p-2 rounded"
      />
      <label>Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="input w-full border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </form>
  );
}
