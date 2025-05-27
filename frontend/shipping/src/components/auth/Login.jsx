// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthContext from "../../context/AuthContext.jsx";
// import { toast } from "react-toastify";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, user } = useContext(AuthContext); // Use login from AuthContext
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
//     if (!password) {
//       newErrors.password = "Password is required";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setIsLoading(true);
//     try {
//       await login(email, password);
//       toast.success("Login successful!");
//       // Role-based redirect
//       if (user?.role === "customer") {
//         navigate("/account");
//       } else if (user?.role === "agent") {
//         navigate("/agents/available-shipments");
//       } else {
//         navigate("/dashboard"); // Fallback
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || "Login failed. Please try again.";
//       toast.error(errorMsg);
//       console.error("Login error:", err.response?.data);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 sm:px-6 md:px-8 py-10">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-10 md:p-12 border border-teal-100 animate-fade-in"
//       >
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-teal-700 mb-6 sm:mb-8">
//           🚪 Login
//         </h2>
//         <div className="mb-5">
//           <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
//             Email
//           </label>
//           <input
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value);
//               setErrors((prev) => ({ ...prev, email: null }));
//             }}
//             placeholder="you@example.com"
//             type="email"
//             required
//             className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
//               errors.email ? "border-red-500" : "border-teal-300"
//             } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
//           />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//         </div>
//         <div className="mb-6 relative">
//           <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
//             Password
//           </label>
//           <input
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               setErrors((prev) => ({ ...prev, password: null }));
//             }}
//             placeholder="••••••••"
//             type={showPassword ? "text" : "password"}
//             required
//             className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border ${
//               errors.password ? "border-red-500" : "border-teal-300"
//             } focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-9 text-teal-600 hover:text-teal-800"
//           >
//             {showPassword ? "Hide" : "Show"}
//           </button>
//           {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition duration-300 shadow-md hover:shadow-lg ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isLoading ? "Logging in..." : "Log In"}
//         </button>
//         <p className="text-center text-sm sm:text-base text-gray-500 mt-5">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-teal-600 hover:underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      toast.success("Logged in successfully!");
      if (userData.role === "agent") {
        navigate("/agents/available-shipments");
      } else if (userData.role === "customer") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard"); // Fallback for admin or other roles
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
      setErrors({ error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 border border-teal-100"
      >
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
          🔑 Login
        </h2>
        {errors.error && <p className="text-red-500 text-sm mb-4 text-center">{errors.error}</p>}
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            required
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Your password"
            required
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.password ? "border-red-500" : "border-teal-300"
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}