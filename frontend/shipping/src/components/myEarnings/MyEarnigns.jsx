import React, { useEffect, useState } from "react";
import { User, DollarSign, MapPin, Mail, Tag, Award } from "lucide-react";
import api from "../../axios/api";

export default function MyEarnings() {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get(`/agents/earnings`);
        setEarningsData(response.data); // Changed from response.json() to response.data as axios already parses JSON
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch earnings data");
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full my-6 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg text-center">
        <div className="animate-pulse">
          <div className="h-32 bg-blue-100 rounded-t-xl"></div>
          <div className="space-y-4 mt-4">
            <div className="h-8 bg-gray-100 rounded"></div>
            <div className="h-8 bg-gray-100 rounded"></div>
            <div className="h-8 bg-gray-100 rounded"></div>
          </div>
          <div className="h-24 bg-gray-100 rounded-xl mt-6"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading earnings data...</p>
      </div>
    );
  }

  // Error state
  if (error || !earningsData || !earningsData.agent) {
    return (
      <div className="w-full my-6 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg text-center border border-red-100">
        <div className="p-4 bg-red-50 rounded-xl">
          <p className="text-red-600">
            {error || "Unable to load earnings data"}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              setLoading(true);
              setError(null);
              // Re-fetch data logic would go here
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { agent } = earningsData;
  const { user, city, total_earnings } = agent;

  // Get first letter of username for avatar (safely)
  const avatarInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="w-full my-6 max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg overflow-hidden md:max-w-2xl border border-blue-100">
      {/* Header with gradient background */}
      <div className="bg-teal-600 p-6 text-white">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white text-blue-600 font-bold text-2xl shadow-md">
            {avatarInitial}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{user?.username || "User"}</h2>
            <div className="flex items-center mt-1 text-blue-100">
              <Mail className="h-4 w-4 mr-1" />
              <p className="text-sm">{user?.email || "No email provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User details */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <Tag className="h-5 w-5 text-blue-500" />
            <div className="ml-3 flex-grow">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                User ID
              </p>
              <p className="font-medium text-gray-800">
                {user?.id || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <Award className="h-5 w-5 text-blue-500" />
            <div className="ml-3 flex-grow">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Role
              </p>
              <p className="font-medium uppercase text-gray-800">
                {user?.role || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div className="ml-3 flex-grow">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                City
              </p>
              <p className="font-medium text-gray-800">
                {city || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Earnings section */}
        <div className="mt-6 bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="ml-2 text-lg font-semibold text-gray-900">
              Earnings Summary
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Total
              </p>
              <p className="text-xl font-bold text-green-600">
                $
                {typeof total_earnings === "number"
                  ? total_earnings.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}