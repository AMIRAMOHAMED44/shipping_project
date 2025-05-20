import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../redux/authSlice";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [localUser, setLocalUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/account/account/");
        
        dispatch(login(res.data));
        setLocalUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        } else {
          setError("Failed to load user data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if ((!user || !user.current_plan) && localStorage.getItem("access")) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [dispatch, user]);

  const currentUser = localUser || user;
  
  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-3 text-gray-600">Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="text-center mt-10">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md mx-auto">
        {error}
        <button 
          onClick={() => navigate("/login")}
          className="mt-3 block w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="text-center mt-10">
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg max-w-md mx-auto">
        No user data found. Please login again.
      </div>
    </div>
  );

  let expire_date = currentUser.plan_expiry;
  if (currentUser.current_plan?.name === "regular") {
    expire_date = "No expiry date";
  }


  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-extrabold text-gray-800">
      Welcome back, <span className="text-blue-600">{currentUser.name || currentUser.email.split('@')[0]}</span>
    </h2>
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
    </div>
  </div>

  {currentUser.current_plan ? (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 space-y-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full mb-2">
            CURRENT PLAN
          </span>
          <h3 className="text-2xl font-bold text-gray-800">{currentUser.current_plan.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">${currentUser.current_plan.price}</p>
          <p className="text-sm text-gray-500">per month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Weight Limit</p>
          <p className="text-lg font-semibold">{currentUser.current_plan.weight_limit}kg</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Plan Expiry</p>
          <p className="text-lg font-semibold">{expire_date}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-600 mb-2">FEATURES INCLUDED</p>
        {Array.isArray(currentUser.current_plan.features) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentUser.current_plan.features.map((f, idx) => (
              <div key={idx} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">{currentUser.current_plan.features}</p>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100 mb-6">
      <div className="flex items-center">
        <div className="p-2 bg-red-100 rounded-full mr-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">No active plan</h3>
          <p className="text-gray-600">You don't have any subscription plan assigned</p>
        </div>
      </div>
    </div>
  )}

  <button
    onClick={() => (window.location.href = "/upgrade-plans")}
    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
  >
    Upgrade Your Plan
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </button>
</div>
  );
}
