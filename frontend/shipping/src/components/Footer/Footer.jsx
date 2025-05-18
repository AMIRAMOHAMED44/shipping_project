import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white py-10 ">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Section */}
        <div>
          <h3 className="text-3xl font-serif mb-3 ">About Ship27</h3>
          <p className="text-sm leading-relaxed">
            Ship27 provides reliable and fast parcel delivery across the globe. Our mission is to simplify shipping and tracking through technology and care.
          </p>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center items-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
              aria-label="Facebook"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
              aria-label="Twitter"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="flex flex-col justify-center items-center md:items-end">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} ShipSwift. All rights reserved.
          </p>
          <p className="text-xs mt-1 text-teal-200">
            Built with care and speed.
          </p>
        </div>
      </div>
    </footer>
  );
}
