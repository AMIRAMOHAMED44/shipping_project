// import React, { useEffect, useState } from "react";
// import {
//   Truck,
//   MapPin,
//   Calendar,
//   DollarSign,
//   Clock,
//   AlertCircle,
//   Package,
//   AlertTriangle,
//   FileText,
//   ShieldCheck,
//   Globe,
//   BarChart2,
//   Users,
// } from "lucide-react";
// import axios from "axios";
// import api from "../../axios/api";
// import toast from "react-hot-toast";

// export default function AvailableShipments() {
//   const [availableShipments, setAvailableShipments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedDescription, setExpandedDescription] = useState({});

//   useEffect(() => {
//     const fetchShipments = async () => {
//       try {
//         setIsLoading(true);
//         const response = await api.get(`agents/available-shipments`);
//         setAvailableShipments(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError("Failed to fetch shipments");
//         setIsLoading(false);
//         console.error("Error fetching shipments:", err);
//       }
//     };
//     fetchShipments();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "ASSIGNED":
//         return "bg-blue-100 text-blue-800";
//       case "IN_TRANSIT":
//         return "bg-purple-100 text-purple-800";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleAcceptShipment = async (shipmentId) => {
//     await api.post(`/agents/claim-shipment/${shipmentId}/`, {});
//     toast.success(`Accepting shipment ${shipmentId}`);
//     setAvailableShipments(
//       availableShipments.filter((shipment) => {
//         return shipment.id !== shipmentId;
//       })
//     );
//   };

//   const toggleDescription = (shipmentId) => {
//     setExpandedDescription((prev) => ({
//       ...prev,
//       [shipmentId]: !prev[shipmentId],
//     }));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
//         <AlertCircle size={24} />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (availableShipments.length === 0) {
//     return (
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
//         <Truck
//           className="mx-auto mb-4 text-gray-400"
//           size={48}
//           strokeWidth={1.5}
//         />
//         <h3 className="text-lg font-semibold text-gray-800">
//           No Available Shipments
//         </h3>
//         <p className="text-gray-500 mt-2">
//           Check back later for new shipment opportunities.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50">
//       {/* Hero Section */}
//       <div className="relative bg-[#2E605A] overflow-hidden">
//         <div className="absolute inset-0 bg-black opacity-30"></div>
//         <img
//           src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=500&q=80"
//           alt="Shipping Hero"
//           className="w-full h-96 object-cover"
//         />
//         <div className="relative container mx-auto px-6 py-24 z-10">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl font-bold text-white mb-4">
//               Deliver with Confidence
//             </h1>
//             <p className="text-xl text-[#c2e0dc] mb-8">
//               Find available shipments and grow your delivery business with our
//               trusted platform.
//             </p>
//             <button className="bg-[#4E9989] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d7c6f] transition">
//               Get Started
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-white py-12">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-gray-50 p-6 rounded-lg text-center">
//               <div className="flex justify-center mb-4">
//                 <Truck size={40} className="text-[#4E9989]" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">10,000+</h3>
//               <p className="text-gray-600">Shipments Delivered</p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-lg text-center">
//               <div className="flex justify-center mb-4">
//                 <Users size={40} className="text-[#4E9989]" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
//               <p className="text-gray-600">Active Delivery Agents</p>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-lg text-center">
//               <div className="flex justify-center mb-4">
//                 <Globe size={40} className="text-[#4E9989]" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">50+</h3>
//               <p className="text-gray-600">Cities Covered</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-6 py-12">
//         {error ? (
//           <div className="p-6 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
//             <AlertCircle size={24} />
//             <p>{error}</p>
//           </div>
//         ) : availableShipments.length === 0 ? (
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
//             <Truck
//               className="mx-auto mb-4 text-gray-400"
//               size={48}
//               strokeWidth={1.5}
//             />
//             <h3 className="text-lg font-semibold text-gray-800">
//               No Available Shipments
//             </h3>
//             <p className="text-gray-500 mt-2">
//               Check back later for new shipment opportunities.
//             </p>
//           </div>
//         ) : (
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <div className="mb-6">
//               <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
//                 <Truck className="mr-2 text-[#4E9989]" size={24} />
//                 Available Shipments
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Select a shipment to accept and deliver
//               </p>
//             </div>

