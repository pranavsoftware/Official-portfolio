import { Building2, BookOpenCheck, CheckCircle2, Calendar, Hash, ExternalLink } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <section id="experience" className="mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Industry &amp; Academic Track</span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">Research &amp; Professional Experience</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span>R&amp;D &amp; Review Work</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Card 1: Samsung PRISM */}
        <div className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/40 p-6 sm:p-8 rounded-sm transition-all relative flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/10 blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase text-white">Samsung R&amp;D Institute India</h3>
                  <p className="text-xs text-red-500 font-mono font-medium">Samsung PRISM Research Intern</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-[#111] border border-white/10 text-gray-300 rounded self-start sm:self-auto shrink-0">
                Bangalore, India
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-gray-400 mb-6 pb-4 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                Jul 2025 – Feb 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ID: <code className="text-white">25LAI22VIT51560</code>
              </span>
            </div>

            <ul className="space-y-3 text-xs text-gray-400 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Conducted confidential AI/ML research through the Samsung PRISM program, implementing novel deep learning model architectures and optimization techniques in an industry-grade R&amp;D environment.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Engineered robust machine learning workflows and production-oriented pipelines with rigorous emphasis on reproducibility, model versioning, and research documentation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Collaborated with senior industry researchers to evaluate state-of-the-art computational paradigms for high-efficiency on-device neural deployment.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-500">
            <span>Domain: Industry AI/ML R&amp;D</span>
            <span className="text-red-500 font-bold">COMPLETED</span>
          </div>
        </div>

        {/* Card 2: IEEE Access Peer Reviewer */}
        <div className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/40 p-6 sm:p-8 rounded-sm transition-all relative flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/10 blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base tracking-wide uppercase text-white">IEEE Access</h3>
                  <p className="text-xs text-red-500 font-mono font-medium">Peer Reviewer (IEEE Open Access Journal)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-[#111] border border-white/10 text-green-400 rounded self-start sm:self-auto shrink-0">
                Active Reviewer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-gray-400 mb-6 pb-4 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                Jul 2026 – Present
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ISSN: <code className="text-white">2169-3536</code>
              </span>
            </div>

            <ul className="space-y-3 text-xs text-gray-400 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Invited peer reviewer for <em>IEEE Access</em>, evaluating high-impact scientific manuscripts on neural architectures, computer vision, and machine intelligence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Successfully completed <strong>3 formal peer reviews</strong> in 2026, delivering constructive critiques on methodology, novelty, mathematical rigor, and benchmark validity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Reviewer credentials recognized and tracked in the global Web of Science / Clarivate researcher database.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono">
            <a 
              href="https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>IEEE Access Journal Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-red-500 font-bold">3 COMPLETED REVIEWS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
