import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ShieldCheck, Brain, LineChart, FileText, Database, GitBranch,
  Search, ShieldAlert, Sparkles, Volume2, Mic, Radio, Waves, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatentSEO } from '../hooks/usePatentSEO';
import { getPatentBySlug } from '../data/patentMetadata';

interface AudioDeepfakePatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function AudioDeepfakePatentPage({ onBack }: AudioDeepfakePatentPageProps) {
  // Dynamic SEO meta tags, Google Scholar citation tags, OpenGraph & Schema.org JSON-LD
  usePatentSEO(getPatentBySlug('audio-deepfake')!);

  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'architecture' | 'attention' | 'benchmarks'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const snrId = useId();
  const durationId = useId();
  const thresholdId = useId();
  const aggregationId = useId();

  // Preset audio scenarios
  type PresetKey = 'authentic_speech' | 'neural_tts' | 'voice_conversion' | 'diffusion_audio' | 'adversarial_noisy';

  const [activePreset, setActivePreset] = useState<PresetKey>('neural_tts');
  const [simSnr, setSimSnr] = useState<number>(28); // 0 to 40 dB
  const [simDuration, setSimDuration] = useState<number>(4.0); // 1.0 to 5.0 seconds
  const [simThreshold, setSimThreshold] = useState<number>(0.50); // 0.1 to 0.9 (Claim 7 default: 0.5)
  const [simAggregation, setSimAggregation] = useState<'mean' | 'median' | 'max' | 'voting'>('mean'); // Claim 7

  const presets: Record<PresetKey, {
    name: string;
    audioContext: string;
    snr: number;
    duration: number;
    threshold: number;
    aggregation: 'mean' | 'median' | 'max' | 'voting';
    isGroundTruthFake: boolean;
    description: string;
  }> = {
    authentic_speech: {
      name: 'Authentic Human Speech (Studio Recording)',
      audioContext: 'Clean Natural Human Voice (16 kHz, High SNR)',
      snr: 36,
      duration: 4.0,
      threshold: 0.50,
      aggregation: 'mean',
      isGroundTruthFake: false,
      description: 'Preserved glottal pulse regularity, organic vocal tract formants, natural breath pauses, and natural spectro-temporal phase coherence.'
    },
    neural_tts: {
      name: 'Neural Text-to-Speech (VITS / FastSpeech2 Cloned Voice)',
      audioContext: 'State-of-the-Art Neural TTS Synthesis',
      snr: 30,
      duration: 4.0,
      threshold: 0.50,
      aggregation: 'mean',
      isGroundTruthFake: true,
      description: 'High spectral fidelity to the human ear, but exposes high-frequency phase incongruity in the 1D-CNN raw waveform branch and subtle robotic pitch flatlining.'
    },
    voice_conversion: {
      name: 'Real-Time Voice Conversion (Source-to-Target)',
      audioContext: 'Target Identity Voice Morphing Attack',
      snr: 24,
      duration: 3.5,
      threshold: 0.50,
      aggregation: 'max',
      isGroundTruthFake: true,
      description: 'Acoustic BiLSTM branch detects cepstral delta-derivative jumps at phoneme boundaries where target spectral envelope fails to align with source prosody.'
    },
    diffusion_audio: {
      name: 'Diffusion-Based Generative Audio (AudioLDM / Grad-TTS)',
      audioContext: 'Continuous Reverse-Diffusion Generated Speech',
      snr: 22,
      duration: 4.5,
      threshold: 0.50,
      aggregation: 'median',
      isGroundTruthFake: true,
      description: 'Exhibits micro-blurring in Mel-spectrogram frequency bins detected by Branch A (CNN), accompanied by subtle background noise hallucination in silent segments.'
    },
    adversarial_noisy: {
      name: 'Adversarial Telephony Audio (G.711 / Cellular Noise)',
      audioContext: 'Compressed Cellular Phone Call with Ambient Noise',
      snr: 12,
      duration: 4.0,
      threshold: 0.50,
      aggregation: 'voting',
      isGroundTruthFake: true,
      description: 'Aggressive compression and low SNR degrade spectral clarity; self-attention module dynamically increases weighting of the raw waveform temporal branch to preserve detection.'
    }
  };

