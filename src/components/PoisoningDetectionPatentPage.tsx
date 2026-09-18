import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, ShieldAlert, 
  ShieldCheck, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  Terminal, Lock, RefreshCw, Filter, Database, GitBranch, GitFork, LineChart,
  Network, Sparkles, Brain, Bug, Shield, Clock, FileText, ChevronRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatentSEO } from '../hooks/usePatentSEO';
import { getPatentBySlug } from '../data/patentMetadata';

interface PoisoningDetectionPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
  figureNum?: string;
}

export default function PoisoningDetectionPatentPage({ onBack }: PoisoningDetectionPatentPageProps) {
  // Dynamic SEO meta tags, Google Scholar citation tags, OpenGraph & Schema.org JSON-LD
  usePatentSEO(getPatentBySlug('poisoning-detection')!);

  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'architecture' | 'trajectories' | 'clustering' | 'quarantine'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const checkpointsId = useId();
  const oscillationId = useId();
  const varianceId = useId();
  const clusterSizeId = useId();
  const targetFprId = useId();
  const cosineThreshId = useId();
  const unlearningToggleId = useId();

  // Preset scenarios
  type PresetKey = 'clean_hard' | 'backdoor_trigger' | 'stealth_campaign' | 'second_wave_descendant' | 'borderline_holdout';

  const [activePreset, setActivePreset] = useState<PresetKey>('backdoor_trigger');
  const [simCheckpoints, setSimCheckpoints] = useState<number>(10); // Checkpoint sequence length (3 - 15)
  const [simOscillation, setSimOscillation] = useState<number>(0.78); // 0.0 - 1.0
  const [simEstimatorVariance, setSimEstimatorVariance] = useState<number>(0.84); // 0.0 - 1.0 (Inter-estimator disagreement)
  const [simClusterSize, setSimClusterSize] = useState<number>(18); // Samples in cluster (1 - 50)
  const [simTargetFpr, setSimTargetFpr] = useState<number>(0.05); // Calibrated clean holdout ceiling (0.01 - 0.10)
  const [simCosineThresh, setSimCosineThresh] = useState<number>(0.70); // 0.50 - 0.90
  const [simApproxUnlearning, setSimApproxUnlearning] = useState<boolean>(true); // Newton-step verification enabled

  const presets: Record<PresetKey, {
    name: string;
    attackType: string;
    checkpoints: number;
    oscillation: number;
    estimatorVariance: number;
    clusterSize: number;
    targetFpr: number;
    cosineThresh: number;
    approxUnlearning: boolean;
    description: string;
    expectedOutcome: string;
  }> = {
    backdoor_trigger: {
      name: 'Backdoor Trigger Injection (Relabeled Patch)',
      attackType: 'Targeted Backdoor Poisoning',
      checkpoints: 10,
      oscillation: 0.82,
      estimatorVariance: 0.86,
      clusterSize: 22,
      targetFpr: 0.05,
      cosineThresh: 0.70,
      approxUnlearning: true,
      description: 'Covert synthetic trigger patch stamped onto training examples and relabeled to a designated target class. Causes volatile gradient shifts across checkpoint updates.',
      expectedOutcome: 'DETECTED & QUARANTINED (Trajectory Anomaly + High Disagreement)'
    },
    stealth_campaign: {
      name: 'Coordinated Multi-Sample Poisoning Campaign',
      attackType: 'Clean-Label Feature Collision',
      checkpoints: 12,
      oscillation: 0.74,
      estimatorVariance: 0.79,
      clusterSize: 34,
      targetFpr: 0.05,
      cosineThresh: 0.68,
      approxUnlearning: true,
      description: 'Subtle adversarial perturbations distributed across multiple images forming a dense cluster in latent representation space to alter decision boundaries.',
      expectedOutcome: 'HDBSCAN CLUSTER FLAGGED (UMAP Coherence + Counterfactual Verification)'
    },
    second_wave_descendant: {
      name: 'Second-Wave Descendant Campaign (New Batch)',
      attackType: 'Descendant Poisoning Stream',
      checkpoints: 8,
      oscillation: 0.65,
      estimatorVariance: 0.71,
      clusterSize: 15,
      targetFpr: 0.05,
      cosineThresh: 0.70,
      approxUnlearning: false,
      description: 'Incoming data batch introduced in subsequent retraining cycle exhibiting high cosine similarity to previously quarantined lineage fingerprints.',
      expectedOutcome: 'INSTANT LINEAGE MATCH (Cosine Similarity = 0.892 ≥ 0.70)'
    },
    clean_hard: {
      name: 'Legitimate Hard Sample (High Loss, Clean Baseline)',
      attackType: 'Clean Borderline Instance',
      checkpoints: 10,
      oscillation: 0.18,
      estimatorVariance: 0.14,
      clusterSize: 2,
      targetFpr: 0.05,
      cosineThresh: 0.70,
      approxUnlearning: true,
      description: 'Naturally ambiguous or noisy training sample exhibiting high instantaneous loss but maintaining a smooth, monotonic influence trajectory and estimator consensus.',
      expectedOutcome: 'RETAINED IN LIVE TRAINING STREAM (Verified Clean Trajectory)'
    },
    borderline_holdout: {
      name: 'Clean Reference Holdout Calibration Test',
      attackType: 'False Alarm Calibration',
      checkpoints: 10,
      oscillation: 0.32,
      estimatorVariance: 0.28,
      clusterSize: 4,
      targetFpr: 0.05,
      cosineThresh: 0.75,
      approxUnlearning: false,
      description: 'Clean holdout benchmark evaluation ensuring that the operational false positive rate remains strictly bounded within the calibrated α ≤ 0.05 threshold.',
      expectedOutcome: 'CALIBRATED PASS (FPR = 0.020 ≤ 0.05 Target Ceiling)'
    }
  };

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimCheckpoints(p.checkpoints);
    setSimOscillation(p.oscillation);
    setSimEstimatorVariance(p.estimatorVariance);
    setSimClusterSize(p.clusterSize);
    setSimTargetFpr(p.targetFpr);
    setSimCosineThresh(p.cosineThresh);
    setSimApproxUnlearning(p.approxUnlearning);
  };

  // Live Simulator Computations
  const trajectoryScore = Math.min(1.0, (simOscillation * 0.55 + (simCheckpoints / 15) * 0.15 + (simClusterSize > 10 ? 0.30 : 0.10) * simOscillation));
  const multiEstimatorScore = Math.min(1.0, (simEstimatorVariance * 0.7 + simOscillation * 0.3));
  const compositeSuspicion = Math.min(1.0, (trajectoryScore * 0.45 + multiEstimatorScore * 0.35 + (simClusterSize / 50) * 0.20));
  
  // Detection Threshold based on 90th percentile & target FPR
  const thresholdValue = 0.52 - (simTargetFpr - 0.05) * 1.5;
  const isFlaggedByTrajectory = compositeSuspicion >= thresholdValue;
  
  // Approximate unlearning verification delta (simulated validation loss reduction in % upon hypothetical removal)
  const unlearningLossReduction = simApproxUnlearning 
    ? (isFlaggedByTrajectory ? (compositeSuspicion * 4.2).toFixed(2) : '0.12')
    : 'N/A (Bypassed)';

  // Lineage cosine match for descendant campaigns
  const simulatedCosineMatch = activePreset === 'second_wave_descendant' 
    ? 0.892 
    : (activePreset === 'backdoor_trigger' ? 0.735 : 0.218);
  const isLineageMatched = simulatedCosineMatch >= simCosineThresh;

  // Final closed-loop decision
  let finalDecision: 'SAFE_TRAINING' | 'LINEAGE_MATCHED' | 'QUARANTINED' | 'FLAGGED_MONITOR';
  let decisionBadgeColor = 'bg-green-950/60 border-green-700/60 text-green-300';
  let decisionText = 'RETAINED IN ACTIVE RETRAINING STREAM';

  if (isLineageMatched) {
    finalDecision = 'LINEAGE_MATCHED';
    decisionBadgeColor = 'bg-red-950/80 border-red-500 text-red-200';
    decisionText = 'RECURSIVELY QUARANTINED (LINEAGE FINGERPRINT MATCH)';
  } else if (isFlaggedByTrajectory && simApproxUnlearning && parseFloat(unlearningLossReduction) > 1.5) {
    finalDecision = 'QUARANTINED';
    decisionBadgeColor = 'bg-red-950/80 border-red-600 text-red-200';
    decisionText = 'ISOLATED TO QUARANTINE PARTITION & FINGERPRINT LOGGED';
  } else if (isFlaggedByTrajectory) {
    finalDecision = 'FLAGGED_MONITOR';
    decisionBadgeColor = 'bg-amber-950/70 border-amber-500/70 text-amber-200';
    decisionText = 'FLAGGED SUSPECT (BELOW UNLEARNING CONFIRMATION THRESHOLD)';
  } else {
    finalDecision = 'SAFE_TRAINING';
    decisionBadgeColor = 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300';
    decisionText = 'VERIFIED CLEAN (ACTIVE LIVE UPDATE STREAM)';
  }

  // All 13 Figures from the Cyber Security Patent Research Portfolio
  const figures: ModalImage[] = [
    {
      figureNum: 'Figure 1',
      src: '/patent-assets/poisoning-detection/system_architecture_diagram.png',
      title: 'End-to-End Three-Pillar System Architecture',
      caption: 'Complete closed-loop architecture illustrating the per-checkpoint TracIn influence computation layer feeding the three novel pillars: (1) Trajectory & Stability Analysis, (2) Closed-Loop Quarantine via Approximate Unlearning, and (3) Provenance & Recursive Lineage Fingerprinting.',
      badge: 'Native 1800x1200 Architecture Diagram'
    },
    {
      figureNum: 'Figure 2',
      src: '/patent-assets/poisoning-detection/class_distribution.png',
      title: 'Training Data Class Distribution',
      caption: 'Class distribution across the CIFAR-10 evaluation corpus confirming equal sample balance across all ten categorical classes prior to synthetic backdoor trigger injection.',
      badge: 'Clean Baseline Dataset Split'
    },
    {
      figureNum: 'Figure 3',
      src: '/patent-assets/poisoning-detection/clean_vs_poisoned.png',
      title: 'Clean vs. Backdoor-Poisoned Sample Visual Comparison',
      caption: 'Visual inspection of clean images versus covertly poisoned examples bearing bottom-right synthetic trigger patches with relabeled target classes, demonstrating the stealthy nature of visual manipulation.',
      badge: 'Adversarial Backdoor Examples'
    },
    {
      figureNum: 'Figure 4',
      src: '/patent-assets/poisoning-detection/training_curves.png',
      title: 'Training Dynamics (Loss & Accuracy Checkpoint Sequence)',
      caption: 'Training loss decay and validation accuracy ascent plotted across sequential training checkpoints, establishing the temporal backbone for computing per-sample influence vectors over time.',
      badge: 'Checkpoint Sequence Backbone'
    },
    {
      figureNum: 'Figure 5',
      src: '/patent-assets/poisoning-detection/influence_distributions.png',
      title: 'Influence Score Distributions Across Training Steps',
      caption: 'Step-by-step distributions of instantaneous TracIn influence scores comparing clean versus poisoned samples, illustrating that static single-point influence metrics fail to reliably separate adversarial inputs.',
      badge: 'Single-Point Influence Limitation'
    },
    {
      figureNum: 'Figure 6',
      src: '/patent-assets/poisoning-detection/trajectory_examples.png',
      title: 'Temporal Influence Trajectories (Clean vs. Poisoned)',
      caption: 'Time-series influence trajectories tracked across model checkpoints. Poisoned samples exhibit characteristic oscillatory, erratic trajectories contrasting with smooth monotonic trajectories of clean instances.',
      badge: 'Core Trajectory Signal'
    },
    {
      figureNum: 'Figure 7',
      src: '/patent-assets/poisoning-detection/trajectory_score_distribution.png',
      title: 'Composite Trajectory Anomaly Score Distribution',
      caption: 'Empirical distribution of the composite trajectory anomaly score across the training corpus with the 90th percentile detection cutoff demarcating candidate samples flagged for stability verification.',
      badge: '90th Percentile Cutoff'
    },
    {
      figureNum: 'Figure 8',
      src: '/patent-assets/poisoning-detection/estimator_scatter.png',
      title: 'Multi-Estimator Stability Scatter & Inter-Estimator Variance',
      caption: 'Scatter plot of three independent stochastic influence approximations plotted against cross-estimator variance, providing multi-perspective stability metrics that complement trajectory shape analysis.',
      badge: 'Multi-Estimator Consensus'
    },
    {
      figureNum: 'Figure 9',
      src: '/patent-assets/poisoning-detection/umap_clusters.png',
      title: 'UMAP Embedding & HDBSCAN Cluster Map',
      caption: 'Low-dimensional UMAP manifold projection combining trajectory features and multi-estimator variance vectors with HDBSCAN density clustering isolating coordinated adversarial poisoning clusters.',
      badge: 'Coordinated Cluster Discovery'
    },
    {
      figureNum: 'Figure 10',
      src: '/patent-assets/poisoning-detection/roc_composite.png',
      title: 'Composite Poisoning Score ROC & Calibration Curve',
      caption: 'Receiver Operating Characteristic (ROC) curve for composite score fusion with calibrated false-positive rate thresholding ensuring operational stability against clean reference holdout data.',
      badge: 'FPR ≤ 0.05 Calibration'
    },
    {
      figureNum: 'Figure 11',
      src: '/patent-assets/poisoning-detection/quarantine_outcome.png',
      title: 'Counterfactual Quarantine Outcome via Approximate Unlearning',
      caption: 'Closed-loop verification outcome using Newton-step approximate unlearning to estimate counterfactual validation loss shifts prior to partitioning confirmed poisoned clusters into quarantine.',
      badge: 'Newton-Step Verification'
    },
    {
      figureNum: 'Figure 12',
      src: '/patent-assets/poisoning-detection/lineage_heatmap.png',
      title: 'Recursive Lineage Fingerprint Matching Heatmap',
      caption: 'Cosine similarity matrix matching second-wave incoming data against stored quarantine lineage fingerprints, demonstrating robust re-identification of descendant poisoning campaigns (F1 = 0.678).',
      badge: 'Lineage Fingerprint Cosine Matrix'
    },
    {
      figureNum: 'Benchmark',
      src: '/patent-assets/poisoning-detection/benchmark.png',
      title: 'Empirical Benchmark Evaluation Across Pipeline Stages',
      caption: 'Comparative quantitative benchmark comparing trajectory detection, composite calibration, approximate unlearning quarantine, and recursive lineage matching across Precision, Recall, and FPR.',
      badge: 'Empirical Benchmark Suite'
    }
  ];

  const filteredFigures = figures.filter(fig => {
    if (selectedGalleryTab === 'all') return true;
    if (selectedGalleryTab === 'architecture') return fig.figureNum === 'Figure 1' || fig.figureNum === 'Figure 4' || fig.figureNum === 'Benchmark';
    if (selectedGalleryTab === 'trajectories') return fig.figureNum === 'Figure 5' || fig.figureNum === 'Figure 6' || fig.figureNum === 'Figure 7' || fig.figureNum === 'Figure 8';
    if (selectedGalleryTab === 'clustering') return fig.figureNum === 'Figure 2' || fig.figureNum === 'Figure 3' || fig.figureNum === 'Figure 9' || fig.figureNum === 'Figure 10';
    if (selectedGalleryTab === 'quarantine') return fig.figureNum === 'Figure 11' || fig.figureNum === 'Figure 12';
    return true;
  });

  const bibtexCitation = `@patent{mahesh2026poisoningdetection,
  title     = {Influence-Trajectory-Based Poisoning Detection with Multi Estimator Stability and Lineage Fingerprinting},
  author    = {Meenakshi and Jaikrishnan, Jaishree and Charhate, Mrinali Prafull and Mahesh, Rayban Pranav},
  number    = {IN202641110083 A1},
  type      = {Patent Application},
  country   = {India},
  assignee  = {Vellore Institute of Technology},
  filing_date = {2026-09-14},
  publication_date = {2026-09-18},
  url       = {https://www.raybanpranav.tech/#/patent/poisoning-detection}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCitation);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-red-900 selection:text-white pb-20 antialiased">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <div 
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#0b0b0b] border border-white/10 rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#101010]">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-red-950/60 border border-red-700/60 text-red-300 font-mono text-xs uppercase font-bold rounded-xs">
                    {activeImage.figureNum || 'Patent Asset'}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-200 tracking-wide">{activeImage.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6 bg-black/60">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="max-h-[68vh] w-auto max-w-full object-contain rounded-xs border border-white/5 shadow-2xl"
                />
              </div>

              <div className="px-5 py-3.5 bg-[#0e0e0e] border-t border-white/10 text-xs text-gray-400 leading-relaxed font-mono">
                <span className="text-gray-200 font-semibold">{activeImage.figureNum}: </span>
                {activeImage.caption}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-mono rounded transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/patent-assets/poisoning-detection/INFLUENCE-TRAJECTORY-BASED%20POISONING%20DETECTION.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/70 hover:bg-red-900 border border-red-700/60 hover:border-red-500 rounded text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-red-300" />
              <span>Official Patent PDF</span>
              <ExternalLink className="w-3 h-3 text-red-400" />
            </a>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-800/50 rounded text-red-300 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Indian Patent 202641110083
            </span>
            <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-700/50 rounded text-emerald-300 text-[11px] font-mono">
              U/S 11A Published · 18/09/2026
            </span>
          </div>
        </div>
      </header>


      {/* Hero / Patent Header */}
      <section className="relative px-4 sm:px-8 pt-10 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0e0404] via-[#070707] to-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 text-[11px] font-mono">
            <span className="px-3 py-1 bg-red-950/60 border border-red-700/60 text-red-300 font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-red-400" />
              Official Indian Patent Application
            </span>
            <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 rounded-xs">
              Application No: <strong className="text-white">202641110083</strong>
            </span>
            <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 rounded-xs">
              Publication: <strong className="text-white">IN202641110083 A1</strong>
            </span>
            <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 rounded-xs">
              Field: <strong className="text-white">Computer Science</strong>
            </span>
            <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-800/40 text-blue-300 rounded-xs">
              Ordinary Application
            </span>
          </div>

          {/* Patent Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4 uppercase">
            Influence-Trajectory-Based Poisoning Detection with Multi Estimator Stability and Lineage Fingerprinting
          </h1>

          {/* Subtitle / Descriptive Scope */}
          <p className="text-sm sm:text-base text-gray-300 max-w-5xl leading-relaxed mb-6 font-light">
            A closed-loop artificial intelligence cybersecurity framework designed for continually updated machine learning models. 
            The system transforms per-checkpoint last-layer TracIn influence metrics into temporal trajectories, computes stability variance across independent stochastic estimators, discovers coordinated adversarial groups via UMAP and HDBSCAN, validates suspects via Newton-step approximate unlearning, and enforces continuous provenance protection through cosine similarity lineage fingerprinting.
          </p>

          {/* Key Registration Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-sm mb-6 text-xs font-mono">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Filing Date</span>
              <span className="text-gray-200 font-bold">14 September 2026</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Publication Date</span>
              <span className="text-red-400 font-bold">18 September 2026</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Applicant / Assignee</span>
              <span className="text-gray-200 font-bold">Vellore Institute of Technology</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Official Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Published (U/S 11A)
              </span>
            </div>
          </div>

          {/* Government IPO Progress Bar Tracker */}
          <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
            <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-gray-400">
              <span className="text-gray-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Official Indian Patent Office (IPO) Lifecycle Tracker
              </span>
              <span className="text-emerald-400 font-bold">Current Stage: Awaiting Request for Examination</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
              <div className="py-2 bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 rounded font-bold">
                ✓ Filed (14/09/2026)
              </div>
              <div className="py-2 bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 rounded font-bold animate-pulse">
                ✓ Published (18/09/2026)
              </div>
              <div className="py-2 bg-[#151515] border border-white/10 text-gray-400 rounded">
                RQ Filed
              </div>
              <div className="py-2 bg-[#151515] border border-white/10 text-gray-500 rounded">
                Under Examination
              </div>
              <div className="py-2 bg-[#151515] border border-white/10 text-gray-500 rounded">
                Disposed (Grant)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-16">
        
        {/* SECTION 1: Form 5 Declaration of Inventorship */}
        <section className="bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <Users className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">FORM 5 · DECLARATION AS TO INVENTORSHIP</h2>
              <p className="text-xs text-gray-400 font-mono">The Patents Act, 1970 (39 of 1970) &amp; The Patent Rules, 2003 [Section 10(6) and Rule 13(6)]</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inventor 1 */}
            <div className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-gray-400">Inventor (a)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-gray-300 rounded">Indian National</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">MEENAKSHI</h3>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Department of English, School of Social Sciences and Languages (SSL)<br />
                Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu, India - 632014
              </p>
            </div>

            {/* Inventor 2 */}
            <div className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-gray-400">Inventor (b)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-gray-300 rounded">Indian National</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">DR. JAISHREE JAIKRISHNAN</h3>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Department of English, School of Social Sciences and Languages (SSL)<br />
                Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu, India - 632014
              </p>
            </div>

            {/* Inventor 3 */}
            <div className="p-4 bg-[#0d0d0d] border border-white/10 rounded-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-gray-400">Inventor (c)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-gray-300 rounded">Indian National</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">MRINALI PRAFULL CHARHATE</h3>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Information Security, School of Computer Science and Engineering (SCOPE)<br />
                Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu, India - 632014
              </p>
            </div>

            {/* Inventor 4 (Rayban) */}
            <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-red-400 font-semibold">Inventor (d) · Lead AI/ML Architecture</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-900/40 text-red-200 border border-red-700/50 rounded font-bold">Indian National</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">RAYBAN PRANAV MAHESH</h3>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                Software Systems, School of Computer Science and Engineering (SCOPE)<br />
                Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu, India - 632014
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Problem Formulation & Technological Gap */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              1. The Adversarial Threat: Poisoning in Continually Updated ML
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">Why traditional single-point anomaly detection fails against stealthy backdoor attacks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#090909] border border-white/10 rounded-sm space-y-3">
              <div className="w-8 h-8 rounded bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dynamic Continual Updates</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Modern production AI systems ingest continuous data streams. Adversaries exploit this ongoing learning loop by injecting perturbed samples incrementally over multiple checkpoints, preventing instantaneous threshold alarms.
              </p>
            </div>

            <div className="p-5 bg-[#090909] border border-white/10 rounded-sm space-y-3">
              <div className="w-8 h-8 rounded bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Static Influence Inadequacy</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Single-checkpoint TracIn and gradient scoring methods merely measure momentary sample impact. Hard-but-clean instances regularly mirror the instantaneous gradient magnitude of poisoned data, triggering devastating false alarms.
              </p>
            </div>

            <div className="p-5 bg-[#090909] border border-white/10 rounded-sm space-y-3">
              <div className="w-8 h-8 rounded bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Costly Retraining Cycles</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Standard defensive remediation requires purging candidate data and executing a complete cold retrain from step zero. The disclosed system introduces closed-loop counterfactual quarantine without restarting the full training cycle.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Prior Art Comparison Matrix */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-red-500" />
              2. Prior Art &amp; Patent Landscape Comparison
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">Gaps in conventional methods relative to the disclosed multi-estimator trajectory architecture</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-white/10 text-xs text-left bg-[#080808]">
              <thead className="bg-[#121212] border-b border-white/10 text-gray-300 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3.5 border-r border-white/10">Prior Art Family</th>
                  <th className="p-3.5 border-r border-white/10">Representative Approach</th>
                  <th className="p-3.5 border-r border-white/10">Relevance to Invention</th>
                  <th className="p-3.5 text-red-400">Gap Relative to This Invention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-gray-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">TracIn / Influence Functions</td>
                  <td className="p-3.5 border-r border-white/10">Validation loss tracking across steps</td>
                  <td className="p-3.5 border-r border-white/10">Mathematical foundation for scoring</td>
                  <td className="p-3.5 text-gray-400">Does not detect poisoning by trajectory shape, variance stability, or lineage</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Gradient-Based Detection</td>
                  <td className="p-3.5 border-r border-white/10">Instantaneous gradient anomaly screening</td>
                  <td className="p-3.5 border-r border-white/10">Sample-level suspicion scoring</td>
                  <td className="p-3.5 text-gray-400">Restricted to static point scores; blind to temporal dynamics across checkpoints</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Federated Round Trajectories</td>
                  <td className="p-3.5 border-r border-white/10">Detecting FL round updates anomalies</td>
                  <td className="p-3.5 border-r border-white/10">Temporal update modeling concept</td>
                  <td className="p-3.5 text-gray-400">Operates on federated updates; lacks checkpoint TracIn, multi-estimator variance, and lineage matching</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">US20210374247A1 (Provenance Def.)</td>
                  <td className="p-3.5 border-r border-white/10">Data provenance filters for ML hardening</td>
                  <td className="p-3.5 border-r border-white/10">Lineage and poisoning defense</td>
                  <td className="p-3.5 text-gray-400">Focuses on static metadata filtering, not influence trajectories, Newton-step quarantine, or recursive cosine matching</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">CN116739073B (Evolutionary Dev.)</td>
                  <td className="p-3.5 border-r border-white/10">Online backdoor deviation detection</td>
                  <td className="p-3.5 border-r border-white/10">Online backdoor defense context</td>
                  <td className="p-3.5 text-gray-400">Does not combine checkpoint influence trajectories, multi-estimator disagreement variance, or recursive lineage fingerprints</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: The Three Architectural Pillars */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-red-500" />
              3. The Three Analytical Pillars of the Invention
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">End-to-end operational pipeline combining temporal tracking, counterfactual verification, and provenance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-[#090909] border border-white/10 rounded-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-950/20 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2.5 text-red-400 font-mono text-xs font-bold uppercase">
                <span className="w-6 h-6 rounded bg-red-950 border border-red-700/60 flex items-center justify-center text-white text-xs">1</span>
                Pillar 1: Trajectory &amp; Stability
              </div>
              <h3 className="text-base font-bold text-white">Checkpoint Dynamics &amp; Multi-Estimator Consensus</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Computes per-sample TracIn influence vectors across saved model checkpoints:
              </p>
              <div className="p-3 bg-[#111] border border-white/5 rounded font-mono text-[11px] text-gray-300">
                <code>I(z, z_val) = Σ η_k ∇_θ L(z; θ_k)ᵀ ∇_θ L(z_val; θ_k)</code>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Extracts temporal trajectory features (oscillation index, rolling variance, Z-score peaks) and cross-references them against three independent projection estimators to capture inter-estimator variance.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#090909] border border-white/10 rounded-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-950/20 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2.5 text-red-400 font-mono text-xs font-bold uppercase">
                <span className="w-6 h-6 rounded bg-red-950 border border-red-700/60 flex items-center justify-center text-white text-xs">2</span>
                Pillar 2: Closed-Loop Quarantine
              </div>
              <h3 className="text-base font-bold text-white">Approximate Unlearning Verification</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Embeds joint features via UMAP and applies HDBSCAN density clustering to identify coordinated adversarial cells. Suspicious candidate clusters are verified via Newton-step approximate unlearning:
              </p>
              <div className="p-3 bg-[#111] border border-white/5 rounded font-mono text-[11px] text-gray-300">
                <code>Δθ ≈ - H⁻¹ ∇_θ L(z_c; θ)</code>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Confirms whether cluster removal counterfactually reduces validation loss without full model retraining, routing confirmed clusters to isolated quarantine.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#090909] border border-white/10 rounded-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-950/20 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2.5 text-red-400 font-mono text-xs font-bold uppercase">
                <span className="w-6 h-6 rounded bg-red-950 border border-red-700/60 flex items-center justify-center text-white text-xs">3</span>
                Pillar 3: Lineage &amp; Provenance
              </div>
              <h3 className="text-base font-bold text-white">Recursive Fingerprint Matching</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Stores confirmed quarantined clusters as normalized influence vector fingerprints in an append-only cryptographic lineage ledger:
              </p>
              <div className="p-3 bg-[#111] border border-white/5 rounded font-mono text-[11px] text-gray-300">
                <code>sim(u, v) = (u · v) / (||u|| ||v||) ≥ 0.70</code>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                When new training batches arrive in subsequent update cycles, incoming samples are scanned via cosine similarity, intercepting second-wave descendant campaigns with <strong>F1 = 0.678</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: High-Resolution Gallery with Modal */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-red-500" />
                4. Visual Evidence &amp; System Figure Gallery
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-1">High-resolution figures from the research disclosure (Click any image to expand in full lightbox)</p>
            </div>

            {/* Gallery Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#101010] border border-white/10 rounded text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('all')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${selectedGalleryTab === 'all' ? 'bg-red-950 text-white font-bold border border-red-700/60' : 'text-gray-400 hover:text-white'}`}
              >
                All Figures (13)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('architecture')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${selectedGalleryTab === 'architecture' ? 'bg-red-950 text-white font-bold border border-red-700/60' : 'text-gray-400 hover:text-white'}`}
              >
                Architecture
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('trajectories')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${selectedGalleryTab === 'trajectories' ? 'bg-red-950 text-white font-bold border border-red-700/60' : 'text-gray-400 hover:text-white'}`}
              >
                Trajectories &amp; Stability
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('clustering')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${selectedGalleryTab === 'clustering' ? 'bg-red-950 text-white font-bold border border-red-700/60' : 'text-gray-400 hover:text-white'}`}
              >
                UMAP &amp; Calibration
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('quarantine')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${selectedGalleryTab === 'quarantine' ? 'bg-red-950 text-white font-bold border border-red-700/60' : 'text-gray-400 hover:text-white'}`}
              >
                Quarantine &amp; Lineage
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFigures.map((fig, idx) => (
              <motion.div
                key={fig.figureNum + '-' + idx}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => setActiveImage(fig)}
                className="group relative bg-[#090909] border border-white/10 hover:border-red-600/60 rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all shadow-md hover:shadow-red-950/20"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] bg-black/60 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={fig.src}
                    alt={fig.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <span className="text-[11px] font-mono text-white flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-red-400" /> Click to Inspect
                    </span>
                    {fig.badge && (
                      <span className="px-2 py-0.5 bg-black/80 text-gray-300 text-[9px] font-mono rounded border border-white/10">
                        {fig.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Meta */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-white/5 bg-[#0b0b0b]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">{fig.figureNum}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors line-clamp-1">{fig.title}</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-1.5 line-clamp-2 leading-relaxed">{fig.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Interactive Live Simulator */}
        <section className="bg-gradient-to-br from-[#0c0404] via-[#090909] to-[#070707] border border-red-900/40 rounded-sm p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-950/60 border border-red-700/60 text-red-300 font-mono text-[10px] uppercase font-bold rounded-xs">
                  Interactive Defense Simulation
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Cpu className="w-6 h-6 text-red-500" />
                5. Influence-Trajectory &amp; Closed-Loop Quarantine Simulator
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Test the pipeline dynamics across varying backdoor trigger profiles, multi-estimator variance, and recursive lineage matching
              </p>
            </div>

            {/* Presets Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor={presetSelectId} className="text-xs font-mono text-gray-400 shrink-0">Preset Scenario:</label>
              <select
                id={presetSelectId}
                value={activePreset}
                onChange={(e) => applyPreset(e.target.value as PresetKey)}
                className="bg-[#141414] border border-white/20 text-xs font-mono text-white rounded px-3 py-1.5 focus:border-red-500 focus:outline-none cursor-pointer"
              >
                <option value="backdoor_trigger">Backdoor Trigger Injection</option>
                <option value="stealth_campaign">Coordinated Multi-Sample Campaign</option>
                <option value="second_wave_descendant">Second-Wave Descendant Campaign</option>
                <option value="clean_hard">Legitimate Hard Sample (Clean)</option>
                <option value="borderline_holdout">Clean Holdout Calibration (FPR ≤ 0.05)</option>
              </select>
            </div>
          </div>

          {/* Active Preset Description Card */}
          <div className="p-4 bg-[#110808] border border-red-800/30 rounded text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold uppercase tracking-wider">{presets[activePreset].name}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-300">{presets[activePreset].attackType}</span>
              </div>
              <p className="text-gray-400 leading-relaxed">{presets[activePreset].description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] uppercase text-gray-500 block">Expected System Behavior</span>
              <span className="text-xs text-white font-bold">{presets[activePreset].expectedOutcome}</span>
            </div>
          </div>

          {/* Controls & Metrics Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-5 text-xs font-mono">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-400" /> Pipeline Parameters &amp; Feature Inputs
              </h3>

              {/* Checkpoints Evaluated */}
              <div className="space-y-1.5 bg-[#0d0d0d] p-3 border border-white/5 rounded">
                <div className="flex justify-between text-gray-300">
                  <label htmlFor={checkpointsId}>Temporal Checkpoints Evaluated (K):</label>
                  <span className="text-red-400 font-bold">{simCheckpoints} Checkpoints</span>
                </div>
                <input
                  id={checkpointsId}
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={simCheckpoints}
                  onChange={(e) => setSimCheckpoints(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>K=3 (Early Checkpoint)</span>
                  <span>K=10 (Standard)</span>
                  <span>K=15 (Deep Dynamics)</span>
                </div>
              </div>

              {/* Trajectory Oscillation Index */}
              <div className="space-y-1.5 bg-[#0d0d0d] p-3 border border-white/5 rounded">
                <div className="flex justify-between text-gray-300">
                  <label htmlFor={oscillationId}>Trajectory Oscillation &amp; Volatility Index:</label>
                  <span className="text-red-400 font-bold">{simOscillation.toFixed(2)}</span>
                </div>
                <input
                  id={oscillationId}
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.01"
                  value={simOscillation}
                  onChange={(e) => setSimOscillation(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Smooth Monotonic (&lt; 0.3)</span>
                  <span>Erratic Backdoor (&gt; 0.7)</span>
                </div>
              </div>

              {/* Multi-Estimator Disagreement */}
              <div className="space-y-1.5 bg-[#0d0d0d] p-3 border border-white/5 rounded">
                <div className="flex justify-between text-gray-300">
                  <label htmlFor={varianceId}>Multi-Estimator Disagreement Variance (σ²_multi):</label>
                  <span className="text-red-400 font-bold">{simEstimatorVariance.toFixed(2)}</span>
                </div>
                <input
                  id={varianceId}
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.01"
                  value={simEstimatorVariance}
                  onChange={(e) => setSimEstimatorVariance(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>High Consensus (&lt; 0.25)</span>
                  <span>Adversarial Instability (&gt; 0.75)</span>
                </div>
              </div>

              {/* Candidate Cluster Size */}
              <div className="space-y-1.5 bg-[#0d0d0d] p-3 border border-white/5 rounded">
                <div className="flex justify-between text-gray-300">
                  <label htmlFor={clusterSizeId}>HDBSCAN Cluster Size (UMAP Coherence):</label>
                  <span className="text-red-400 font-bold">{simClusterSize} Candidate Samples</span>
                </div>
                <input
                  id={clusterSizeId}
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={simClusterSize}
                  onChange={(e) => setSimClusterSize(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Toggle for Newton-Step Approximate Unlearning */}
              <div className="flex items-center justify-between p-3 bg-[#0d0d0d] border border-white/5 rounded">
                <div>
                  <span className="text-white font-bold block">Newton-Step Approximate Unlearning</span>
                  <span className="text-[10px] text-gray-400">Counterfactually estimate validation loss drop prior to quarantine</span>
                </div>
                <input
                  id={unlearningToggleId}
                  type="checkbox"
                  checked={simApproxUnlearning}
                  onChange={(e) => setSimApproxUnlearning(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Right Output: Live Gauges & System Remedial Decision */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-red-400" /> Pipeline Decision Engine
                </h3>

                {/* Decision Output Banner */}
                <div className={`p-4 border rounded-sm ${decisionBadgeColor} space-y-2`}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="uppercase tracking-wider font-bold">Autonomous Decision:</span>
                    <span className="font-bold">{finalDecision}</span>
                  </div>
                  <div className="text-base font-extrabold tracking-wide uppercase">
                    {decisionText}
                  </div>
                </div>

                {/* Score Meters */}
                <div className="space-y-3 font-mono text-xs bg-[#090909] p-4 border border-white/10 rounded-sm">
                  {/* Trajectory Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">1. Trajectory Anomaly Score (S_traj):</span>
                      <span className="text-white font-bold">{trajectoryScore.toFixed(3)}</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className={`h-full transition-all duration-300 ${trajectoryScore > 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${trajectoryScore * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Multi-Estimator Stability Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">2. Estimator Instability Index (V_multi):</span>
                      <span className="text-white font-bold">{multiEstimatorScore.toFixed(3)}</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className={`h-full transition-all duration-300 ${multiEstimatorScore > 0.6 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${multiEstimatorScore * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Composite Suspicion Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">3. Composite Poisoning Score (S_comp):</span>
                      <span className="text-white font-bold">{compositeSuspicion.toFixed(3)}</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className={`h-full transition-all duration-300 ${compositeSuspicion >= thresholdValue ? 'bg-red-600' : 'bg-emerald-600'}`}
                        style={{ width: `${compositeSuspicion * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-500 flex justify-between pt-0.5">
                      <span>Calibrated Threshold: {thresholdValue.toFixed(3)}</span>
                      <span>Target FPR: {(simTargetFpr * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Newton-step Unlearning Validation Delta */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Unlearning Validation Loss Delta:</span>
                    <span className={`font-bold ${parseFloat(unlearningLossReduction) > 1.5 ? 'text-red-400' : 'text-gray-300'}`}>
                      {unlearningLossReduction !== 'N/A (Bypassed)' ? `-${unlearningLossReduction}%` : unlearningLossReduction}
                    </span>
                  </div>

                  {/* Lineage Cosine Similarity Match */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Lineage Cosine Fingerprint Match:</span>
                    <span className={`font-bold ${isLineageMatched ? 'text-red-400' : 'text-emerald-400'}`}>
                      {simulatedCosineMatch.toFixed(3)} (Cutoff: {simCosineThresh.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Provenance Hash & Lineage Key */}
              <div className="p-3 bg-[#080808] border border-white/10 rounded font-mono text-[10px] text-gray-400 space-y-1">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-red-400" /> Lineage Fingerprint Hash:
                  </span>
                  <span className="text-emerald-400">SHA-256 Verified</span>
                </div>
                <div className="text-gray-500 truncate">
                  <code>0x7f4b892a01ce94e5d898c56d734e0fa82bc19448ec8231578bca6120e3419bb9</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Experimental Validation & Empirical Benchmarks */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <LineChart className="w-6 h-6 text-red-500" />
              6. Empirical Validation Results on CIFAR-10
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">Quantitative experimental metrics measured across prototype execution</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-white/10 text-xs text-left bg-[#080808]">
              <thead className="bg-[#121212] border-b border-white/10 text-gray-300 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3.5 border-r border-white/10">Detection Stage / Claim</th>
                  <th className="p-3.5 text-center border-r border-white/10">Precision</th>
                  <th className="p-3.5 text-center border-r border-white/10">Recall</th>
                  <th className="p-3.5 text-center border-r border-white/10">F1 Score</th>
                  <th className="p-3.5 text-center border-r border-white/10">FPR</th>
                  <th className="p-3.5">Empirical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-gray-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Claim 1 — Trajectory Detection (90th percentile)</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.037</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.074</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.050</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.101</td>
                  <td className="p-3.5 text-gray-400">Weak but nontrivial separation from clean samples across checkpoints</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Claims 13+14 — Composite + Calibration (FPR ≤ 0.05)</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.012</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.004</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.006</td>
                  <td className="p-3.5 text-center border-r border-white/10 text-emerald-400 font-bold">0.020</td>
                  <td className="p-3.5 text-gray-400">Conservative operational calibration strictly below target 5% ceiling</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Claims 15+17 — Counterfactual Quarantine</td>
                  <td className="p-3.5 text-center border-r border-white/10">—</td>
                  <td className="p-3.5 text-center border-r border-white/10">—</td>
                  <td className="p-3.5 text-center border-r border-white/10">—</td>
                  <td className="p-3.5 text-center border-r border-white/10 text-amber-400 font-bold">High</td>
                  <td className="p-3.5 text-gray-400">11 True Positives quarantined; requires step-size regularization (Section 7)</td>
                </tr>
                <tr className="hover:bg-white/[0.02] bg-red-950/20">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">Claims 18+19 — Recursive Lineage Match (Cosine ≥ 0.70)</td>
                  <td className="p-3.5 text-center border-r border-white/10 text-red-300 font-bold">0.690</td>
                  <td className="p-3.5 text-center border-r border-white/10 text-red-300 font-bold">0.667</td>
                  <td className="p-3.5 text-center border-r border-white/10 text-red-300 font-bold">0.678</td>
                  <td className="p-3.5 text-center border-r border-white/10">0.300</td>
                  <td className="p-3.5 text-red-200 font-bold">Strongest practical performance; robustly intercepts descendant attacks</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 font-bold text-white border-r border-white/10">ROC-AUC (Composite Score)</td>
                  <td className="p-3.5 text-center border-r border-white/10" colSpan={4}>0.1863 (Prototype Inversion Documented in §8.3)</td>
                  <td className="p-3.5 text-gray-400">Numerical discrepancy documented in audit protocol below</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 8: Errata, Critical Fixes & Recommended Corrections */}
        <section className="bg-[#0a0a0a] border border-amber-900/50 rounded-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-amber-900/40 pb-4">
            <Bug className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">7. TECHNICAL ERRATA, CRITICAL FIXES &amp; AUDIT TRAIL</h2>
              <p className="text-xs text-amber-300/80 font-mono">Formal documentation from Section 8.3 of Invention Disclosure Form</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#110e08] border border-amber-800/40 rounded space-y-2">
              <span className="text-amber-400 font-bold block">1. AUC Numerical Discrepancy &amp; ROC Harmonization</span>
              <p className="text-gray-300 leading-relaxed">
                A numerical discrepancy was audited between tabulated metrics and Fig. 10 ROC curves. Action taken: Reconciled composite-score evaluation split and fixed random number generator seed to guarantee single authoritative reproducibility.
              </p>
            </div>

            <div className="p-4 bg-[#110e08] border border-amber-800/40 rounded space-y-2">
              <span className="text-amber-400 font-bold block">2. Sign-Inversion Audit in Estimator Variance</span>
              <p className="text-gray-300 leading-relaxed">
                Fig. 8 prototype displayed an apparent sign-flip where certain poisoned instances exhibited lower variance than clean controls. Action taken: Audited estimator batching pipelines, added synthetic unit test fixtures, and verified expected variance orientation.
              </p>
            </div>

            <div className="p-4 bg-[#110e08] border border-amber-800/40 rounded space-y-2">
              <span className="text-amber-400 font-bold block">3. Composite Suspicion Metric Scaling Correction</span>
              <p className="text-gray-300 leading-relaxed">
                Calibrated score formulation was normalized to eliminate inverted histogram tails, ensuring high-risk synthetic triggers consistently populate top percentiles above the operational threshold.
              </p>
            </div>

            <div className="p-4 bg-[#110e08] border border-amber-800/40 rounded space-y-2">
              <span className="text-amber-400 font-bold block">4. Newton-Step Approximate Unlearning Stabilization</span>
              <p className="text-gray-300 leading-relaxed">
                To eliminate false positive confirmation spikes, the Newton-step routine was augmented with Hessian condition number checks, eigenvalue regularization, and adaptive step-size clipping prior to automated quarantine actions.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 9: Aspects Requiring Legal Protection (Claims) */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              8. Aspects of the Invention Requiring Patent Protection
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">Eight novel technological elements covered under Indian Patent Application 202641110083</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 1 — Checkpoint Influence Trajectories</span>
              <p className="text-gray-400 leading-relaxed">
                Method of tracking influence-score trajectories across sequential training checkpoints rather than single-step scores, utilizing oscillation indices, rolling variance, and Z-score peaks as primary poisoning indicators.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 2 — Multi-Estimator Stability Analysis</span>
              <p className="text-gray-400 leading-relaxed">
                Measuring inter-estimator disagreement across three or more independent stochastic projection approximations to compute a stability metric complementing trajectory temporal shape.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 3 — Manifold Embedding &amp; Density Clustering</span>
              <p className="text-gray-400 leading-relaxed">
                Joint embedding of trajectory features and estimator variance into lower-dimensional manifolds via UMAP, followed by HDBSCAN clustering to detect coordinated adversarial poisoning campaigns.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 4 — FPR-Calibrated Operational Thresholding</span>
              <p className="text-gray-400 leading-relaxed">
                Calibration subsystem establishing composite suspicion thresholds against clean reference holdout data to guarantee operational false positive rates α ≤ 0.05 in live retraining environments.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 5 — Counterfactual Approximate Unlearning</span>
              <p className="text-gray-400 leading-relaxed">
                Closed-loop counterfactual verification applying Newton-step approximate unlearning to confirm suspect cluster impact on validation loss without executing full model retraining cycles.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 6 — Closed-Loop Quarantine Partitioning</span>
              <p className="text-gray-400 leading-relaxed">
                Remedial quarantine architecture removing confirmed clusters from live training streams, withholding them from future retrain loops, and logging cryptographic provenance records.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 7 — Recursive Lineage Fingerprinting</span>
              <p className="text-gray-400 leading-relaxed">
                Storing normalized influence vectors of quarantined clusters as lineage fingerprints and matching incoming subsequent data streams via cosine similarity (threshold ≥ 0.70) to block descendant campaigns.
              </p>
            </div>

            <div className="p-4 bg-[#090909] border border-white/10 rounded-sm space-y-2">
              <span className="text-red-400 font-bold block">Claim 8 — Cross-Checkpoint Lineage Preservation</span>
              <p className="text-gray-400 leading-relaxed">
                Persistence mechanism maintaining historical influence vectors across model checkpoint lifecycles, enabling continuous transfer of poisoning evidence across retraining generations.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 10: Citation & BibTeX */}
        <section className="bg-[#090909] border border-white/10 rounded-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">9. CITE THIS PATENT DISCLOSURE</h2>
              <p className="text-xs text-gray-400 font-mono">Academic citation format for researchers &amp; patent examiners</p>
            </div>
            <button
              type="button"
              onClick={handleCopyBibtex}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] hover:bg-white/10 border border-white/20 text-gray-200 text-xs font-mono rounded transition-all cursor-pointer"
            >
              {copiedBibtex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied BibTeX!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-black/80 border border-white/5 rounded text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
            {bibtexCitation}
          </pre>
        </section>

      </main>
    </div>
  );
}
