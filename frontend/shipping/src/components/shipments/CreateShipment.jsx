import { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/17.jpg';
import { toast } from 'react-toastify';

export default function CreateShipment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState([]);
  const [createdShipment, setCreatedShipment] = useState(null);

  // جلب المدن
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const access = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/cities/', {
          headers: access ? { Authorization: `Bearer ${access}` } : {}
        });
        setCities(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedShipment(null);

    try {
      if (!formData.origin || !formData.destination) {
        throw new Error('Please select both origin and destination');
      }
      if (isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
        throw new Error('Weight must be a positive number');
      }
      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        description: formData.description
      };

      const access = localStorage.getItem('access');
      const res = await axios.post('http://localhost:8000/api/shipments/', payload, {
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Shipment created successfully!');
      setSuccess(true);
      setCreatedShipment(res.data);
      setFormData({ origin: '', destination: '', weight: '', description: '' });
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.detail ||
        err.response?.data ||
        err.message ||
        "Error creating shipment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10 sm:py-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 mb-6">🚚 Create a Shipment</h2>
        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-100 border border-red-300 text-red-800 shadow-sm text-sm sm:text-base">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 rounded-md bg-green-100 border border-green-300 text-green-800 shadow-sm text-sm sm:text-base">
            ✅ Shipment created successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 text-lg">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Origin City</label>
            <select
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Origin</option>
              {cities.map(city => (
                <option key={`origin-${city.id}`} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Destination City</label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select Destination</option>
              {cities.map(city => (
                <option key={`dest-${city.id}`} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Weight (kg) <span className="text-gray-500 text-base">(Your plan limit applies)</span>
            </label>
            <input
              type="number"
              name="weight"
              min="0.1"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 2.5"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Books and clothes"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ${
              isLoading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Create Shipment'}
          </button>
        </form>
        {createdShipment && (
          <div className="mt-6 p-5 bg-teal-50 border border-teal-200 rounded-xl text-sm sm:text-base">
            <h3 className="text-lg font-semibold text-teal-800 mb-2">📄 Shipment Details</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Tracking ID:</strong> {createdShipment.tracking_id}</li>
              <li><strong>Estimated Cost:</strong> EGP {createdShipment.cost?.toFixed(2)}</li>
              <li><strong>Estimated Delivery:</strong> {new Date(createdShipment.estimated_delivery).toLocaleDateString()}</li>
              {createdShipment.description && (
                <li><strong>Description:</strong> {createdShipment.description}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}