import { useContext } from "react";
import { toast } from 'react-toastify';
import AuthContext from "../../context/AuthContext.jsx";
import bgImage from '../../assets/17.jpg'; // Reuse CreateShipment.jsx background

export default function Dashboard({ profile, logout }) {
  const { isLoading } = useContext(AuthContext);

  // Debugging logs
  console.log('Dashboard - Profile:', profile);
  console.log('Dashboard - isLoading:', isLoading);

  // Handle missing profile data
  if (!profile) {
    console.warn('No profile data provided');
    toast.error('No user data found. Please log in again.');
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10 sm:py-16"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 text-center">
          <p className="text-red-800 text-base">No user data found. Please login again.</p>
        </div>
      </div>
    );
  }

  // Handle no current plan
  if (!profile.current_plan) {
    console.warn('No current plan assigned for user:', profile.email);
    toast.warn('No current plan assigned. Contact support or upgrade your plan.');
  }

  let expire_date = profile.plan_expiry;
  if (profile.current_plan.name === "regular") {
    expire_date = "No expiry date";
  }
// profile.plan_expiry ? new Date(profile.plan_expiry).toLocaleDateString() : 'N/A'



  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10 sm:py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-teal-400/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 transform transition duration-300 hover:shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 mb-6">
            👋 Welcome, {profile.username || profile.email}
          </h2>

          <div className="bg-teal-50 p-5 rounded-xl border border-teal-200 mb-6">
            <h3 className="text-lg font-semibold text-teal-800 mb-3">📋 Plan Details</h3>
            {profile.current_plan ? (
              <div className="space-y-2 text-sm sm:text-base text-gray-800">
                <p><strong className="text-gray-700">Plan:</strong> {profile.current_plan.name}</p>
                <p><strong className="text-gray-700">Price:</strong> USB {profile.current_plan.price?.toFixed(2)}</p>
                <p><strong className="text-gray-700">Weight Limit:</strong> {profile.current_plan.weight_limit} kg</p>
                <p><strong className="text-gray-700">Features:</strong></p>
                {Array.isArray(profile.current_plan.features) ? (
                  <ul className="list-disc ml-5 text-gray-700">
                    {profile.current_plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{profile.current_plan.features || 'No features available'}</p>
                )}
              </div>
            ) : (
              <p className="text-red-800 bg-red-100 p-3 rounded-md border border-red-300">
                ❌ No current plan assigned.
              </p>
            )}
            <p className="mt-3 text-sm sm:text-base text-gray-800">
              <strong className="text-gray-700">Plan Expiry:</strong> {expire_date}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                console.log('Upgrade Plan clicked');
                window.location.href = '/upgrade-plans';
              }}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition duration-300 hover:scale-105"
            >
              🚀 Upgrade Plan
            </button>
            <button
              onClick={() => {
                console.log('Logout clicked');
                logout();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200 transition duration-300 hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}