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
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold">Register</h2>
      <label>Username</label>
      <input name="username" onChange={handleChange} placeholder="Username" className="input w-full border p-2 rounded" />
      <label>Email</label>
      <input name="email" onChange={handleChange} placeholder="Email" type="email" className="input w-full border p-2 rounded" />
      <label>Password</label>
      <input name="password" onChange={handleChange} placeholder="Password" type="password" className="input w-full border p-2 rounded" />

      <label>Role</label>
      <select name="role" onChange={handleChange} className="input w-full border p-2 rounded">
        <option value="customer">Customer</option>
        <option value="agent">Agent</option>
      </select>

      {formData.role === "agent" && (
        <>
          <label>Upload Document</label>
          <input name="document" type="file" onChange={handleChange} className="input w-full border p-2 rounded" />
        </>
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
    </form>
  );
}
