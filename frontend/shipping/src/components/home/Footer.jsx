export default function Footer() {
    return (
      <footer className="bg-teal-800 text-white py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} ShipSwift. All rights reserved.</p>
          <p className="text-sm">Follow us on Facebook, Twitter, Instagram</p>
        </div>
      </footer>
    );
  }
  