import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    console.log("Access Token:", token); // ← Debug

    if (!accessToken) {
      setError("No access token, please login.");
      return;
    }

    axios.get("http://localhost:8000/api/account/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      setUserData(res.data);
    })
    .catch(err => {
      setError("Failed to fetch user data, try logging in again.");
      console.error(err);
    });
  }, []);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>;
      console.log("Dashboard Response:", res.data); // ← Debug
  return (
    <div>
      <h1>Welcome, {userData.email}</h1>
      <p>Name: {userData.name}</p>
      {/* غير حسب البيانات اللي بيرجعها الباك إند */}
    </div>
  );
}
