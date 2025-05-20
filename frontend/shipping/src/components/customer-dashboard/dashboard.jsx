import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../redux/authSlice"; // ← غيّر حسب مكان ملف الـ slice

export default function Dashboard() {
  const [localUser, setLocalUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
  const accessToken = localStorage.getItem("access");

  // 👇 الشرط الجديد
  if ((!user || !user.current_plan) && accessToken) {
    setLoading(true); // مهم تبدأ التحميل

    axios.get("http://localhost:8000/api/account/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      dispatch(login(res.data));
      setLocalUser(res.data);
    })
    .catch(err => {
      console.error(err);
      setError("Please login again.");
    })
    .finally(() => {
      setLoading(false);
    });
  } else {
    setLoading(false);
  }
}, [dispatch, user]);
  const currentUser = localUser || user;

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!currentUser) return <div className="text-center mt-10">No user data found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {currentUser.name || currentUser.email}
      </h2>

      {currentUser.current_plan ? (
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          <p><strong>Current Plan:</strong> {currentUser.current_plan.name}</p>
          <p><strong>Price:</strong> ${currentUser.current_plan.price}</p>
          <p><strong>Weight Limit:</strong> {currentUser.current_plan.weight_limit}kg</p>
          <p><strong>Features:</strong></p>
          {Array.isArray(currentUser.current_plan.features) ? (
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {currentUser.current_plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          ) : (
            <p>{currentUser.current_plan.features}</p>
          )}
        </div>
      ) : (
        <p className="text-red-600 mt-4">No current plan assigned.</p>
      )}

      <p className="mt-4"><strong>Plan Expiry:</strong> {currentUser.plan_expiry}</p>

      <button
        onClick={() => window.location.href = "/upgrade-plans"}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
