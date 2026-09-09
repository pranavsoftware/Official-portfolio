import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Download, Award, CheckCircle2, AlertTriangle, ShieldAlert, 
  ShieldCheck, Volume2, Eye, Cpu, Compass, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatentSEO } from '../hooks/usePatentSEO';
import { getPatentBySlug } from '../data/patentMetadata';

interface CrowdChaosPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function CrowdChaosPatentPage({ onBack }: CrowdChaosPatentPageProps) {
  // Dynamic SEO meta tags, Google Scholar citation tags, OpenGraph & Schema.org JSON-LD
  usePatentSEO(getPatentBySlug('crowd-chaos-detection')!);

  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Unique IDs for accessibility
  const personCountId = useId();
  const facesCountId = useId();
  const emotionSelectId = useId();
  const audioIntensityId = useId();

  // Interactive Simulator State
  const [simPersonCount, setSimPersonCount] = useState<number>(14);
  const [simFacesCount, setSimFacesCount] = useState<number>(8);
  const [simEmotion, setSimEmotion] = useState<'Fear' | 'Anger' | 'Surprise' | 'Disgust' | 'Sad' | 'Neutral' | 'Happy'>('Fear');
  const [simAudioIntensity, setSimAudioIntensity] = useState<number>(65);

  // Emotion weight mapping from patent
  const emotionWeights: Record<string, number> = {
    Fear: 10,
    Anger: 9,
    Surprise: 7,
    Disgust: 6,
    Sad: 4,
    Neutral: 2, // "Not Neutral" mapped in patent
    Happy: 1
  };

  // Calculate live scores
  // E_Score = (sum(w_i * e_i) / n) * 10 (scaled approx)
  const eWeight = emotionWeights[simEmotion];
  const simEScore = simFacesCount > 0 
    ? Math.min(100, Math.round((eWeight * 0.75 + (simEmotion === 'Fear' ? 2.5 : 1.0)) * 10))
    : 0;

  // D_Score = min(100, (person_count / 8) * 100) (as defined in IDF)
  const simDScore = Math.min(100, Math.round((simPersonCount / 16) * 100));

  // A_Score = min(100, 0.4*I + 0.3*F + 0.3*S)
  const simAScore = Math.min(100, Math.round(simAudioIntensity * 0.9));

  // Risk Score = 0.4 * E + 0.4 * D + 0.2 * A
  const simRiskScore = Number((0.4 * simEScore + 0.4 * simDScore + 0.2 * simAScore).toFixed(1));

