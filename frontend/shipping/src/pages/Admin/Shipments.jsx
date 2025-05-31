import React, { useEffect, useState } from "react";
import axios from "axios"

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newShipment, setNewShipment] = useState({
        tracking_id: "",
        customer: "",
        destination: "",
        status: "Pending",
    });

    useEffect(() => {
        const token = localStorage.getItem("access"); // اتأكد إنه نفس الاسم اللي خزنتي بيه التوكن
        console.log("Token from localStorage:", token);

        if (!token) {
            console.warn("No access token found, user might not be logged in.");
            return;
        }

        axios
            .get("http://127.0.0.1:8000//api/agents/delivery-requests/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("Shipments data:", res.data);
                setShipments(res.data.results); // لو الـ API بيرجع results
                // أو استخدمي setShipments(res.data) لو الـ API بيرجع list مباشرة
            })
            .catch((err) => {
                console.error("Error fetching shipments:", err);
            });
    }, []);




    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredShipments = shipments.filter((s) =>
        `${s.tracking_id} ${s.customer} ${s.destination}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleAddShipmentClick = () => {
        setEditingShipment(null);
        setShowForm(true);
        setNewShipment({
            tracking_id: "",
            customer: "",
            destination: "",
            status: "Pending",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewShipment((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddShipment = (e) => {
        e.preventDefault();

        if (editingShipment) {
            setShipments((prev) =>
                prev.map((shipment) =>
                    shipment.id === editingShipment.id ? { ...newShipment } : shipment
                )
            );
            setEditingShipment(null);
        } else {
            const newId = shipments.length + 1;
            const shipmentToAdd = { ...newShipment, id: newId };
            setShipments((prev) => [...prev, shipmentToAdd]);
        }

        setNewShipment({
            tracking_id: "",
            customer: "",
            destination: "",
            status: "Pending",
        });
        setShowForm(false);
    };

    const [selectedShipment, setSelectedShipment] = useState(null);

    const handleDeleteShipment = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this shipment?");
        if (confirmDelete) {
            setShipments((prev) => prev.filter((shipment) => shipment.id !== id));
            if (selectedShipment && selectedShipment.id === id) {
                setSelectedShipment(null);
            }
        }
    };

    const [editingShipment, setEditingShipment] = useState(null);
    const handleEditClick = (shipment) => {
        setEditingShipment(shipment);
        setShowForm(true);
        setNewShipment({
            tracking_id: shipment.tracking_id,
            customer: shipment.customer,
            destination: shipment.destination,
            status: shipment.status,
            id: shipment.id,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Shipments</h2>
                <input
                    type="text"
                    placeholder="Search shipments"
                    className="border px-4 py-2 rounded-lg shadow-sm text-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddShipmentClick}
                    className="bg-blue-600 text-black px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                    Add New Shipment
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md overflow-hidden rounded-xl">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            <th className="px-6 py-3">#</th>
                            <th className="px-6 py-3">Tracking Number</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Destination</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShipments.map((shipment, index) => (
                            <tr
                                key={shipment.id}
                                onClick={() => setSelectedShipment(shipment)}
                                className={`cursor-pointer border-t hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{shipment.tracking_id}</td>
                                <td className="px-6 py-4">{shipment.customer}</td>
                                <td className="px-6 py-4">{shipment.destination}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full ${shipment.status === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : shipment.status === "In Transit"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {shipment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2 text-sm">
                                    <button
                                        onClick={() => handleEditClick(shipment)}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteShipment(shipment.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => setSelectedShipment(shipment)}
                                        className="text-green-600 hover:underline"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedShipment && (
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-md border max-w-xl">
                        <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
                        <p><strong>Tracking Number:</strong> {selectedShipment.tracking_id}</p>
                        <p><strong>Customer Name:</strong> {selectedShipment.customer}</p>
                        <p><strong>Destination:</strong> {selectedShipment.destination}</p>
                        <p><strong>Status:</strong>
                            <span className={`ml-2 px-3 py-1 text-xs rounded-full font-medium ${selectedShipment.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : selectedShipment.status === "In Transit"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-200 text-gray-600"
                                }`}>
                                {selectedShipment.status}
                            </span>
                        </p>
                        <button
                            onClick={() => setSelectedShipment(null)}
                            className="mt-4 text-sm text-blue-600 hover:underline"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            {showForm && (
                <form
                    onSubmit={handleAddShipment}
                    className="mt-6 bg-white p-6 rounded-xl shadow-md border max-w-xl"
                >
                    <h3 className="text-lg font-semibold mb-4">
                        {editingShipment ? "Edit Shipment" : "Add Shipment"}
                    </h3>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Tracking Number</label>
                        <input
                            type="text"
                            name="tracking_id"
                            value={newShipment.tracking_id}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Customer Name</label>
                        <input
                            type="text"
                            name="customer"
                            value={newShipment.customer}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={newShipment.destination}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Status</label>
                        <select
                            name="status"
                            value={newShipment.status}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
                        >
                            {editingShipment ? "Save" : "Add"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Shipments;