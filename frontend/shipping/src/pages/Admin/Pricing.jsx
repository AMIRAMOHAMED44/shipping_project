import React, { useEffect, useState } from "react";
import mockPlans from "../../mock-data/Pricing.json";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planData, setPlanData] = useState({
    name: "",
    price: "",
    limit: "",
    discount: "",
  });

  useEffect(() => {
    setPlans(mockPlans);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...editingPlan, ...planData } : plan
        )
      );
    } else {
      const newPlan = {
        id: plans.length + 1,
        ...planData,
      };
      setPlans((prev) => [...prev, newPlan]);
    }
    setPlanData({ name: "", price: "", limit: "", discount: "" });
    setEditingPlan(null);
    setShowForm(false);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setPlanData({
      name: plan.name,
      price: plan.price,
      limit: plan.limit,
      discount: plan.discount,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  };


  const [searchTerm, setSearchTerm] = useState("");
  const filteredPlans = plans.filter(plan =>
    `${plan.name} ${plan.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Pricing Plans</h2>
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm text-sm"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPlan(null);
            setPlanData({ name: "", price: "", limit: "", discount: "" });
          }}
          className="bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Plan
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md overflow-hidden rounded-xl">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Limit</th>
            <th className="px-6 py-3">Discount</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlans.map((plan, index) => (
            <tr key={plan.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{plan.name}</td>
              <td className="px-6 py-4">${plan.price}</td>
              <td className="px-6 py-4">{plan.limit}</td>
              <td className="px-6 py-4">{plan.discount}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <form
          onSubmit={handleAddOrEdit}
          className="mt-6 bg-white p-6 rounded-xl shadow-md border max-w-xl"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingPlan ? "Edit Plan" : "Add Plan"}
          </h3>

          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={planData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={planData.price}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Limit</label>
            <input
              type="text"
              name="limit"
              value={planData.limit}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Discount</label>
            <input
              type="text"
              name="discount"
              value={planData.discount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
            >
              {editingPlan ? "Save" : "Add"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPlan(null);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Pricing;
