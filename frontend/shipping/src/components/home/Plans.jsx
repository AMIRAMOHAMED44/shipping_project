import { useEffect, useState } from "react";
import axios from "axios";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/home/plans/")
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching plans");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-teal-700">Loading plans...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="max-w-5xl mx-auto mb-12 p-6">
      <h2 className="text-3xl font-semibold text-teal-900 mb-6 text-center">Our Plans</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.id} className="border border-teal-300 rounded-lg p-6 shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-bold text-teal-800 mb-2">{plan.name}</h3>
            <p className="text-teal-700 mb-4">{plan.description}</p>
            <ul className="list-disc list-inside text-teal-600 mb-4">
              {plan.features.split(",").map((feature, i) => (
                <li key={i}>{feature.trim()}</li>
              ))}
            </ul>
            <p className="font-semibold text-teal-900">{plan.price_note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
