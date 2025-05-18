/* src/components/auth/Login.jsx */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../auth/authContext";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [sendingReset, setSending] = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  /* ---------- login ---------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login/",
        { email, password },
        { withCredentials: false }          // explicit, so CORS pre-flight is simple
      );

      if (data.access && data.refresh) {
        login(data.access);                 // update AuthContext
        localStorage.setItem("refresh", data.refresh);

        console.log("✔ logged-in, go → /dashboard");
        navigate("/dashboard");
      } else {
        alert("Login failed: tokens missing");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed, please check your credentials.");
    }
  };

  /* ---------- forgot-password ---------- */
  const handleForgot = async () => {
    if (!email) return alert("Enter your e-mail first.");
    try {
      setSending(true);
      await axios.post(
        "http://localhost:8000/api/users/password-reset/",
        { email },
        { withCredentials: false }
      );
      alert("Password-reset link sent to your e-mail.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Couldn’t send reset e-mail.");
    } finally {
      setSending(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 border border-teal-100"
      >
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">
          🚪 Login
        </h2>

        {/* email */}
        <div className="mb-5">
          <label className="block text-teal-800 font-semibold mb-1">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* password */}
        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-1">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-md">
          Log In
        </button>

        {/* actions */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-5">
          <button
            type="button"
            onClick={handleForgot}
            disabled={sendingReset}
            className="text-teal-600 hover:underline disabled:opacity-50"
          >
            {sendingReset ? "Sending…" : "Forgot password?"}
          </button>

          <Link to="/register" className="text-teal-600 hover:underline">
            Don’t have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}
