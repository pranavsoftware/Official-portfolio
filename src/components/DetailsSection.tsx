import { Search, Lightbulb, PenTool, Code2, Send } from 'lucide-react';

const skills = [
  "WEB DESIGN", "UI/UX DESIGN", "FIGMA", "FRAMER", 
  "ADOBE XD", "PHOTOSHOP", "WEBFLOW", "HTML / CSS", 
  "JAVASCRIPT", "GSAP ANIMATION", "SEO BASICS"
];

const processes = [
  { id: '01', icon: Search, title: 'DISCOVER', desc: 'Understanding goals, audience, and project requirements.' },
  { id: '02', icon: Lightbulb, title: 'IDEATE', desc: 'Planning, wireframing, and creating the right concept.' },
  { id: '03', icon: PenTool, title: 'DESIGN', desc: 'Crafting visual design with a focus on user experience.' },
  { id: '04', icon: Code2, title: 'DEVELOP', desc: 'Building fast, responsive, and high-performing websites.' },
  { id: '05', icon: Send, title: 'DELIVER', desc: 'Testing, optimizing, and launching with perfection.' },
];

export default function DetailsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
      {/* Col 1: Education & Skills */}
      <div className="py-12 pr-12 border-b md:border-b-0 md:border-r border-white/10">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-12">Education & Skills</h2>
        
        <div className="mb-14">
          <h3 className="text-red-600 text-xs font-bold tracking-widest uppercase mb-6">Education</h3>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="font-bold text-sm mb-1">B.Sc. in Visual Communication Design</h4>
              <p className="text-xs text-gray-400">Binus University</p>
            </div>
            <span className="text-red-600 text-xs whitespace-nowrap">2018 - 2022</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="font-bold text-sm mb-1">UI/UX Design Certification</h4>
              <p className="text-xs text-gray-400">Google Career Certificates</p>
            </div>
            <span className="text-red-600 text-xs whitespace-nowrap">2023</span>
          </div>
        </div>

        <div>
          <h3 className="text-red-600 text-xs font-bold tracking-widest uppercase mb-6">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 border border-white/10 text-[9px] text-gray-400 tracking-[0.15em] uppercase rounded-sm hover:border-red-500/50 hover:text-white transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Col 2: Work Process */}
      <div className="py-12 md:px-12 border-b md:border-b-0 md:border-r border-white/10 relative">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-12">Work Process</h2>
        
        <div className="space-y-6 relative">
          {/* Vertical dashed line connecting icons */}
          <div className="absolute left-[54px] top-4 bottom-8 w-px border-l border-dashed border-white/20 z-0 hidden sm:block"></div>
          
          {processes.map((process) => (
            <div key={process.id} className="flex gap-4 items-start relative bg-[#050505]">
              <span className="font-bebas text-2xl text-red-600 w-6 pt-1">{process.id}</span>
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-[#050505] z-10 mt-1">
                <process.icon className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="pt-1 pb-4">
                <h4 className="text-xs font-bold tracking-widest text-red-600 uppercase mb-2">{process.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">{process.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Red Quote Block */}
      <div className="bg-[#A30000] p-12 flex flex-col justify-between">
        <div>
          <span className="font-bebas text-7xl text-[#600000] leading-none opacity-50 block mb-4">“</span>
          <p className="text-2xl font-medium leading-snug mb-8 tracking-wide">
            Good design is not just how it looks, but how it works.
          </p>
          <p className="font-signature text-4xl transform -rotate-2">Rayhan</p>
        </div>
        
        <div className="mt-24 border-t border-white/20 pt-6 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-widest font-bold max-w-[150px] leading-relaxed">
            Let's create something great together.
          </p>
          <span className="text-white text-2xl font-light">+</span>
        </div>
      </div>
    </section>
  );
}
