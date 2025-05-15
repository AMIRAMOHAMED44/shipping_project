import { useEffect, useState } from "react";
import axios from "axios";

export default function PlanSection() {
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
        setError("Failed to load plans.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-teal-700">Loading plans...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="bg-white p-8 rounded shadow-md max-w-5xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Our Plans</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-teal-50 p-4 rounded border border-teal-200">
            <h3 className="text-xl font-semibold text-teal-900">{plan.name}</h3>
            <p className="text-teal-700 mt-2">{plan.description}</p>
            <ul className="text-sm text-teal-600 mt-2 list-disc list-inside">
              {plan.features.split(",").map((feature, i) => (
                <li key={i}>{feature.trim()}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-teal-800 italic">{plan.price_note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