  const handleApplyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimSnr(p.snr);
    setSimDuration(p.duration);
    setSimThreshold(p.threshold);
    setSimAggregation(p.aggregation);
  };

  // Compute live Multi-Domain Fusion outputs
  const computeForensicInference = () => {
    const isFake = presets[activePreset].isGroundTruthFake;

    // Base domain feature importance weights (Claim 6 defines baseline: Spectral 42%, Acoustic 35%, Temporal 23%)
    // Self-attention adapts weights based on SNR conditions (Figure 6 & Claim 6)
    let spectralWeight = 0.42;
    let acousticWeight = 0.35;
    let temporalWeight = 0.23;

    if (simSnr < 18) {
      // Under high noise, spectral is degraded, temporal raw waveform and cepstral take over
      spectralWeight = 0.28;
      acousticWeight = 0.38;
      temporalWeight = 0.34;
    } else if (simSnr > 32) {
      // Under clean audio, high-resolution Mel-spectrogram provides dominant discriminative power
      spectralWeight = 0.48;
      acousticWeight = 0.32;
      temporalWeight = 0.20;
    }

    // Normalize weights to 100%
    const weightSum = spectralWeight + acousticWeight + temporalWeight;
    const normSpectral = Math.round((spectralWeight / weightSum) * 100);
    const normAcoustic = Math.round((acousticWeight / weightSum) * 100);
    const normTemporal = Math.round((temporalWeight / weightSum) * 100);

    // Simulated frame-by-frame deepfake probabilities (Claim 7: segment into temporal frames)
    // Audio sampled at 16 kHz: duration 4.0s = 64,000 samples (Claim 5)
    const totalSamples = Math.round(simDuration * 16000);
    const numFrames = 8;
    const frameScores: number[] = [];

    for (let i = 0; i < numFrames; i++) {
      let score: number;
      if (isFake) {
        // Real deepfake has elevated scores across frames with slight temporal variance
        const baseProb = 0.88 + Math.sin(i * 1.3) * 0.08 - (40 - simSnr) * 0.003;
        score = Math.min(0.999, Math.max(0.65, baseProb));
      } else {
        // Authentic audio has very low deepfake score
        const baseProb = 0.02 + Math.cos(i * 1.1) * 0.015 + (40 - simSnr) * 0.001;
        score = Math.min(0.18, Math.max(0.002, baseProb));
      }
      frameScores.push(parseFloat(score.toFixed(3)));
    }

    // Decision aggregation over frames (Claim 7: mean, median, max, or voting)
    let aggregatedScore: number;
    if (simAggregation === 'mean') {
      aggregatedScore = frameScores.reduce((a, b) => a + b, 0) / numFrames;
    } else if (simAggregation === 'median') {
      const sorted = [...frameScores].sort((a, b) => a - b);
      aggregatedScore = (sorted[3] + sorted[4]) / 2;
    } else if (simAggregation === 'max') {
      aggregatedScore = Math.max(...frameScores);
    } else {
      // Voting: proportion of frames exceeding threshold
      const fakeVotes = frameScores.filter(s => s >= simThreshold).length;
      aggregatedScore = fakeVotes / numFrames;
    }

    const finalConfidencePct = Math.min(99.9, Math.max(50.0, isFake ? aggregatedScore * 100 : (1.0 - aggregatedScore) * 100));
    const isClassifiedFake = aggregatedScore >= simThreshold;
    const classification = isClassifiedFake ? 'DEEPFAKE SYNTHETIC' : 'AUTHENTIC GENUINE';

    // Forensic Artifact Indicators
    const spectralArtifact = isFake ? Math.min(98, 72 + Math.round((40 - simSnr) * 0.6)) : Math.round(simSnr * 0.15);
    const acousticArtifact = isFake ? Math.min(96, 68 + Math.round((40 - simSnr) * 0.5)) : Math.round(simSnr * 0.12);
    const temporalArtifact = isFake ? Math.min(94, 64 + Math.round((40 - simSnr) * 0.7)) : Math.round(simSnr * 0.10);

    return {
      totalSamples,
      weights: {
        spectral: normSpectral,
        acoustic: normAcoustic,
        temporal: normTemporal
      },
      frameScores,
      aggregatedScore: aggregatedScore.toFixed(3),
      confidence: finalConfidencePct.toFixed(1),
      isClassifiedFake,
      classification,
      artifacts: {
        spectral: spectralArtifact,
        acoustic: acousticArtifact,
        temporal: temporalArtifact
      }
    };
  };

  const simResult = computeForensicInference();

  // Gallery items for lightbox
  const galleryItems = [
    {
      id: 'fig1_arch',
      category: 'architecture',
      title: 'Figure 1: Overall System Architecture of Multi-Domain Feature Fusion',
      caption: 'End-to-end architecture of the proposed neural system: parallel extraction via Branch A (2D-CNN Spectral), Branch B (BiLSTM Cepstral), and Branch C (1D-CNN Raw Waveform), fused via Multi-Head Self-Attention for binary classification.',
      src: '/patent-assets/audio-deepfake/fig1_overall_system_architecture.png',
      badge: 'Core Architecture'
    },
    {
      id: 'fig2_temporal',
      category: 'architecture',
      title: 'Figure 2: Frame-Level Temporal Deepfake Probability Analysis',
      caption: 'Frame-level temporal deepfake probability estimation spanning raw audio waveform, frame-wise anomaly probabilities, and decision aggregation strategies (mean, median, max, voting).',
      src: '/patent-assets/audio-deepfake/fig2_temporal_probability_aggregation.png',
      badge: 'Temporal Analysis'
    },
    {
      id: 'fig3_noise',
      category: 'benchmarks',
      title: 'Figure 3: Model Accuracy Under Different Noise Levels',
      caption: 'Adversarial acoustic evaluation demonstrating that the multi-domain fusion architecture maintains accuracy above 90% even under severe additive noise conditions.',
      src: '/patent-assets/audio-deepfake/fig3_accuracy_vs_noise_levels.png',
      badge: 'Noise Robustness'
    },
    {
      id: 'fig4_snr',
      category: 'benchmarks',
      title: 'Figure 4: Accuracy Degradation Curve Across Decreasing SNR',
      caption: 'Continuous degradation curve comparing multi-domain fusion vs. single-domain baselines across SNR levels from 100 dB down to 0 dB, confirming superior noise tolerance.',
      src: '/patent-assets/audio-deepfake/fig4_accuracy_degradation_snr.png',
      badge: 'SNR Robustness'
    },
    {
      id: 'fig5_importance',
      category: 'attention',
      title: 'Figure 5: Relative Importance of Multi-Domain Audio Features',
      caption: 'Empirical quantification of feature branch contribution: Spectral CNN features (42%), Cepstral BiLSTM features (35%), and Raw Waveform 1D-CNN features (23%).',
      src: '/patent-assets/audio-deepfake/fig5_relative_domain_importance.png',
      badge: 'Domain Importance'
    },
    {
      id: 'fig6_attention',
      category: 'attention',
      title: 'Figure 6: Gradient-Based Feature Importance & Cross-Branch Attention',
      caption: 'Self-attention heatmaps showing dynamic inter-branch weight reallocation under varying acoustic contexts, forming the primary inventive step of Claim 6.',
      src: '/patent-assets/audio-deepfake/fig6_cross_branch_attention_weights.png',
      badge: 'Attention Weights'
    },
    {
      id: 'fig7_metrics',
      category: 'benchmarks',
      title: 'Figure 7: Training & Validation Performance Metrics Over Epochs',
      caption: 'Six-panel convergence dashboard displaying loss, accuracy, precision, recall, F1-score, and AUC-ROC curves demonstrating rapid stabilization and zero overfitting.',
      src: '/patent-assets/audio-deepfake/fig7_training_validation_metrics.png',
      badge: 'Convergence Curves'
    },
    {
      id: 'fig8_det',
      category: 'benchmarks',
      title: 'Figure 8: Detection Error Trade-off (DET) Curve',
      caption: 'DET curve showing near-zero Equal Error Rate (EER), confirming high forensic reliability across false alarm and miss probability trade-offs.',
      src: '/patent-assets/audio-deepfake/fig8_det_curve_eer.png',
      badge: 'DET / EER'
    },
    {
      id: 'fig9_far_frr',
      category: 'benchmarks',
      title: 'Figure 9: False Acceptance Rate (FAR) vs. False Rejection Rate (FRR)',
      caption: 'Optimal decision threshold identification where FAR and FRR curves intersect at threshold 0.50, demonstrating operational stability across biometric thresholds.',
      src: '/patent-assets/audio-deepfake/fig9_far_vs_frr_analysis.png',
      badge: 'FAR vs FRR'
    },
    {
      id: 'fig10_pr',
      category: 'benchmarks',
      title: 'Figure 10: Precision–Recall Curve (AP = 0.9999)',
      caption: 'Precision-Recall trajectory demonstrating near-perfect Average Precision (AP = 0.9999) on synthetic audio benchmark datasets.',
      src: '/patent-assets/audio-deepfake/fig10_precision_recall_curve.png',
      badge: 'PR Curve'
    },
    {
      id: 'fig11_roc',
      category: 'benchmarks',
      title: 'Figure 11: Receiver Operating Characteristic (ROC) Curve (AUC = 1.000)',
      caption: 'Near-ideal ROC curve with an Area Under the Curve (AUC) of 1.000, confirming perfect separation between real speech and synthetic deepfakes.',
      src: '/patent-assets/audio-deepfake/fig11_roc_curve_auc100.jpg',
      badge: 'ROC-AUC 1.00'
    },
    {
      id: 'fig12_cm',
      category: 'benchmarks',
      title: 'Figure 12: Normalized Confusion Matrix for Audio Deepfake Classification',
      caption: 'Normalized 2x2 confusion matrix exhibiting 99.5% accuracy with minimal false positive and false negative rates across unseen test partitions.',
      src: '/patent-assets/audio-deepfake/fig12_normalized_confusion_matrix.png',
      badge: 'Confusion Matrix'
    }
  ];

  const filteredGallery = selectedGalleryTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedGalleryTab);

  const bibtexCode = `@patent{IN202641027783A1,
  title     = {Multi-Domain Feature Fusion Based Deep Learning System for Audio Deepfake Detection},
  author    = {Mohanasundaram, R. and Mahesh, Rayban Pranav and Sharma, Ajitesh and Patidar, Hansaj},
  assignee  = {Vellore Institute of Technology},
  number    = {IN202641027783 A1},
  type      = {Patent Application},
  country   = {India},
  journal   = {The Patent Office Journal No. 12/2026},
  filing    = {2026-03-09},
  published = {2026-03-20},
  url       = {http://localhost:3000/patent-assets/audio-deepfake/Official_Gazette_Patent_202641027783.pdf}
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-red-900 selection:text-white pb-20 antialiased overflow-x-hidden">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-red-900/30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3 py-1.5 bg-[#0e0e0e] hover:bg-red-950/40 border border-red-900/40 hover:border-red-600/70 text-gray-300 hover:text-white text-xs font-mono font-semibold rounded-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
              <span>Back to Portfolio</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400">
              <span>/</span>
              <span>Patents</span>
              <span>/</span>
              <span className="text-red-400 font-bold">IN202641027783 A1</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* ONLY ONE PDF BUTTON: Official Document */}
            <a
              href="/patent-assets/audio-deepfake/Official_Gazette_Patent_202641027783.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 hover:border-red-500 text-white text-xs font-mono font-bold rounded-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
              <span>Official PDF</span>
            </a>

            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-[#0e0e0e] hover:bg-red-950/30 border border-red-900/40 hover:border-red-700/60 text-gray-300 hover:text-white text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy BibTeX Citation"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              <span className="hidden md:inline">{copiedBibtex ? 'Copied' : 'BibTeX'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Hero Section */}
        <section className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 relative z-10 font-mono text-[11px]">
            <span className="px-2.5 py-1 bg-red-950/60 border border-red-700/60 text-red-300 font-bold rounded-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-red-400" />
              PATENT #09 · INDIAN PATENT PUBLISHED
            </span>
            <span className="px-2.5 py-1 bg-[#121212] border border-white/10 text-gray-300 rounded-xs">
              App No: <strong className="text-white">202641027783</strong>
            </span>
            <span className="px-2.5 py-1 bg-[#121212] border border-white/10 text-gray-300 rounded-xs">
              Journal: <strong className="text-white">12/2026</strong>
            </span>
            <span className="px-2.5 py-1 bg-red-950/30 border border-red-900/40 text-red-400 font-semibold rounded-xs">
              Deepfake Forensics · Multi-Domain Audio AI
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug mb-3 relative z-10">
            Multi-Domain Feature Fusion Based Deep Learning System for Audio Deepfake Detection
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-mono mb-6 relative z-10 max-w-5xl leading-relaxed">
            A real-time forensic neural framework integrating parallel <strong className="text-white">Spectral 2D-CNN</strong> (128 Mel bands), <strong className="text-white">Acoustic BiLSTM</strong> (40 MFCCs + Δ + ΔΔ), and <strong className="text-white">Temporal 1D-CNN</strong> (64,000 raw samples) feature extraction fused via <span className="text-red-400 font-bold">Multi-Head Self-Attention</span> with temporal frame-level aggregation.
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/10 relative z-10 text-xs font-mono">
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-400" /> Filing Date
              </span>
              <span className="text-white font-bold">09 March 2026</span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-400" /> Published Date
              </span>
              <span className="text-red-400 font-bold">20 March 2026</span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-red-400" /> Applicant
              </span>
              <span className="text-gray-200 font-medium truncate block" title="Vellore Institute of Technology">
                Vellore Inst. of Tech.
              </span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-red-400" /> Primary IPC
              </span>
              <span className="text-gray-200 font-medium">G10L 25/30</span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5 col-span-2">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-red-400" /> Inventors
              </span>
              <div className="text-gray-200 font-medium space-y-1">
                <div>Dr. Mohanasundaram R; Ajitesh Sharma; Hansaj Patidar</div>
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="px-1.5 py-0.5 bg-red-950/60 border border-red-600/60 text-red-300 rounded text-[10px]">
                    Rayban Pranav Mahesh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Innovation Highlights Banner */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              Validated Accuracy
            </div>
            <div className="text-2xl font-bold text-white">~99.5%</div>
            <div className="text-gray-500 text-[10px] mt-1">Multi-domain feature fusion</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
              ROC-AUC Metric
            </div>
            <div className="text-2xl font-bold text-red-400">1.000</div>
            <div className="text-gray-500 text-[10px] mt-1">Perfect synthetic discrimination</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5 text-red-400" />
              Average Precision (AP)
            </div>
            <div className="text-2xl font-bold text-white">0.9999</div>
            <div className="text-gray-500 text-[10px] mt-1">Precision-Recall benchmark</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              Adversarial Noise Tol.
            </div>
            <div className="text-2xl font-bold text-white">&gt; 90%</div>
            <div className="text-gray-500 text-[10px] mt-1">Maintained down to 10 dB SNR</div>
          </div>
        </section>

        {/* Interactive Forensic Simulator Section */}
        <section id="simulator" className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
                <Sliders className="w-4 h-4 text-red-500" />
                Live Forensic Neural Simulator
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Multi-Domain Audio Deepfake Detection Simulator
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
                Simulate the tri-branch feature extraction pipeline: adjust signal-to-noise ratio (SNR), audio segment length, decision threshold, and temporal frame aggregation (Claim 7) to inspect live cross-domain attention reweighting and classification verdict.
              </p>
            </div>

            {/* Presets Selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <label htmlFor={presetSelectId} className="text-gray-400">Audio Scenario:</label>
              <select
                id={presetSelectId}
                value={activePreset}
                onChange={(e) => handleApplyPreset(e.target.value as PresetKey)}
                className="bg-[#121212] border border-red-900/60 text-white px-3 py-1.5 rounded-sm focus:outline-none focus:border-red-500 text-xs font-mono"
              >
                <option value="authentic_speech">Authentic Human Speech</option>
                <option value="neural_tts">Neural TTS Cloned Voice</option>
                <option value="voice_conversion">Real-Time Voice Conversion</option>
                <option value="diffusion_audio">Diffusion-Based Speech</option>
                <option value="adversarial_noisy">Adversarial Noisy Call</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#070707] border border-white/5 rounded-xs text-xs font-mono text-gray-300">
            <span className="text-red-400 font-bold">{presets[activePreset].name}: </span>
            {presets[activePreset].description}
          </div>

          {/* Simulator Grid: Inputs vs Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Audio Signal & Parameter Controls */}
            <div className="lg:col-span-5 space-y-5 bg-[#070707] border border-white/10 p-5 rounded-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-500" />
                Acoustic Signal &amp; Decision Hyperparameters
              </h3>

              {/* Signal-to-Noise Ratio (SNR) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={snrId} className="text-gray-300">Signal-to-Noise Ratio (SNR):</label>
                  <span className="text-white font-bold">{simSnr} dB</span>
                </div>
                <input
                  id={snrId}
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={simSnr}
                  onChange={(e) => setSimSnr(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0 dB (Extreme Noise)</span>
                  <span>20 dB (Mobile Call)</span>
                  <span>40 dB (Clean Studio)</span>
                </div>
              </div>

              {/* Duration / Sample Count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={durationId} className="text-gray-300">Audio Clip Duration (Claim 5):</label>
                  <span className="text-white font-bold">{simDuration.toFixed(1)} s ({simResult.totalSamples.toLocaleString()} samples)</span>
                </div>
                <input
                  id={durationId}
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={simDuration}
                  onChange={(e) => setSimDuration(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>1.0 s (16,000)</span>
                  <span>4.0 s (64,000 samples · Claim 5)</span>
                  <span>5.0 s (80,000)</span>
                </div>
              </div>

              {/* Classification Threshold (Claim 7: default 0.5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={thresholdId} className="text-gray-300">Classification Threshold (Claim 7):</label>
                  <span className="text-red-400 font-bold">{simThreshold.toFixed(2)}</span>
                </div>
                <input
                  id={thresholdId}
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={simThreshold}
                  onChange={(e) => setSimThreshold(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0.10 (High Sensitivity)</span>
                  <span>0.50 (Default Optimal · Claim 7)</span>
                  <span>0.90 (High Specificity)</span>
                </div>
              </div>

              {/* Temporal Aggregation Strategy (Claim 7) */}
              <div className="space-y-1.5">
                <label htmlFor={aggregationId} className="text-xs font-mono text-gray-300 block">
                  Frame-Level Decision Aggregation (Claim 7):
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {(['mean', 'median', 'max', 'voting'] as const).map((strategy) => (
                    <button
                      key={strategy}
                      type="button"
                      onClick={() => setSimAggregation(strategy)}
                      className={`py-1.5 px-2 rounded-xs border text-center capitalize transition-all cursor-pointer ${
                        simAggregation === strategy 
                          ? 'bg-red-950/80 border-red-600 text-white font-bold' 
                          : 'bg-[#121212] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {strategy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Specifications (Fixed per claims) */}
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Spectral Resolution (Claim 3):</span>
                  <span className="text-white font-semibold">128 Mel Bands</span>
                </div>
                <div className="flex justify-between">
                  <span>Acoustic Coefficients (Claim 4):</span>
                  <span className="text-white font-semibold">40 MFCCs + Δ + ΔΔ (120-dim)</span>
                </div>
                <div className="flex justify-between">
                  <span>Raw Waveform Input (Claim 5):</span>
                  <span className="text-white font-semibold">1D 16 kHz Time-Domain</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Fusion Model Outputs */}
            <div className="lg:col-span-7 space-y-5 bg-[#070707] border border-white/10 p-5 rounded-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Live Tri-Branch Attention &amp; Classification Output
                </h3>
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-300 text-[10px] font-mono rounded-xs">
                  Inference Latency: ~18.4ms
                </span>
              </div>

              {/* 1. Primary Verdict Banner */}
              <div className={`p-4 rounded-xs border flex items-center justify-between font-mono ${
                simResult.isClassifiedFake
                  ? 'bg-red-950/50 border-red-700 text-white'
                  : 'bg-[#121212] border-white/10 text-white'
              }`}>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block mb-0.5">Forensic Classification Verdict</span>
                  <span className="text-lg font-black tracking-wider flex items-center gap-2">
                    {simResult.isClassifiedFake ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-400">DEEPFAKE DETECTED</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-red-400" />
                        <span className="text-white">GENUINE AUDIO</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase block mb-0.5">Model Confidence</span>
                  <span className="text-2xl font-black text-red-400">{simResult.confidence}%</span>
                </div>
              </div>

              {/* 2. Self-Attention Domain Weights (Claim 6 & Figure 6) */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-red-400" />
                    Self-Attention Feature Domain Weights (Claim 6):
                  </span>
                  <span className="text-gray-400 text-[10px]">Adaptive Cross-Branch Fusion</span>
                </div>

                {/* Spectral Weight */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">Branch A: Spectral CNN (Mel-Spectrogram 128)</span>
                    <span className="text-white font-bold">{simResult.weights.spectral}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${simResult.weights.spectral}%` }}
                    />
                  </div>
                </div>

                {/* Acoustic Weight */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">Branch B: Acoustic BiLSTM (40 MFCCs + Δ + ΔΔ)</span>
                    <span className="text-white font-bold">{simResult.weights.acoustic}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                    <div 
                      className="h-full bg-red-700 transition-all duration-300"
                      style={{ width: `${simResult.weights.acoustic}%` }}
                    />
                  </div>
                </div>

                {/* Temporal Weight */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-300">Branch C: Temporal 1D-CNN (Raw Waveform 64k)</span>
                    <span className="text-white font-bold">{simResult.weights.temporal}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                    <div 
                      className="h-full bg-red-800 transition-all duration-300"
                      style={{ width: `${simResult.weights.temporal}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Frame-Level Probability Trajectory (Claim 7 & Figure 2) */}
              <div className="p-3 bg-[#121212] border border-white/5 rounded-xs space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-red-400" />
                    Frame-Level Deepfake Probability Trajectory:
                  </span>
                  <span className="text-red-400 text-[11px] font-bold">
                    Aggregated ({simAggregation}): {simResult.aggregatedScore}
                  </span>
                </div>

                <div className="grid grid-cols-8 gap-1 pt-1">
                  {simResult.frameScores.map((score, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="h-14 bg-[#0a0a0a] rounded-xs flex items-end p-0.5 border border-white/5">
                        <div 
                          className={`w-full rounded-xs transition-all duration-300 ${
                            score >= simThreshold ? 'bg-red-600' : 'bg-red-950'
                          }`}
                          style={{ height: `${score * 100}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-center text-gray-400">{score.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                  <span>Frame 1 (t=0.0s)</span>
                  <span className="text-red-400">--- Decision Threshold {simThreshold.toFixed(2)} ---</span>
                  <span>Frame 8 (t={simDuration}s)</span>
                </div>
              </div>

              {/* 4. Artifact Indicator Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                <div className="bg-[#121212] p-2.5 rounded-xs border border-white/5">
                  <span className="text-gray-500 text-[9px] uppercase block mb-0.5">Phase Distortion</span>
                  <span className="text-white font-bold">{simResult.artifacts.spectral}% Anomaly</span>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xs border border-white/5">
                  <span className="text-gray-500 text-[9px] uppercase block mb-0.5">Phoneme Smear</span>
                  <span className="text-white font-bold">{simResult.artifacts.acoustic}% Anomaly</span>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xs border border-white/5">
                  <span className="text-gray-500 text-[9px] uppercase block mb-0.5">Glottal Pulse Loss</span>
                  <span className="text-white font-bold">{simResult.artifacts.temporal}% Anomaly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Section: The Multi-Domain Tri-Branch Pipeline */}
        <section id="architecture" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-red-500" />
              Tri-Branch Neural Anatomy
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Multi-Domain Feature Extraction &amp; Attention Fusion Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Unlike single-domain audio models vulnerable to noise, compression, or unseen neural vocoders, Patent #09 extracts complementary representations from three distinct signal domains in parallel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Branch A */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  BRANCH A · 42% WEIGHT
                </span>
                <span className="text-gray-500 text-[10px]">Claim 3 &amp; 6</span>
              </div>
              <h3 className="text-sm font-bold text-white">Spectral 2D-CNN Module</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Converts preprocessed audio into a 128 Mel-band log Mel-spectrogram. A 2D Convolutional Neural Network extracts time-frequency spectral textures, harmonic overtones, vocal tract resonances, and spectral envelope smearing indicative of synthesis.
              </p>
            </div>

            {/* Branch B */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  BRANCH B · 35% WEIGHT
                </span>
                <span className="text-gray-500 text-[10px]">Claim 4 &amp; 6</span>
              </div>
              <h3 className="text-sm font-bold text-white">Acoustic BiLSTM Module</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Computes 40 Mel-Frequency Cepstral Coefficients (MFCCs) augmented with first (Δ) and second (ΔΔ) temporal derivatives (120 dimensions total). A Bidirectional LSTM processes forward and reverse temporal context to detect unnatural phoneme transitions.
              </p>
            </div>

            {/* Branch C */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  BRANCH C · 23% WEIGHT
                </span>
                <span className="text-gray-500 text-[10px]">Claim 5 &amp; 6</span>
              </div>
              <h3 className="text-sm font-bold text-white">Temporal 1D-CNN Waveform</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Directly ingests 64,000 raw time-domain audio samples (4 seconds at 16 kHz). A 1D Convolutional Neural Network captures micro-temporal phase discontinuities, glottal pulse abnormalities, and vocoder artifacts stripped by Fourier transformation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Self-Attention Fusion Engine */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  FUSION ENGINE
                </span>
                <span className="text-gray-500 text-[10px]">Claim 1 &amp; 8</span>
              </div>
              <h3 className="text-sm font-bold text-white">Multi-Head Self-Attention Fusion (64114)</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Computes scaled dot-product cross-domain attention across the spectral, acoustic, and temporal representations. Learns dynamic inter-domain correlations, ensuring that if spectral features are corrupted by noise or compression, the attention mechanism automatically upweights the temporal and cepstral branches.
              </p>
            </div>

            {/* Temporal Frame Aggregation */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  AGGREGATION
                </span>
                <span className="text-gray-500 text-[10px]">Claim 7</span>
              </div>
              <h3 className="text-sm font-bold text-white">Frame-Level Decision Aggregator (410)</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Segments audio into temporal frames, computes deepfake probability score per frame with a calibrated 0.50 threshold, and aggregates predictions using configurable mean, median, max, or voting functions to output a hardened overall confidence score.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Figures Gallery with Lightbox */}
        <section id="figures" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
                <Eye className="w-4 h-4 text-red-500" />
                Technical Figures &amp; Patent Drawings
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High-Resolution Engineering Gallery
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Explore official patent figures, architecture schematics, attention weight heatmaps, and empirical benchmark curves. Click any figure to expand in high definition.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {[
                { key: 'all', label: 'All Figures (12)' },
                { key: 'architecture', label: 'Architecture & Pipeline' },
                { key: 'attention', label: 'Attention & Weights' },
                { key: 'benchmarks', label: 'Empirical Curves' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedGalleryTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xs border transition-all cursor-pointer ${
                    selectedGalleryTab === tab.key
                      ? 'bg-red-950/70 border-red-600 text-white font-bold'
                      : 'bg-[#0e0e0e] border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Figures Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveImage(item)}
                className="group bg-[#0a0a0a] border border-red-900/30 hover:border-red-600/70 rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-xl hover:shadow-red-950/20"
              >
                <div className="relative aspect-4/3 bg-[#050505] overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2.5 py-1 bg-black/80 border border-red-500/80 text-white text-[11px] font-mono font-bold rounded-xs flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-red-400" />
                      Expand HD
                    </span>
                  </div>
                  {item.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-red-800/80 text-red-300 text-[9px] font-mono rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between border-t border-white/5 bg-[#080808]">
                  <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Empirical Benchmarks & Performance Metrics */}
        <section id="benchmarks" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <LineChart className="w-4 h-4 text-red-500" />
              Empirical Forensics Validation
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Audio Deepfake Detection Benchmarks &amp; Ablation Evaluation
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Systematic evaluation demonstrating superior discriminative performance, high noise resilience under adversarial SNR conditions, and near-zero detection error rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table 1: Validation Summary */}
            <div className="lg:col-span-6 bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                Validated Performance Summary (Section 8)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                      <th className="pb-2">Performance Metric</th>
                      <th className="pb-2 text-right">Achieved Value</th>
                      <th className="pb-2 text-right">Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 font-bold text-white">Detection Accuracy</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">~99.5%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Multi-domain fused</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">ROC-AUC Score</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">1.000</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Near-ideal separation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Average Precision (AP)</td>
                      <td className="py-2.5 text-right font-bold text-white">0.9999</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">PR-curve benchmark</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Equal Error Rate (EER)</td>
                      <td className="py-2.5 text-right font-bold text-red-400">&lt; 0.1%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">DET curve analysis</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Noise Resilience (&gt;90% Acc)</td>
                      <td className="py-2.5 text-right font-bold text-white">Down to 10 dB SNR</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Severe audio distortion</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Optimal Decision Threshold</td>
                      <td className="py-2.5 text-right font-bold text-white">0.50 (FAR/FRR)</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Claim 7 default</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Inference Latency</td>
                      <td className="py-2.5 text-right text-white">&lt; 20 ms / 4s audio</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Real-time telephony</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Feature Domain Contribution Breakdown */}
            <div className="lg:col-span-6 bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-red-500" />
                Feature Domain Ablation &amp; Stat Weights (Claim 6)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                      <th className="pb-2">Domain Branch</th>
                      <th className="pb-2 text-center">Assigned Weight</th>
                      <th className="pb-2 text-right">Isolated Acc</th>
                      <th className="pb-2 text-right">Target Synthetic Clues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Branch A (Spectral CNN)</td>
                      <td className="py-2.5 text-center text-red-400 font-bold">42%</td>
                      <td className="py-2.5 text-right">88.4%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Mel-frequency harmonic smear</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Branch B (Acoustic BiLSTM)</td>
                      <td className="py-2.5 text-center text-red-400 font-bold">35%</td>
                      <td className="py-2.5 text-right">84.1%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Phoneme velocity &amp; acceleration</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Branch C (Temporal 1D-CNN)</td>
                      <td className="py-2.5 text-center text-red-400 font-bold">23%</td>
                      <td className="py-2.5 text-right">79.6%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Glottal pulse discontinuities</td>
                    </tr>
                    <tr className="bg-red-950/30 font-bold text-white border-l-2 border-red-500">
                      <td className="py-3 pl-3 text-red-300 font-bold">Multi-Head Self-Attention Fusion</td>
                      <td className="py-3 text-center text-white font-bold">100% (Claim 6)</td>
                      <td className="py-3 text-right text-red-400 font-black text-sm">~99.5%</td>
                      <td className="py-3 text-right text-red-300 text-[10px]">Cross-domain complementary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                <strong className="text-white">Ablation Takeaway:</strong> Relying on any isolated single branch yields 79.6%–88.4% accuracy. Fusing all three via self-attention achieves ~99.5% accuracy (+11.1% gain) with absolute resilience against noise and vocoder-specific artifacts.
              </p>
            </div>
          </div>
        </section>

        {/* Prior Art & Patent Literature Survey (Section 3) */}
        <section id="prior-art" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <Search className="w-4 h-4 text-red-500" />
              Prior Art &amp; Patent Landscape Survey
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Prior Art Analysis &amp; Technical Gaps Addressed (Section 3)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Survey of 10 prior patents and research papers in audio spoofing detection, establishing novel inventive steps over existing acoustic systems.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                    <th className="pb-2 w-10">#</th>
                    <th className="pb-2 w-28">Type</th>
                    <th className="pb-2 w-56">Reference Title</th>
                    <th className="pb-2">Technique Used</th>
                    <th className="pb-2 text-red-400">Identified Technical Deficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 text-[11px]">
                  <tr>
                    <td className="py-3 text-gray-500">1</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">ASVspoof Countermeasures</td>
                    <td className="py-3">CNN-based spectrogram analysis</td>
                    <td className="py-3 text-red-300">Relies solely on spectral representations; poor generalization to unseen neural vocoders.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">2</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">Detecting Synthetic Speech via MFCC+GMM</td>
                    <td className="py-3">MFCC + Gaussian Mixture Models</td>
                    <td className="py-3 text-red-300">Hand-crafted acoustic features only; severe performance drop on modern neural TTS.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">3</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">RawNet: End-to-End Audio Spoofing</td>
                    <td className="py-3">Raw waveform 1D-CNN</td>
                    <td className="py-3 text-red-300">High compute overhead; lacks multi-domain interpretability and spectral awareness.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">4</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">Transformer-based Audio Deepfake Detection</td>
                    <td className="py-3">Transformer attention on audio</td>
                    <td className="py-3 text-red-300">Requires massive pretraining corpora; sensitive to telephony domain shifts and SNR variance.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">5</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">Generalized Detection Using LFCC</td>
                    <td className="py-3">Linear frequency cepstral coefficients</td>
                    <td className="py-3 text-red-300">Performance degrades sharply under real-world MP3/AAC compression and channel noise.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">6</td>
                    <td className="py-3 text-gray-400">Patent</td>
                    <td className="py-3 font-semibold text-white">US Patent: Detecting Synthetic Audio Signals</td>
                    <td className="py-3">Single-domain spectral anomaly detection</td>
                    <td className="py-3 text-red-300">Operates on isolated feature space; vulnerable to newer voice conversion models.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">7</td>
                    <td className="py-3 text-gray-400">Patent</td>
                    <td className="py-3 font-semibold text-white">WO Patent: Audio Authentication via ML</td>
                    <td className="py-3">ML-based audio fingerprinting</td>
                    <td className="py-3 text-red-300">Designed for copyright/auth verification, not generative synthesis; lacks temporal analysis.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">8</td>
                    <td className="py-3 text-gray-400">Patent</td>
                    <td className="py-3 font-semibold text-white">IN Patent: Method for Speech Spoofing Detection</td>
                    <td className="py-3">Cepstral features with classifier</td>
                    <td className="py-3 text-red-300">Zero cross-domain fusion; vulnerable to background noise and codec mismatch.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">9</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">Multi-Feature Audio Forgery Detection</td>
                    <td className="py-3">Simple feature concatenation + CNN</td>
                    <td className="py-3 text-red-300">Static vector concatenation without adaptive self-attention weighting.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">10</td>
                    <td className="py-3 text-gray-400">Research Paper</td>
                    <td className="py-3 font-semibold text-white">Noise-Robust Spoofing Countermeasures</td>
                    <td className="py-3">Data augmentation + CNN</td>
                    <td className="py-3 text-red-300">Robustness strictly bounded by training noise distributions; lacks architectural resilience.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Verbatim Official Legal Claims (Indian Patent Gazette) */}
        <section id="claims" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-red-500" />
              Official Patent Gazette Claims
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Granted Legal Claims (IN202641027783 A1)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Verbatim statutory legal claims as officially published by the Intellectual Property Office, India in Patent Gazette Journal No. 12/2026.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Independent Claim 1 */}
            <div className="bg-[#0a0a0a] border border-red-700/60 rounded-sm p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                <span className="px-2.5 py-1 bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold rounded-xs">
                  CLAIM 1 · INDEPENDENT METHOD CLAIM
                </span>
                <span className="text-gray-400 text-[11px]">Core Algorithmic Method</span>
              </div>
              <p className="text-gray-200 leading-relaxed text-[11px] whitespace-pre-line">
{`A computer-implemented method (100) for audio deepfake detection, comprising:
receiving (102) an audio input;
extracting (106) spectral features from a spectral representation of the audio input using a convolutional neural network (64108);
extracting (108) acoustic features from cepstral coefficients of the audio input using a recurrent neural network (64110);
extracting (110) temporal features from a raw waveform of the audio input using a one-dimensional convolutional neural network (64112);
fusing (112) the spectral features, the acoustic features, and the temporal features using a self-attention module (64114) to generate a fused feature representation;
classifying (114) the fused feature representation using a neural network classifier (64116); and
outputting (116) a classification indicating whether the audio input is real or deepfake along with a confidence score.`}
              </p>
            </div>

            {/* Independent Claim 8 */}
            <div className="bg-[#0a0a0a] border border-red-700/60 rounded-sm p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                <span className="px-2.5 py-1 bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold rounded-xs">
                  CLAIM 8 · INDEPENDENT SYSTEM CLAIM
                </span>
                <span className="text-gray-400 text-[11px]">Hardware &amp; System Apparatus</span>
              </div>
              <p className="text-gray-200 leading-relaxed text-[11px] whitespace-pre-line">
{`An audio deepfake detection system (64100), comprising:
an audio input module (64102) configured to receive an audio input;
a multi-branch feature extraction module (64106) comprising:
  - a first branch (64108) comprising a convolutional neural network configured to process a spectral representation of the audio input to generate spectral features,
  - a second branch (64110) comprising a recurrent neural network configured to process cepstral coefficients of the audio input to generate acoustic features, and
  - a third branch (64112) comprising a one-dimensional convolutional neural network configured to process raw waveform data of the audio input to generate temporal features;
a self-attention fusion module (64114) configured to fuse the spectral features, the acoustic features, and the temporal features using an attention-based mechanism to generate a fused feature representation;
a classification module (64116) configured to classify the fused feature representation as real or deepfake; and
an output module (64118) configured to output a classification result along with a confidence score.`}
              </p>
            </div>

            {/* Dependent Claims 2 to 7, 9, 10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              {/* Claim 2 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 2 · Preprocessing Operations</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of claim 1, further comprising: preprocessing (104) the audio input through noise handling, normalization, and segmentation prior to extracting the spectral features, the acoustic features, and the temporal features.
                </p>
              </div>

              {/* Claim 3 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 3 · 128 Mel Bands Spectrogram</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of claim 1 or 2, wherein extracting spectral features comprises generating (206) a Mel-spectrogram (128) with 128 mel bands from the audio input, and processing the Mel-spectrogram via the convolutional neural network (64108).
                </p>
              </div>

              {/* Claim 4 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 4 · 40 MFCCs &amp; BiLSTM Processing</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of any of claims 1 to 3, wherein extracting acoustic features comprises computing (208) Mel-frequency cepstral coefficients (40) with 40 coefficients along with delta and delta-delta derivatives, and processing via a bidirectional LSTM (64212).
                </p>
              </div>

              {/* Claim 5 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 5 · 64,000 Raw Waveform Samples</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of any of claims 1 to 4, wherein extracting temporal features comprises sampling (204) 64,000 samples from the raw waveform and processing through the one-dimensional convolutional neural network (64112).
                </p>
              </div>

              {/* Claim 6 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 6 · Domain-Aware Baseline Weights</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of any of claims 1 to 5, wherein fusing features comprises assigning (312) domain-aware weights: spectral features assigned 42 percent, acoustic features assigned 35 percent, and temporal features assigned 23 percent.
                </p>
              </div>

              {/* Claim 7 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 7 · Temporal Frame Aggregation</span>
                <p className="text-gray-300 leading-relaxed">
                  The method (100) of any of claims 1 to 6, further comprising: segmenting (404) audio input into temporal frames, generating (406) deepfake probability scores per frame, applying threshold (0.50), and aggregating using mean, median, max, or voting.
                </p>
              </div>

              {/* Claim 9 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 9 · System Preprocessing Integration</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (64100) of claim 8, further comprising a preprocessing module (64104) configured to perform noise handling, normalization, and segmentation on audio input prior to processing by the multi-branch feature extraction module (64106).
                </p>
              </div>

              {/* Claim 10 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 10 · Computer-Readable Medium</span>
                <p className="text-gray-300 leading-relaxed">
                  A non-transitory computer-readable medium storing instructions that, when executed by a processor, cause the processor to perform the method of any of claims 1 to 7.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BibTeX Citation Box */}
        <section id="citation" className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-6 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              Cite this Patent Publication (BibTeX)
            </span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-white rounded-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
              <span>{copiedBibtex ? 'Copied to Clipboard' : 'Copy Citation'}</span>
            </button>
          </div>
          <pre className="p-4 bg-[#050505] border border-white/5 rounded-xs text-gray-300 text-[11px] overflow-x-auto leading-relaxed">
            {bibtexCode}
          </pre>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-red-700/60 rounded-sm max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#070707]">
                <div className="flex items-center gap-2 font-mono text-xs">
                  {activeImage.badge && (
                    <span className="px-2 py-0.5 bg-red-950/80 border border-red-600 text-red-300 text-[10px] font-bold rounded-xs">
                      {activeImage.badge}
                    </span>
                  )}
                  <span className="text-white font-bold truncate max-w-xl">{activeImage.title}</span>
                </div>
                <button
                  onClick={() => setActiveImage(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#050505] flex items-center justify-center min-h-[300px]">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="max-h-[68vh] max-w-full object-contain rounded-xs shadow-md"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#080808] border-t border-white/10 text-xs font-mono text-gray-300 leading-relaxed">
                {activeImage.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
