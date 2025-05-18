// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("access");
    
//     if (!accessToken) {
//       setError("No access token, please login.");
//       return;
//     }

//     axios.get("http://localhost:8000/api/account/account", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then(res => {
//       setUserData(res.data);
//     })
//     .catch(err => {
//       setError("Failed to fetch user data, try logging in again.");
//       console.error(err);
//     });
//   }, []);

//   if (error) return <div>{error}</div>;
//   if (!userData) return <div>Loading...</div>;
//       console.log("Dashboard Response:", res.data); // ← Debug
//   return (
//     <div>
//       <h1>Welcome, {userData.email}</h1>
//       <p>Name: {userData.name}</p>
//       {/* غير حسب البيانات اللي بيرجعها الباك إند */}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("No access token. Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8000/api/account/account", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err.response?.data || err.message);
        setError("Failed to load user data. Please log in again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {userData.user}</h2>

      {userData.current_plan ? (
        <div className="space-y-2">
          <p><strong>Current Plan:</strong> {userData.current_plan.name}</p>
          <p><strong>Price:</strong> ${userData.current_plan.price}</p>
          <p><strong>Features:</strong> {userData.current_plan.features}</p>
          <p><strong>Weight Limit:</strong> {userData.current_plan.weight_limit}kg</p>
        </div>
      ) : (
        <p className="text-red-600">No current plan assigned</p>
      )}

      <p className="mt-4"><strong>Plan Expiry:</strong> {userData.plan_expiry}</p>

      <button
        onClick={() => window.location.href = "/upgrade-plans"}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Upgrade Plan
      </button>
    </div>
  );
}