//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {availableShipments.map((shipment) => (
//                 <div
//                   key={shipment.id}
//                   className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
//                 >
//                   <div className="bg-gradient-to-r from-[#f0f7f6] to-[#e0f0ee] p-4 border-b border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold text-lg text-gray-800 flex items-center">
//                         <Package className="mr-2 text-[#4E9989]" size={20} />
//                         {shipment.id}
//                       </h3>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           shipment.status
//                         )}`}
//                       >
//                         {shipment.status}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-5">
//                     <div className="space-y-4">
//                       <div className="flex items-start text-gray-700">
//                         <MapPin
//                           size={18}
//                           className="mr-2 mt-1 text-[#4E9989] flex-shrink-0"
//                         />
//                         <div>
//                           <span className="text-sm text-gray-500">Origin:</span>
//                           <p className="font-medium">{shipment.origin}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-start text-gray-700">
//                         <MapPin
//                           size={18}
//                           className="mr-2 mt-1 text-[#2E605A] flex-shrink-0"
//                         />
//                         <div>
//                           <span className="text-sm text-gray-500">
//                             Destination:
//                           </span>
//                           <p className="font-medium">{shipment.destination}</p>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="flex items-center text-gray-700">
//                           <DollarSign
//                             size={18}
//                             className="mr-2 text-[#4E9989] flex-shrink-0"
//                           />
//                           <div>
//                             <span className="text-sm text-gray-500">
//                               Payment:
//                             </span>
//                             <p className="font-medium">
//                               ${shipment.cost.toFixed(2)}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center text-gray-700">
//                           <AlertTriangle
//                             size={18}
//                             className="mr-2 text-[#2E605A] flex-shrink-0"
//                           />
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm text-gray-500">
//                               Weight:
//                             </span>
//                             <p className="font-medium">{shipment.weight}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center text-gray-700">
//                         <Clock
//                           size={18}
//                           className="mr-2 text-[#4E9989] flex-shrink-0"
//                         />
//                         <div>
//                           <span className="text-sm text-gray-500">
//                             Created:
//                           </span>
//                           <p className="text-sm">
//                             {formatDate(shipment.created_at)}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="border-t border-gray-100 pt-3 mt-2">
//                         <button
//                           onClick={() => toggleDescription(shipment.id)}
//                           className="flex items-center text-[#4E9989] hover:text-[#2E605A] text-sm font-medium"
//                         >
//                           <FileText size={16} className="mr-1" />
//                           {expandedDescription[shipment.id]
//                             ? "Hide Description"
//                             : "View Description"}
//                         </button>

