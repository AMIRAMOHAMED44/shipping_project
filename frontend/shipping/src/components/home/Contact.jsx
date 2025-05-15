import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // success or error message
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Replace with your actual backend API for contact messages
      await axios.post("http://localhost:8000/api/home/contact/", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Failed to send message. Please try again.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6 text-center">Contact Us</h2>
      {status && (
        <p
          className={`mb-4 text-center ${
            status.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-teal-700 font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-teal-700 font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-teal-700 font-medium mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-teal-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Write your message here"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
