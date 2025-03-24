import React, { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

// Remove the useLocation import since we're not using Router context
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between py-4">
            <a href="/" className="flex items-center text-2xl font-bold text-indigo-400">
              <Zap className="mr-2" />
              HyperRAG
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/features"
                className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium"
              >
                Features
              </a>
              <a 
                href="/why-us"
                className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium"
              >
                Why Us
              </a>
              <a 
                href="/about"
                className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a 
                href="/contact"
                className="text-slate-300 hover:text-indigo-400 transition-colors duration-200 font-medium"
              >
                Contact
              </a>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {!user.name ? (
                <>
                  <a href="/login" className="px-4 py-2 rounded-md border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-200 font-medium">
                    Login
                  </a>
                  <a href="/signup" className="px-4 py-2 rounded-md bg-indigo-500 border border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-200 font-medium">
                    Sign Up
                  </a>
                </>
              ) : (
                <div className="text-indigo-300 font-medium">Welcome, {user.name}</div>
              )}
            </div>
            
            <button onClick={toggleMobileMenu} className="md:hidden text-white">
              <Menu size={24} />
            </button>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={closeMobileMenu} className="absolute top-4 right-4 text-white">
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center space-y-6 text-xl">
          <a 
            href="/features" 
            onClick={closeMobileMenu}
            className="text-white font-medium"
          >
            Features
          </a>
          <a 
            href="/why-us" 
            onClick={closeMobileMenu}
            className="text-white font-medium"
          >
            Why Us
          </a>
          <a 
            href="/about" 
            onClick={closeMobileMenu}
            className="text-white font-medium"
          >
            About
          </a>
          <a 
            href="/contact" 
            onClick={closeMobileMenu}
            className="text-white font-medium"
          >
            Contact
          </a>
        </div>
        
        <div className="flex flex-col w-4/5 max-w-xs mt-8 space-y-4">
          {!user.name ? (
            <>
              <a 
                href="/login" 
                onClick={closeMobileMenu}
                className="w-full px-4 py-2 rounded-md border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-200 font-medium text-center"
              >
                Login
              </a>
              <a 
                href="/signup" 
                onClick={closeMobileMenu}
                className="w-full px-4 py-2 rounded-md bg-indigo-500 border border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-200 font-medium text-center"
              >
                Sign Up
              </a>
            </>
          ) : (
            <div className="text-indigo-300 font-medium text-center">Welcome, {user.name}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;