//                         {expandedDescription[shipment.id] && (
//                           <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border-l-4 border-[#4E9989]">
//                             {shipment.description}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 bg-gray-50 p-4">
//                     <button
//                       onClick={() => handleAcceptShipment(shipment.id)}
//                       className="w-full py-2 px-4 bg-[#4E9989] hover:bg-[#2E605A] text-white font-medium rounded transition-colors duration-200 flex justify-center items-center gap-2"
//                     >
//                       <Truck size={18} />
//                       Accept Shipment
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Benefits Section */}
//       <div className="bg-[#f0f7f6] py-16">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">
//               Why Choose Our Platform?
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               We provide the best tools and support for delivery agents to
//               succeed.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div className="flex items-center mb-4">
//                 <ShieldCheck size={24} className="text-[#4E9989] mr-3" />
//                 <h3 className="text-xl font-semibold">Reliable Payments</h3>
//               </div>
//               <p className="text-gray-600">
//                 Guaranteed payments for every completed shipment with
//                 transparent tracking.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div className="flex items-center mb-4">
//                 <BarChart2 size={24} className="text-[#4E9989] mr-3" />
//                 <h3 className="text-xl font-semibold">Performance Insights</h3>
//               </div>
//               <p className="text-gray-600">
//                 Detailed analytics to help you optimize your delivery routes and
//                 earnings.
//               </p>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div className="flex items-center mb-4">
//                 <Globe size={24} className="text-[#4E9989] mr-3" />
//                 <h3 className="text-xl font-semibold">Wide Coverage</h3>
//               </div>
//               <p className="text-gray-600">
//                 Shipments available across multiple cities and regions to
//                 maximize your opportunities.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Truck, MapPin, Calendar, DollarSign, Clock, AlertCircle, Package, AlertTriangle, FileText, ShieldCheck, Globe, BarChart2, Users } from "lucide-react";
import api from "../../axios/api";
import toast from "react-hot-toast";

