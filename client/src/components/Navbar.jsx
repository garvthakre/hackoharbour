import React, { useState } from "react";
import { useLocation, Link } from "react-router"; // Import useLocation to get current path
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current route

  // User state logic (keeping your existing structure)
  let user = {
    name: "Person",
    email: "email@test.com",
    password: "1234"
  }
  user = {
    name: null,
    email: null,
    password: null
  }

  return (
    <nav className="bg-zinc-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-extrabold font-outfit text-2xl text-white hover:text-[#243CB6] transition-colors">
              Project Name
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-gray-300 hover:text-[#243CB6] px-3 py-2 text-sm font-medium transition-colors">
            Features
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-[#243CB6] px-3 py-2 text-sm font-medium transition-colors">
            About Us
          </Link>
          <Link to="/documentation" className="text-gray-300 hover:text-[#243CB6] px-3 py-2 text-sm font-medium transition-colors">
            Documentation
          </Link>
          
          {/* Auth buttons */}
          {!user.name ? (
            <div className="flex items-center ml-4 space-x-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:bg-[#243CB6] rounded-md transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-[#243CB6] rounded-md hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="text-yellow-200 font-medium">Welcome, {user.name}</div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white hover:text-[#243CB6]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Only visible when open) */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link to="/features" className="block px-3 py-2 text-base font-medium text-white hover:text-[#243CB6]">
            Features
          </Link>
          <Link to="/about" className="block px-3 py-2 text-base font-medium text-white hover:text-[#243CB6]">
            About Us
          </Link>
          <Link to="/documentation" className="block px-3 py-2 text-base font-medium text-white hover:text-[#243CB6]">
            Documentation
          </Link>
          
          {/* Auth buttons for mobile */}
          {!user.name ? (
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-center text-white hover:bg-[#243CB6] rounded-md">
                Log In
              </Link>
              <Link to="/signup" className="block px-3 py-2 text-base font-medium text-center text-white bg-[#243CB6] rounded-md hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="block px-3 py-2 text-base font-medium text-yellow-200">
              Welcome, {user.name}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;