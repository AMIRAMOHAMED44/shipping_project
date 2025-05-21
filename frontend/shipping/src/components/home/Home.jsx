import React, { useState } from "react";
import axios from "axios";
import Features from "./Features";
import Plans from "../customer-dashboard/plans";
import Reviews from "./Reviews";
import Contact from "./Contact";

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackingResult(null);
    setTrackingError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/shipments/track/?tracking_id=${trackingNumber}`);
      setTrackingResult(res.data);
    } catch (err) {
      setTrackingError(err.response?.data?.error || "Failed to track shipment");
    }
  };

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-800 mb-4">
            Track Your Shipment
          </h1>
          <p className="text-teal-700 mb-6 text-base sm:text-lg max-w-md mx-auto md:mx-0">
            Ship27 is your trusted partner for fast and reliable parcel delivery worldwide. We provide real-time tracking and seamless shipping solutions to keep your packages safe and on time.
          </p>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row max-w-md mx-auto md:mx-0 gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="My shipment tracking number"
              className="flex-grow border border-teal-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md px-6 py-3 transition hover:scale-105"
            >
              Track
            </button>
          </form>
          {trackingError && (
            <p className="mt-4 text-red-600 text-center md:text-left">{trackingError}</p>
          )}
          {trackingResult && (
            <div className="mt-4 text-teal-700 text-center md:text-left">
              <p><strong>Tracking ID:</strong> {trackingResult.tracking_id}</p>
              <p><strong>Status:</strong> {trackingResult.status.replace('_', ' ')}</p>
              <p><strong>From:</strong> {trackingResult.origin}</p>
              <p><strong>To:</strong> {trackingResult.destination}</p>
              <p><strong>Weight:</strong> {trackingResult.weight} kg</p>
              <p><strong>Cost:</strong> EGP {trackingResult.cost}</p>
              <p><strong>Est. Delivery:</strong> {new Date(trackingResult.estimated_delivery).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="src/assets/11.jpg"
            alt="Shipment dashboard and boxes"
            className="w-full max-w-sm sm:max-w-md md:max-w-full h-auto rounded-xl"
          />
        </div>
      </section>
      <section>
        <Plans />
      </section>
      <section>
        <Features />
      </section>
      <section>
        <Reviews />
      </section>
      <section>
        <Contact />
      </section>
    </div>
  );
}