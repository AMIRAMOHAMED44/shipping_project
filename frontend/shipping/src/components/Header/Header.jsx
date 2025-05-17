import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-teal-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-6">
                {/* Website Logo/Name as Home Link */}
                <Link
                    to="/"
                    className="text-3xl md:text-4xl font-extrabold tracking-wide font-serif hover:text-yellow-400 transition"
                >
                    Ship27
                </Link>

                {/* Hamburger Icon for Mobile */}
                <button
                    className="md:hidden text-3xl focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 text-lg font-semibold items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="hover:underline hover:text-yellow-400 transition-colors duration-300"
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

                    <Link
                        to="/login"
                        className="hover:underline hover:text-yellow-400 transition-colors duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="hover:underline hover:text-yellow-400 transition-colors duration-300"
                    >
                        Register
                    </Link>
                </nav>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-3 text-lg font-semibold bg-teal-500">
                    <details className="block">
                        <summary className="cursor-pointer hover:text-yellow-300 transition">
                            Shipments
                        </summary>
                        <div className="pl-4 mt-1 space-y-1">
                            <Link to="/shipments/create" className="block hover:text-yellow-300 transition">
                                Create
                            </Link>
                            <Link to="/shipments/list" className="block hover:text-yellow-300 transition">
                                List
                            </Link>
                        </div>
                    </details>

                    <Link to="/login" className="block hover:text-yellow-300 transition">
                        Login
                    </Link>
                    <Link to="/register" className="block hover:text-yellow-300 transition">
                        Register
                    </Link>
                </div>
            )}
        </header>
    );
}
