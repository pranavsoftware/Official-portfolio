import { Github, Linkedin, Award } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3.5 text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-4 md:mb-5 pb-3 border-b border-white/10">
      <div className="flex flex-col">
        <p className="text-white font-bold tracking-widest text-xs">RAYBAN PRANAV MAHESH</p>
        <p className="text-red-500 font-medium text-[10px] tracking-wider">SOFTWARE DEVELOPER · AI/ML ENGINEER · DEEP LEARNING &amp; MLOPS</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-[10px] text-gray-400">
        <a href="#experience" className="hover:text-white transition-colors py-0.5">Experience</a>
        <a href="#publications" className="hover:text-white transition-colors py-0.5">Publications</a>
        <a href="#patents" className="hover:text-white transition-colors py-0.5">Patents (13)</a>
        <a href="#projects" className="hover:text-white transition-colors py-0.5">Projects</a>
        <a href="#skills" className="hover:text-white transition-colors py-0.5">Skills</a>
        <a href="#education" className="hover:text-white transition-colors py-0.5">Education &amp; Certs</a>
      </nav>

      {/* Socials & Status */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <a 
          href="https://github.com/pranavsoftware" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
          title="GitHub"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <a 
          href="https://linkedin.com/in/pranav-rayban-vit2027" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white transition-colors flex items-center gap-1.5 py-1"
          title="LinkedIn"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        <a 
          href="https://orcid.org/0009-0005-6897-6725" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white transition-colors flex items-center gap-1.5 text-red-400 py-1"
          title="ORCID"
        >
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ORCID</span>
        </a>
        <a 
          href="#contact" 
          className="flex items-center gap-1 text-red-500 hover:text-white transition-colors ml-1 sm:ml-2 font-bold py-1"
        >
          <span>Get in Touch</span>
          <span className="text-red-600 text-base leading-none mt-[-2px]">+</span>
        </a>
      </div>
    </header>
  );
}
