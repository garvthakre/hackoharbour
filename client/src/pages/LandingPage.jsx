import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Zap, 
  MessageSquare, 
  FileStack, 
  ArrowRight,
  Database,
  Share2,
  PlayCircle,
  ShieldCheck,
  Github, Globe, ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center">
            <img src='/collabgpt-logo.png'/>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">CollabGPT</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Login In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-full transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-20 pb-12 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 uppercase tracking-[0.2em]">
          Collaborative RAG PDF APP
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">
          The first shared brain <br/>
          <span className="text-indigo-600">for your team's PDFs.</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          While others were building personal chatbots, we built the <strong>Multi-User Retrieval Engine</strong>. 
          Query vast document libraries collaboratively in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            Start a Workspace <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
            <PlayCircle className="h-5 w-5 text-indigo-600" /> Watch Demo
          </a>
        </div>
      </header>

      {/* Video Demo Section */}
      <section id="demo" className="max-w-6xl mx-auto px-6 mb-32">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100 border-8 border-slate-50 shadow-2xl shadow-indigo-100">
          <div className="aspect-video w-full bg-slate-200 flex items-center justify-center relative group">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/your-video-id" 
              title="MultiRAG Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Core Engineering Philosophy */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <FileStack className="text-indigo-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Multi-Source Synthesis</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our RAG engine doesn't just scan one file; it cross-references thousands of tokens across your shared PDF library to find the hidden connections.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <Users className="text-emerald-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Collaborative Context</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Engineered for teams. The chat history and vector retrievals are synced via high-speed web sockets, ensuring everyone stays on the same page.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <ShieldCheck className="text-amber-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Data Privacy Protocol</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Built before the public models dominated. We prioritize data isolation, ensuring your workspace vector store is never leaked or shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA & Creator Section */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          {/* CTA Card */}
          <div className="rounded-[40px] bg-indigo-600 py-16 px-8 text-center text-white shadow-2xl shadow-indigo-200 mb-20">
            <h2 className="text-4xl font-bold mb-6 italic">Built first. Built better.</h2>
            <p className="text-indigo-100 mb-10 text-lg max-w-xl mx-auto">
              Experience the original collaborative document engine. 
              Deploy your own space in seconds.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-lg mb-8"
            >
              Create Your Space
            </button>
            
            {/* Project Github Link */}
            <div className="flex justify-center">
              <a 
                href="https://github.com/adnankhan46/collab-gpt-rag" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-medium"
              >
                <Github className="h-5 w-5" />
                View Project on GitHub
              </a>
            </div>
          </div>

          {/* Founders/Developers Section */}
          <div className="text-center">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
              Engineered By
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Profile 1 */}
              <div className="flex items-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Adnan Khan</h4>
                  <div className="flex gap-3 mt-2 justify-center items-center">
                    <a href="https://adnankhan93.vercel.app" className="text-slate-400 hover:text-slate-900 transition-colors">Portfolio</a>
                    <a href="https://github.com/adnankahn46" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="h-7 w-7" /></a>
                  </div>
                </div>
              </div>

              {/* Profile 2 */}
              <div className="flex items-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Garv Thakre</h4>
                  <div className="flex gap-3 mt-2  justify-center items-center">
                    <a href="https://garvthakreportfolio.netlify.app" className="text-slate-400 hover:text-slate-900 transition-colors">Portfolio</a>
                    <a href="https://github.com/garvthakre" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="h-7 w-7" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src='/collabgpt-logo.png' className='w-12 h-12'/>
            <span className="font-bold text-slate-900">CollabGPT</span>
            <span className="text-slate-400 text-sm ml-2">© 2025</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Collaborative RAG PDF APP
          </p>
          <div className="flex gap-6">
            <a href="https://github.com/adnankhan46/collab-gpt-rag" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-tighter transition-colors">System Status</a>
            <a href="https://github.com/adnankhan46/collab-gpt-rag" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-tighter transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;