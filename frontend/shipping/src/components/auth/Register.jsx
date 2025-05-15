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
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 max-w-md mx-auto bg-white shadow-lg rounded-lg border border-teal-100"
    >
      <h2 className="text-2xl font-bold text-teal-800 text-center">Register</h2>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Username</label>
        <input
          name="username"
          onChange={handleChange}
          placeholder="Username"
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Email</label>
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email"
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Password</label>
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div>
        <label className="block text-teal-700 font-medium mb-1">Role</label>
        <select
          name="role"
          onChange={handleChange}
          className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      {formData.role === "agent" && (
        <div>
          <label className="block text-teal-700 font-medium mb-1">Upload Document</label>
          <input
            name="document"
            type="file"
            onChange={handleChange}
            className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full transition"
      >
        Register
      </button>
    </form>
  );
}
