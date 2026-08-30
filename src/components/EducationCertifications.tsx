import { GraduationCap, Award, Users, MapPin } from 'lucide-react';

const certifications = [
  {
    title: 'Oracle Cloud Infrastructure 2025 AI Foundations Associate',
    issuer: 'Oracle',
    date: 'Aug 2025',
    category: 'Cloud AI'
  },
  {
    title: 'Docker Foundations Professional Certificate',
    issuer: 'Docker, Inc.',
    date: 'Jun 2025',
    category: 'Containers & DevOps'
  },
  {
    title: 'Career Essentials in GitHub Professional Certificate',
    issuer: 'GitHub',
    date: 'Jun 2025',
    category: 'CI/CD & Version Control'
  },
  {
    title: 'Enterprise Architecture in Practice',
    issuer: 'PMI (Project Management Institute)',
    date: 'Jun 2025',
    category: 'Architecture'
  },
  {
    title: 'Programming with Python Professional Certificate',
    issuer: 'OpenEDG Python Institute',
    date: 'Dec 2023',
    category: 'Programming'
  },
  {
    title: 'Cisco Network Security: Core Security Concepts',
    issuer: 'Cisco',
    date: 'Dec 2023',
    category: 'Cybersecurity'
  }
];

export default function EducationCertifications() {
  return (
    <section id="education" className="mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Academic Credentials &amp; Industry Honors</span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">Education, Certifications &amp; Leadership</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span>VIT · Oracle · Docker · GitHub · Cisco</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Col 1: Education (VIT) */}
        <div className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/40 p-6 sm:p-8 rounded-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">Higher Education</h3>
                <p className="text-[10px] font-mono text-red-500">Undergraduate Degree</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/30 border border-red-800/40 text-red-400 rounded">
                  Aug 2023 – Jul 2027
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-3 leading-snug">
                  B.Tech in Computer Science and Engineering
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1">Department: Software Systems</p>
              </div>

              <div className="p-3 sm:p-4 bg-[#050505] border border-white/5 rounded-sm space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Vellore Institute of Technology (VIT)
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Vellore, Tamil Nadu, India</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-gray-400 font-mono pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  <span>Focus: AI/ML, Deep Learning &amp; MLOps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  <span>Expected Graduation: July 2027</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  <span>Active Research &amp; Patent Portfolio</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 flex justify-between items-center">
            <span>Status: Final Year Scholar</span>
            <span className="text-green-400 font-bold">ENROLLED</span>
          </div>
        </div>

        {/* Col 2: Professional Certifications (6 items) */}
        <div className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/40 p-6 sm:p-8 rounded-sm transition-all">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">Certifications</h3>
              <p className="text-[10px] font-mono text-red-500">6 Industry Credentials</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {certifications.map((cert) => (
              <div 
                key={cert.title}
                className="p-3 bg-[#050505] border border-white/5 rounded-sm hover:border-red-600/30 transition-colors"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {cert.title}
                  </h4>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-1">
                  <span className="text-red-400 font-medium">{cert.issuer}</span>
                  <span className="text-gray-500">{cert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Leadership & Impact */}
        <div className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/40 p-6 sm:p-8 rounded-sm transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">Leadership &amp; Impact</h3>
                <p className="text-[10px] font-mono text-red-500">Mentorship &amp; Community</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-[#050505] border border-white/5 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bebas text-3xl leading-none">80+</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Bootcamp Mentorship</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Machine Learning Bootcamp Lead
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Mentored <strong>80+ participants</strong> through rigorous machine learning workshops, directly contributing to an average <strong>12% boost in model validation accuracy</strong>.
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-[#050505] border border-white/5 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bebas text-3xl leading-none">5+</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Hackathons Organized</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Technical Head — AI &amp; Robotics
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Spearheaded technical development and hackathons under <strong>IEEE-RAS</strong> (Robotics and Automation Society) and the <strong>Standards Club</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>IEEE-RAS &amp; Standards Club</span>
            <span className="text-red-500 font-bold">COMMUNITY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
