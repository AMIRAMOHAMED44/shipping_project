import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";  // عدل المسار لو مختلف عندك

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = await login(email, password);
      console.log("Logged in user:", userData);

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("أنت غير مصرح لك بالدخول كأدمن");
      }
    } catch (error) {
      alert(error.message || "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-white text-black border border-black rounded hover:bg-gray-100 font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
