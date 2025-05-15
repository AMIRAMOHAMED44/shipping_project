import { useEffect, useState } from "react";
import axios from "axios";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/home/testimonials/")
      .then((res) => {
        setTestimonials(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching testimonials");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-teal-700">Loading testimonials...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="bg-teal-100 p-8 rounded shadow-md max-w-5xl mx-auto mb-12">
      <h2 className="text-3xl font-semibold text-teal-900 mb-6 text-center">What Our Customers Say</h2>
      <div className="space-y-6">
        {testimonials.map(t => (
          <blockquote key={t.id} className="border-l-4 border-teal-600 pl-4 italic text-teal-700">
            <p>"{t.feedback}"</p>
            <footer className="mt-2 font-bold text-teal-900">
              — {t.name}{t.company && `, ${t.company}`}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
