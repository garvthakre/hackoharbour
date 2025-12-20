import React, { useEffect, useState } from 'react';
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
  const [isServerActiveMsg, setIsServerActiveMsg] = useState("jjj");

  useEffect(() => {
    const isServerActive = import.meta.env.VITE_IS_SERVER_ACTIVE;
    if (isServerActive && isServerActive.toLowerCase() === 'false') {
      setIsServerActiveMsg("Server is temporarily down");
    }
  }, [])

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
            className="px-4 py-2 text-sm font-semibold text-slate-600 border-2 rounded-lg hover:text-indigo-600 transition-colors cursor-pointer"
          >
           {isServerActiveMsg}
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Login In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-full transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-12 pb-6 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 uppercase tracking-[0.2em]">
          Collaborative RAG PDF APP
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">
          The first shared brain <br/>
          <span className="text-indigo-600">for your team's PDFs.</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-6 max-w-3xl mx-auto leading-relaxed">
          While others were building personal chatbots, we built the <strong>Multi-User Retrieval Engine</strong>. 
          Query vast document libraries collaboratively in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl cursor-pointer font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            Start a Workspace <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
            <PlayCircle className="h-5 w-5 text-indigo-600" /> Watch Demo
          </a>
        </div>
      </header>

      {/* Video Demo Section */}
      <section id="demo" className="max-w-6xl mx-auto px-6 mb-12">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100 border-8 border-slate-50 shadow-2xl shadow-indigo-100">
          <div className="aspect-video w-full bg-slate-200 flex items-center justify-center relative group">
            <iframe className='w-full h-full' src="https://www.youtube.com/embed/9EmrKSyg2oc?si=R20x1juYkHsvah5_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
      </section>

       
      <section className="max-w-2xl mx-auto px-6 mb-32 h-90">
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-3xl border-2 border-slate-200 shadow-2xl p-6 overflow-hidden h-[450px]">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold mb-2 uppercase tracking-wider">
                Timeline Comparison
              </div>
              <h3 className="text-base font-black text-slate-800 mb-1">
                When collaboration was added
              </h3>
              <p className="text-[10px] text-slate-500">Multi-user RAG feature launch dates</p>
            </div>

            {/* Competitors (Vertical) */}
            <div className="flex justify-center gap-6 mb-4 ">
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center mb-1">
                  <span className="text-sm">💬</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ChatGPT</div>
                <div className="text-lg font-black text-slate-800">Nov 28</div>
                <div className="text-[10px] text-slate-500 font-medium">2025</div>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center mb-1">
                  <span className="text-sm">🔮</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Perplexity</div>
                <div className="text-lg font-black text-slate-800">Oct 15</div>
                <div className="text-[10px] text-slate-500 font-medium">2025</div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 via-white to-slate-50 px-3 py-0.5 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-full border border-slate-200">
                  vs
                </span>
              </div>
            </div>

            {/* CollabGPT (Below, Highlighted) */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-25 rounded-xl"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 rounded-xl p-3 shadow-xl border border-indigo-400">
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full p-1.5 shadow-lg animate-pulse border border-white">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  
                  <div className="text-center text-white h-25">
                    <div className="w-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-1.5 border border-white/30">
                      <span className="text-lg">🚀</span>
                    </div>
                    <div className="text-[9px] font-bold mb-1 text-indigo-100 uppercase tracking-wider">CollabGPT</div>
                    <div className="text-2xl font-black mb-0.5 tracking-tight">20 March</div>
                    <div className="text-xs text-indigo-100 font-semibold mb-2">2025</div>
                    <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-white text-indigo-600 rounded-full px-2.5 py-1 shadow-md">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      First to Ship
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 text-center">
              <p className="text-[10px] text-slate-500">
                Shipped <span className="font-black text-indigo-600 text-xs">9+ months earlier</span> than the competition
              </p>
            </div>
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
      <section className="py-16 bg-white border-t border-slate-50">
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
              className="cursor-pointer px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-lg mb-8"
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
                    <a href="https://github.com/adnankhan46" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="h-7 w-7" /></a>
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
            <a href="https://github.com/garvthakre/CollabGPT" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-tighter transition-colors">Github</a>
            <a href="https://github.com/garvthakre/CollabGPT" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-tighter transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;