import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
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
import LiquidEther from '../components/LiquidEther';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isServerActiveMsg, setIsServerActiveMsg] = useState("");

  useEffect(() => {
    const isServerActive = import.meta.env.VITE_IS_SERVER_ACTIVE;
    if (isServerActive && isServerActive.toLowerCase() === 'false') {
      setIsServerActiveMsg("Server is temporarily down");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 py-6 max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center">
            <img src='/collabgpt-logo.png'/>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">CollabGPT</span>
        </div>
        
        <div>
          <button 
            className="px-2 py-1 text-xs font-semibold text-slate-600 border-2 rounded-lg hover:text-indigo-600 transition-colors cursor-pointer"
            >
           {isServerActiveMsg}
          </button>
            </div>
        <div className="flex items-center gap-2 md:flex-row flex-col">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Login In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="hidden md:block md:px-6 px-4 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-full transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative w-full" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0 z-0">
          <LiquidEther
              colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
              mouseForce={20}
              cursorSize={100}
              isViscous={false}
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
          />
        </div>
        <header className="relative z-10 pt-20 pb-16 px-6 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full" style={{ minHeight: '600px' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 uppercase tracking-[0.2em] shadow-sm">
            Collaborative RAG PDF APP
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">
            The first shared brain <br/>
            <span className="text-indigo-600">for your team's PDFs.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-xl">
           Increase your team's productivity with <strong>CollabGPT</strong>. 
          </p>
  
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl cursor-pointer font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              Start a Workspace <ArrowRight className="h-5 w-5" />
            </button>
            <a href="#demo" className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white transition-all">
              <PlayCircle className="h-5 w-5 text-indigo-600" /> Watch Demo
            </a>
          </div>
        </header>
      </div>

      {/* Video Demo Section */}
      <section id="demo" className="max-w-6xl mx-auto px-6 mb-12">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100 border-8 border-slate-50 shadow-2xl shadow-indigo-100">
          <div className="aspect-video w-full bg-slate-200 flex items-center justify-center relative group">
            <iframe className='w-full h-full' src="https://www.youtube.com/embed/9EmrKSyg2oc?si=R20x1juYkHsvah5_" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        </div>
      </section>

       
      <section className="py-10 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold mb-8 uppercase tracking-wider">
            Timeline Comparison
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            When collaboration was added
          </h2>
          <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed">
            Multi-user RAG feature launch dates compared to major platforms.
          </p>

          <div className="max-w-3xl mx-auto">
             <div className="relative bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
               {/* Subtle grid pattern background */}
               <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                 
                 {/* Competitors Group */}
                 <div className="flex gap-4">
                   {/* ChatGPT */}
                   <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 min-w-[100px]">
                     <div className="text-2xl mb-2">💬</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ChatGPT</div>
                     <div className="text-lg font-black text-slate-800">Nov</div>
                     <div className="text-xs text-slate-400 font-medium">2025</div>
                   </div>

                   {/* Perplexity */}
                   <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 min-w-[100px]">
                     <div className="text-2xl mb-2">🔮</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Perplexity</div>
                     <div className="text-lg font-black text-slate-800">Oct</div>
                     <div className="text-xs text-slate-400 font-medium">2025</div>
                   </div>
                 </div>

                 {/* Divider */}
                 <div className="flex md:flex-col items-center gap-4 text-slate-300">
                   <div className="h-px w-12 md:w-px md:h-12 bg-slate-200"></div>
                   <span className="font-bold text-xs uppercase tracking-widest text-slate-400">vs</span>
                   <div className="h-px w-12 md:w-px md:h-12 bg-slate-200"></div>
                 </div>

                 {/* CollabGPT */}
                 <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20"></div>
                    <div className="relative bg-indigo-600 text-white p-6 rounded-2xl shadow-lg border border-indigo-500 min-w-[180px] transform hover:scale-105 transition-transform duration-300">
                      <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-1 rounded-full shadow-md">
                        FIRST
                      </div>
                      <div className="text-3xl mb-3">🚀</div>
                      <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mb-1">CollabGPT</div>
                      <div className="text-2xl font-black mb-1">20 March</div>
                      <div className="text-sm font-medium text-indigo-100">2025</div>
                    </div>
                 </div>

               </div>
               
               <div className="mt-10 pt-8 border-t border-slate-100">
                 <p className="text-sm font-medium text-slate-500">
                   We shipped <span className="font-black text-indigo-600 px-1 py-0.5 bg-indigo-50 rounded">9+ months earlier</span> than the competition
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Philosophy */}
      <section className="bg-slate-50 py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <FileStack className="text-indigo-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Multi-Source Synthesis</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our RAG engine doesn't just scan one file; it cross-references thousands of tokens across your shared PDF library to find the hidden connections.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                <Users className="text-emerald-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Collaborative Context</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Engineered for teams. The chat history and vector retrievals are synced via high-speed web sockets, ensuring everyone stays on the same page.
              </p>
            </div>

            <div className="space-y-2">
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

      <section className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold mb-6">Open Source Community Driven</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
        Our plateform is open source. As we are big time open-source fans because of its collaborative nature and growth-for-all
        persona. We built CollabGPT a community of folks just like us because we wanted to give something back to place we have
        learnt so much from.
      </p>
      <p className="text-gray-600 my-4 mb-8 max-w-2xl mx-auto text-lg">
        You can be a part of this journey by helping us improve CollabGPT for thousands of people around the world.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to={'https://github.com/adnankhan46/collab-gpt-rag'}>
        <button className="w-fit px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-blue-700">
          Contribute to Github
        </button>
        </Link>
        <Link to={'https://github.com/adnankhan46/collab-gpt-rag'}>
        <button className="px-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
          Star us on GitHub
        </button>
        </Link>
      </div>
    </div>
  </section>

      {/* Final CTA & Creator Section */}
      <section className="py-8 bg-white border-t border-slate-50">
        <div className="max-w-5xl mx-auto px-6">

          {/* Founders/Developers Section */}
          <div className="text-center">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">
              Built By
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