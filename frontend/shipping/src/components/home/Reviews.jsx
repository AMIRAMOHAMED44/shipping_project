import { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/home/testimonials/")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching reviews");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-teal-700">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-800 text-center mb-12 font-serif">
          What Our Customers Say
        </h2>
        <div className="space-y-8">
          {reviews.map((review) => (
            <blockquote
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-600 italic hover:shadow-lg transition"
            >
              <p className="text-teal-700">"{review.feedback}"</p>
              <footer className="mt-2 font-bold text-teal-900">
                — {review.name}
                {review.company && `, ${review.company}`}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
