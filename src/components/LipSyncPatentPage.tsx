import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, ShieldAlert, 
  ShieldCheck, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ScanFace, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LipSyncPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function LipSyncPatentPage({ onBack }: LipSyncPatentPageProps) {
  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const correlationSliderId = useId();
  const pixelDiffSliderId = useId();
  const edgeDensitySliderId = useId();
  const spectralDiscontinuitySliderId = useId();
  const cnnFeatureSliderId = useId();

  // Preset scenarios
  type PresetKey = 'authentic' | 'wav2lip_deepfake' | 'temporal_desync' | 'cross_speaker_swap' | 'silent_cctv';

  const [activePreset, setActivePreset] = useState<PresetKey>('authentic');
  const [simCorrelation, setSimCorrelation] = useState<number>(0.96);
  const [simPixelDiff, setSimPixelDiff] = useState<number>(6.5);
  const [simEdgeDensity, setSimEdgeDensity] = useState<number>(1.4);
  const [simSpectralDiscontinuity, setSimSpectralDiscontinuity] = useState<number>(0.12);
  const [simCnnFeatureScore, setSimCnnFeatureScore] = useState<number>(0.88);

  const presets: Record<PresetKey, {
    name: string;
    description: string;
    correlation: number;
    pixelDiff: number;
    edgeDensity: number;
    spectralDiscontinuity: number;
    cnnScore: number;
  }> = {
    authentic: {
      name: 'Authentic Natural Speech (GRID Dataset)',
      description: 'Consecutive synchronized frames from same speaker. Smooth micro-motion continuity and uniform central 2D FFT energy.',
      correlation: 0.97,
      pixelDiff: 5.8,
      edgeDensity: 1.2,
      spectralDiscontinuity: 0.08,
      cnnScore: 0.92,
    },
    wav2lip_deepfake: {
      name: 'Wav2Lip / SadTalker AI Generative Deepfake',
      description: 'Synthetic lip re-targeting. High-frequency boundary blending artifacts, elevated edge density, and spectral Fourier anomalies.',
      correlation: 0.84,
      pixelDiff: 28.5,
      edgeDensity: 4.6,
      spectralDiscontinuity: 0.78,
      cnnScore: 0.22,
    },
    temporal_desync: {
      name: 'Same Speaker with Temporal Desync (+150ms Lag)',
      description: 'Identical facial identity, but frames taken from disconnected timestamps. Abrupt micro-expression mismatch triggers forensic detection.',
      correlation: 0.86,
      pixelDiff: 22.0,
      edgeDensity: 2.8,
      spectralDiscontinuity: 0.45,
      cnnScore: 0.35,
    },
    cross_speaker_swap: {
      name: 'Cross-Speaker Face / Lip Swapping',
      description: 'Frames sourced from different speakers. Severe pixel-intensity disparity, sharp boundary inconsistencies, and high CNN classification anomaly.',
      correlation: 0.79,
      pixelDiff: 36.0,
      edgeDensity: 4.9,
      spectralDiscontinuity: 0.86,
      cnnScore: 0.14,
    },
    silent_cctv: {
      name: 'Silent Video Forensic Audit (No Audio Track)',
      description: 'Evaluating muted CCTV footage using purely visual forensics: temporal micro-motion continuity, Sobel edge coherence, and 2D FFT patterns.',
      correlation: 0.93,
      pixelDiff: 8.2,
      edgeDensity: 1.8,
      spectralDiscontinuity: 0.18,
      cnnScore: 0.85,
    },
  };

  const handleApplyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimCorrelation(p.correlation);
    setSimPixelDiff(p.pixelDiff);
    setSimEdgeDensity(p.edgeDensity);
    setSimSpectralDiscontinuity(p.spectralDiscontinuity);
    setSimCnnFeatureScore(p.cnnScore);
  };

  // LASCI Formula Computation
  // Normalizing to 0 - 100 range
  const normCorrelation = Math.max(0, Math.min(1, simCorrelation));
  const normPixelScore = Math.max(0, Math.min(1, 1 - simPixelDiff / 45));
  const normEdgeScore = Math.max(0, Math.min(1, 1 - simEdgeDensity / 5.5));
  const normSpectralScore = Math.max(0, Math.min(1, 1 - simSpectralDiscontinuity));
  const normCnnScore = Math.max(0, Math.min(1, simCnnFeatureScore));

  // Weights w1=0.25, w2=0.20, w3=0.25, w4=0.15, w5=0.15 (Sum = 1.0)
  const lasciScoreRaw = (
    0.25 * normCorrelation +
    0.20 * normPixelScore +
    0.25 * normCnnScore +
    0.15 * normSpectralScore +
    0.15 * normEdgeScore
  );
  const lasciScore = Math.round(lasciScoreRaw * 1000) / 10; // e.g. 84.5 / 100

  // Determine classification verdict & severity
  let verdict: {
    label: 'REAL_SYNC' | 'SUSPECTED_DESYNC' | 'FAKE_DESYNC';
    color: string;
    bg: string;
    border: string;
    severity: 'LOW (Authentic)' | 'MEDIUM (Drift / Jitter)' | 'HIGH (Manipulated Deepfake)';
    description: string;
    icon: React.ReactNode;
  };

  if (lasciScore >= 75.0) {
    verdict = {
      label: 'REAL_SYNC',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-600/50',
      severity: 'LOW (Authentic)',
      description: 'Natural temporal lip-motion continuity verified. Uniform central 2D FFT magnitude spectrum and high correlation confirm authentic synchronized speech.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    };
  } else if (lasciScore >= 52.0) {
    verdict = {
      label: 'SUSPECTED_DESYNC',
      color: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-600/50',
      severity: 'MEDIUM (Drift / Jitter)',
      description: 'Moderate micro-expression latency or packet-loss jitter detected. Lip motion deviates from expected temporal continuity; requires frame-level audit.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
    };
  } else {
    verdict = {
      label: 'FAKE_DESYNC',
      color: 'text-red-500',
      bg: 'bg-red-950/40',
      border: 'border-red-600/60',
      severity: 'HIGH (Manipulated Deepfake)',
      description: 'Severe forensic mismatch detected. Discontinuous pixel transitions, high edge-density boundary artifacts, or synthetic 2D FFT spectral noise confirmed.',
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />
    };
  }

  const bibtexCitation = `@patent{mahesh2026lipsyncforensics,
  title={System for Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep-Learning Based Feature Fusion},
  author={Dr. Jaishree Jaikrishnan and Rayban Pranav Mahesh and Aarya Ashish Nagvekar and Ajitesh Sharma},
  year={2026},
  month={January},
  number={202541131828},
  type={Patent},
  nationality={Indian},
  assignee={Vellore Institute of Technology},
  note={Published in Official Indian Patent Office Gazette Journal No. 01/2026 on 02 January 2026}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'prior-art', label: 'Prior Art' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'spatial-pipeline', label: 'Spatial Forensics' },
    { id: 'spectral-pipeline', label: 'Spectral FFT' },
    { id: 'attention-cnn', label: 'Attention CNN' },
    { id: 'lasci-engine', label: 'LASCI Index' },
    { id: 'simulator', label: 'Forensic Lab' },
    { id: 'empirical-results', label: 'GRID Results' },
    { id: 'claims', label: '10 Claims' },
    { id: 'citations', label: 'Citation' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-900 selection:text-white pb-24 font-inter antialiased">
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c0c0c] border border-white/20 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#101010]">
                <div className="flex items-center gap-2">
                  {activeImage.badge && (
                    <span className="px-2 py-0.5 bg-red-950/40 border border-red-800/50 text-red-400 font-mono text-[10px] rounded font-bold uppercase">
                      {activeImage.badge}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-white tracking-wide">{activeImage.title}</h4>
                </div>
                <button 
                  onClick={() => setActiveImage(null)}
                  className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-[#070707]">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title} 
                  className="max-h-[65vh] w-auto object-contain rounded border border-white/5 shadow-lg"
                />
              </div>
              <div className="p-4 bg-[#0a0a0a] border-t border-white/10 text-xs font-mono text-gray-300 leading-relaxed">
                <span className="text-red-400 font-bold mr-1.5">FORENSIC SPECIFICATION:</span>
                {activeImage.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-sm bg-[#121212] hover:bg-red-950/40 border border-white/10 hover:border-red-600/50 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-red-400" />
              <span>Back to Portfolio</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>/</span>
              <span>PATENT DOSSIER</span>
              <span>/</span>
              <span className="text-red-400 font-bold">202541131828</span>
            </div>
          </div>

          {/* Action Buttons: Open Official Document in New Tab */}
          <div className="flex items-center gap-2">
            <a 
              href="/patent-assets/lip-sync-detection/Official_Gazette_Patent_202541131828.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/70 hover:bg-red-900 border border-red-600/80 hover:border-red-400 text-white text-xs font-mono font-bold rounded-sm shadow-md transition-all cursor-pointer"
              title="Open Official Patent Publication Issued by Indian Patent Office"
            >
              <Award className="w-3.5 h-3.5 text-red-300" />
              <span className="hidden sm:inline">Official PDF</span>
              <span className="sm:hidden">Official PDF</span>
              <ExternalLink className="w-3 h-3 text-red-300" />
            </a>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="w-full lg:w-auto flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-mono text-gray-400 border-t lg:border-t-0 border-white/5 mt-1 lg:mt-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="whitespace-nowrap px-2 py-1 rounded hover:text-white hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">

        {/* HERO DOSSIER BANNER */}
        <section id="overview" className="scroll-mt-24 relative p-6 sm:p-10 bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-indigo-950/20 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-red-950/40 border border-red-800/50 text-red-300 font-mono text-[11px] rounded font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-400" />
                Official Indian Patent Application
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                App No: <strong className="text-white font-mono">202541131828</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                Pub No: <strong className="text-gray-200">IN202541131828 A</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                Journal No: <strong className="text-gray-200">01/2026</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-950/30 border border-emerald-600/30 text-emerald-400 font-mono text-[11px] rounded font-semibold">
                TRL 4 (Lab Validated)
              </span>
            </div>

            {/* Patent Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight leading-snug sm:leading-tight mb-4 max-w-5xl">
              System for Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep-Learning Based Feature Fusion
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-inter max-w-4xl leading-relaxed mb-8">
              A forensic-grade multimedia verification architecture that detects manipulated, generated, and desynchronized lip movements in digital video. Operates across a <strong className="text-white">Dual-Path Feature Pipeline</strong>—combining <strong className="text-white">2D Fast Fourier Transform (FFT) spectral analysis</strong>, <strong className="text-white">inter-frame spatial correlation &amp; pixel difference</strong>, and an <strong className="text-white">Attention-Guided 5-Block Convolutional Neural Network</strong>. Fuses analytical modalities into a unified <span className="text-red-400 font-mono font-bold">Lip-Audio Synchronization Consistency Index (LASCI)</span> with forensic explainability, functioning even in <strong className="text-white">silent-video conditions</strong>.
            </p>

            {/* Patent Specification & Inventors Dossier */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 font-mono text-xs">
              
              {/* Inventors Breakdown Card (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    Inventors &amp; Authors (Official IPO Authorship)
                  </span>
                  <span className="text-[9px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 font-bold">
                    4 Official Inventors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#141414] border border-white/5 rounded">
                    <span className="text-gray-500 text-[9px] block uppercase">Inventor 01 (Lead / Faculty)</span>
                    <strong className="text-white text-xs block mt-0.5">Dr. Jaishree Jaikrishnan</strong>
                    <span className="text-gray-400 text-[10px]">Vellore Institute of Technology</span>
                  </div>

                  <div className="p-3 bg-red-950/30 border border-red-700/50 rounded">
                    <span className="text-red-400 text-[9px] block uppercase font-bold">Inventor 02 (Primary Inventor)</span>
                    <strong className="text-red-200 text-xs block mt-0.5">Rayban Pranav Mahesh</strong>
                    <span className="text-red-300 text-[10px]">AI/ML &amp; Deepfake Forensics Researcher</span>
                  </div>

                  <div className="p-3 bg-[#141414] border border-white/5 rounded">
                    <span className="text-gray-500 text-[9px] block uppercase">Inventor 03 (Co-Inventor)</span>
                    <strong className="text-white text-xs block mt-0.5">Aarya Ashish Nagvekar</strong>
                    <span className="text-gray-400 text-[10px]">Vellore Institute of Technology</span>
                  </div>

                  <div className="p-3 bg-[#141414] border border-white/5 rounded">
                    <span className="text-gray-500 text-[9px] block uppercase">Inventor 04 (Co-Inventor)</span>
                    <strong className="text-white text-xs block mt-0.5">Ajitesh Sharma</strong>
                    <span className="text-gray-400 text-[10px]">Vellore Institute of Technology</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-gray-400 text-[11px] border-t border-white/5">
                  <Building className="w-3.5 h-3.5 text-gray-500" />
                  <span>Applicant / Assignee: <strong className="text-gray-200">Vellore Institute of Technology (VIT), Tamil Nadu, India</strong></span>
                </div>
              </div>

              {/* Bibliographic Card (5 Cols) */}
              <div className="lg:col-span-5 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold border-b border-white/5 pb-2.5 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    Gazette Bibliographic Details
                  </span>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-500">Date of Filing:</span>
                      <strong className="text-white">25 December 2025</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-500">Date of Publication:</span>
                      <strong className="text-red-400">02 January 2026</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-500">Patent Office:</span>
                      <strong className="text-gray-300">IPO Chennai, Govt. of India</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-gray-500">International Class (IPC):</span>
                      <strong className="text-gray-300">G06V 40/40, G06V 10/62, 10/82</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Benchmark Dataset:</span>
                      <strong className="text-emerald-400">GRID Lip-Reading (34 Speakers)</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBibtex}
                  className="w-full py-2 px-3 bg-[#161616] hover:bg-red-950/40 border border-white/10 hover:border-red-600/50 text-gray-300 hover:text-white rounded text-[11px] font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
                  <span>{copiedBibtex ? 'BibTeX Citation Copied!' : 'Copy Official BibTeX Reference'}</span>
                </button>
              </div>

            </div>

            {/* Quick Feature Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 font-mono text-[11px]">
              <div className="p-3 bg-[#111] border border-white/5 rounded flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">2D FFT Spectral</span>
                  <span className="text-gray-400 text-[10px]">Frequency artifact maps</span>
                </div>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded flex items-center gap-2.5">
                <ScanFace className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Attention CNN</span>
                  <span className="text-gray-400 text-[10px]">Lip micro-motion focus</span>
                </div>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">LASCI Fusion Index</span>
                  <span className="text-gray-400 text-[10px]">Weighted multi-modal score</span>
                </div>
              </div>
              <div className="p-3 bg-[#111] border border-white/5 rounded flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">Silent-Video Mode</span>
                  <span className="text-gray-400 text-[10px]">Zero audio track required</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: PRIOR ART & RESEARCH GAP */}
        <section id="prior-art" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">State of the Art &amp; Existing Systems</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Prior Art Comparison &amp; Critical Research Gaps
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 rounded-sm space-y-4">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-mono">
              Conventional audio-visual systems predominantly focus on <span className="text-white font-semibold">broadcast delay correction</span>, <span className="text-white font-semibold">hardware latency measurement</span>, or <span className="text-white font-semibold">generative lip-sync animation</span> (such as Wav2Lip or Disney animated avatars). None of these prior architectures provide a <strong className="text-red-400">forensic-grade verification system</strong> capable of detecting frame-level manipulation, synthetic blending, or desynchronized speech clips in real human video without ground truth.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/10 bg-[#121212] text-gray-400 text-[11px] uppercase tracking-wider">
                    <th className="p-3">Patent / Publication</th>
                    <th className="p-3">Assignee / Authors</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Core Focus</th>
                    <th className="p-3">Critical Limitation (Resolved by Patent 202541131828)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">US7212248B2</td>
                    <td className="p-3">Thomson Licensing</td>
                    <td className="p-3">2007</td>
                    <td className="p-3">System timestamps for AV delay correction</td>
                    <td className="p-3 text-red-400">Only corrects broadcast delay; cannot detect fake lip-sync, deepfakes, or visual tampering.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">US7586544B2</td>
                    <td className="p-3">Invidi Technologies</td>
                    <td className="p-3">2009</td>
                    <td className="p-3">Reference test streams for TV hardware latency</td>
                    <td className="p-3 text-red-400">Hardware latency testing only; no ML classification, spectral forensics, or deepfake detection.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">US10573313B2</td>
                    <td className="p-3">Google LLC</td>
                    <td className="p-3">2020</td>
                    <td className="p-3">Audio feature learning from facial cues for speech reconstruction</td>
                    <td className="p-3 text-red-400">Does not classify REAL vs FAKE; lacks 2D FFT spectral mismatch or LASCI consistency grading.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">US12118323B2</td>
                    <td className="p-3">Meta Platforms, Inc.</td>
                    <td className="p-3">2024</td>
                    <td className="p-3">Generative lip-sync animation for translated speech</td>
                    <td className="p-3 text-red-400">Creation tool rather than forensic verifier; zero artifact detection or confidence auditing.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">US20230130287A1</td>
                    <td className="p-3">Disney / Pixar</td>
                    <td className="p-3">2023</td>
                    <td className="p-3">ML-based lip animation and speech alignment</td>
                    <td className="p-3 text-red-400">Animated graphics tool; no authentic vs fake scoring, no silent-video audit capability.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white">LipForensics (Chung et al.)</td>
                    <td className="p-3">Academic Literature</td>
                    <td className="p-3">2021</td>
                    <td className="p-3">Spatio-temporal talking head deepfake detection</td>
                    <td className="p-3 text-red-400">Lacks frequency-domain 2D FFT analysis, pixel-difference metrics, LASCI fusion, and explainability heatmaps.</td>
                  </tr>
                  <tr className="bg-red-950/20 hover:bg-red-950/30 border-t-2 border-red-500/50">
                    <td className="p-3 font-bold text-red-300">IN202541131828 A (Present Invention)</td>
                    <td className="p-3 font-bold text-white">Vellore Institute of Technology</td>
                    <td className="p-3 font-bold text-white">2026</td>
                    <td className="p-3 font-bold text-red-300">Multi-Feature Spatial, 2D FFT Spectral &amp; Attention CNN Fusion</td>
                    <td className="p-3 text-emerald-400 font-bold">Forensic-grade LASCI score (0-100), 3-tier severity, explainable FFT &amp; difference maps, and works in silent-video mode.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION: SYSTEM ARCHITECTURE */}
        <section id="architecture" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Dual-Path Feature Extraction</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              End-to-End System Architecture (Figure 1)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Figure 1 Interactive Card (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-[10px] font-bold rounded">
                    FIGURE 1
                  </span>
                  <span className="text-xs font-mono font-bold text-white">Dual-Path Lip-Sync Authenticity Architecture</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage({
                    src: '/patent-assets/lip-sync-detection/fig1_system_architecture.jpeg',
                    title: 'Figure 1: Complete System Architecture Diagram',
                    caption: 'Dual-path architecture comprising input video acquisition, 10 FPS frame extraction, paired-frame generator (128x256), Haar/YOLO face & lip detector (128x128), Left Branch: 5-Block Attention CNN; Right Branch: 2D FFT + Correlation (C) + Pixel Difference (P) + Sobel Edge Density (E), LASCI Fusion Engine, Decision Node, and Forensic Explainability Module.',
                    badge: 'PATENT FIGURE 1'
                  })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded text-[10px] font-mono text-gray-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-red-400" />
                  <span>Enlarge Figure</span>
                </button>
              </div>

              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig1_system_architecture.jpeg',
                  title: 'Figure 1: Complete System Architecture Diagram',
                  caption: 'Dual-path architecture comprising input video acquisition, 10 FPS frame extraction, paired-frame generator (128x256), Haar/YOLO face & lip detector (128x128), Left Branch: 5-Block Attention CNN; Right Branch: 2D FFT + Correlation (C) + Pixel Difference (P) + Sobel Edge Density (E), LASCI Fusion Engine, Decision Node, and Forensic Explainability Module.',
                  badge: 'PATENT FIGURE 1'
                })}
                className="relative group overflow-hidden rounded border border-white/10 bg-[#060606] cursor-pointer"
              >
                <img 
                  src="/patent-assets/lip-sync-detection/fig1_system_architecture.jpeg" 
                  alt="Figure 1: Complete System Architecture Diagram" 
                  className="w-full h-auto max-h-[480px] object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 bg-black/80 border border-red-500/60 rounded text-red-300 font-mono text-xs flex items-center gap-1.5 shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5" /> Click to Inspect Full Resolution Diagram
                  </span>
                </div>
              </div>

              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                <strong className="text-white">Fig. 1 Breakdown:</strong> The system accepts any RGB video, resamples at a fixed temporal rate (10 FPS), constructs paired lip crops ($128 \times 256$), and routes them through simultaneous deep learning (5 Conv blocks + Attention) and analytical signal processing paths before LASCI scoring.
              </p>
            </div>

            {/* Pipeline Stage Architecture Steps (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 font-mono text-xs">
              
              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-red-400 font-bold text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center text-[10px]">1</span>
                  <span>Input Acquisition &amp; Temporal Resampling</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed pl-7">
                  Extracts video frames at exactly 10 FPS to ensure uniform temporal granularity and capture micro-expression progression across speech phonemes.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-red-400 font-bold text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center text-[10px]">2</span>
                  <span>Paired-Frame Generator (128×256)</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed pl-7">
                  Isolates lower face ROI via Haar / YOLO-Face, extracts standardized $128 \times 128$ lip crops, and concatenates paired frames side-by-side into a single composite representation.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-red-400 font-bold text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center text-[10px]">3</span>
                  <span>Branch A: 5-Block Attention CNN</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed pl-7">
                  Custom CNN with spatial attention highlighting mouth boundaries and micro-motion gaps, outputting class probabilities (P_real, P_fake) and activation vectors.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-red-400 font-bold text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center text-[10px]">4</span>
                  <span>Branch B: Handcrafted Spatial &amp; Spectral Engine</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed pl-7">
                  Computes 2D Fast Fourier Transform magnitude spectra, frame correlation ($C$), absolute pixel deviation ($P$), and Sobel edge-density discrepancy ($E$).
                </p>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-red-300 font-bold text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-[10px] text-white">5</span>
                  <span>LASCI Fusion &amp; Explainability Engine</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed pl-7">
                  Combines all 5 metrics into the unified LASCI score, assigns LOW/MEDIUM/HIGH severity, and renders audit-ready heatmaps, FFT spectrum plots, and reasoning logs.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: SPATIAL & SPECTRAL FORENSICS */}
        <section id="spatial-pipeline" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Analytical Signal Processing</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Handcrafted Spatial Forensics &amp; 2D FFT Spectral Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* Spatial Forensics Box */}
            <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <ScanFace className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Spatial Forensic Indicators</h3>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Spatial forensics evaluate pixel-level motion continuity across paired lip frames without requiring speech audio:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-[#111] border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">1. Lip-Region Correlation (C)</strong>
                    <span className="text-red-400 font-bold">REAL: 0.95–1.00 | FAKE: 0.82–0.90</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Measures statistical correlation of mouth pixel intensities between consecutive timestamps. Natural speech exhibits smooth transitions; synthetic re-targeting causes sharp correlation drops.
                  </p>
                </div>

                <div className="p-3 bg-[#111] border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">2. Pixel Intensity Difference (P)</strong>
                    <span className="text-red-400 font-bold">REAL: 3–10 | FAKE: 15–40</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Evaluates mean absolute deviation across pixel matrix |I_t(x,y) - I_t+1(x,y)|. High deviations unmask frame swapping, audio drift, or cross-speaker blending.
                  </p>
                </div>

                <div className="p-3 bg-[#111] border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">3. Sobel Edge-Density Discrepancy (E)</strong>
                    <span className="text-red-400 font-bold">REAL: 0–3 | FAKE: 2–5</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Computes edge gradient density using Sobel convolution masks. Generative GAN/Diffusion inpainting creates high-frequency boundary blurring or artificial stitching edges around the lip contour.
                  </p>
                </div>
              </div>
            </div>

            {/* Spectral FFT Forensics Box */}
            <div id="spectral-pipeline" className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Activity className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">2D Fast Fourier Transform (Spectral Forensics)</h3>
              </div>

              <p className="text-gray-300 leading-relaxed">
                Applies 2D Discrete Fast Fourier Transform to convert standardized lip crops from spatial domain into frequency domain:
              </p>

              <div className="p-3 bg-[#070707] border border-red-800/40 rounded text-center">
                <span className="text-red-300 font-bold text-sm block mb-1">
                  {"\\mathcal{F}(u,v) = \\sum_{x=0}^{M-1} \\sum_{y=0}^{N-1} f(x,y) \\cdot e^{-j 2\\pi \\left( \\frac{ux}{M} + \\frac{vy}{N} \\right)}"}
                </span>
                <span className="text-gray-400 text-[10px]">2D FFT Formulation for Standardized 128×128 Lip Crops</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-[#111] border border-white/5 rounded flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Central Frequency Concentration (REAL_SYNC)</strong>
                    <span className="text-gray-400">Authentic human video exhibits smooth, continuous frequency distributions with natural energy concentration in low/mid frequencies.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#111] border border-white/5 rounded flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">High-Frequency Noise &amp; Checkerboard Distortions (FAKE)</strong>
                    <span className="text-gray-400">Generative neural decoders (Wav2Lip, GAN upsamplers) introduce distinct periodic high-frequency noise and cross-mixing distortions in the Fourier spectrum.</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail of Fig 5 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig5_fft_spectrum_comparison.png',
                  title: 'Figure 5: 2D FFT Spectrum Comparison (REAL vs FAKE)',
                  caption: 'Comparison of two-dimensional Fast Fourier Transform magnitude spectra. Real samples show smooth central frequency concentrations, whereas fake/manipulated samples display high-frequency noise spikes, checkerboard grid patterns, and cross-mixing distortions.',
                  badge: 'PATENT FIGURE 5'
                })}
                className="p-2 bg-[#121212] border border-white/10 hover:border-red-500/50 rounded flex items-center gap-3 cursor-pointer group"
              >
                <img 
                  src="/patent-assets/lip-sync-detection/fig5_fft_spectrum_comparison.png" 
                  alt="Figure 5: 2D FFT Spectrum Comparison" 
                  className="w-20 h-14 object-cover rounded border border-white/5"
                />
                <div className="flex-1">
                  <span className="text-red-400 font-bold text-[11px] block group-hover:text-red-300">View Figure 5 (FFT Spectra Comparison)</span>
                  <span className="text-gray-400 text-[10px]">Clear visual proof of high-frequency manipulation traces in Fourier domain.</span>
                </div>
                <Maximize2 className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0" />
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: LASCI FORMULATION & SIMULATOR */}
        <section id="lasci-engine" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Unified Authenticity Index</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Lip-Audio Synchronization Consistency Index (LASCI)
            </h2>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-5">
            <p className="text-xs sm:text-sm text-gray-300 font-mono leading-relaxed">
              A cornerstone novelty of Patent 202541131828 is the formulation of the <strong className="text-white">LASCI metric</strong>, which eliminates fragmented or single-point deep learning failure modes by fusing analytical spatial, spectral, and learned attention embeddings into a calibrated score:
            </p>

            <div className="p-4 bg-[#070707] border border-red-700/40 rounded-sm text-center font-mono">
              <span className="text-red-300 font-bold text-base sm:text-lg tracking-wide block mb-1">
                {"\\text{LASCI} = w_1 \\cdot C + w_2 \\cdot \\left(1 - \\frac{P}{P_{\\max}}\\right) + w_3 \\cdot F + w_4 \\cdot (1 - D) + w_5 \\cdot \\left(1 - \\frac{E}{E_{\\max}}\\right)"}
              </span>
              <p className="text-gray-400 text-[11px] mt-1">
                Where $C$ = Correlation, $P$ = Pixel Difference, $F$ = Attention CNN Score, $D$ = Spectral Discontinuity, $E$ = Edge Density, and $w_1 \dots w_5$ are optimized weights ($0.25, 0.20, 0.25, 0.15, 0.15$).
              </p>
            </div>

            {/* 3-Tier Severity Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-600/40 rounded">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>LOW MISMATCH (REAL_SYNC)</span>
                </div>
                <span className="text-emerald-300 text-xs font-bold block mb-1">Score: 75.0 – 100.0</span>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  Smooth micro-motions, high correlation ($&gt;0.90$), negligible pixel deviation, and uniform central 2D FFT energy confirm authentic human video.
                </p>
              </div>

              <div className="p-3.5 bg-amber-950/20 border border-amber-600/40 rounded">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>MEDIUM MISMATCH (SUSPECTED)</span>
                </div>
                <span className="text-amber-300 text-xs font-bold block mb-1">Score: 52.0 – 74.9</span>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  Minor transmission jitter, temporal lag, or audio desynchronization ($&gt;100$ms). Triggers secondary frame-level forensic review.
                </p>
              </div>

              <div className="p-3.5 bg-red-950/20 border border-red-600/40 rounded">
                <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>HIGH MISMATCH (FAKE_DESYNC)</span>
                </div>
                <span className="text-red-300 text-xs font-bold block mb-1">Score: 0.0 – 51.9</span>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  High pixel difference, boundary stitching artifacts, and strong 2D FFT high-frequency noise confirm generative manipulation or deepfake synthesis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE FORENSICS LAB (SIMULATOR) */}
        <section id="simulator" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Interactive Telemetry Simulator</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Lip-Sync Forensics &amp; Live LASCI Calculator
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-7 rounded-sm space-y-6">
            
            {/* Preset Selector */}
            <div>
              <label htmlFor={presetSelectId} className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                Select Video Scenario Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(presets) as PresetKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyPreset(key)}
                    className={`p-2.5 rounded text-left font-mono text-xs transition-all cursor-pointer border ${
                      activePreset === key 
                        ? 'bg-red-950/60 border-red-500 text-white font-bold shadow-md' 
                        : 'bg-[#121212] border-white/5 text-gray-400 hover:text-white hover:bg-[#181818]'
                    }`}
                  >
                    <span className="block truncate text-[11px]">{presets[key].name}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-mono text-gray-400 mt-2 italic bg-[#0e0e0e] p-2.5 rounded border border-white/5">
                <span className="text-red-400 font-bold">Scenario Note:</span> {presets[activePreset].description}
              </p>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-white/5">
              
              {/* Slider 1: Correlation */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <label htmlFor={correlationSliderId} className="text-gray-300">
                    Lip-Region Correlation ($C$):
                  </label>
                  <span className="text-red-400 font-bold">{simCorrelation.toFixed(2)}</span>
                </div>
                <input 
                  id={correlationSliderId}
                  type="range" 
                  min="0.60" 
                  max="1.00" 
                  step="0.01" 
                  value={simCorrelation} 
                  onChange={(e) => setSimCorrelation(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">Higher = authentic synchronized motion ($&gt;0.95$)</span>
              </div>

              {/* Slider 2: Pixel Difference */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <label htmlFor={pixelDiffSliderId} className="text-gray-300">
                    Pixel Difference Score ($P$):
                  </label>
                  <span className="text-red-400 font-bold">{simPixelDiff.toFixed(1)}</span>
                </div>
                <input 
                  id={pixelDiffSliderId}
                  type="range" 
                  min="1.0" 
                  max="45.0" 
                  step="0.5" 
                  value={simPixelDiff} 
                  onChange={(e) => setSimPixelDiff(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">Lower = authentic continuity ($3-10$); Higher = manipulation</span>
              </div>

              {/* Slider 3: 2D FFT Spectral Discontinuity */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <label htmlFor={spectralDiscontinuitySliderId} className="text-gray-300">
                    Spectral Discontinuity Index ($D$):
                  </label>
                  <span className="text-red-400 font-bold">{simSpectralDiscontinuity.toFixed(2)}</span>
                </div>
                <input 
                  id={spectralDiscontinuitySliderId}
                  type="range" 
                  min="0.0" 
                  max="1.0" 
                  step="0.02" 
                  value={simSpectralDiscontinuity} 
                  onChange={(e) => setSimSpectralDiscontinuity(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">Lower = uniform 2D FFT spectrum; Higher = GAN checkerboard noise</span>
              </div>

              {/* Slider 4: Edge Density */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <label htmlFor={edgeDensitySliderId} className="text-gray-300">
                    Sobel Edge-Density Discrepancy ($E$):
                  </label>
                  <span className="text-red-400 font-bold">{simEdgeDensity.toFixed(1)}</span>
                </div>
                <input 
                  id={edgeDensitySliderId}
                  type="range" 
                  min="0.5" 
                  max="5.0" 
                  step="0.1" 
                  value={simEdgeDensity} 
                  onChange={(e) => setSimEdgeDensity(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">Lower = natural facial contour ($0-3$); Higher = synthetic blending border</span>
              </div>

              {/* Slider 5: CNN Feature Score */}
              <div className="space-y-1.5 font-mono text-xs md:col-span-2">
                <div className="flex justify-between">
                  <label htmlFor={cnnFeatureSliderId} className="text-gray-300">
                    Attention CNN Authenticity Confidence ($F$):
                  </label>
                  <span className="text-red-400 font-bold">{(simCnnFeatureScore * 100).toFixed(1)}%</span>
                </div>
                <input 
                  id={cnnFeatureSliderId}
                  type="range" 
                  min="0.05" 
                  max="0.99" 
                  step="0.01" 
                  value={simCnnFeatureScore} 
                  onChange={(e) => setSimCnnFeatureScore(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <span className="text-[10px] text-gray-500 block">Output probability from 5-block CNN with spatial lip attention layer</span>
              </div>

            </div>

            {/* LIVE CALCULATION VERDICT BOX */}
            <div className={`p-5 rounded border ${verdict.bg} ${verdict.border} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-black/40 border border-white/10">
                    {verdict.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">SYSTEM VERDICT</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40 ${verdict.color}`}>
                        {verdict.severity}
                      </span>
                    </div>
                    <h4 className={`text-xl sm:text-2xl font-bebas tracking-wide ${verdict.color}`}>
                      {verdict.label}
                    </h4>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] text-gray-400 uppercase block">Calculated LASCI Score</span>
                  <span className="text-3xl font-extrabold text-white">
                    {lasciScore.toFixed(1)}<span className="text-sm text-gray-400 font-normal"> / 100</span>
                  </span>
                </div>

              </div>

              <div className="mt-3 pt-3 border-t border-white/10 font-mono text-xs text-gray-300 leading-relaxed">
                <strong className="text-white mr-1">Forensic Reasoning:</strong>
                {verdict.description}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: EMPIRICAL BENCHMARK & GRID DATASET VALIDATION */}
        <section id="empirical-results" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Experimental Rigor</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Empirical Validation on GRID Dataset (34 Speakers)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Metrics Breakdown Table (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider block font-bold border-b border-white/5 pb-2">
                  System Validation Summary
                </span>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Benchmark Dataset</span>
                    <strong className="text-white">GRID Lip-Reading (34 Speakers)</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Total Video Subset</span>
                    <strong className="text-white">1,000 High-Res Videos</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Overall Test Accuracy</span>
                    <strong className="text-red-400 text-sm font-bold">73.3%</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Best Validation Accuracy</span>
                    <strong className="text-emerald-400">70.0%</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Correct REAL Detection Rate</span>
                    <strong className="text-emerald-400 font-bold">90.0% (27/30)</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">Correct FAKE Detection Rate</span>
                    <strong className="text-amber-400 font-bold">56.7% (17/30)</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">FAKE Precision</span>
                    <strong className="text-red-300 font-bold">0.85 (85%)</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Forensic Explainability</span>
                    <strong className="text-emerald-400">✓ Fully Provided</strong>
                  </div>
                </div>
              </div>

              {/* Critical Discovery Note: Same Person Detected as FAKE */}
              <div className="p-4 bg-[#101010] border border-red-800/40 rounded-sm space-y-2">
                <div className="flex items-center gap-1.5 text-red-300 font-bold text-xs">
                  <Info className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Key Innovation: Identity vs Temporal Alignment</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  In several test cases, paired frames visually featured the <strong className="text-white">exact same human individual</strong>. Generic face-verification models fail on these by marking them as REAL. Patent 202541131828 successfully marks them as <strong className="text-red-400">FAKE_DESYNC</strong> because the micro-expressions are temporally disconnected across timestamps, proving the model detects <span className="text-red-300 font-semibold">genuine temporal-viseme synchrony</span> rather than trivial facial identity.
                </p>
              </div>

            </div>

            {/* Figures Grid (7 Cols): Figures 2, 3, 4, 6 */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Figure 2: Training & Validation Curves */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig2_training_validation_curves.png',
                  title: 'Figure 2: Training & Validation Accuracy/Loss Curves',
                  caption: 'Curves showing consistent reduction in validation loss and progressive improvement in validation accuracy across 5 training epochs on paired-frame dataset, demonstrating robust convergence.',
                  badge: 'PATENT FIGURE 2'
                })}
                className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-red-500/60 rounded-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-red-400 font-bold">FIG 2: TRAINING CURVES</span>
                    <Maximize2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  </div>
                  <img 
                    src="/patent-assets/lip-sync-detection/fig2_training_validation_curves.png" 
                    alt="Figure 2: Training & Validation Curves" 
                    className="w-full h-36 object-contain rounded bg-[#060606] p-1 mb-2 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">Stable loss convergence and 70% validation accuracy peak.</p>
              </div>

              {/* Figure 3: Confusion Matrix */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig3_confusion_matrix.png',
                  title: 'Figure 3: Confusion Matrix (Counts & Percentages)',
                  caption: 'Evaluation on 60 unseen test samples (30 REAL, 30 FAKE). Demonstrates 90% recall on authentic synchronized content (27/30) and 85% precision on manipulated samples.',
                  badge: 'PATENT FIGURE 3'
                })}
                className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-red-500/60 rounded-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-red-400 font-bold">FIG 3: CONFUSION MATRIX</span>
                    <Maximize2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  </div>
                  <img 
                    src="/patent-assets/lip-sync-detection/fig3_confusion_matrix.png" 
                    alt="Figure 3: Confusion Matrix" 
                    className="w-full h-36 object-contain rounded bg-[#060606] p-1 mb-2 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">60-sample test evaluation showing 73.3% overall test accuracy.</p>
              </div>

              {/* Figure 4: Feature Distributions */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig4_feature_distribution.png',
                  title: 'Figure 4: Feature Distribution Plot (REAL vs FAKE)',
                  caption: 'Distribution plot confirming statistical separation between REAL and FAKE classes across frame correlation, pixel difference intensity, and Sobel edge density metrics.',
                  badge: 'PATENT FIGURE 4'
                })}
                className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-red-500/60 rounded-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-red-400 font-bold">FIG 4: FEATURE SEPARATION</span>
                    <Maximize2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  </div>
                  <img 
                    src="/patent-assets/lip-sync-detection/fig4_feature_distribution.png" 
                    alt="Figure 4: Feature Distribution Plot" 
                    className="w-full h-36 object-contain rounded bg-[#060606] p-1 mb-2 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">Statistical separation across correlation, pixel delta, and edge density.</p>
              </div>

              {/* Figure 6: Correct Classifications & Indicators */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/lip-sync-detection/fig6_real_vs_fake_classification.png',
                  title: 'Figure 6: Example of Correct Classifications with Indicators',
                  caption: 'Sample-level case study showing frame pairs correctly classified as REAL and FAKE, complete with automated feature indicators, probability bars, and LASCI confidence scores.',
                  badge: 'PATENT FIGURE 6'
                })}
                className="p-3 bg-[#0a0a0a] border border-white/10 hover:border-red-500/60 rounded-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-red-400 font-bold">FIG 6: SAMPLE CASE STUDIES</span>
                    <Maximize2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                  </div>
                  <img 
                    src="/patent-assets/lip-sync-detection/fig6_real_vs_fake_classification.png" 
                    alt="Figure 6: Correct Classifications" 
                    className="w-full h-36 object-contain rounded bg-[#060606] p-1 mb-2 group-hover:scale-[1.02] transition-transform"
                  />
                </div>
                <p className="text-[10px] font-mono text-gray-400">Visual proof of classification reasoning with feature indicators.</p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION: 10 FORMAL LEGAL CLAIMS */}
        <section id="claims" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Intellectual Property Protection</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              The 10 Formal Legal Claims (Verbatim from Patent Gazette)
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-7 rounded-sm space-y-4 font-mono text-xs">
            <p className="text-gray-400 leading-relaxed">
              Published in the official Indian Patent Office Gazette Journal No. 01/2026 under Application No. 202541131828:
            </p>

            <div className="space-y-3.5">
              
              <div className="p-4 bg-[#0e0e0e] border-l-4 border-red-500 border border-white/5 rounded-r">
                <span className="text-red-400 font-bold block mb-1">CLAIM 1 (Principal Independent Claim):</span>
                <p className="text-gray-200 leading-relaxed">
                  A system for lip-sync authenticity detection using spatial, spectral, and deep-learning based feature fusion (100), comprising: a paired-frame generator configured to construct a combined lip-region frame of size 128×256 pixels from two input frames obtained from an RGB video; a lip-region detection unit adapted to identify a lower-face region of interest and produce standardized 128×128 lip crops; a handcrafted feature extraction module configured to compute a correlation score, a pixel-difference score, an edge-density score, and a frequency-domain feature obtained through a two-dimensional Fast Fourier Transform applied to each lip crop; a convolutional neural network comprising five convolution blocks and an attention mechanism, the network being configured to extract deep spatial features and generate classification probabilities for REAL_SYNC and FAKE_DESYNC; a feature fusion engine adapted to combine the handcrafted features and the deep features; a Lip-Audio Synchronization Consistency Index (LASCI) computation unit configured to determine an authenticity score using weighted parameters C, P, F, D, and E, wherein C represents the correlation score, P represents the pixel-difference score, F represents the FFT consistency score, D represents the edge-density deviation, and E represents the CNN-based inconsistency score; and a decision logic module configured to classify the paired frame as REAL_SYNC or FAKE_DESYNC based on the LASCI score and the CNN output.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 2 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the paired-frame generator is configured to generate REAL samples using consecutive frames from a same video and FAKE samples using non-consecutive or cross-video frames.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 3 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the correlation score is computed as a quantitative measure of similarity between the paired lip crops, enabling detection of reduced temporal consistency in desynchronized content.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 4 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the pixel-difference score is computed as an absolute pixel-wise deviation between the paired lip crops to detect abrupt visual transitions caused by frame swapping or manipulation.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 5 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the edge-density score is derived using a Sobel-based edge estimator to identify irregular edge structures arising from synthetic blending or generative artifacts.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 6 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the two-dimensional Fast Fourier Transform produces spectral magnitude representations that highlight high-frequency inconsistencies associated with manipulated frames.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 7 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the attention mechanism of the convolutional neural network is configured to emphasize discriminative lip-region micro-movements by assigning higher weights to spatially relevant regions.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 8 (Dependent):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein the LASCI score is computed using learned or manually optimized weights w₁–w₅ to generate a fused authenticity measure derived from spatial, spectral, and deep-learning features.
                </p>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded">
                <span className="text-red-300 font-bold block mb-1">CLAIM 9 (Silent Video Operation Novelty):</span>
                <p className="text-gray-300 leading-relaxed">
                  The system as claimed in claim 1, wherein the decision logic module is further adapted to operate in silent-video conditions by utilizing only spatial, spectral, and deep-learning visual features without requiring audio input.
                </p>
              </div>

              <div className="p-3 bg-[#0e0e0e] border border-white/5 rounded">
                <span className="text-gray-300 font-bold block mb-1">CLAIM 10 (Explainability Module):</span>
                <p className="text-gray-400 leading-relaxed">
                  The system as claimed in claim 1, wherein an explainability and forensic reporting module is configured to generate activation heatmaps, attention visualizations, FFT spectral maps, frame-difference heatmaps, feature comparisons, and reasoning outputs that illustrate the basis for the classification decision.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: BIBTEX CITATION */}
        <section id="citations" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block mb-1">Academic &amp; Legal Citations</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              Official Citation &amp; BibTeX Reference
            </h2>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-7 rounded-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">BibTeX Code</span>
              <button
                type="button"
                onClick={handleCopyBibtex}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
                <span>{copiedBibtex ? 'Copied to Clipboard' : 'Copy BibTeX'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#050505] border border-white/10 rounded font-mono text-xs text-gray-300 overflow-x-auto selection:bg-red-900 selection:text-white">
              {bibtexCitation}
            </pre>
          </div>
        </section>

        {/* BOTTOM NAV / BACK BUTTON */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-[#111] hover:bg-red-950/40 border border-white/15 hover:border-red-500/60 text-gray-200 hover:text-white font-mono text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-red-400 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio Main Page</span>
          </button>

          <div className="flex items-center gap-3">
            <a 
              href="/patent-assets/lip-sync-detection/Official_Gazette_Patent_202541131828.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-red-950/80 hover:bg-red-900 border border-red-600 hover:border-red-400 text-white font-mono text-xs font-bold rounded-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4 text-red-300" />
              <span>Open Official PDF</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-300" />
            </a>
          </div>
        </div>

      </main>

    </div>
  );
}
