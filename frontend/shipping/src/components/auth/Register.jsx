import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Register() {
  const { api } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must include at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must include at least one number";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "Password must include at least one special character";
    }
    if (formData.role === "agent" && !formData.city) {
      newErrors.city = "City is required for agent registration";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      console.log("Sending data:", formData);
      const response = await api.post("/users/register/", formData);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || Object.values(err.response?.data || {}).join(", ") || "Registration failed. Please try again.";
      toast.error(errorMsg);
      console.error("Registration error:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 sm:px-6 md:px-8 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-10 md:p-12 border border-teal-100 animate-fade-in"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-teal-700 mb-6 sm:mb-8">
          📝 Register
        </h2>
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
              errors.username ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
            required
            className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4 relative">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Password
          </label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        {formData.role === "agent" && (
          <div className="mb-4">
            <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
              City
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Your city"
              required={formData.role === "agent"}
              className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
                errors.city ? "border-red-500" : "border-teal-300"
              } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-4 rounded-lg text-base sm:text-lg transition duration-300 shadow-md hover:shadow-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}