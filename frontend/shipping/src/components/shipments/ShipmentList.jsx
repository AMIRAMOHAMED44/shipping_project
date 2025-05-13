import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShipmentList() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/shipments/');
        let shipmentsData = res.data;
        if (!Array.isArray(shipmentsData)) {
          if (shipmentsData.results) {
            shipmentsData = shipmentsData.results;
          } else if (shipmentsData.shipments) {
            shipmentsData = shipmentsData.shipments;
          } else {
            shipmentsData = Object.values(shipmentsData);
          }
        }
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);
      } catch (err) {
        console.error('Error fetching shipments:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const cancelShipment = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/shipments/${id}/`);
      setShipments(shipments.filter(shipment => shipment.id !== id));
    } catch (err) {
      console.error('Error cancelling shipment:', err);
      alert(err.response?.data?.detail || 'Cannot cancel shipment');
    }
  };

  if (isLoading) return <div className="text-center py-10 text-teal-600">Loading shipments...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;
  if (shipments.length === 0) return <div className="text-center text-gray-500">No shipments found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200">
      <h2 className="text-2xl font-bold text-teal-800 mb-6 border-b pb-2 border-teal-100">
        📦 Your Shipments
      </h2>
      <div className="space-y-6">
        {shipments.map(shipment => (
          <div key={shipment.id} className="bg-white p-5 rounded-xl shadow-md border border-teal-100 hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-teal-700">
                #{shipment.tracking_id}
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                shipment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                shipment.status === 'IN_TRANSIT' ? 'bg-teal-100 text-teal-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {shipment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong className="text-teal-700">From:</strong> {shipment.origin}</p>
              <p><strong className="text-teal-700">To:</strong> {shipment.destination}</p>
              <p><strong>Weight:</strong> {shipment.weight} kg</p>
              <p><strong>Cost:</strong> <span className="text-amber-600 font-medium">${shipment.cost}</span></p>
              <p><strong>Est. Delivery:</strong> {new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
            </div>
            {shipment.status === 'PENDING' && (
              <button
                onClick={() => cancelShipment(shipment.id)}
                className="mt-3 inline-block text-sm text-red-600 hover:text-red-800 hover:underline transition"
              >
                ❌ Cancel Shipment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
