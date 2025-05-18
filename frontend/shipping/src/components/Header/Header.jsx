/* src/components/Header/Header.jsx */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";

export default function Header() {
  const { isAuth, logout } = useAuth();     // ← السياق
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const navigate                           = useNavigate();

  const toggleDropdown  = () => setDropdownOpen((p) => !p);
  const toggleMobile    = () => setMobileOpen((p) => !p);

  const handleLogout = () => {
    localStorage.removeItem("refresh");    // نمسح refresh فقط
    logout();                              // يحذف access من الـ context
    navigate("/login");
  };

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-6">
        <Link
          to="/"
          className="text-3xl md:text-4xl font-extrabold tracking-wide font-serif hover:text-yellow-400 transition"
        >
          Ship27
        </Link>

        {/* Mobile burger */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={toggleMobile}
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 text-lg font-semibold items-center">
          {/* Shipments dropdown */}
          <div className="relative">
            {isAuth && (
              <Link
                to="/dashboard"
                className="hover:underline hover:text-yellow-400 transition"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={toggleDropdown}
              className="hover:underline hover:text-yellow-400 transition"
            >
              Shipments
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-2 bg-white text-gray-800 rounded-md shadow-lg w-40 z-50">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/shipments/create"
                      className="block px-4 py-2 hover:bg-yellow-100 hover:text-teal-700 transition"
                    >
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipments/list"
                      className="block px-4 py-2 hover:bg-yellow-100 hover:text-teal-700 transition"
                    >
                      List
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {!isAuth ? (
            <>
              <Link to="/login"    className="hover:underline hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="hover:underline hover:text-yellow-400 transition">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:underline hover:text-yellow-400 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-lg font-semibold bg-teal-500">
          {isAuth && (
            <Link
              to="/dashboard"
              className="block hover:text-yellow-300 transition"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <details>
            <summary className="cursor-pointer hover:text-yellow-300 transition">
              Shipments
            </summary>
            <div className="pl-4 mt-1 space-y-1">
              <Link
                to="/shipments/create"
                className="block hover:text-yellow-300 transition"
                onClick={() => setMobileOpen(false)}
              >
                Create
              </Link>
              <Link
                to="/shipments/list"
                className="block hover:text-yellow-300 transition"
                onClick={() => setMobileOpen(false)}
              >
                List
              </Link>
            </div>
          </details>

          {!isAuth ? (
            <>
              <Link to="/login" className="block hover:text-yellow-300 transition" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block hover:text-yellow-300 transition" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-left hover:text-yellow-300 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
