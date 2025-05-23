import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Login() {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Login failed. Please try again.";
      toast.error(errorMsg);
      console.error("Login error:", err.response?.data);
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
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="you@example.com"
            type="email"
            required
            className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-6 relative">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
            className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
              errors.password ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-teal-600 hover:text-teal-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition duration-300 shadow-md hover:shadow-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}