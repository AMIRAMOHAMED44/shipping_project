import React, { useState, useEffect } from "react";
import mockTransactions from "../../mock-data/Finance.json";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    amount: "",
    status: "",
    date: "",
  });

  useEffect(() => {
    setTransactions(mockTransactions);
    setFiltered(mockTransactions);
  }, []);

  useEffect(() => {
    const result = transactions.filter((t) => {
      const matchesStatus = searchStatus ? t.status === searchStatus : true;
      const matchesDate = searchDate ? t.date === searchDate : true;
      return matchesStatus && matchesDate;
    });
    setFiltered(result);
  }, [searchStatus, searchDate, transactions]);

  const stats = {
    total: transactions.length,
    paid: transactions.filter((t) => t.status === "Paid").length,
    pending: transactions.filter((t) => t.status === "Pending").length,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...editingTransaction, ...formData } : t
        )
      );
    } else {
      const newTransaction = {
        id: transactions.length + 1,
        ...formData,
      };
      setTransactions((prev) => [...prev, newTransaction]);
    }
    setFormData({ customerName: "", amount: "", status: "", date: "" });
    setEditingTransaction(null);
    setShowForm(false);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      customerName: transaction.customerName,
      amount: transaction.amount,
      status: transaction.status,
      date: transaction.date,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Total Transactions</p>
          <h2 className="text-xl font-bold">{stats.total}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Paid</p>
          <h2 className="text-xl font-bold">{stats.paid}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-600">Pending</p>
          <h2 className="text-xl font-bold">{stats.pending}</h2>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingTransaction(null);
            setFormData({ customerName: "", amount: "", status: "", date: "" });
          }}
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Payment
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((transaction, index) => (
            <tr key={transaction.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{transaction.customerName}</td>
              <td className="px-6 py-4">${transaction.amount}</td>
              <td className="px-6 py-4">{transaction.status}</td>
              <td className="px-6 py-4">{transaction.date}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleAddOrEdit}
          className="mt-6 bg-white p-6 rounded-xl shadow-md border max-w-xl"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingTransaction ? "Edit Payment" : "Add Payment"}
          </h3>

          <div className="mb-4">
            <label className="block text-sm mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
            >
              {editingTransaction ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingTransaction(null);
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

export default Finance;
