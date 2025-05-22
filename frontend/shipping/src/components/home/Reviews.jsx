import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { toast } from 'react-toastify';

const StarRating = ({ rating, setRating }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-8 h-8 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={() => setRating(star)}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00 .951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function Reviews() {
  const { user, isAuthenticated, api } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    feedback: "",
    company: "",
    rating: 5,
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    api
      .get("/home/testimonials/")
      .then((res) => {
        setReviews(Array.isArray(res.data.results) ? res.data.results : res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching reviews");
        setLoading(false);
      });
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setSubmitStatus("Please log in to submit a review.");
      toast.error("Please log in to submit a review.");
      return;
    }
    const token = localStorage.getItem('access');
    if (!token) {
      setSubmitStatus("Authentication token missing. Please log in again.");
      toast.error("Session expired. Please log in again.");
      return;
    }
    setSubmitStatus(null);
    try {
      await api.post(
        "/home/testimonials/",
        { ...formData, name: user.username }
      );
      setSubmitStatus("Review submitted successfully!");
      toast.success("Review submitted successfully!");
      setFormData({ feedback: "", company: "", rating: 5 });
      const res = await api.get("/home/testimonials/");
      setReviews(Array.isArray(res.data.results) ? res.data.results : res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to submit review.";
      setSubmitStatus(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loading) return <p className="text-center text-teal-700">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-800 text-center mb-12 font-serif">
          What Our Customers Say
        </h2>
        {reviews.length === 0 ? (
          <p className="text-center text-teal-700">No testimonials available.</p>
        ) : (
          <div className="space-y-8 mb-12">
            {reviews.map((review) => (
              <blockquote
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-600 italic hover:shadow-lg transition"
              >
                <p className="text-teal-700">"{review.feedback}"</p>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00 .951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <footer className="ml-2 font-bold text-teal-900">
                    — {review.name}
                    {review.company && `, ${review.company}`}
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-teal-700 mb-6 text-center">Share Your Feedback</h3>
            {submitStatus && (
              <p
                className={`text-center mb-6 ${
                  submitStatus.includes("success") ? "text-green-600" : "text-red-600"
                }`}
              >
                {submitStatus}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 shadow-md p-8 bg-white rounded-xl max-w-lg mx-auto">
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                placeholder="Write your review..."
                className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition resize-none"
                rows="4"
              />
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company (optional)"
                className="w-full bg-gray-50 text-gray-800 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
              />
              <div>
                <label className="block text-teal-700 mb-2">Rating</label>
                <StarRating
                  rating={formData.rating}
                  setRating={handleRatingChange}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold py-3 transition-all duration-300"
              >
                Send Review
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}