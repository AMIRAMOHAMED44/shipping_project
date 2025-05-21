import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext.jsx';
import bgImage from '../../assets/22.jpg';

export default function ShipmentList() {
  const { api } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await api.get('/shipments/');
        console.log('Shipments response:', res.data);
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
        // Filter out CANCELLED shipments (safeguard)
        const activeShipments = shipmentsData.filter(
          shipment => shipment.status && shipment.status.toUpperCase() !== 'CANCELLED'
        );
        console.log('Filtered active shipments:', activeShipments);
        setShipments(Array.isArray(activeShipments) ? activeShipments : []);
      } catch (err) {
        console.error('Error fetching shipments:', err.response?.data || err.message);
        setError(err.message);
        toast.error('Failed to load shipments.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchShipments();
  }, [api]);

  const deleteShipment = async (id) => {
    try {
      await api.delete(`/shipments/${id}/`);
      setShipments(shipments.filter(shipment => shipment.id !== id));
      console.log('Shipment deleted:', id);
      toast.success('Shipment deleted successfully!');
    } catch (err) {
      console.error('Error deleting shipment:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Cannot delete shipment');
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-700">Loading shipments...</div>;
  if (error) return <div className="text-center py-10 text-red-800">Error: {error}</div>;
  if (shipments.length === 0) return <div className="text-center py-10 text-gray-500">No shipments found</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-teal-900 mb-8 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg max-w-2xl mx-auto">
        📦 Your Shipments
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {shipments.map(shipment => (
          <div
            key={shipment.id}
            className="bg-white/80 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-teal-800">
                #{shipment.tracking_id}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  shipment.status === 'PENDING'
                    ? 'bg-teal-100 text-teal-800'
                    : shipment.status === 'IN_TRANSIT'
                    ? 'bg-green-100 text-green-800'
                    : shipment.status === 'DELIVERED'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {shipment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-sm text-gray-800 space-y-1">
              <p><strong className="text-gray-700">From:</strong> {shipment.origin}</p>
              <p><strong className="text-gray-700">To:</strong> {shipment.destination}</p>
              <p><strong>Weight:</strong> {shipment.weight} kg</p>
              <p><strong>Cost:</strong> <span className="text-teal-800 font-medium">EGP {shipment.cost}</span></p>
              <p><strong>Est. Delivery:</strong> {new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
            </div>
            {shipment.status === 'PENDING' && (
              <button
                onClick={() => {
                  console.log('Delete button clicked for shipment:', shipment.id);
                  deleteShipment(shipment.id);
                }}
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition hover:scale-105"
              >
                ❌ Delete Shipment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}