import { useState, useEffect } from 'react';
import axios from 'axios';
import bgImage from '../../assets/22.jpg';

export default function ShipmentList() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const access = localStorage.getItem('access');
        const res = await axios.get('http://localhost:8000/api/shipments/', {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });
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
      const access = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/shipments/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      setShipments(shipments.filter(shipment => shipment.id !== id));
    } catch (err) {
      console.error('Error cancelling shipment:', err);
      alert(err.response?.data?.detail || 'Cannot cancel shipment');
    }
  };

  if (isLoading)
    return <div className="text-center py-10 text-teal-600">Loading shipments...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;
  if (shipments.length === 0)
    return <div className="text-center text-gray-500">No shipments found</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-md">
        📦 Your Shipments
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {shipments.map(shipment => (
          <div
            key={shipment.id}
            className="bg-white/80 backdrop-blur-md p-5 rounded-xl shadow-md border border-teal-100 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-teal-700">
                #{shipment.tracking_id}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                  shipment.status === 'PENDING'
                    ? 'bg-amber-100 text-amber-700'
                    : shipment.status === 'IN_TRANSIT'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {shipment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong className="text-teal-700">From:</strong> {shipment.origin}</p>
              <p><strong className="text-teal-700">To:</strong> {shipment.destination}</p>
              <p><strong>Weight:</strong> {shipment.weight} kg</p>
              <p>
                <strong>Cost:</strong> <span className="text-amber-600 font-medium">${shipment.cost}</span>
              </p>
              <p><strong>Est. Delivery:</strong> {new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
            </div>
            {shipment.status === 'PENDING' && (
              <button
                onClick={() => cancelShipment(shipment.id)}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md shadow-sm hover:bg-red-200 hover:text-red-800 transition"
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
