import React, { useEffect, useState } from "react";
import shipmentsData from "../../mock-data/Shipments.json";

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newShipment, setNewShipment] = useState({
        trackingNumber: "",
        customerName: "",
        destination: "",
        status: "Pending",
    });

    useEffect(() => {
        setShipments(shipmentsData);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredShipments = shipments.filter((s) =>
        `${s.trackingNumber} ${s.customerName} ${s.destination}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleAddShipmentClick = () => {
        setEditingShipment(null);
        setShowForm(true);
        setNewShipment({
            trackingNumber: "",
            customerName: "",
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
            // تعديل الشحنة
            setShipments((prev) =>
                prev.map((shipment) =>
                    shipment.id === editingShipment.id ? { ...newShipment } : shipment
                )
            );
            setEditingShipment(null);
        } else {
            // إضافة شحنة جديدة
            const newId = shipments.length + 1;
            const shipmentToAdd = { ...newShipment, id: newId };
            setShipments((prev) => [...prev, shipmentToAdd]);
        }

        setNewShipment({
            trackingNumber: "",
            customerName: "",
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
            // لو الشحنة المعروضة حالياً هي دي، نفضيها
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
            trackingNumber: shipment.trackingNumber,
            customerName: shipment.customerName,
            destination: shipment.destination,
            status: shipment.status,
            id: shipment.id,  // لو هتستخدمه للتحديث
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
                                <td className="px-6 py-4">{shipment.trackingNumber}</td>
                                <td className="px-6 py-4">{shipment.customerName}</td>
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
                        <p><strong>Tracking Number:</strong> {selectedShipment.trackingNumber}</p>
                        <p><strong>Customer Name:</strong> {selectedShipment.customerName}</p>
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
                            name="trackingNumber"
                            value={newShipment.trackingNumber}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={newShipment.customerName}
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

                    {/* هنا إضافة اختيار حالة الشحنة */}
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
