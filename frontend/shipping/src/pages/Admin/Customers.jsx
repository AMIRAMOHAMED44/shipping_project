import React, { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access"); // ✅ غيّرت من "token" لـ "access"

    axios
      .get("http://localhost:8000/api/users/all/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: customer.status === "Active" ? "Inactive" : "Active",
            }
          : customer
      )
    );
  };


const handleDeleteCustomer = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer?"
  );
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("access");  // أو حسب مكان التخزين
    await axios.delete(`http://localhost:8000/api/users/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // لو نجح الحذف، حدّث ال state بتاعت العملاء
    setCustomers(prevCustomers =>
      prevCustomers.filter(customer => customer.id !== id)
    );

  } catch (error) {
    console.error("Failed to delete customer:", error);
    alert("Failed to delete customer. Please try again.");
  }
};


  return (
    <div className="p-6">
      {/*  عنوان وبحث */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customer List</h2>
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-4 py-2 rounded-lg shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول العملاء */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-3 rounded-tl-xl">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr
                key={customer.id}
                className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(customer.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* عرض بيانات العميل */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
            <p>
              <strong>Name:</strong> {selectedCustomer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
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

export default Customers;
