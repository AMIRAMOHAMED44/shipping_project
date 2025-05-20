import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/authSlice"; // غيّر المسار حسب مكان ملف الـ slice

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { isLoggedIn } = useSelector((state) => state.auth);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    dispatch(logoutAction()); // لو عندك logout action في الـ Redux
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

        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={toggleMobileMenu}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-lg font-semibold items-center">
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="hover:underline hover:text-yellow-400 transition"
            >
              Dashboard
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
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

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="hover:underline hover:text-yellow-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:underline hover:text-yellow-400 transition"
              >
                Register
              </Link>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-lg font-semibold bg-teal-500">
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="block hover:text-yellow-300 transition"
            >
              Dashboard
            </Link>
          )}

          <details className="block">
            <summary className="cursor-pointer hover:text-yellow-300 transition">
              Shipments
            </summary>
            <div className="pl-4 mt-1 space-y-1">
              <Link
                to="/shipments/create"
                className="block hover:text-yellow-300 transition"
              >
                Create
              </Link>
              <Link
                to="/shipments/list"
                className="block hover:text-yellow-300 transition"
              >
                List
              </Link>
            </div>
          </details>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="block hover:text-yellow-300 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-yellow-300 transition"
              >
                Register
              </Link>
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
