import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  Scale,
  ArrowRight,
  Filter,
  RefreshCw,
  X,
  Calendar,
  User,
  Clipboard,
} from "lucide-react";
import api from "../../axios/api";

export default function MyShipments() {
  const [myShipments, setMyShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [expandedDescription, setExpandedDescription] = useState({});
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyShipments = async () => {
      try {
        setIsLoading(true);
        // For preview purposes, using mock data
        // In production, uncomment the axios call below

        const response = await api.get(`/agents/my-shipments`);
        setMyShipments(response.data);
      } catch (err) {
        setError("Failed to fetch shipments");
        setIsLoading(false);
        console.error("Error fetching shipments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyShipments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle size={18} className="text-green-600" />;
      case "IN_TRANSIT":
        return <Truck size={18} className="text-purple-600" />;
      default:
        return <Package size={18} className="text-blue-600" />;
    }
  };

  const toggleDescription = (shipmentId) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [shipmentId]: !prev[shipmentId],
    }));
  };

  const openDetailsModal = (shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    // Set timeout to allow the closing animation to complete
    setTimeout(() => {
      setSelectedShipment(null);
    }, 300);
  };

  const markAsDelivered = async (shipmentId) => {
    // Implementation would call the API to update shipment status
    await api.post(`/agents/confirm-delivery/${shipmentId}/`, {});
    // Update the shipment status in the state
    setMyShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === shipmentId
          ? { ...shipment, status: "DELIVERED" }
          : shipment
      )
    );
    alert(`Marking shipment ${shipmentId} as delivered`);
  };

  const filteredShipments = myShipments.filter(
    (shipment) => filter === "ALL" || shipment.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Package className="mr-2" size={24} />
            My Shipments
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage your current shipments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="ALL">All Shipments</option>
              <option value="PENDING">Pending</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Filter
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <button
            className="bg-white p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {filteredShipments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Truck
            className="mx-auto mb-4 text-gray-400"
            size={48}
            strokeWidth={1.5}
          />
          <h3 className="text-lg font-semibold text-gray-800">
            No Shipments Found
          </h3>
          <p className="text-gray-500 mt-2">
            {filter === "ALL"
              ? "You don't have any shipments yet."
              : `You don't have any ${filter
                  .toLowerCase()
                  .replace("_", " ")} shipments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      {getStatusIcon(shipment.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Shipment #{shipment.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created {formatDate(shipment.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <MapPin
                        size={18}
                        className="mr-2 mt-1 text-green-600 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm text-gray-500">Origin:</span>
                        <p className="font-medium">{shipment.origin}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin
                        size={18}
                        className="mr-2 mt-1 text-red-600 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm text-gray-500">
                          Destination:
                        </span>
                        <p className="font-medium">{shipment.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:justify-center">
                    <div className="hidden md:block w-full max-w-xs">
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">
                            Origin
                          </div>
                          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md">
                            Destination
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
                          <div
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              shipment.status === "DELIVERED"
                                ? "bg-green-500 w-full"
                                : shipment.status === "IN_TRANSIT"
                                ? "bg-blue-500 w-1/2"
                                : "bg-yellow-500 w-1/4"
                            }`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <div>Pickup</div>
                          <div>In Transit</div>
                          <div>Delivered</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <Scale
                        size={18}
                        className="mr-2 mt-1 text-blue-600 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm text-gray-500">Weight:</span>
                        <p className="font-medium">{shipment.weight} kg</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <DollarSign
                        size={18}
                        className="mr-2 mt-1 text-emerald-600 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm text-gray-500">Payment:</span>
                        <p className="font-medium">
                          ${shipment.cost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {shipment.description && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => toggleDescription(shipment.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <FileText size={16} className="mr-1" />
                      {expandedDescription[shipment.id]
                        ? "Hide Description"
                        : "View Description"}
                    </button>

                    {expandedDescription[shipment.id] && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border-l-4 border-blue-400">
                        {shipment.description || "No description provided."}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Agent ID: {shipment.assigned_agent}
                </div>
                <div className="flex gap-2">
                  {shipment.status === "IN_TRANSIT" && (
                    <button
                      className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors duration-200 flex items-center gap-1"
                      onClick={() => markAsDelivered(shipment.id)}
                    >
                      <CheckCircle size={16} />
                      Mark as Delivered
                    </button>
                  )}
                  <button
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors duration-200 flex items-center gap-1"
                    onClick={() => openDetailsModal(shipment)}
                  >
                    <Package size={16} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipment Details Modal */}
      {isModalOpen && selectedShipment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
              isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Package className="mr-2 text-blue-600" size={24} />
                Shipment Details #{selectedShipment.id}
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Status Banner */}
              <div
                className={`mb-6 p-3 rounded-md ${
                  selectedShipment.status === "DELIVERED"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : selectedShipment.status === "IN_TRANSIT"
                    ? "bg-purple-50 border-l-4 border-purple-500"
                    : "bg-yellow-50 border-l-4 border-yellow-500"
                }`}
              >
                <div className="flex items-center">
                  {getStatusIcon(selectedShipment.status)}
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-800">
                      Status: {selectedShipment.status.replace("_", " ")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedShipment.status === "DELIVERED"
                        ? "This shipment has been successfully delivered."
                        : selectedShipment.status === "IN_TRANSIT"
                        ? "This shipment is currently in transit."
                        : "This shipment is awaiting pickup."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-3 text-gray-800">
                  Tracking Progress
                </h4>
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200"></div>
                  </div>
                  <ul className="relative flex justify-between">
                    <li className="text-center">
                      <div
                        className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
                          true
                            ? "bg-green-600 text-white"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {true ? <CheckCircle size={16} /> : "1"}
                      </div>
                      <span className="block mt-2 text-sm font-medium text-gray-900">
                        Order Created
                      </span>
                      <span className="block text-xs text-gray-500">
                        {formatDate(selectedShipment.created_at)}
                      </span>
                    </li>
                    <li className="text-center">
                      <div
                        className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
                          selectedShipment.status === "IN_TRANSIT" ||
                          selectedShipment.status === "DELIVERED"
                            ? "bg-green-600 text-white"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {selectedShipment.status === "IN_TRANSIT" ||
                        selectedShipment.status === "DELIVERED" ? (
                          <CheckCircle size={16} />
                        ) : (
                          "2"
                        )}
                      </div>
                      <span className="block mt-2 text-sm font-medium text-gray-900">
                        In Transit
                      </span>
                    </li>
                    <li className="text-center">
                      <div
                        className={`relative w-8 h-8 flex items-center justify-center rounded-full ${
                          selectedShipment.status === "DELIVERED"
                            ? "bg-green-600 text-white"
                            : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {selectedShipment.status === "DELIVERED" ? (
                          <CheckCircle size={16} />
                        ) : (
                          "3"
                        )}
                      </div>
                      <span className="block mt-2 text-sm font-medium text-gray-900">
                        Delivered
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Shipment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    Shipment Information
                  </h4>

                  <div className="flex items-start">
                    <Clipboard className="mr-3 text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Shipment ID</p>
                      <p className="font-medium">{selectedShipment.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="mr-3 text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="font-medium">
                        {formatDate(selectedShipment.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="mr-3 text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Assigned Agent</p>
                      <p className="font-medium">
                        Agent #{selectedShipment.assigned_agent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Scale className="mr-3 text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">
                        {selectedShipment.weight} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    Locations
                  </h4>

                  <div className="flex items-start">
                    <MapPin className="mr-3 text-green-600 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Origin</p>
                      <p className="font-medium">{selectedShipment.origin}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 text-red-600 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">
                        {selectedShipment.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign
                      className="mr-3 text-emerald-600 mt-1"
                      size={18}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="font-medium">
                        ${selectedShipment.cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedShipment.description && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                    <FileText className="mr-2 text-gray-600" size={18} />
                    Description
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-md text-gray-700">
                    {selectedShipment.description || "No description provided."}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>

              {selectedShipment.status === "IN_TRANSIT" && (
                <button
                  onClick={() => {
                    markAsDelivered(selectedShipment.id);
                    closeDetailsModal();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
