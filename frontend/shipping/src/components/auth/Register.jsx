/* src/components/auth/Register.jsx */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
    document: null,
  });

  /* ---------- handlers ---------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));

    try {
      await axios.post("http://localhost:8000/api/users/register/", data);
      alert("Registered successfully! You can now log in.");
      navigate("/login");                 // 🔸 jump to Login
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed.");
      console.error("REGISTER-400:", err.response?.data || err.message);
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 border border-teal-100">
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-8">📝 Register</h2>

        {/* username / email / password */}
        {["username", "email", "password"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-teal-800 font-semibold mb-1 capitalize">{field}</label>
            <input
              name={field}
              type={field === "password" ? "password" : field}
              onChange={handleChange}
              placeholder={field === "email" ? "you@example.com" : field}
              required
              className="w-full px-4 py-2 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        ))}

        {/* role */}
        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* document for agents */}
        {formData.role === "agent" && (
          <div className="mb-6">
            <label className="block text-teal-800 font-semibold mb-1">Upload Document</label>
            <input
              name="document"
              type="file"
              onChange={handleChange}
              className="w-full cursor-pointer file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-teal-100 file:text-teal-700 rounded-lg border border-teal-300"
            />
          </div>
        )}

        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-md">
          Register
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:underline">Login here</a>
        </p>
      </form>
    </div>
  );
}
