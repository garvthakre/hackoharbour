import React, { useState } from "react";
import { useLocation, Link } from "react-router"; // Import useLocation to get current path
import { GemIcon, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get current route

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

console.log(user)
  return (
    <nav className="bg-zinc-900 text-white">
      <div className="flex items-center justify-between h-[60px] px-6 md:px-36">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl"> <Link to="/">Project Name</Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-16 font-semibold text-lg">
         {(user) ? 
         <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-white hover:underline mx-4">
                LogIn
              </Link>
                <Link to="/signup" className="font-medium text-white hover:underline">
                SignUp
              </Link>
         </div>
         :
         <div className="text-yellow-200">{"Guest"}</div>}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu (Only visible when open) */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-zinc-800">
          {(!user) ?
         <div className="text-center text-sm flex gap-3 flex-col">
                <Link to="/login" className="font-medium text-white hover:underline ">
                LogIn
              </Link>
                <Link to="/signup" className="font-medium text-white hover:underline">
                SignUp
              </Link>
         </div>
         : 
         <div className="text-yellow-200">{"Guest"}</div>}
        </div>
      )}
    </nav>
  );
}

export default Navbar;