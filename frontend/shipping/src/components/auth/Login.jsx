import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← الإضافة الجديدة
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ← الإضافة الجديدة

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
        // alert("Login successful");

        navigate("/dashboard"); 
      } else {
        alert("Login failed: Tokens missing");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 sm:px-6 md:px-8 py-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-10 md:p-12 border border-teal-100 animate-fade-in"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-teal-700 mb-6 sm:mb-8">
          🚪 Login
        </h2>

        <div className="mb-5">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>

        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition duration-300 shadow-md hover:shadow-lg"
        >
          Log In
        </button>

        <p className="text-center text-sm sm:text-base text-gray-500 mt-5">
          Forgot password?{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Reset it
          </a>
        </p>
      </form>
    </div>
  );
}
