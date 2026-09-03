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
    description: 'Developed a 5-layer Zero-Trust AI framework for telecom conference number spoofing detection, integrating authentication, behavioral analytics, network forensics, NLP, and voice intelligence.',
    features: [
      'Engineered an ensemble ML architecture (Isolation Forest, Random Forest, TF-IDF + Logistic Regression, Gradient Boosting) with SHAP-based explainability.',
      'Achieved 90.05% accuracy and 0.7243 ROC-AUC on 49,999 CDRs under an 80/20 stratified train-test split for binary classification on imbalanced spoofed vs. legitimate call records.',
      'Implemented automated incident response (Allow / Warn / Quarantine / Block) with immutable SHA-256 audit logs for security governance.'
    ],
    techStack: ['Python', 'Isolation Forest', 'Random Forest', 'Gradient Boosting', 'SHAP', 'TF-IDF + Logistic Regression', 'Zero-Trust', 'SHA-256'],
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
      { label: 'Food Database', val: '200+ Foods' },
      { label: 'Metabolic Model', val: 'Mifflin-St Jeor' },
      { label: 'AI Vision Engine', val: 'Gemini 3.6 Flash' },
      { label: 'Cloud DB', val: 'Turso libSQL' }
    ],
    description: 'An evidence-based nutritional intelligence platform combining clinical dietetics with multimodal AI vision recognition, automated 7-day meal planning, and Turso cloud database persistence.',
    features: [
      'Dual-engine AI vision & UPC barcode scanner powered by Google Gemini and Open Food Facts with automatic macro extraction.',
      'Personalized metabolic calibration computing individualized BMR, TDEE, and daily macro targets with weight tracking.',
      'Interactive Recharts analytics, real-time context-aware AI nutritionist chat, and Nodemailer OTP email verification.'
    ],
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Turso libSQL', 'Google Gemini AI'],
    github: 'https://github.com/pranavsoftware/NutriCraft',
    liveUrl: 'https://nutricraft.raybanpranav.tech/',
    icon: Activity,
    accent: 'text-emerald-500 border-emerald-900/50 bg-emerald-950/20'
  },
  {
    id: '03',
    title: 'CryptoVideoAuthenticityNet',
    subtitle: 'AI-POWERED VIDEO TAMPER DETECTION & FORENSICS',
    date: 'May 2024 – Jul 2024',
    metrics: [
      { label: 'Benchmark Acc.', val: '99.56%' },
      { label: 'Parameters', val: '52K+' },
      { label: 'Benchmark', val: 'FaceForensics++' },
      { label: 'Manipulations', val: '4 Methods' }
    ],
    description: 'Developed a multimodal video forensic framework integrating cryptographic verification, FFT frequency analysis, PRNU sensor fingerprinting, and C2PA-inspired provenance validation.',
    features: [
      'Designed a lightweight AuthenticityNet neural classifier (52K+ parameters) achieving 99.56% accuracy on FaceForensics++ benchmark (80/10/10 train/val/test split).',
      'Binary authentic vs. tampered classification across 4 manipulation methods.',
      'Built automated chain-of-custody reporting with trust scores, per-frame localization heatmaps, and cryptographic audit trails for explainable digital investigations.'
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
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">
            Applied Deep Learning &amp; Zero-Trust Systems
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">
            Selected Engineering Projects
          </h2>
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
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
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
