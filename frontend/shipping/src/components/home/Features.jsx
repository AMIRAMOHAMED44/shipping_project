export default function Features() {
  const features = [
    "Fast delivery",
    "International shipping",
    "Live shipment tracking",
    "24/7 customer support",
    "Affordable prices",
    "Flexible pickup options",
    "Secure packaging",
    "Real-time notifications",
    "Customs clearance assistance",
    "Eco-friendly shipping",
    "Multiple payment methods",
    "Dedicated account manager",
  ];

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-800 text-center mb-12 font-serif">
          Why Choose Ship27?
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4 hover:shadow-lg transition duration-300"
            >
              <div className="bg-yellow-400 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-medium text-teal-800">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
