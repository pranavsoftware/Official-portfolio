import { Github, ExternalLink, ShieldCheck, Activity, Eye, ArrowUpRight } from 'lucide-react';

interface ProjectMetric {
  label: string;
  val: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  metrics: ProjectMetric[];
  description: string;
  features: string[];
  techStack: string[];
  github: string;
  liveUrl?: string;
  icon: any;
  accent: string;
}

const projects: Project[] = [
  {
    id: '01',
    title: 'Number Spoofing Detection',
    subtitle: '5-LAYER ZERO-TRUST AI & FORENSICS FRAMEWORK',
    date: 'Jan 2025 – Mar 2025',
    metrics: [
      { label: 'Dataset', val: '49,999 CDRs' },
      { label: 'Accuracy', val: '90.05%' },
      { label: 'ROC-AUC', val: '0.7243' },
      { label: 'Protocol', val: 'Zero-Trust' }
    ],
    description: 'A 5-layer Zero-Trust AI framework for telecom conference number spoofing detection, integrating cryptographic authentication, behavioral analytics, network forensics, NLP, and voice intelligence.',
    features: [
      'Ensemble ML architecture: Isolation Forest, Random Forest, TF-IDF + Logistic Regression, and Gradient Boosting.',
      'SHAP-based explainable AI providing granular feature attribution for each flagged call.',
      'Automated incident response pipeline triggering Allow / Warn / Quarantine / Block protocols.',
      'Tamper-proof immutable SHA-256 cryptographic audit logs for enterprise security compliance.'
    ],
    techStack: ['Python', 'Isolation Forest', 'Random Forest', 'Gradient Boosting', 'SHAP', 'TF-IDF', 'Zero-Trust', 'SHA-256'],
    github: 'https://github.com/pranavsoftware',
    icon: ShieldCheck,
    accent: 'text-red-500 border-red-900/50 bg-red-950/20'
  },
  {
    id: '02',
    title: 'NutriCraft',
    subtitle: 'AI PRECISION NUTRITION & CLINICAL METABOLIC PLATFORM',
    date: 'Jan 2025 – Present',
    metrics: [
      { label: 'Dataset', val: '200+ Foods' },
      { label: 'TDEE Precision', val: 'Mifflin-St Jeor' },
      { label: 'AI Scanner', val: 'Gemini 3.6 Flash' },
      { label: 'Database', val: 'Turso libSQL' }
    ],
    description: 'An evidence-based, fullstack nutritional intelligence platform combining clinical dietetics with multimodal AI food vision recognition, automated 7-day meal planning, and Turso cloud database persistence.',
    features: [
      'Dual-engine AI vision & UPC barcode scanner powered by Google Gemini 3.6 Flash and Open Food Facts with automatic macro extraction.',
      'Personalized Mifflin-St Jeor metabolic calibration computing individualized BMR, TDEE, and daily macro targets with weight tracking.',
      '7-Day AI meal planner auto-generating structured dietary regimens with synchronized categorized grocery checklists.',
      'Interactive Recharts analytics, real-time context-aware AI nutritionist chat, and Nodemailer OTP email verification auth pipeline.'
    ],
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Turso libSQL', 'Google Gemini AI', 'Recharts'],
    github: 'https://github.com/pranavsoftware/NutriCraft',
    liveUrl: 'https://nutricraft.raybanpranav.tech/',
    icon: Activity,
    accent: 'text-emerald-500 border-emerald-900/50 bg-emerald-950/20'
  },
  {
    id: '03',
    title: 'CryptoVideoAuthenticityNet',
    subtitle: 'AI VIDEO TAMPER DETECTION & PROVENANCE VERIFICATION',
    date: 'May 2024 – Jul 2024',
    metrics: [
      { label: 'Benchmark Acc.', val: '99.56%' },
      { label: 'Parameters', val: '52K+' },
      { label: 'Benchmark', val: 'FaceForensics++' },
      { label: 'Methods', val: '4 Manipulation Types' }
    ],
    description: 'A multimodal video forensic framework combining cryptographic provenance, FFT frequency analysis, PRNU sensor fingerprinting, and C2PA-inspired validation.',
    features: [
      'Engineered ultra-lightweight neural classifier AuthenticityNet requiring only 52K+ parameters for real-time inference.',
      'Achieved 99.56% state-of-the-art forensic accuracy on FaceForensics++ benchmark under 80/10/10 split.',
      'Detects deepfake face swaps, expression reenactments, and frame-level splices across 4 manipulation types.',
      'Automated chain-of-custody generation with trust scoring, per-frame spatial heatmaps, and cryptographic audit trails.'
    ],
    techStack: ['TensorFlow', 'OpenCV', 'FFT Frequency Analysis', 'PRNU Fingerprinting', 'C2PA Provenance', 'Deep Learning'],
    github: 'https://github.com/pranavsoftware',
    icon: Eye,
    accent: 'text-red-400 border-red-900/50 bg-red-950/20'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Applied Deep Learning &amp; Systems</span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">Selected Engineering Projects</h2>
        </div>
        <a 
          href="https://github.com/pranavsoftware" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4 text-red-500" />
          <span>github.com/pranavsoftware</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 rounded-sm p-5 sm:p-8 md:p-10 transition-all relative group"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/5">
              <div className="flex items-start gap-4">
                <span className="font-bebas text-4xl sm:text-5xl text-red-600 leading-none shrink-0 group-hover:text-red-500 transition-colors">
                  {project.id}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    {project.subtitle} · <span className="text-gray-500">{project.date}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase rounded flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-[#141414] hover:bg-red-700 text-gray-300 hover:text-white border border-white/10 hover:border-red-600 text-xs font-mono font-bold uppercase rounded flex items-center justify-center gap-2 transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 font-mono">
              {project.metrics.map((m) => (
                <div key={m.label} className="p-3 bg-[#050505] border border-white/5 rounded-sm">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">{m.label}</span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Description & Feature list */}
            <div className="space-y-4 mb-6">
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed bg-[#070707] p-3 rounded border border-white/5">
                    <span className="text-red-500 font-mono font-bold text-xs mt-0.5 shrink-0">▶</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mr-1 sm:mr-2">Tech Stack:</span>
              {project.techStack.map((tech) => (
                <span key={tech} className="px-2.5 py-1 bg-[#141414] border border-white/10 text-[10px] font-mono text-gray-300 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