export default function AvailableShipments() {
  const [availableShipments, setAvailableShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("agents/available-shipments");
        setAvailableShipments(response.data);
        setError(null);
        
        // Animate cards in sequence
        response.data.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => new Set([...prev, index]));
          }, index * 100);
        });
      } catch (err) {
        const errorMessage = err.response?.data?.error || "Failed to fetch shipments";
        setError(errorMessage);
        console.error("Error fetching shipments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    
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
      case "PENDING": return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-yellow-200/50";
      case "ASSIGNED": return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-blue-200/50";
      case "IN_TRANSIT": return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 shadow-purple-200/50";
      case "DELIVERED": return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-green-200/50";
      case "CANCELLED": return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-red-200/50";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-gray-200/50";
    }
  };

  const handleAcceptShipment = async (shipmentId) => {
    try {
      await api.post(`/agents/claim-shipment/${shipmentId}/`);
      toast.success(`Shipment ${shipmentId} accepted`);
      setAvailableShipments(availableShipments.filter((shipment) => shipment.id !== shipmentId));
    } catch (err) {
      toast.error("Failed to accept shipment");
    }
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-[#4E9989] to-[#2E605A] bg-clip-border"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-white absolute top-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="text-white animate-pulse" size={24} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl flex items-center gap-3 text-red-700 shadow-lg border border-red-200 animate-slideIn">
        <AlertCircle size={24} className="animate-pulse" />
        <p className="flex-1">{error}</p>
        <button
          className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#2E605A] via-[#3d7c6f] to-[#4E9989] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-xl animate-float"></div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=500&q=80"
          alt="Shipping Hero"
          className="w-full h-96 object-cover mix-blend-overlay opacity-80"
        />
        <div className="relative container mx-auto px-6 py-24 z-10">
          <div className="max-w-2xl animate-slideInLeft">
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Deliver with Confidence
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Find available shipments and grow your delivery business with our trusted platform.
            </p>
            <button className="group bg-gradient-to-r from-[#4E9989] to-[#3d7c6f] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#3d7c6f] hover:to-[#2E605A] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span className="flex items-center gap-2">
                Get Started
                <Truck className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, number: "10,000+", label: "Shipments Delivered", delay: "0ms" },
              { icon: Users, number: "500+", label: "Active Delivery Agents", delay: "100ms" },
              { icon: Globe, number: "50+", label: "Cities Covered", delay: "200ms" }
            ].map((stat, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 animate-fadeInUp"
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-[#4E9989] to-[#2E605A] rounded-full group-hover:scale-110 transition-transform duration-300">
                    <stat.icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-[#2E605A] to-[#4E9989] bg-clip-text text-transparent">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shipments Section */}
      <div className="container mx-auto px-6 py-12">
        {availableShipments.length === 0 ? (
          <div className="bg-gradient-to-r from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 text-center animate-slideIn">
            <div className="animate-bounce mb-6">
              <Truck className="mx-auto text-gray-400" size={64} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Available Shipments</h3>
            <p className="text-gray-500">Check back later for new shipment opportunities.</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-white to-gray-50 p-8 rounded-2xl shadow-lg animate-slideIn">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-[#4E9989] to-[#2E605A] rounded-lg mr-3">
                  <Truck className="text-white" size={28} />
                </div>
                Available Shipments
              </h2>
              <p className="text-gray-600 ml-14">Select a shipment to accept and deliver</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {availableShipments.map((shipment, index) => (
                <div
                  key={shipment.id}
                  className={`group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    visibleCards.has(index) 
                      ? 'animate-slideInUp opacity-100' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[#f0f7f6] via-[#e8f5f3] to-[#e0f0ee] p-6 border-b border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <h3 className="font-bold text-lg text-gray-800 flex items-center">
                        <div className="p-2 bg-gradient-to-r from-[#4E9989] to-[#2E605A] rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                          <Package className="text-white" size={18} />
                        </div>
                        #{shipment.id}
                      </h3>
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-5">
                      {/* Location Info */}
                      <div className="space-y-3">
                        <div className="flex items-start text-gray-700 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <MapPin size={18} className="mr-3 mt-1 text-[#4E9989] flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Origin</span>
                            <p className="font-semibold text-gray-800">{shipment.origin}</p>
                          </div>
                        </div>
                        <div className="flex items-start text-gray-700 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                          <MapPin size={18} className="mr-3 mt-1 text-[#2E605A] flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Destination</span>
                            <p className="font-semibold text-gray-800">{shipment.destination}</p>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                          <div className="flex items-center text-gray-700">
                            <DollarSign size={18} className="mr-2 text-[#4E9989] flex-shrink-0" />
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide block">Payment</span>
                              <p className="font-bold text-lg text-green-600">${shipment.cost.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                          <div className="flex items-center text-gray-700">
                            <AlertTriangle size={18} className="mr-2 text-[#2E605A] flex-shrink-0" />
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide block">Weight</span>
                              <p className="font-bold text-lg text-gray-800">{shipment.weight} kg</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center text-gray-700 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                        <Clock size={18} className="mr-3 text-[#4E9989] flex-shrink-0" />
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Created</span>
                          <p className="text-sm font-medium">{formatDate(shipment.created_at)}</p>
                        </div>
                      </div>

                      {/* Description Toggle */}
                      <div className="border-t border-gray-100 pt-4">
                        <button
                          onClick={() => toggleDescription(shipment.id)}
                          className="group flex items-center text-[#4E9989] hover:text-[#2E605A] text-sm font-semibold transition-colors duration-200"
                        >
                          <FileText size={16} className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                          {expandedDescription[shipment.id] ? "Hide Description" : "View Description"}
                        </button>
                        {expandedDescription[shipment.id] && (
                          <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg text-sm text-gray-700 border-l-4 border-[#4E9989] animate-slideDown">
                            {shipment.description || "No description provided."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                    <button
                      onClick={() => handleAcceptShipment(shipment.id)}
                      className="group w-full py-3 px-6 bg-gradient-to-r from-[#4E9989] to-[#2E605A] hover:from-[#2E605A] hover:to-[#1a4d47] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex justify-center items-center gap-3"
                    >
                      <Truck size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                      Accept Shipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-[#f0f7f6] via-white to-[#e8f5f3] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-[#2E605A] to-[#4E9989] bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We provide the best tools and support for delivery agents to succeed in their business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Reliable Payments",
                description: "Guaranteed payments for every completed shipment with transparent tracking.",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: BarChart2,
                title: "Performance Insights",
                description: "Detailed analytics to help you optimize your delivery routes and earnings.",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: Globe,
                title: "Wide Coverage",
                description: "Shipments available across multiple cities and regions to maximize opportunities.",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.5s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
      `}</style>
    </div>
  );
}