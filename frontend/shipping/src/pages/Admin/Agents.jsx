import React, { useEffect, useState } from "react";
import agentsData from "../../mock-data/Agents.json";

const Agents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    setAgents(agentsData);
  }, []);

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

  const handleDeleteAgent = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (confirmDelete) {
      setAgents((prevAgents) =>
        prevAgents.filter((agent) => agent.id !== id)
      );
    }
  };

  const handleDeliveryRequest = (id, action) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === id
          ? { ...agent, deliveryRequestStatus: action }
          : agent
      )
    );
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter((agent) =>
    `${agent.name} ${agent.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleViewAgent = (agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Agent List</h2>
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-4 py-2 rounded-lg shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* <h2 className="text-2xl font-semibold mb-4">Agents List</h2> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-3 rounded-tl-xl">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Request Status</th>
              <th className="px-6 py-3 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent, index) => (
              <tr
                key={agent.id}
                className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{agent.name}</td>
                <td className="px-6 py-4">{agent.email}</td>
                <td className="px-6 py-4">{agent.phone}</td>
                <td className="px-6 py-4">{agent.region}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      agent.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      agent.deliveryRequestStatus === "Approved"
                        ? "bg-green-100 text-green-700"
                        : agent.deliveryRequestStatus === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {agent.deliveryRequestStatus}
                  </span>
                </td>
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
                    onClick={() => handleViewAgent(agent)}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </button>
                  {agent.deliveryRequestStatus === "Pending" && (
                    <>
                      <button
                        onClick={() => handleDeliveryRequest(agent.id, "Approved")}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeliveryRequest(agent.id, "Rejected")}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAgent && (
        <div className="mt-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Agent Details
          </h3>
          <p>
            <strong>Name:</strong> {selectedAgent.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedAgent.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedAgent.phone}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-3 py-1 text-xs rounded-full font-medium ${
                selectedAgent.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedAgent.status}
            </span>
          </p>

          <button
            onClick={() => setSelectedAgent(null)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Agents;
