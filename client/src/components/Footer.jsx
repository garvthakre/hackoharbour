import React from 'react';
import { Instagram, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-zinc-100 text-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between md:px-6 lg:px-8 gap-10">
        {/* Brand section */}
        <div className="max-w-md">
          <h2 className="text-3xl font-extrabold font-outfit hover:text-[#243CB6] transition-colors">Project Name</h2>
          <p className="my-4 text-gray-600">Building innovative solutions for tomorrow's challenges. Join us on our mission to transform the digital landscape.</p>
          <div className="social-icons flex gap-6 mt-6">
            <a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">
              <Instagram size={22} />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">
              <Linkedin size={22} />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">
              <Github size={22} />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">
              <Mail size={22} />
            </a>
          </div>
        </div>

        {/* Links section */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Sponsor</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#243CB6] transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500">
        <p>&copy; 2025 Project Name. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;