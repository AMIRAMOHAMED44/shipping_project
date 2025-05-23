import React, { useEffect, useState } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  Package,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Globe,
  BarChart2,
  Users,
} from "lucide-react";
import axios from "axios";
import api from "../../axios/api";
import toast from "react-hot-toast";

export default function AvailableShipments() {
  const [availableShipments, setAvailableShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`agents/available-shipments`);
        setAvailableShipments(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch shipments");
        setIsLoading(false);
        console.error("Error fetching shipments:", err);
      }
    };
    fetchShipments();
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
        return "bg-yellow-100 text-yellow-800";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAcceptShipment = async (shipmentId) => {
    await api.post(`/agents/claim-shipment/${shipmentId}/`, {});
    toast.success(`Accepting shipment ${shipmentId}`);
    setAvailableShipments(
      availableShipments.filter((shipment) => {
        return shipment.id !== shipmentId;
      })
    );
  };

  const toggleDescription = (shipmentId) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [shipmentId]: !prev[shipmentId],
    }));
  };

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

  if (availableShipments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <Truck
          className="mx-auto mb-4 text-gray-400"
          size={48}
          strokeWidth={1.5}
        />
        <h3 className="text-lg font-semibold text-gray-800">
          No Available Shipments
        </h3>
        <p className="text-gray-500 mt-2">
          Check back later for new shipment opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#2E605A] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img
          src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=500&q=80"
          alt="Shipping Hero"
          className="w-full h-96 object-cover"
        />
        <div className="relative container mx-auto px-6 py-24 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Deliver with Confidence
            </h1>
            <p className="text-xl text-[#c2e0dc] mb-8">
              Find available shipments and grow your delivery business with our
              trusted platform.
            </p>
            <button className="bg-[#4E9989] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d7c6f] transition">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Truck size={40} className="text-[#4E9989]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">10,000+</h3>
              <p className="text-gray-600">Shipments Delivered</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Users size={40} className="text-[#4E9989]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Active Delivery Agents</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Globe size={40} className="text-[#4E9989]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {error ? (
          <div className="p-6 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        ) : availableShipments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <Truck
              className="mx-auto mb-4 text-gray-400"
              size={48}
              strokeWidth={1.5}
            />
            <h3 className="text-lg font-semibold text-gray-800">
              No Available Shipments
            </h3>
            <p className="text-gray-500 mt-2">
              Check back later for new shipment opportunities.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Truck className="mr-2 text-[#4E9989]" size={24} />
                Available Shipments
              </h2>
              <p className="text-gray-600 mt-1">
                Select a shipment to accept and deliver
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="bg-gradient-to-r from-[#f0f7f6] to-[#e0f0ee] p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                        <Package className="mr-2 text-[#4E9989]" size={20} />
                        {shipment.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start text-gray-700">
                        <MapPin
                          size={18}
                          className="mr-2 mt-1 text-[#4E9989] flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm text-gray-500">Origin:</span>
                          <p className="font-medium">{shipment.origin}</p>
                        </div>
                      </div>

                      <div className="flex items-start text-gray-700">
                        <MapPin
                          size={18}
                          className="mr-2 mt-1 text-[#2E605A] flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm text-gray-500">
                            Destination:
                          </span>
                          <p className="font-medium">{shipment.destination}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-700">
                          <DollarSign
                            size={18}
                            className="mr-2 text-[#4E9989] flex-shrink-0"
                          />
                          <div>
                            <span className="text-sm text-gray-500">
                              Payment:
                            </span>
                            <p className="font-medium">
                              ${shipment.cost.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <AlertTriangle
                            size={18}
                            className="mr-2 text-[#2E605A] flex-shrink-0"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Weight:
                            </span>
                            <p className="font-medium">{shipment.weight}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Clock
                          size={18}
                          className="mr-2 text-[#4E9989] flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm text-gray-500">
                            Created:
                          </span>
                          <p className="text-sm">
                            {formatDate(shipment.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 mt-2">
                        <button
                          onClick={() => toggleDescription(shipment.id)}
                          className="flex items-center text-[#4E9989] hover:text-[#2E605A] text-sm font-medium"
                        >
                          <FileText size={16} className="mr-1" />
                          {expandedDescription[shipment.id]
                            ? "Hide Description"
                            : "View Description"}
                        </button>

                        {expandedDescription[shipment.id] && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border-l-4 border-[#4E9989]">
                            {shipment.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <button
                      onClick={() => handleAcceptShipment(shipment.id)}
                      className="w-full py-2 px-4 bg-[#4E9989] hover:bg-[#2E605A] text-white font-medium rounded transition-colors duration-200 flex justify-center items-center gap-2"
                    >
                      <Truck size={18} />
                      Accept Shipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-[#f0f7f6] py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best tools and support for delivery agents to
              succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <ShieldCheck size={24} className="text-[#4E9989] mr-3" />
                <h3 className="text-xl font-semibold">Reliable Payments</h3>
              </div>
              <p className="text-gray-600">
                Guaranteed payments for every completed shipment with
                transparent tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <BarChart2 size={24} className="text-[#4E9989] mr-3" />
                <h3 className="text-xl font-semibold">Performance Insights</h3>
              </div>
              <p className="text-gray-600">
                Detailed analytics to help you optimize your delivery routes and
                earnings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Globe size={24} className="text-[#4E9989] mr-3" />
                <h3 className="text-xl font-semibold">Wide Coverage</h3>
              </div>
              <p className="text-gray-600">
                Shipments available across multiple cities and regions to
                maximize your opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}