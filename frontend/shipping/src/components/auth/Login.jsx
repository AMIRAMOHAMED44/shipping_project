import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import axiosInstance from '../../api/axiosInstance';

// دالة التحقق من صلاحية التوكن
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. تسجيل الدخول
      const res = await axiosInstance.post("/api/users/login/", { email, password });
      
      if (!res.data.access || !res.data.refresh) {
        throw new Error("Tokens missing in response");
      }

      // 2. تخزين التوكنز
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 3. جلب بيانات المستخدم
      const userRes = await axiosInstance.get("/api/account/account/");
      dispatch(login(userRes.data));

      // 4. التوجيه للداشبورد
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Login failed";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 400) {
          errorMessage = "Please check your email and password format";
        }
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Network error, check your connection";
      }
      
      setError(errorMessage);
      
      // تنظيف التوكنز في حالة الخطأ
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } finally {
      setLoading(false);
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
          disabled={loading}
          className={`w-full ${loading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg transition duration-300 shadow-md hover:shadow-lg flex justify-center items-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Log In"
          )}
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