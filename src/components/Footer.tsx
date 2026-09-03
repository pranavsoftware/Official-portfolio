import { useState } from 'react';
import { Mail, Globe, Phone, MapPin, ArrowRight, Github, Linkedin, Award, Copy, Check } from 'lucide-react';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('raybanpranav@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="border-t border-white/10 pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
        {/* Col 1: Call to action */}
        <div className="flex flex-col justify-between items-start">
          <div>
            <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-2">Initiate Collaboration</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bebas tracking-wide mb-4 sm:mb-6 leading-[0.9]">
              LET'S BUILD<br/>INTELLIGENT<br/>SYSTEMS <span className="text-red-500 align-top text-2xl sm:text-3xl">+</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-sm">
              Open for Machine Learning Engineering, AI Research, and Deep Learning roles. Let's engineer impactful, trustworthy, and scalable systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:raybanpranav@gmail.com"
              className="px-5 py-2.5 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all duration-200 shadow-lg cursor-pointer"
            >
              <span>Email Rayban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleCopyEmail}
              className="px-4 py-2.5 bg-[#141414] hover:bg-[#202020] active:scale-95 text-gray-300 hover:text-white border border-white/10 text-xs font-mono rounded-sm flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>

        {/* Col 2: Direct Contact Channels */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:pl-6 font-mono">
          <a 
            href="mailto:raybanpranav@gmail.com"
            className="flex items-center gap-3 sm:gap-4 p-3 bg-[#0a0a0a] border border-white/5 hover:border-red-600/40 active:scale-[0.98] rounded-sm transition-all duration-200 group min-w-0"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-red-500 group-hover:border-red-500 transition-colors shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase block">Email Address</span>
              <span className="text-xs text-gray-200 group-hover:text-white transition-colors truncate block">raybanpranav@gmail.com</span>
            </div>
          </a>

          <a 
            href="tel:+919854587777"
            className="flex items-center gap-3 sm:gap-4 p-3 bg-[#0a0a0a] border border-white/5 hover:border-red-600/40 active:scale-[0.98] rounded-sm transition-all duration-200 group min-w-0"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-red-500 group-hover:border-red-500 transition-colors shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase block">Phone / Mobile</span>
              <span className="text-xs text-gray-200 group-hover:text-white transition-colors truncate block">+91 9854587777</span>
            </div>
          </a>

          <a 
            href="https://www.raybanpranav.tech/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 sm:gap-4 p-3 bg-[#0a0a0a] border border-white/5 hover:border-red-600/40 active:scale-[0.98] rounded-sm transition-all duration-200 group min-w-0"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-red-500 group-hover:border-red-500 transition-colors shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase block">Official Domain</span>
              <span className="text-xs text-gray-200 group-hover:text-white transition-colors truncate block">raybanpranav.tech</span>
            </div>
          </a>

          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-[#0a0a0a] border border-white/5 rounded-sm min-w-0">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-red-500 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-500 uppercase block">Primary Locations</span>
              <span className="text-xs text-gray-200 truncate block">Vellore &amp; Bangalore, India</span>
            </div>
          </div>
        </div>

        {/* Col 3: Research Profiles Banner */}
        <div className="relative bg-[#0a0a0a] rounded-sm overflow-hidden flex flex-col justify-between p-6 sm:p-8 border border-white/10 h-auto">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">RESEARCH_IDENTITY</span>
            </div>

            <h3 className="font-bebas text-3xl sm:text-4xl tracking-wider leading-none text-white mb-4">
              RAYBAN PRANAV MAHESH
            </h3>

            <p className="text-xs font-mono text-gray-400 mb-6 leading-relaxed">
              B.Tech CSE (Software Systems) · VIT '27<br/>
              Samsung PRISM Research Intern<br/>
              IEEE Access Peer Reviewer · 13 Patents
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
            <a 
              href="https://github.com/pranavsoftware" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-[#141414] hover:bg-red-950/40 active:scale-95 border border-white/5 hover:border-red-600/40 rounded text-gray-300 hover:text-white flex flex-col items-center gap-1 transition-all duration-200"
            >
              <Github className="w-4 h-4 text-red-500" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com/in/pranav-rayban-vit2027" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-[#141414] hover:bg-red-950/40 active:scale-95 border border-white/5 hover:border-red-600/40 rounded text-gray-300 hover:text-white flex flex-col items-center gap-1 transition-all duration-200"
            >
              <Linkedin className="w-4 h-4 text-red-500" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://orcid.org/0009-0005-6897-6725" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 bg-[#141414] hover:bg-red-950/40 active:scale-95 border border-white/5 hover:border-red-600/40 rounded text-gray-300 hover:text-white flex flex-col items-center gap-1 transition-all duration-200"
            >
              <Award className="w-4 h-4 text-red-500" />
              <span>ORCID</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-500 gap-4 text-center sm:text-left">
        <p>© 2026 Rayban Pranav Mahesh. All rights reserved.</p>
        <p className="text-gray-400">
          Built with React 19, TypeScript &amp; Tailwind CSS v4
        </p>
      </div>
    </footer>
  );
}
