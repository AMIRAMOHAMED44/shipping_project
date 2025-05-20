import { useContext } from "react";
import AuthContext from "../../context/AuthContext.jsx";

export default function Dashboard({ profile, logout }) {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (!profile) return <div className="text-center mt-10">No user data found. Please login again.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {profile.username || profile.email}
      </h2>

      {profile.current_plan ? (
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          <p><strong>Current Plan:</strong> {profile.current_plan.name}</p>
          <p><strong>Price:</strong> ${profile.current_plan.price}</p>
          <p><strong>Weight Limit:</strong> {profile.current_plan.weight_limit}kg</p>
          <p><strong>Features:</strong></p>
          {Array.isArray(profile.current_plan.features) ? (
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {profile.current_plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          ) : (
            <p>{profile.current_plan.features}</p>
          )}
        </div>
      ) : (
        <p className="text-red-600 mt-4">No current plan assigned.</p>
      )}

      <p className="mt-4"><strong>Plan Expiry:</strong> {profile.plan_expiry || "N/A"}</p>

      <button
        onClick={() => window.location.href = "/payment"} // Updated to /payment
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Upgrade Plan
      </button>
      <button
        onClick={logout}
        className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}