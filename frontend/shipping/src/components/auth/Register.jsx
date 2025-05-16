import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.post("http://localhost:8000/api/users/register/", data);
      alert("Registered successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed.");
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
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Email
          </label>
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Password
          </label>
          <input
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
            Role
          </label>
          <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {formData.role === "agent" && (
          <div className="mb-4">
            <label className="block text-teal-800 font-semibold mb-1 text-base sm:text-lg">
              Upload Document
            </label>
            <input
              name="document"
              type="file"
              onChange={handleChange}
              className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-teal-100 file:text-teal-700"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 sm:py-4 rounded-lg text-base sm:text-lg transition duration-300 shadow-md hover:shadow-lg"
        >
          Register
        </button>

        <p className="text-center text-sm sm:text-base text-gray-500 mt-5">
          Already have an account?{" "}
          <a href="#" className="text-teal-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
