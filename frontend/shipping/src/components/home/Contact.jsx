// src/components/auth/Login.jsx
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-8 font-serif">Login</h2>
        {error && <p className="text-red-600 mb-6">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6 shadow-md p-8 bg-white rounded-xl">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold py-3 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}