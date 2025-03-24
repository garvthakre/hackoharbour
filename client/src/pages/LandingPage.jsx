import React, { useState, useEffect } from 'react';

export default function HyperRAG() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Close mobile menu when clicking outside
    const handleOutsideClick = (event) => {
      if (isMobileMenuOpen && 
          !event.target.closest('#mobileMenu') && 
          !event.target.closest('#menuToggle')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Smooth scroll for anchor links
  const handleSmoothScroll = (e, href) => {
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="text-slate-50 bg-slate-900 leading-relaxed">
      <header className="bg-slate-950 shadow-md sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-6">
          <nav className="flex justify-between items-center py-4">
            <a href="#" className="flex items-center font-bold text-2xl text-indigo-500 no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
              </svg>
              HyperRAG
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="text-slate-300 no-underline font-medium transition-colors hover:text-indigo-500">Features</a>
              <a href="#unique-features" onClick={(e) => handleSmoothScroll(e, '#unique-features')} className="text-slate-300 no-underline font-medium transition-colors hover:text-indigo-500">Why Us</a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-slate-300 no-underline font-medium transition-colors hover:text-indigo-500">About</a>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-slate-300 no-underline font-medium transition-colors hover:text-indigo-500">Contact</a>
            </div>
            <div className="hidden md:flex gap-4">
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Login</a>
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all bg-indigo-500 text-slate-50 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600">Sign Up</a>
            </div>
            <button 
              className="md:hidden bg-transparent border-none text-slate-50 text-2xl cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div 
        id="mobileMenu"
        className={`fixed top-0 left-0 w-full h-full bg-slate-950 z-[1000] flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <button 
          className="absolute top-4 right-4 bg-transparent border-none text-slate-50 text-2xl cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex flex-col items-center gap-6">
          <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="text-slate-50 no-underline text-xl font-medium">Features</a>
          <a href="#unique-features" onClick={(e) => handleSmoothScroll(e, '#unique-features')} className="text-slate-50 no-underline text-xl font-medium">Why Us</a>
          <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="text-slate-50 no-underline text-xl font-medium">About</a>
          <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="text-slate-50 no-underline text-xl font-medium">Contact</a>
        </div>
        <div className="flex flex-col gap-4 mt-8 w-4/5 max-w-[300px]">
          <a href="#" className="w-full text-center px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Login</a>
          <a href="#" className="w-full text-center px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all bg-indigo-500 text-slate-50 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600">Sign Up</a>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-950 text-center flex">
        <div className="container w-full max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-4xl sm:text-3xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Transform Your Documents into Intelligent Conversations
          </h1>
          <p className="text-xl sm:text-lg text-slate-300 max-w-[700px] mx-auto mb-8">
            KnowledgeRAG is a powerful platform that leverages advanced RAG technology to process, understand, and retrieve information from your documents with unprecedented accuracy and context awareness.
          </p>
          <div className="flex justify-center gap-4 mb-10 flex-wrap sm:flex-col sm:max-w-[300px] sm:mx-auto">
            <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all bg-indigo-500 text-slate-50 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 sm:w-full sm:text-center">Get Started Free</a>
            <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50 sm:w-full sm:text-center">See Demo</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://res.cloudinary.com/dszh95unv/image/upload/v1742633320/otqy94cegpbqtesdoqbu.gif" alt="KnowledgeRAG platform interface showing document processing and chat interaction" className="w-full h-auto block h-[300px] rounded-[2000px]" />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-3xl font-bold mb-4 text-slate-50">Powerful Document Intelligence</h2>
            <p className="text-lg text-slate-300 max-w-[700px] mx-auto">Process, store, and retrieve information from your documents with exceptional accuracy and context awareness.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Multi-Format Document Processing</h3>
              <p className="text-slate-300">Seamlessly ingest PDF, CSV, voice files, and even extract content from images and links within your documents.</p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Advanced Vector Database</h3>
              <p className="text-slate-300">Store and retrieve information efficiently using state-of-the-art vector databases like FAISS, Pinecone, and ChromaDB.</p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Real-Time Updates</h3>
              <p className="text-slate-300">Your vector database automatically updates when documents are edited in your collection, ensuring your chatbot always has the latest information.</p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Collections Management</h3>
              <p className="text-slate-300">Create multiple document collections and query specific collections within the chatbot interface for better organization and segmentation.</p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Transparent Retrieval</h3>
              <p className="text-slate-300">View the retrieved information, re-ranking results, and final LLM-generated responses for complete transparency in decision-making.</p>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8 sm:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 bg-sky-500/20 rounded-lg flex items-center justify-center mb-6 text-sky-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-50">Secure & Reliable</h3>
              <p className="text-slate-300">Built-in guardrails prevent hallucinations and misinformation, ensuring secure document handling and reliable responses.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Unique Features Section */}
      <section id="unique-features" className="py-20 sm:py-12 bg-slate-950">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-3xl font-bold mb-4 text-slate-50">What Makes Us Unique</h2>
            <p className="text-lg text-slate-300 max-w-[700px] mx-auto">Our platform goes beyond standard RAG implementations with advanced features designed for enterprise-level document intelligence.</p>
          </div>
          
          {/* Showcase Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 last:mb-0">
            <div className="md:order-1">
              <h3 className="text-2xl font-bold mb-4 text-slate-50">Multimodal Processing</h3>
              <p className="text-slate-300 mb-6">Our advanced system doesn't just process text - it understands images, audio, and structured data within your documents. Extract information from charts, diagrams, and embedded media to create a comprehensive knowledge base that captures all aspects of your content.</p>
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Learn More</a>
            </div>
            <div className="md:order-2 rounded-lg overflow-hidden shadow-xl">
              <img src="https://res.cloudinary.com/dszh95unv/image/upload/f_auto,q_auto/rt5clyxm6j5woutdehzt" alt="Multimodal processing visualization showing text, image, and data extraction" className="h-[300px] w-[500px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 last:mb-0">
            <div className="md:order-2">
              <h3 className="text-2xl font-bold mb-4 text-slate-50">Contextual Spaces</h3>
              <p className="text-slate-300 mb-6">Create dedicated knowledge spaces for different departments, projects, or topics. Each space maintains its own context, allowing for specialized document collections and tailored responses based on the specific domain knowledge required.</p>
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Learn More</a>
            </div>
            <div className="md:order-1 rounded-lg overflow-hidden shadow-xl">
              <img src="https://res.cloudinary.com/dszh95unv/image/upload/f_auto,q_auto/wqtubggsuut1sc8em1yl" alt="Contextual spaces visualization showing multiple knowledge domains" className="h-[300px] w-[500px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 last:mb-0">
            <div className="md:order-1">
              <h3 className="text-2xl font-bold mb-4 text-slate-50">Contextual Continuity</h3>
              <p className="text-slate-300 mb-6">Our system doesn't just answer questions - it maintains conversation context. When you send your third message, the system considers your previous two messages to provide coherent, contextually relevant responses that build on your ongoing conversation.</p>
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Learn More</a>
            </div>
            <div className="md:order-2 rounded-lg overflow-hidden shadow-xl">
              <img src="https://res.cloudinary.com/dszh95unv/image/upload/v1742633320/iaww62eblzclrq4melsm.webp" alt="Contextual continuity visualization showing conversation flow" className="h-[300px] w-[500px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 last:mb-0">
            <div className="md:order-2">
              <h3 className="text-2xl font-bold mb-4 text-slate-50">Collections & Smart Filtering</h3>
              <p className="text-slate-300 mb-6">Organize your documents into collections and sub-collections with intuitive management. Our smart filtering system automatically determines which documents are most relevant to your query, even across multiple collections.</p>
              <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-indigo-500 text-indigo-500 bg-transparent hover:bg-indigo-500 hover:text-slate-50">Learn More</a>
            </div>
            <div className="md:order-1 rounded-lg overflow-hidden shadow-xl">
              <img src="https://res.cloudinary.com/dszh95unv/image/upload/f_auto,q_auto/wqtubggsuut1sc8em1yl" alt="Collections and filtering visualization showing document organization" className="h-[300px] w-[500px]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 sm:py-12 bg-gradient-to-br from-indigo-600 to-purple-500 text-slate-50 text-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="text-4xl sm:text-3xl font-bold mb-6">Ready to Transform Your Document Intelligence?</h2>
          <p className="text-lg opacity-90 max-w-[700px] mx-auto mb-8">Start processing your documents and building intelligent chatbots in minutes. No credit card required to get started.</p>
          <div className="flex justify-center gap-4 flex-wrap sm:flex-col sm:max-w-[300px] sm:mx-auto">
            <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all bg-slate-50 text-indigo-700 border border-slate-50 hover:bg-transparent hover:text-slate-50">Get Started Free</a>
            <a href="#" className="px-4 py-2 rounded-md font-medium no-underline cursor-pointer transition-all border border-slate-50 text-slate-50 bg-transparent hover:bg-slate-50 hover:text-indigo-700">Schedule Demo</a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-950 text-slate-50 py-12">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">KnowledgeRAG</h3>
              <p className="text-slate-300 mb-4">Advanced document intelligence platform powered by state-of-the-art retrieval augmented generation technology.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="list-none">
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Document Processing</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Vector Database</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">RAG Implementation</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Collections Management</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">API Integration</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Resources</h3>
              <ul className="list-none">
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Documentation</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">API Reference</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Tutorials</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Company</h3>
              <ul className="list-none">
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Careers</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="text-slate-400 no-underline transition-colors hover:text-slate-50">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>&copy; 2025 KnowledgeRAG. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}