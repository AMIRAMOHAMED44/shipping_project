export default function Features() {
    const features = [
      "Fast delivery",
      "International shipping",
      "Live shipment tracking",
      "24/7 customer support",
      "Affordable prices",
    ];
  
    return (
      <section className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md my-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-6 text-center">Our Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-teal-700">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center space-x-3 bg-teal-50 p-4 rounded shadow hover:bg-teal-100 transition"
            >
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  