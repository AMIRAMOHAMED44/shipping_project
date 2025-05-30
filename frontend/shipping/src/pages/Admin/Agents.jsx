import React, { useEffect, useState } from "react";
import axios from "axios";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    console.log("Token from localStorage:", token);

    if (!token) {
      console.warn("No access token found, user might not be logged in.");
      return; // ممكن تعمل redirect لو عايز
    }

    axios
      .get("http://127.0.0.1:8000/api/users/agents/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Agents data:", res.data);
        if (Array.isArray(res.data.results)) {
          setAgents(res.data.results);
        } else {
          console.error("Expected an array for agents results:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching agents:", err);
      });
  }, []);

 const filteredAgents = agents.filter((agent) => {
  if (!agent.username) return false;
  const searchStr = `${agent.username} ${agent.email}`.toLowerCase();
  return searchStr.includes(searchTerm.toLowerCase());
});


  const handleToggleStatus = (id) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              status: agent.status === "Active" ? "Inactive" : "Active",
            }
          : agent
      )
    );
  };

  const handleDeleteAgent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
    } catch (error) {
      console.error("Failed to delete agent:", error);
      alert("Failed to delete agent. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* عنوان وبحث */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Agent List</h2>
        <input
          type="text"
          placeholder="Search by username or email"
          className="border px-4 py-2 rounded-lg shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول الوكلاء */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-3 rounded-tl-xl">#</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Total Earnings</th>
              <th className="px-6 py-3 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent, index) => (
                <tr
                  key={agent.id}
                  className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{agent.username}</td>
                  <td className="px-6 py-4">{agent.email}</td>
                  <td className="px-6 py-4">{agent.city}</td>
                  <td className="px-6 py-4">{agent.total_earnings}</td>
                  <td className="px-6 py-4 flex gap-2 flex-wrap text-sm">
                    <button
                      onClick={() => handleToggleStatus(agent.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* عرض بيانات الوكيل */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Agent Details</h3>
            <p>
              <strong>Username:</strong> {selectedAgent.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedAgent.email}
            </p>
            <p>
              <strong>City:</strong> {selectedAgent.city}
            </p>
            <p>
              <strong>Total Earnings:</strong> {selectedAgent.total_earnings}
            </p>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
