import { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyIntro() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/home/company/")
      .then((res) => {
        console.log("Company API response:", res.data);
        const result = Array.isArray(res.data) ? res.data[0] : res.data;
        setCompany(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching company info");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-teal-700">Loading company info...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!company) return <p className="text-center text-red-600">No company info found.</p>;

  return (
    <section className="bg-teal-50 p-8 rounded shadow-md max-w-4xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-teal-800 mb-4">Welcome to Ship27</h1>
      <p className="text-teal-700 mb-4">{company.intro}</p>
      <p className="text-teal-900 font-semibold mb-2">
        Contact us at: {company.contact_email} | {company.phone_number}
      </p>
      <p className="text-teal-700 mb-4">{company.address}</p>
      {(company.facebook || company.twitter || company.instagram) && (
        <div className="flex space-x-4">
          {company.facebook && (
            <a href={company.facebook} className="text-teal-600 hover:text-teal-800">Facebook</a>
          )}
          {company.twitter && (
            <a href={company.twitter} className="text-teal-600 hover:text-teal-800">Twitter</a>
          )}
          {company.instagram && (
            <a href={company.instagram} className="text-teal-600 hover:text-teal-800">Instagram</a>
          )}
        </div>
      )}
    </section>
  );
}