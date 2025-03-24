import React from 'react';
import { Link } from 'react-router';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">HyperRAG</h3>
            <p className="text-slate-300 mb-4">
              Advanced document intelligence platform powered by state-of-the-art retrieval augmented generation technology.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/features/document-processing" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Document Processing</Link></li>
              <li><Link to="/features/vector-database" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Vector Database</Link></li>
              <li><Link to="/features/rag-implementation" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">RAG Implementation</Link></li>
              <li><Link to="/features/collections" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Collections Management</Link></li>
              <li><Link to="/features/api" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">API Integration</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Documentation</Link></li>
              <li><Link to="/api-reference" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">API Reference</Link></li>
              <li><Link to="/tutorials" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Tutorials</Link></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Blog</Link></li>
              <li><Link to="/case-studies" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Case Studies</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Careers</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Contact</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>&copy; 2025 HyperRAG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;