  // Determine Risk Category & Action
  let riskStatus: { label: string; color: string; bg: string; border: string; action: string; icon: React.ReactNode };
  if (simRiskScore < 35) {
    riskStatus = {
      label: 'SAFE',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30',
      border: 'border-emerald-600/40',
      action: 'Routine standard surveillance & video logging. Low stress confirmed.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    };
  } else if (simRiskScore < 55) {
    riskStatus = {
      label: 'CAUTION',
      color: 'text-yellow-400',
      bg: 'bg-yellow-950/30',
      border: 'border-yellow-600/40',
      action: 'Heightened watch. Operator alerted; monitor visual emotion fluctuations closely.',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />
    };
  } else if (simRiskScore < 75) {
    riskStatus = {
      label: 'WARNING',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30',
      border: 'border-amber-600/40',
      action: 'Proactive crowd-control intervention issued. Audio direction pinpointed for stewards.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
    };
  } else {
    riskStatus = {
      label: 'CRITICAL',
      color: 'text-red-500',
      bg: 'bg-red-950/40',
      border: 'border-red-600',
      action: 'CRITICAL HAZARD: Automated crowd safety sprinkler systems & emergency sirens activated!',
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />
    };
  }

  const bibtexCitation = `@patent{rayban2025crowdchaos,
  title={Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal},
  author={Dr. Padma Priya R and Rayban Pranav Mahesh and Divyam Goel and Tansiha Bagga},
  year={2025},
  month={November},
  number={202541103106},
  type={Patent},
  nationality={Indian},
  assignee={Vellore Institute of Technology},
  note={Published 28 November 2025}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const handleDownloadBibtex = () => {
    const element = document.createElement('a');
    const file = new Blob([bibtexCitation], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'rayban2025crowdchaos.bib';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'prior-art', label: 'Prior Art' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'visual-pipeline', label: 'Visual Pipeline' },
    { id: 'audio-pipeline', label: 'Acoustic CADA' },
    { id: 'risk-engine', label: 'Risk Simulator' },
    { id: 'empirical-results', label: 'Results' },
    { id: 'claims', label: 'Claims' },
    { id: 'citations', label: 'Citation' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-900 selection:text-white pb-20 font-inter antialiased">
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
              <div className="p-4 border-t border-white/10 bg-[#0e0e0e] text-xs text-gray-300 font-mono">
                {activeImage.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Sub-Navbar */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-8 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
          <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] hover:bg-red-950/30 border border-white/10 hover:border-red-600/50 text-gray-300 hover:text-white text-xs font-mono rounded transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Portfolio</span>
            </button>

            <a 
              href="/patent-assets/Crowd%20Chaos%20Detection%20System%20for%20Crowd%20Safety%20Management%20Using%20Audio-Visual%20Signal.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full text-[11px] font-mono text-gray-400">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="whitespace-nowrap px-2.5 py-1 rounded hover:text-white hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            <a 
              href="/patent-assets/Crowd%20Chaos%20Detection%20System%20for%20Crowd%20Safety%20Management%20Using%20Audio-Visual%20Signal.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* HERO DOSSIER BANNER */}
        <section id="overview" className="scroll-mt-24 relative p-6 sm:p-10 bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-red-950/20 blur-3xl rounded-full pointer-events-none" />

          {/* Patent Header Meta */}
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-red-950/40 border border-red-800/50 text-red-400 font-mono text-[11px] rounded font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-500" />
                Official Indian Patent Application
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                App No: <strong className="text-white font-mono">202541103106</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                Document: <strong className="text-gray-200">IDF-B (02-IPR-R003)</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-950/30 border border-emerald-600/30 text-emerald-400 font-mono text-[11px] rounded font-semibold">
                TRL 4 (Validated in Lab)
              </span>
            </div>

            {/* Patent Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight leading-snug sm:leading-tight mb-4 max-w-5xl">
              Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-inter max-w-4xl leading-relaxed mb-8">
              A synchronized edge-multimodal artificial intelligence system that combines <strong className="text-white">harmonics-based acoustic fingerprinting</strong>, <strong className="text-white">audio-only crowd density analysis (CADA)</strong>, and <strong className="text-white">cascaded knowledge distillation with YOLOv8</strong> for facial stress quantification. Unifies dual-modal telemetry into a continuous, real-time <span className="text-red-400 font-mono font-bold">Chaotic Risk Score (0–100)</span> to automate crowd safety interventions and prevent fatal stampedes.
            </p>

            {/* Patent Specification & Inventors Dossier */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 font-mono text-xs">
              
              {/* Inventors Breakdown Card (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Users className="w-3.5 h-3.5 text-red-500" />
                    Inventors &amp; Authors (BibTeX Authorship)
                  </span>
                  <span className="text-[9px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 font-bold">
                    4 Official Inventors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Inventor 1 */}
                  <div className="p-3 bg-[#080808] border border-white/5 rounded hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold">01 · Lead Faculty Inventor</span>
                      <span className="text-[9px] text-gray-400 font-mono">Faculty</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Dr. Padma Priya R</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Associate Professor, VIT</p>
                  </div>

                  {/* Inventor 2 */}
                  <div className="p-3 bg-red-950/20 border border-red-800/50 rounded hover:border-red-500 transition-colors relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-red-400 font-bold">02 · AI/ML Researcher &amp; Developer</span>
                      <span className="text-[9px] text-red-400/80 font-mono">Lead Author</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <span>Rayban Pranav Mahesh</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">AI/ML Engineer &amp; Researcher, VIT</p>
                  </div>

                  {/* Inventor 3 */}
                  <div className="p-3 bg-[#080808] border border-white/5 rounded hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold">03 · Co-Inventor</span>
                      <span className="text-[9px] text-gray-400 font-mono">Researcher</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Divyam Goel</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Student Researcher, VIT</p>
                  </div>

                  {/* Inventor 4 */}
                  <div className="p-3 bg-[#080808] border border-white/5 rounded hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold">04 · Co-Inventor</span>
                      <span className="text-[9px] text-gray-400 font-mono">Researcher</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Tansiha Bagga</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Student Researcher, VIT</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Institution: <strong className="text-gray-200">Vellore Institute of Technology (VIT)</strong></span>
                  <span className="text-gray-500">Document No: <strong className="text-gray-300">02-IPR-R003</strong></span>
                </div>
              </div>

              {/* Patent Filing & Legal Specs Card (5 Cols) */}
              <div className="lg:col-span-5 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-red-500" />
                      Official Patent Filing Details
                    </span>
                    <span className="text-[9px] text-gray-300 bg-[#161616] px-2 py-0.5 rounded border border-white/10">
                      Indian Patent
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500">Application Number:</span>
                      <code className="text-white font-bold bg-[#141414] px-2 py-0.5 rounded border border-white/10 text-xs">
                        202541103106
                      </code>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500">Assignee / Applicant:</span>
                      <span className="text-gray-200 font-semibold text-right">Vellore Institute of Technology</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500">Filing Date:</span>
                      <span className="text-gray-200 font-medium">26 October 2025</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500">Publication Date:</span>
                      <span className="text-red-400 font-bold">28 November 2025 (Nov 2025)</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-gray-500">Nationality &amp; Type:</span>
                      <span className="text-gray-300">Indian · Patent Application</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">Official Note:</span>
                      <span className="text-gray-300 font-medium text-right">Published 28 November 2025</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                  <span>Domain: Multimodal Crowd Safety</span>
                  <span className="text-emerald-400 font-medium">TRL 4 Validated</span>
                </div>
              </div>

            </div>

            {/* Quick Spec Tags */}
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 bg-[#141414] text-gray-400 border border-white/5 rounded">
                Video Model: <strong className="text-white">YOLOv8x + YOLOv8n-face</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] text-gray-400 border border-white/5 rounded">
                Audio Processing: <strong className="text-white">FFT + Chroma HBSF + CADA</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] text-gray-400 border border-white/5 rounded">
                Decision Fusion: <strong className="text-red-400">RiskScore = 0.4E + 0.4D + 0.2A</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] text-gray-400 border border-white/5 rounded">
                Safety Actuation: <strong className="text-white">Automated Water Sprinkler Trigger</strong>
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: THE CORE PROBLEM & NOVELTY */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">01 / Background &amp; Problem Statement</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Why Crowd Chaos Fails Conventional Surveillance
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
              <div className="w-9 h-9 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Video-Only Failure Modes</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Conventional crowd counters (CCTV, trellis nets) degrade critically under occlusions, dense overlapping bodies, dust, smoke, sudden lighting failures, and camera lens smudging during surges. In blind spots, optical surveillance provides zero early-warning telemetry.
              </p>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
              <div className="w-9 h-9 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audio-Only Shortcomings</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Acoustic event systems typically focus on indoor gunshot alarms or isolated home events. They cannot distinguish joyful stadium cheering from panic roars without harmonic analysis, nor can they quantify physical person density or crowd movement vectors independently.
              </p>
            </div>

            <div className="p-6 bg-[#0a0a0a] border border-red-600/30 rounded-sm space-y-3 bg-gradient-to-b from-red-950/20 to-transparent">
              <div className="w-9 h-9 rounded bg-red-900/40 border border-red-600/50 flex items-center justify-center text-red-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">The Multimodal Breakthrough</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                This invention fuses both modalities into a continuous mathematical risk scoring pipeline: audio provides 360° omnidirectional panic and density detection even in complete darkness, while distilled visual models track individual facial stress and density spikes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PRIOR ART GAP MATRIX */}
        <section id="prior-art" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">02 / Patent Literature Survey</span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
                Prior Patents &amp; Literature vs. This Invention
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">Derived from Official IDF-B Document</span>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-sm bg-[#080808]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#121212] text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-3.5 text-[11px] font-bold text-white uppercase tracking-wider">Citation / Patent</th>
                  <th className="p-3.5 text-[11px] font-bold text-white uppercase tracking-wider">Authors / Assignee</th>
                  <th className="p-3.5 text-[11px] font-bold text-white uppercase tracking-wider">Year</th>
                  <th className="p-3.5 text-[11px] font-bold text-white uppercase tracking-wider">Summary Approach</th>
                  <th className="p-3.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">Critical Limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">Deep Learning for Crowd Counting Survey</td>
                  <td className="p-3.5 text-gray-400">Liu, Luo, Wang, Xu, Wang</td>
                  <td className="p-3.5 text-gray-400">2020</td>
                  <td className="p-3.5">Review of deep learning for crowd counting &amp; density estimation</td>
                  <td className="p-3.5 text-red-400">Focuses exclusively on visual methods; zero acoustic integration</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">Trellis Encoder-Decoder Networks</td>
                  <td className="p-3.5 text-gray-400">Jiang, Xiao, Zhang, Doermann, et al.</td>
                  <td className="p-3.5 text-gray-400">2019</td>
                  <td className="p-3.5">Visual crowd density estimation using trellis structures</td>
                  <td className="p-3.5 text-red-400">Video-only approach; fails completely in poor visibility/smoke</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">Audio Event Recognition System</td>
                  <td className="p-3.5 text-gray-400">Ntalampiras, Potamitis, Fakotakis</td>
                  <td className="p-3.5 text-gray-400">2019</td>
                  <td className="p-3.5">Acoustic event detection for smart homes and indoor safety</td>
                  <td className="p-3.5 text-red-400">Not designed for crowd dynamics; limited strictly to quiet indoors</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">US Patent US9812150B2</td>
                  <td className="p-3.5 text-gray-400">Microphone Array Patent</td>
                  <td className="p-3.5 text-gray-400">2017</td>
                  <td className="p-3.5">Detecting and localizing sound events with distributed microphones</td>
                  <td className="p-3.5 text-red-400">Optimized only for gunshots; unable to track crowd behavioral flux</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">US Patent US10134271B1</td>
                  <td className="p-3.5 text-gray-400">Acoustic Sensors for Crowd Behavior</td>
                  <td className="p-3.5 text-gray-400">2018</td>
                  <td className="p-3.5">Distributed acoustic sensors to detect crowd behaviors</td>
                  <td className="p-3.5 text-red-400">Acoustic only; lacks visual fusion or harmonic chroma fingerprinting</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white">US Patent US9892606B2</td>
                  <td className="p-3.5 text-gray-400">Anomalous Crowd Behavior Method</td>
                  <td className="p-3.5 text-gray-400">2018</td>
                  <td className="p-3.5">Computer vision system for detecting unusual movement vectors</td>
                  <td className="p-3.5 text-red-400">Relies solely on video; completely blinds in low light, fog or smoke</td>
                </tr>
                <tr className="bg-red-950/20 border-t-2 border-red-600">
                  <td className="p-3.5 font-bold text-red-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                    Indian Patent 202541103106 (This Invention)
                  </td>
                  <td className="p-3.5 text-gray-200 font-bold">Rayban Pranav Mahesh et al. (VIT)</td>
                  <td className="p-3.5 text-white font-bold">2025</td>
                  <td className="p-3.5 text-gray-200">
                    Dual YOLOv8 cascaded distillation + CADA acoustic density + HBSF harmonic fingerprinting + 4-tier automated safety actuation
                  </td>
                  <td className="p-3.5 text-emerald-400 font-bold">
                    Resolves all prior limitations: fully operational under visual occlusions &amp; complex acoustics
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: SYSTEM ARCHITECTURE (FIGURE 1) */}
        <section id="architecture" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">03 / End-to-End System Pipeline</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              System Architecture Diagram (Figure 1)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Figure 1 Image Card with Zoom */}
            <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-4 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig1_system_architecture.png',
                  title: 'Figure 1: System Architecture Diagram',
                  caption: 'Complete End-to-End System Architecture: Synchronizing Visual YOLOv8 Pipeline, Acoustic CADA & Harmonic Analysis, and Mathematical Risk Score Decision Engine with Automated Actuation.',
                  badge: 'Figure 1 (Native 1431x1416 PNG)'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig1_system_architecture.png" 
                  alt="Figure 1 System Architecture Diagram" 
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs">
                  <Maximize2 className="w-4 h-4 text-red-400" />
                  <span>Click to Expand Full Resolution</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs font-mono text-gray-400 px-1">
                <span>Figure 1: Official System Architecture Diagram</span>
                <span className="text-red-500 text-[10px]">IDF-B Drawing</span>
              </div>
            </div>

            {/* Architecture Explanation */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#0e0e0e] border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase text-[11px]">
                  <Cpu className="w-4 h-4" />
                  <span>Stage 1: Visual Tracking Pipeline</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Real-time video feed is fed into a heavy <code className="text-red-300">YOLOv8x</code> Teacher model for accurate person bounding box identification, which guides a lightweight <code className="text-red-300">YOLOv8n-face</code> Student model for cropped face region localization and subsequent CNN emotional classification.
                </p>
              </div>

              <div className="p-4 bg-[#0e0e0e] border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase text-[11px]">
                  <Volume2 className="w-4 h-4" />
                  <span>Stage 2: Acoustic Analysis &amp; CADA</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Ambient crowd audio is pre-processed, filtered, and subjected to <strong className="text-white">Harmonic Fingerprint Extraction (Chroma features)</strong> and <strong className="text-white">Crowd Acoustic Density Analysis (CADA)</strong> to derive acoustic chaos, sound intensity, and dominant source directional vectors via Fast Fourier Transform (FFT).
                </p>
              </div>

              <div className="p-4 bg-[#0e0e0e] border border-red-600/40 rounded-sm bg-gradient-to-r from-red-950/20 to-transparent">
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase text-[11px]">
                  <Activity className="w-4 h-4" />
                  <span>Stage 3: Decision Engine &amp; Actuation</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  The mathematical fusion framework weights emotional stress ($E\_Score$), physical density ($D\_Score$), and acoustic noise ($A\_Score$) into a single continuous <strong className="text-white">Risk Score (0–100)</strong>. High-risk spikes instantly trigger automated safety systems (such as crowd-calming mist sprinklers and emergency protocols).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: STAGE 1 — VISUAL PIPELINE & KNOWLEDGE DISTILLATION */}
        <section id="visual-pipeline" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">04 / Stage 1: Computer Vision &amp; Distillation</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Cascaded Knowledge Distillation for Emotion-Aware Crowd Monitoring
            </h2>
          </div>

          <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm font-inter text-sm text-gray-300 leading-relaxed">
            <h3 className="text-white font-bold mb-2">The Knowledge Distillation Strategy</h3>
            <p>
              In dense crowds, running multi-task facial recognition on whole frames causes massive compute throttling and high frame drops on edge hardware. To solve this, the patent introduces a <strong className="text-white">Teacher-Student cascaded knowledge distillation paradigm</strong>:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5 font-mono text-xs text-gray-400">
              <li><strong className="text-white">Teacher Model (YOLOv8x):</strong> Detects full human bodies and outputs high-confidence bounding boxes surrounding every person.</li>
              <li><strong className="text-white">Student Model (YOLOv8n-face):</strong> Constrained to look <em>strictly within</em> the teacher bounding boxes to locate and crop faces, discarding background noise and reducing compute by over 70%.</li>
              <li><strong className="text-white">Emotion CNN Classifier:</strong> Classifies extracted facial crops into 7 discrete emotional states to quantify psychological panic in real-time.</li>
            </ul>
          </div>

          {/* Visual Model Figures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Figure 2 */}
            <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig2_teacher_person_detection.jpg',
                  title: 'Figure 2: Teacher Model (YOLOv8x) - Person Detection',
                  caption: 'Teacher Model (YOLOv8x) detecting individual persons in dense crowd scenes with bounding boxes and confidence metrics.',
                  badge: 'Figure 2: Teacher Output'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] aspect-[16/10] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig2_teacher_person_detection.jpg" 
                  alt="Figure 2 Teacher Person Detection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Enlarge</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block">Figure 2 (IDF-B)</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Teacher Model (YOLOv8x)</h4>
                <p className="text-[11px] font-mono text-gray-400 mt-1">
                  Full person identification and spatial bounding box estimation.
                </p>
              </div>
            </div>

            {/* Figure 3 */}
            <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig3_student_face_detection.jpg',
                  title: 'Figure 3: Student Model (YOLOv8n-face) - Face Detection & Cropping',
                  caption: 'Student Model (YOLOv8n-face) detecting and isolating individual facial regions guided by teacher annotations for low-latency inference.',
                  badge: 'Figure 3: Student Face Detection'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] aspect-[16/10] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig3_student_face_detection.jpg" 
                  alt="Figure 3 Student Face Detection" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Enlarge</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block">Figure 3 (IDF-B)</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Student Model (YOLOv8n-face)</h4>
                <p className="text-[11px] font-mono text-gray-400 mt-1">
                  Guided face localization &amp; extraction from person crops.
                </p>
              </div>
            </div>

            {/* Figure 4 */}
            <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig4_emotion_detection_cnn.jpg',
                  title: 'Figure 4: Emotion Detection (CNN) - Real-time Classification',
                  caption: 'Emotion Detection CNN performing real-time facial emotion recognition into 7 states to generate the weighted emotion stress vector.',
                  badge: 'Figure 4: Emotion Classification'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] aspect-[16/10] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig4_emotion_detection_cnn.jpg" 
                  alt="Figure 4 Emotion Detection CNN" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Enlarge</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block">Figure 4 (IDF-B)</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Emotion Detection (CNN)</h4>
                <p className="text-[11px] font-mono text-gray-400 mt-1">
                  Categorizes Fear, Anger, Surprise, Sad, Neutral, and Happy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: STAGE 2 — ACOUSTIC HARMONICS & CADA */}
        <section id="audio-pipeline" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">05 / Stage 2: Acoustic Signal Processing</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Harmonic Sound Fingerprinting (HBSF) &amp; Acoustic Density (CADA)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Figure 5 */}
            <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig5_harmonic_chroma_features.png',
                  title: 'Figure 5: Harmonic Fingerprint Extraction (Chroma Features)',
                  caption: 'Harmonic Fingerprint Extraction (Chroma Features) generated from crowd acoustic streams, separating high-energy panic harmonics from ambient background noise.',
                  badge: 'Figure 5: Chroma Features'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] aspect-[16/8] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig5_harmonic_chroma_features.png" 
                  alt="Figure 5 Harmonic Fingerprint Extraction Chroma Features" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Enlarge</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block">Figure 5 (IDF-B)</span>
                <h4 className="text-sm font-bold text-white mt-0.5">Harmonic Fingerprint Extraction (Chroma Features)</h4>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Chroma feature maps and harmonic patterns isolating high-stress acoustic signatures from baseline stadium/concert ambience.
                </p>
              </div>
            </div>

            {/* Figure 6 */}
            <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-sm group relative">
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/fig6_audio_spectrogram_peaks.jpg',
                  title: 'Figure 6: Spectrogram of Speech (Audio Fingerprint Peaks)',
                  caption: 'Spectrogram of Speech depicting high-energy audio fingerprint peaks, frequency thresholds, and sudden acoustic burst detection.',
                  badge: 'Figure 6: Spectrogram Peaks'
                })}
                className="relative cursor-pointer overflow-hidden rounded bg-[#060606] aspect-[16/8] flex items-center justify-center border border-white/5"
              >
                <img 
                  src="/patent-assets/fig6_audio_spectrogram_peaks.jpg" 
                  alt="Figure 6 Spectrogram of Speech Audio Fingerprint Peaks" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Enlarge</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-wider block">Figure 6 (IDF-B)</span>
                <h4 className="text-sm font-bold text-white mt-0.5">Spectrogram Analysis &amp; Acoustic Peak Tracking</h4>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Continuous spectral analysis calculating frequency bursts, speech resonance spikes, and panic transients.
                </p>
              </div>
            </div>
          </div>

          {/* CADA Feature Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-sm">
              <h5 className="font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                CADA 8-Feature Vector
              </h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Crowd Acoustic Density Analysis derives: Spectral Centroid, Spectral Rolloff, RMS Energy, Zero Crossing Rate (ZCR), MFCCs, Tempo, Onset Rate, and Spectral Contrast.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-sm">
              <h5 className="font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Spatial Direction &amp; Angle
              </h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Directional microphone arrays feed into Fast Fourier Transform (FFT) polar coordinate estimators, mapping dominant chaos to 8 cardinal sectors (N, NE, E, SE, S, SW, W, NW) with angular confidence.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] border border-white/5 rounded-sm">
              <h5 className="font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Audio-Only Density Level
              </h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Outputs an autonomous CADA Density Tier (Very Low, Low, Medium, High, Very High) allowing the system to monitor crowd surges even if cameras are fully blinded.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: MATHEMATICAL RISK SCORING ENGINE & INTERACTIVE SIMULATOR */}
        <section id="risk-engine" className="scroll-mt-24 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">06 / Mathematical Decision Framework</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              The Multimodal Chaotic Risk Scoring Engine
            </h2>
          </div>

          {/* Mathematical Formulations Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
            {/* Formula 1: E_Score */}
            <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-500 font-bold uppercase">1. Emotion Metric</span>
                <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-[#141414] rounded">Weight: 0.40</span>
              </div>
              <div className="p-3 bg-[#060606] border border-white/5 rounded text-center text-sm font-bold text-white">
                E_Score = (∑ w_i × e_i / n) × 10
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Quantifies facial stress across detected faces (n). Weights: Fear (10), Anger (9), Surprise (7), Disgust (6), Sad (4), Not Neutral (2), Happy (1).
              </p>
            </div>

            {/* Formula 2: D_Score */}
            <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-500 font-bold uppercase">2. Density Metric</span>
                <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-[#141414] rounded">Weight: 0.40</span>
              </div>
              <div className="p-3 bg-[#060606] border border-white/5 rounded text-center text-sm font-bold text-white">
                D_Score = min(100, (person_count / θ_venue) × 100)
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Evaluates person count against venue safety capacity (θ_venue=8 default). Adaptable threshold enables venue-specific calibration.
              </p>
            </div>

            {/* Formula 3: A_Score */}
            <div className="p-5 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-500 font-bold uppercase">3. Audio Chaos Metric</span>
                <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-[#141414] rounded">Weight: 0.20</span>
              </div>
              <div className="p-3 bg-[#060606] border border-white/5 rounded text-center text-sm font-bold text-white">
                A_Score = min(100, 0.4I + 0.3F + 0.3S)
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Fuses Audio Intensity (I), Movement/Volume Fluctuation (F), and Ambience-only noise (S) into a single normalized acoustic metric.
              </p>
            </div>
          </div>

          {/* Unified Formula Banner */}
          <div className="p-6 bg-gradient-to-r from-red-950/30 via-[#0d0d0d] to-red-950/20 border border-red-800/40 rounded-sm text-center font-mono space-y-2">
            <span className="text-xs text-gray-400 uppercase tracking-widest block">Unified Patent Decision Fusion Formula</span>
            <div className="text-lg sm:text-2xl font-bold text-white tracking-wider py-1">
              RiskScore = (0.4 × E_Score) + (0.4 × D_Score) + (0.2 × A_Score)
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs pt-2 text-gray-400">
              <span>Safe: &lt; 35</span>
              <span>Caution: &lt; 55</span>
              <span>Warning: &lt; 75</span>
              <span className="text-red-400 font-bold">Critical: &gt; 75 (Sprinkler Activated)</span>
            </div>
          </div>

          {/* LIVE INTERACTIVE SIMULATOR WIDGET */}
          <div className="p-6 sm:p-8 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4">
              <div>
                <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest block">Live Patent Demonstration</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Interactive Multimodal Risk Simulator</h3>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-[#121212] px-3 py-1 rounded border border-white/5">
                Adjust sliders to simulate live edge telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-5 font-mono text-xs">
                {/* Person Count Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <label htmlFor={personCountId} className="flex items-center gap-1.5 cursor-pointer">
                      <Users className="w-3.5 h-3.5 text-red-400" />
                      Person Count (Visual Density)
                    </label>
                    <span className="font-bold text-white">{simPersonCount} people</span>
                  </div>
                  <input 
                    id={personCountId}
                    type="range" 
                    min="1" 
                    max="25" 
                    value={simPersonCount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSimPersonCount(val);
                      if (simFacesCount > val) setSimFacesCount(val);
                    }}
                    className="w-full accent-red-600 h-1.5 bg-[#1f1f1f] rounded appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>1 (Sparse)</span>
                    <span>16 (Threshold)</span>
                    <span>25 (Dense Surge)</span>
                  </div>
                </div>

                {/* Faces Detected */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <label htmlFor={facesCountId} className="flex items-center gap-1.5 cursor-pointer">
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      Faces Detected (Student YOLOv8n-face)
                    </label>
                    <span className="font-bold text-white">{simFacesCount} / {simPersonCount}</span>
                  </div>
                  <input 
                    id={facesCountId}
                    type="range" 
                    min="0" 
                    max={simPersonCount} 
                    value={simFacesCount}
                    onChange={(e) => setSimFacesCount(Number(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-[#1f1f1f] rounded appearance-none cursor-pointer"
                  />
                </div>

                {/* Emotion Selector */}
                <div className="space-y-2">
                  <label htmlFor={emotionSelectId} className="text-gray-300 block">Dominant Facial Emotion State</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Fear', 'Anger', 'Surprise', 'Disgust', 'Sad', 'Neutral', 'Happy'] as const).map((emo) => (
                      <button
                        key={emo}
                        onClick={() => setSimEmotion(emo)}
                        className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                          simEmotion === emo 
                            ? 'bg-red-700 text-white font-bold border border-red-500 shadow-md' 
                            : 'bg-[#141414] text-gray-400 hover:text-white hover:bg-[#1e1e1e] border border-white/5'
                        }`}
                      >
                        {emo} (w={emotionWeights[emo]})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <label htmlFor={audioIntensityId} className="flex items-center gap-1.5 cursor-pointer">
                      <Volume2 className="w-3.5 h-3.5 text-red-400" />
                      Acoustic Chaos / Noise Intensity (CADA)
                    </label>
                    <span className="font-bold text-white">{simAudioIntensity}%</span>
                  </div>
                  <input 
                    id={audioIntensityId}
                    type="range" 
                    min="0" 
                    max="100" 
                    value={simAudioIntensity}
                    onChange={(e) => setSimAudioIntensity(Number(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-[#1f1f1f] rounded appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>0 (Quiet Ambience)</span>
                    <span>50 (Chanting/Cheering)</span>
                    <span>100 (Panic Shouting)</span>
                  </div>
                </div>
              </div>

              {/* Live Calculated Output Panel */}
              <div className="lg:col-span-5 bg-[#060606] border border-white/10 p-6 rounded-sm space-y-5">
                <div className="text-center pb-4 border-b border-white/10">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                    Calculated Chaotic Risk Score
                  </span>
                  <div className="text-5xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-2">
                    <span>{simRiskScore}</span>
                    <span className="text-xs text-gray-500 font-normal">/ 100</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className={`px-3 py-1 text-xs font-mono font-bold rounded uppercase flex items-center gap-1.5 ${riskStatus.bg} ${riskStatus.color} ${riskStatus.border} border`}>
                      {riskStatus.icon}
                      {riskStatus.label}
                    </span>
                  </div>
                </div>

                {/* Metric Subscore Breakdown */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>E_Score (Weight 0.4):</span>
                    <span className="text-white font-bold">{simEScore} / 100</span>
                  </div>
                  <div className="w-full bg-[#181818] h-1.5 rounded overflow-hidden">
                    <div className="bg-red-500 h-full rounded" style={{ width: `${simEScore}%` }} />
                  </div>

                  <div className="flex justify-between text-gray-400 pt-1">
                    <span>D_Score (Weight 0.4):</span>
                    <span className="text-white font-bold">{simDScore} / 100</span>
                  </div>
                  <div className="w-full bg-[#181818] h-1.5 rounded overflow-hidden">
                    <div className="bg-amber-500 h-full rounded" style={{ width: `${simDScore}%` }} />
                  </div>

                  <div className="flex justify-between text-gray-400 pt-1">
                    <span>A_Score (Weight 0.2):</span>
                    <span className="text-white font-bold">{simAScore} / 100</span>
                  </div>
                  <div className="w-full bg-[#181818] h-1.5 rounded overflow-hidden">
                    <div className="bg-blue-500 h-full rounded" style={{ width: `${simAScore}%` }} />
                  </div>
                </div>

                {/* Actuation Action */}
                <div className={`p-3 rounded border text-xs font-mono ${riskStatus.bg} ${riskStatus.border} space-y-1`}>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                    Automated System Response:
                  </span>
                  <p className={`font-medium ${riskStatus.color} leading-relaxed`}>
                    {riskStatus.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: EMPIRICAL RESULTS & EXPERIMENTAL CASE STUDIES */}
        <section id="empirical-results" className="scroll-mt-24 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">07 / Experimental Validation</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Empirical Results &amp; Real-World Case Studies (Figures 7, 8, 9, 10)
            </h2>
          </div>

          {/* Figure 7: Main Real-time Dashboard */}
          <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-sm group relative space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block">Figure 7 (IDF-B)</span>
                <h3 className="text-base font-bold text-white">Multi-Modal Crowd Chaos Detection Dashboard</h3>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-[#121212] px-2.5 py-1 rounded border border-white/5">
                Real-Time Analysis Results with Risk Assessment &amp; Status
              </span>
            </div>

            <div 
              onClick={() => setActiveImage({
                src: '/patent-assets/fig7_multimodal_dashboard.jpg',
                title: 'Figure 7: Multi-Modal Crowd Chaos Detection Dashboard',
                caption: 'Figure 7: Multi-Modal Crowd Chaos Detection Dashboard showing real-time video feeds with person and face detections, polar coordinate audio direction estimation, and live risk metrics.',
                badge: 'Figure 7: Live Dashboard (1407x977)'
              })}
              className="relative cursor-pointer overflow-hidden rounded bg-[#060606] flex items-center justify-center border border-white/5 max-h-[500px]"
            >
              <img 
                src="/patent-assets/fig7_multimodal_dashboard.jpg" 
                alt="Figure 7 Multi-Modal Dashboard" 
                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs gap-2">
                <Maximize2 className="w-4 h-4 text-red-400" />
                <span>Click to Inspect High-Resolution Dashboard</span>
              </div>
            </div>

            <p className="text-xs font-mono text-gray-400 pt-1">
              The operational dashboard simultaneously displays: (1) Optical feed with person counts and emotion tags; (2) Polar acoustic plots with directional angle estimation; (3) Live numerical telemetry for E_Score, D_Score, and A_Score; (4) Instantaneous safety status.
            </p>
          </div>

          {/* Case Studies Triad: Safe, Caution, Warning */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              Official Experimental Verification Case Studies
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Case 1: SAFE (Figure 10) */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between group">
                <div className="p-4 border-b border-white/5 bg-[#0e0e0e] flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    CASE 1: SAFE (Fig. 10)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 rounded font-bold">
                    Risk: 28.0 / 100
                  </span>
                </div>

                <div 
                  onClick={() => setActiveImage({
                    src: '/patent-assets/fig10_safe_case_result.jpg',
                    title: 'Figure 10: Sample Captured Result - "Safe" Case',
                    caption: 'Figure 10: Persons detected = 19, Faces = 0 (no emotion panic), E-Score = 0.0, D-Score = 70.0, A-Score = 0.0. Final Risk = 28.0 / 100 -> Safe (continue standard surveillance). Confirms no false alarm despite dense gathering.',
                    badge: 'Figure 10: Safe Case'
                  })}
                  className="p-3 bg-[#060606] cursor-pointer overflow-hidden aspect-[16/9] flex items-center justify-center border-b border-white/5"
                >
                  <img 
                    src="/patent-assets/fig10_safe_case_result.jpg" 
                    alt="Figure 10 Safe Case Result" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400">
                    <span>Persons: <strong className="text-white">19</strong></span>
                    <span>Faces: <strong className="text-white">0</strong></span>
                    <span>E_Score: <strong className="text-white">0.0</strong></span>
                    <span>D_Score: <strong className="text-white">70.0</strong></span>
                    <span>A_Score: <strong className="text-white">0.0</strong></span>
                    <span>Final Risk: <strong className="text-emerald-400">28.0</strong></span>
                  </div>
                  <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5 leading-relaxed">
                    <strong className="text-emerald-400">Key Finding:</strong> Confirms low emotional stress despite high density. Prevents false panic alarms in normal static assemblies.
                  </p>
                </div>
              </div>

              {/* Case 2: CAUTION (Figure 8) */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between group">
                <div className="p-4 border-b border-white/5 bg-[#0e0e0e] flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    CASE 2: CAUTION (Fig. 8)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-yellow-950/40 border border-yellow-800/40 text-yellow-300 rounded font-bold">
                    Risk: 44.6 / 100
                  </span>
                </div>

                <div 
                  onClick={() => setActiveImage({
                    src: '/patent-assets/fig8_caution_case_result.jpg',
                    title: 'Figure 8: Sample Captured Result - "Caution" Case',
                    caption: 'Figure 8: Persons detected = 15, Faces = 5. Emotion distribution: Neutral 40%, Fear 25%, Anger 15%. E-Score = 61.5, D-Score = 50.0, A-Score = 0.0. Final Risk = 44.6 / 100 -> Caution (monitor closely).',
                    badge: 'Figure 8: Caution Case'
                  })}
                  className="p-3 bg-[#060606] cursor-pointer overflow-hidden aspect-[16/9] flex items-center justify-center border-b border-white/5"
                >
                  <img 
                    src="/patent-assets/fig8_caution_case_result.jpg" 
                    alt="Figure 8 Caution Case Result" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400">
                    <span>Persons: <strong className="text-white">15</strong></span>
                    <span>Faces: <strong className="text-white">5</strong></span>
                    <span>E_Score: <strong className="text-white">61.5</strong></span>
                    <span>D_Score: <strong className="text-white">50.0</strong></span>
                    <span>A_Score: <strong className="text-white">0.0</strong></span>
                    <span>Final Risk: <strong className="text-yellow-400">44.6</strong></span>
                  </div>
                  <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5 leading-relaxed">
                    <strong className="text-yellow-400">Key Finding:</strong> Fear (25%) and Anger (15%) detected visually. Triggers heightened watch without causing unnecessary panic or disruption.
                  </p>
                </div>
              </div>

              {/* Case 3: WARNING (Figure 9) */}
              <div className="bg-[#0a0a0a] border border-red-600/40 rounded-sm overflow-hidden flex flex-col justify-between group bg-gradient-to-b from-red-950/20 to-transparent">
                <div className="p-4 border-b border-white/5 bg-[#0e0e0e] flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    CASE 3: WARNING (Fig. 9)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/60 border border-red-700/60 text-red-300 rounded font-bold">
                    Risk: 58.2 / 100
                  </span>
                </div>

                <div 
                  onClick={() => setActiveImage({
                    src: '/patent-assets/fig9_warning_case_result.jpg',
                    title: 'Figure 9: Sample Captured Result - "Warning" Case',
                    caption: 'Figure 9: Persons detected = 13, Faces = 13. Emotion: Neutral 40%, Fear 25%, Anger 15%. E-Score = 61.5, D-Score = 50.0, A-Score = 68.2. Audio direction: NW (325.1°) with 121% confidence. Final Risk = 58.2 / 100 -> Warning (immediate crowd control intervention issued).',
                    badge: 'Figure 9: Warning Case'
                  })}
                  className="p-3 bg-[#060606] cursor-pointer overflow-hidden aspect-[16/9] flex items-center justify-center border-b border-white/5"
                >
                  <img 
                    src="/patent-assets/fig9_warning_case_result.jpg" 
                    alt="Figure 9 Warning Case Result" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400">
                    <span>Persons: <strong className="text-white">13</strong></span>
                    <span>Faces: <strong className="text-white">13</strong></span>
                    <span>E_Score: <strong className="text-white">61.5</strong></span>
                    <span>A_Score: <strong className="text-red-400 font-bold">68.2</strong></span>
                    <span>Audio Vector: <strong className="text-white">NW (325.1°)</strong></span>
                    <span>Final Risk: <strong className="text-red-400 font-bold">58.2</strong></span>
                  </div>
                  <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5 leading-relaxed">
                    <strong className="text-red-400">Key Finding:</strong> Synchronized acoustic roar + high facial stress triggers urgent crowd intervention, pinpointing the NW surge direction for dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: PATENT CLAIMS & PROTECTED ASPECTS */}
        <section id="claims" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">08 / Intellectual Property Scope</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Aspects Protected Under Indian Patent 202541103106
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="font-bold text-white mb-1">Harmonics-Based Sound Fingerprinting (HBSF)</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Novel acoustic extraction pipeline using chroma feature mapping to differentiate panic frequencies from background crowd murmurs and public music.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="font-bold text-white mb-1">Crowd Acoustic Density Analysis (CADA)</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Audio-only crowd density estimation framework providing an autonomous CADA score (0–100) and density tiers under complete camera blindness.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="font-bold text-white mb-1">Multimodal Chaotic Risk Scoring Formula</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Mathematical fusion formulation: RiskScore = 0.4×E_Score + 0.4×D_Score + 0.2×A_Score with weighted emotion matrices and venue calibration.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <h4 className="font-bold text-white mb-1">Cascaded Distillation with YOLOv8n-face</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Edge optimization where teacher bounding boxes guide low-compute student models to extract facial micro-expressions without full-frame overhead.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-red-600/40 rounded-sm flex items-start gap-3 md:col-span-2 bg-gradient-to-r from-red-950/20 to-transparent">
              <span className="w-6 h-6 rounded bg-red-950/60 border border-red-700/60 text-red-400 font-bold flex items-center justify-center shrink-0">5</span>
              <div>
                <h4 className="font-bold text-white mb-1">Automated Emergency Sprinkler Response Integration</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Direct hardware actuation coupling where critical risk threshold breaches (&gt; 75) trigger automated overhead misting / sprinkler systems to de-escalate crowd panic and suppress temperature spikes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: CITATION & DOWNLOAD FOOTER */}
        <section id="citations" className="scroll-mt-24 p-6 sm:p-8 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest block">Cite This Work</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Official Citation &amp; BibTeX Reference</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopyBibtex}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-mono rounded transition-all cursor-pointer"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copiedBibtex ? 'Copied BibTeX!' : 'Copy BibTeX'}</span>
              </button>

              <button
                onClick={handleDownloadBibtex}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-mono rounded transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-red-400" />
                <span>Download .bib</span>
              </button>

              <a
                href="/patent-assets/Crowd%20Chaos%20Detection%20System%20for%20Crowd%20Safety%20Management%20Using%20Audio-Visual%20Signal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Official PDF</span>
              </a>
            </div>
          </div>

          {/* Inventor Names Reference Badges */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#0d0d0d] border border-white/5 rounded">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mr-1">Inventors:</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Dr. Padma Priya R</span>
            <span className="px-2.5 py-1 bg-red-950/40 border border-red-700/50 text-red-300 font-bold rounded text-xs font-mono">Rayban Pranav Mahesh</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Divyam Goel</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Tansiha Bagga</span>
          </div>

          {/* Formatted Citation Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#070707] border border-white/5 rounded space-y-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">IEEE Citation Format</span>
              <p className="text-gray-200 leading-relaxed text-[11px]">
                Dr. Padma Priya R, Rayban Pranav Mahesh, Divyam Goel, and Tansiha Bagga, &quot;Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal,&quot; Indian Patent Application 202541103106, filed Oct. 26, 2025, published Nov. 28, 2025. Assignee: Vellore Institute of Technology.
              </p>
            </div>

            <div className="p-4 bg-[#070707] border border-white/5 rounded space-y-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">APA Citation Format</span>
              <p className="text-gray-200 leading-relaxed text-[11px]">
                Dr. Padma Priya R, Rayban Pranav Mahesh, Divyam Goel, &amp; Tansiha Bagga (2025). <em>Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal</em> (Indian Patent Application No. 202541103106). Vellore Institute of Technology. Published November 28, 2025.
              </p>
            </div>
          </div>

          {/* Raw BibTeX Entry */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">BibTeX Code</span>
            <pre className="p-4 bg-[#050505] border border-white/10 rounded font-mono text-xs text-gray-300 overflow-x-auto selection:bg-red-900 leading-relaxed">
              {bibtexCitation}
            </pre>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-gray-400">
            <span>Official Assignee: Vellore Institute of Technology (VIT) · Patent App No: 202541103106 · IDF: 02-IPR-R003</span>
            <button 
              onClick={onBack}
              className="text-red-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-bold"
            >
              <span>Return to Portfolio</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
