import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
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
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Image */}
        <div>
          <img
            src="src/assets/10.jpg"
            alt="Contact illustration"
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-8 font-serif">
            Get in Touch
          </h2>

          {status && (
            <p
              className={`mb-6 text-lg font-medium ${
                status.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 shadow-md p-8 bg-white rounded-xl">

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
            />

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Write your message here..."
              className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold py-3 transition-all duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
