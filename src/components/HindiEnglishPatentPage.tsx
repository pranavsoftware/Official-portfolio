import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ScanFace, Info, MessageSquare, Languages, Volume2, Lock, ShieldCheck,
  Sparkles, RefreshCw, SlidersHorizontal, ArrowRight, ShieldAlert, HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HindiEnglishPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function HindiEnglishPatentPage({ onBack }: HindiEnglishPatentPageProps) {
  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'architecture' | 'models' | 'benchmarks' | 'analysis'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const speechArousalId = useId();
  const faceValenceId = useId();
  const pitchShiftId = useId();
  const epsilonId = useId();
  const turnsId = useId();

  // Preset scenarios
  type PresetKey = 'telehealth_consultation' | 'diplomatic_summit' | 'hinglish_chat' | 'emergency_distress' | 'misunderstanding_breakdown';

  const [activePreset, setActivePreset] = useState<PresetKey>('telehealth_consultation');
  const [simSpeechArousal, setSimSpeechArousal] = useState<number>(-0.45); // -1.0 to 1.0
  const [simFaceValence, setSimFaceValence] = useState<number>(-0.62); // -1.0 to 1.0
  const [simPitchShift, setSimPitchShift] = useState<number>(-14); // Hz (-50 to +50)
  const [simPrivacyEpsilon, setSimPrivacyEpsilon] = useState<number>(1.0); // 0.1 to 10.0
  const [simConversationTurns, setSimConversationTurns] = useState<number>(3); // 1 to 10

  const presets: Record<PresetKey, {
    name: string;
    domainContext: string;
    speechArousal: number;
    faceValence: number;
    pitchShift: number;
    privacyEpsilon: number;
    turns: number;
    hindiInput: string;
    englishOutput: string;
    detectedEmotion: string;
    policy: 'EMPATHETIC' | 'FORMAL' | 'CASUAL' | 'SIMPLIFIED' | 'CLARIFY';
    prosodyAdvice: string;
    description: string;
  }> = {
    telehealth_consultation: {
      name: 'Empathetic Telehealth Consultation',
      domainContext: 'Rural Patient Tele-Clinic (Hindi -> English Doctor)',
      speechArousal: -0.45,
      faceValence: -0.62,
      pitchShift: -14,
      privacyEpsilon: 1.0,
      turns: 3,
      hindiInput: 'मुझे सीने में पिछले दो दिनों से बहुत भारीपन और बेचैनी महसूस हो रही है...',
      englishOutput: 'I have been experiencing distressing heaviness and persistent discomfort in my chest for the past two days...',
      detectedEmotion: 'Anxiety / Somatic Distress',
      policy: 'EMPATHETIC',
      prosodyAdvice: 'Softer pitch envelope (-14Hz), reduced speaking rate (-18%), warm reassuring timbre.',
      description: 'Patient exhibits vocal tremor and furrowed brow indicative of health anxiety. The policy engine adapts clinical terminology into compassionate, validated phrasing.'
    },
    diplomatic_summit: {
      name: 'High-Stakes Bilateral Negotiation',
      domainContext: 'Inter-Governmental Trade Dialogue (English -> Hindi)',
      speechArousal: 0.15,
      faceValence: -0.10,
      pitchShift: 4,
      privacyEpsilon: 0.5,
      turns: 6,
      hindiInput: 'हम इस प्रस्तावित टैरिफ संशोधन की शर्तों पर पुनर्विचार करने का औपचारिक अनुरोध करते हैं।',
      englishOutput: 'We formally request a comprehensive reconsideration regarding the proposed tariff adjustments.',
      detectedEmotion: 'Composed / Formal Restraint',
      policy: 'FORMAL',
      prosodyAdvice: 'Neutral cadence, even intensity (68dB), controlled articulation rate, zero colloquialisms.',
      description: 'Subtle facial tension and restrained prosody dictate a strictly ceremonial, diplomatic register with elevated privacy shielding (ε=0.5).'
    },
    hinglish_chat: {
      name: 'Casual Code-Mixed Hinglish Exchange',
      domainContext: 'Peer-to-Peer Collaborative Video Call (Hinglish -> English)',
      speechArousal: 0.78,
      faceValence: 0.85,
      pitchShift: 28,
      privacyEpsilon: 5.0,
      turns: 2,
      hindiInput: 'Bhai ye prototype dekh, bilkul seamless chal raha hai, mast visual appeal hai!',
      englishOutput: 'Check out this prototype! It runs completely seamlessly with gorgeous visual appeal!',
      detectedEmotion: 'Joy / High Enthusiasm',
      policy: 'CASUAL',
      prosodyAdvice: 'Dynamic pitch excursions (+28Hz), rapid tempo (+22%), expressive energetic avatar smile.',
      description: 'Vibrant facial engagement (YOLOv10 smile confidence: 0.94) triggers colloquial idiom mapping and enthusiastic acoustic rendering.'
    },
    emergency_distress: {
      name: 'Emergency SOS First-Responder Dispatch',
      domainContext: 'Crisis Hotline (Hindi SOS -> English Emergency Dispatcher)',
      speechArousal: 0.92,
      faceValence: -0.88,
      pitchShift: 42,
      privacyEpsilon: 3.0,
      turns: 1,
      hindiInput: 'जल्दी मदद भेजो! यहाँ दूसरी मंजिल पर भीषण आग लग गई है, रास्ता बंद है!',
      englishOutput: 'Send immediate assistance! Severe fire on the second floor; the primary exit is blocked!',
      detectedEmotion: 'Panic / High-Arousal Terror',
      policy: 'SIMPLIFIED',
      prosodyAdvice: 'Staccato bursts, maximum urgency articulation, loud alert modulation, concise syntax.',
      description: 'High vocal shimmer and dilated facial fear triggers rapid syntactic simplification to avoid ambiguity and accelerate triage action.'
    },
    misunderstanding_breakdown: {
      name: 'Cross-Cultural Misunderstanding Intervention',
      domainContext: 'Technical Support Escalation (Hindi User -> English Architect)',
      speechArousal: 0.55,
      faceValence: -0.74,
      pitchShift: -22,
      privacyEpsilon: 1.0,
      turns: 8,
      hindiInput: 'मैंने वही कॉन्फ़िगरेशन किया जो आपने बताया, फिर भी डेटाबेस सिंक पूरी तरह फेल हो गया।',
      englishOutput: 'I followed the exact steps instructed, yet the database synchronization failed entirely. Could we clarify the target port?',
      detectedEmotion: 'Frustration / Dissonance',
      policy: 'CLARIFY',
      prosodyAdvice: 'De-escalation tone (-22Hz pitch drop), slower pacing (-25%), proactive clarifying query inserted.',
      description: 'Temporal sequence LSTM detects cumulative misunderstanding trajectory across 8 conversation turns, auto-injecting disambiguation prompts.'
    }
  };

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimSpeechArousal(p.speechArousal);
    setSimFaceValence(p.faceValence);
    setSimPitchShift(p.pitchShift);
    setSimPrivacyEpsilon(p.privacyEpsilon);
    setSimConversationTurns(p.turns);
  };

  // Dynamic calculations based on user adjustments
  const computedValence = (simFaceValence * 0.55) + (simSpeechArousal * 0.45);
  
  // Attention weights calculation
  const rawSpeechAttn = Math.max(0.15, 0.30 + (Math.abs(simSpeechArousal) * 0.18));
  const rawFaceAttn = Math.max(0.18, 0.34 + (Math.abs(simFaceValence) * 0.16));
  const rawProsodyAttn = Math.max(0.15, 0.35 + (Math.abs(simPitchShift) / 100 * 0.12));
  const totalAttn = rawSpeechAttn + rawFaceAttn + rawProsodyAttn;
  const attnSpeech = (rawSpeechAttn / totalAttn);
  const attnFace = (rawFaceAttn / totalAttn);
  const attnProsody = (rawProsodyAttn / totalAttn);

  // Dynamic Policy Determination
  let activePolicy: 'EMPATHETIC' | 'FORMAL' | 'CASUAL' | 'SIMPLIFIED' | 'CLARIFY' = 'FORMAL';
  if (simConversationTurns >= 7 && (computedValence < -0.3 || Math.abs(simSpeechArousal) > 0.6)) {
    activePolicy = 'CLARIFY';
  } else if (computedValence < -0.5 && simSpeechArousal > 0.6) {
    activePolicy = 'SIMPLIFIED';
  } else if (computedValence < -0.2 && simSpeechArousal <= 0.2) {
    activePolicy = 'EMPATHETIC';
  } else if (computedValence > 0.35 && simSpeechArousal > 0.3) {
    activePolicy = 'CASUAL';
  } else {
    activePolicy = 'FORMAL';
  }

  // Misunderstanding Risk Score (0.0 to 1.0)
  const baseMisunderstanding = Math.min(0.96, Math.max(0.04, (
    (simConversationTurns * 0.08) + 
    (Math.abs(simSpeechArousal - simFaceValence) * 0.35) + 
    (computedValence < -0.2 ? 0.25 : -0.15)
  )));

  // Differential Privacy Cosine Similarity & L2 distortion
  const privacyCosineSim = simPrivacyEpsilon <= 0.2 ? 0.02 :
                           simPrivacyEpsilon <= 0.5 ? 0.08 :
                           simPrivacyEpsilon <= 1.0 ? 0.14 :
                           simPrivacyEpsilon <= 3.0 ? 0.27 :
                           simPrivacyEpsilon <= 5.0 ? 0.56 : 0.80;

  const copyBibtex = () => {
    const bibtex = `@patent{manasi2026multimodalcommunication,
  author    = {Nupur Manasi and Mrinali Charhate and Rayban Pranav Mahesh and Ashish Anil Sikaria},
  title     = {A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication},
  number    = {202641033897},
  type      = {Indian Patent Application},
  holder    = {Vellore Institute of Technology},
  day       = {20},
  month     = {March},
  year      = {2026},
  journal   = {The Patent Office Journal No. 13/2026},
  url       = {https://ipindiaservices.gov.in}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  // Figure definitions with high-res assets
  const figures = [
    {
      id: 'fig0',
      num: 'Figure 0',
      title: 'Conceptual Overview of Real-Time Multimodal Emotion-Aware Communication',
      category: 'architecture',
      src: '/patent-assets/multimodal-hindi-english/fig0_conceptual_overview.jpeg',
      caption: 'High-level conceptual interaction diagram showing audio-visual Hindi input, multimodal fusion, affective policy adaptation, and emotion-synchronized English rendering.',
      badge: 'System Concept'
    },
    {
      id: 'fig1',
      num: 'Figure 1',
      title: 'Complete 7-Module End-to-End System Architecture',
      category: 'architecture',
      src: '/patent-assets/multimodal-hindi-english/fig1_system_architecture.png',
      caption: 'Comprehensive architecture detailing Input Interface (100), Speech Recognition & Translation (110), Emotion Engine (120), Fusion Core (130), Policy Engine (140), Privacy Layer (150), Risk Detector (160), Speech Synthesis (170), and Avatar Rendering (180).',
      badge: 'Core Architecture'
    },
    {
      id: 'fig2',
      num: 'Figure 2',
      title: '7-Class Emotion Classification Confusion Matrices on 504 Test Samples',
      category: 'benchmarks',
      src: '/patent-assets/multimodal-hindi-english/fig2_confusion_matrices.png',
      caption: 'Comparative confusion matrices for Speech CNN (top-left), YOLOv10 + Facial CNN (top-right), Cross-Attention Multimodal Fusion (bottom-left), and 5-class Policy Engine (bottom-right).',
      badge: 'Confusion Matrices'
    },
    {
      id: 'fig3',
      num: 'Figure 3',
      title: 'Model Accuracy and F1-Score Comparative Analysis Across All 5 Engines',
      category: 'benchmarks',
      src: '/patent-assets/multimodal-hindi-english/fig3_accuracy_f1_comparison.png',
      caption: 'Side-by-side bar chart showing Accuracy and F1 metrics: Multimodal Fusion achieves 98.0% accuracy and 0.978 F1, outperforming individual modalities by up to +56.0%.',
      badge: 'Accuracy & F1'
    },
    {
      id: 'fig4',
      num: 'Figure 4',
      title: 'Dynamic Modality Attention Weights & Per-Emotion Class Heatmap',
      category: 'analysis',
      src: '/patent-assets/multimodal-hindi-english/fig4_modality_attention_weights.png',
      caption: 'Transformer cross-modal attention weight distribution: Speech (mean 0.300), Facial (0.344), and Prosody (0.356). Heatmap proves weights dynamically shift according to expressed emotion.',
      badge: 'Attention Analysis'
    },
    {
      id: 'fig5',
      num: 'Figure 5',
      title: 'Performance Heatmap & Sub-30ms Inference Latency Breakdown',
      category: 'benchmarks',
      src: '/patent-assets/multimodal-hindi-english/fig5_performance_heatmap.png',
      caption: 'Precision/Recall/F1 heatmap (left) paired with sequential latency bar chart (right). Total pipeline completes in 25.40ms, strictly satisfying real-time conversational SLA (<30ms).',
      badge: 'Latency Benchmark'
    },
    {
      id: 'fig6',
      num: 'Figure 6',
      title: 'Predictive Misunderstanding Detector ROC Curve, Risk & Interventions',
      category: 'benchmarks',
      src: '/patent-assets/multimodal-hindi-english/fig6_misunderstanding_detector.png',
      caption: 'ROC curve (AUC: 0.9357), bimodal risk score distribution with threshold 0.5, and 3-tier graded intervention probability profiles (Clarification, Simplification, Slow Down).',
      badge: 'Risk Detector'
    },
    {
      id: 'fig7',
      num: 'Figure 7',
      title: 'Multi-Metric Radar Trade-Off Comparison',
      category: 'analysis',
      src: '/patent-assets/multimodal-hindi-english/fig7_multimetric_radar_chart.jpeg',
      caption: 'Radar evaluation comparing Speech CNN, YOLOv10 Facial CNN, and Multimodal Fusion across 5 orthogonal axes: Accuracy, Precision, Recall, F1-Score, and Normalized Speed.',
      badge: 'Radar Comparison'
    },
    {
      id: 'fig8',
      num: 'Figure 8',
      title: 'Invention Contribution 1: Dynamic Cross-Modal Attention Fusion with YOLOv10',
      category: 'models',
      src: '/patent-assets/multimodal-hindi-english/fig8_dynamic_crossmodal_attention_fusion.png',
      caption: 'Experimental validation of dynamic cross-modal attention: proves non-static fusion weights with attention spread ranges (Speech: 0.1797, Face: 0.1650, Prosody: 0.1017) and 98% fusion accuracy.',
      badge: 'Contribution #1'
    },
    {
      id: 'fig9',
      num: 'Figure 9',
      title: 'Invention Contribution 2: Affective-Aware Adaptive Translation Policy Engine',
      category: 'models',
      src: '/patent-assets/multimodal-hindi-english/fig9_affective_adaptive_translation_policy.png',
      caption: 'Empirical proof of affective translation policy: 92.6% policy accuracy across 5 discrete classes (FORMAL, CASUAL, EMPATHETIC, SIMPLIFIED, CLARIFY) conditioned on emotional context.',
      badge: 'Contribution #2'
    },
    {
      id: 'fig10',
      num: 'Figure 10',
      title: 'Invention Contribution 3: Predictive Misunderstanding Detection & Proactive Intervention',
      category: 'models',
      src: '/patent-assets/multimodal-hindi-english/fig10_predictive_misunderstanding_detection.png',
      caption: 'Temporal 10-turn sequence risk modeling: achieves 0.9357 AUC-ROC, accurately forecasting conversational breakdown before communicative failure occurs.',
      badge: 'Contribution #3'
    },
    {
      id: 'fig11',
      num: 'Figure 11',
      title: 'Invention Contribution 4: End-to-End Real-Time Pipeline Benchmark',
      category: 'architecture',
      src: '/patent-assets/multimodal-hindi-english/fig11_end_to_end_realtime_pipeline.png',
      caption: 'Waterfall latency validation: Speech (20.71ms), Face (0.67ms), Fusion (1.73ms), Policy (0.68ms), Risk (1.61ms) totaling 25.40ms with 1,260 samples/sec batched throughput.',
      badge: 'Contribution #4'
    },
    {
      id: 'fig12',
      num: 'Figure 12',
      title: 'Invention Contribution 5: Unified Hierarchical Embedding Space',
      category: 'models',
      src: '/patent-assets/multimodal-hindi-english/fig12_unified_hierarchical_embedding_space.png',
      caption: 'PCA clustering and silhouette score analysis: demonstrates hierarchical projection from 512+512+256 dimensions down to a 128-d unified manifold with 0.7927 silhouette score.',
      badge: 'Contribution #5'
    },
    {
      id: 'fig13',
      num: 'Figure 13',
      title: 'Policy Engine Detailed Distribution & Confidence Calibration',
      category: 'analysis',
      src: '/patent-assets/multimodal-hindi-english/fig13_policy_engine_analysis.png',
      caption: 'Detailed statistical analysis of policy selection distribution, confidence score density (mean: 0.4730), and confidence variation correlated with emotional intensity.',
      badge: 'Policy Analysis'
    },
    {
      id: 'fig14',
      num: 'Figure 14',
      title: 'YOLOv10 Multi-Person Video Facial Emotion Extraction & Detection',
      category: 'architecture',
      src: '/patent-assets/multimodal-hindi-english/fig14_yolov10_facial_emotion_analysis.jpeg',
      caption: 'Real-time multi-person video extraction utilizing lightweight YOLOv10n (~0.5M parameters) achieving >99% face detection rate and 0.67ms inference speed.',
      badge: 'YOLOv10 Vision'
    }
  ];

  const filteredFigures = figures.filter(fig => {
    if (selectedGalleryTab === 'all') return true;
    return fig.category === selectedGalleryTab;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-red-900 selection:text-white">

      {/* TOP HEADER & STICKY BREADCRUMB */}
      <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-red-900/40 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-sm bg-[#121212] hover:bg-red-950/40 border border-white/10 hover:border-red-500/50 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-red-500" />
              <span>Back to Portfolio</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>/</span>
              <span>PATENT DOSSIER</span>
              <span>/</span>
              <span className="text-red-400 font-bold">202641033897</span>
            </div>
          </div>

          {/* Action Buttons: ONLY Official Document in New Tab */}
          <div className="flex items-center gap-2">
            <a 
              href="/patent-assets/multimodal-hindi-english/Official_Gazette_Patent_202641033897.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/70 hover:bg-red-900 border border-red-700/80 hover:border-red-500 text-white text-xs font-mono font-bold rounded-sm shadow-md transition-all cursor-pointer"
              title="Open Official Patent Publication Issued by Indian Patent Office"
            >
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Official PDF</span>
              <span className="sm:hidden">Official PDF</span>
              <ExternalLink className="w-3 h-3 text-red-400" />
            </a>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="w-full lg:w-auto flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-mono text-gray-400 border-t lg:border-t-0 border-white/5 mt-1 lg:mt-0">
            <a href="#overview" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Overview</a>
            <a href="#architecture" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Architecture</a>
            <a href="#figures" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Figures (15)</a>
            <a href="#simulator" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Multimodal Simulator</a>
            <a href="#benchmarks" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Benchmarks</a>
            <a href="#prior-art" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Prior Art</a>
            <a href="#claims" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Claims (10)</a>
            <a href="#citation" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">BibTeX</a>
          </nav>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">

        {/* HERO DOSSIER CARD */}
        <section id="overview" className="relative rounded-sm bg-gradient-to-b from-[#100a0a] to-[#080808] border border-red-900/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle Dark Red Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 space-y-6">
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-red-950/40 border border-red-700/50 text-red-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Languages className="w-3 h-3 text-red-400" /> Patent #05 • Multimodal AI
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px]">
                App No: <strong className="text-white font-mono">202641033897</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px]">
                Publication: <strong className="text-red-400 font-mono">IN202641033897 A1</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-red-950/30 border border-red-800/40 text-red-300 font-mono text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-red-400" /> Published (Journal No: 13/2026)
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-400 font-mono text-[11px]">
                Indian Patent Office (IPO)
              </span>
            </div>

            {/* Patent Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication
              </h1>
              <p className="text-sm sm:text-base text-gray-400 font-mono">
                Research Domain: <span className="text-red-400 font-medium">Cross-Lingual Emotion Synchronization &amp; Bilingual NLP</span>
              </p>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/5 text-xs font-mono">
              
              <div className="bg-[#0c0c0c] p-3 rounded-sm border border-white/5">
                <span className="text-gray-500 block uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-red-500" /> Inventors
                </span>
                <div className="space-y-1 text-gray-300">
                  <div>Dr. Nupur Manasi</div>
                  <div>Mrinali Charhate</div>
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <span>Rayban Pranav Mahesh</span>
                    <span className="text-[9px] px-1 bg-red-950/50 text-red-300 rounded border border-red-800/50">Lead Architect</span>
                  </div>
                  <div>Ashish Anil Sikaria</div>
                </div>
              </div>

              <div className="bg-[#0c0c0c] p-3 rounded-sm border border-white/5">
                <span className="text-gray-500 block uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-red-500" /> Applicant &amp; Jurisdiction
                </span>
                <div className="text-white font-semibold">Vellore Institute of Technology (VIT)</div>
                <div className="text-gray-400 text-[11px] mt-0.5">Vellore, Tamil Nadu, India</div>
                <div className="text-red-400/80 text-[11px] mt-1">IPC: G10L 25/63, G06F 17/28</div>
              </div>

              <div className="bg-[#0c0c0c] p-3 rounded-sm border border-white/5">
                <span className="text-gray-500 block uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-red-500" /> Filing &amp; Publication Timeline
                </span>
                <div className="text-gray-300">Filed: <strong className="text-white font-mono">20 March 2026</strong></div>
                <div className="text-red-400 mt-0.5">Published: <strong className="font-mono">27 March 2026</strong></div>
                <div className="text-gray-500 text-[11px] mt-1">First Publication (Sec 11A)</div>
              </div>

              <div className="bg-[#0c0c0c] p-3 rounded-sm border border-white/5">
                <span className="text-gray-500 block uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-red-500" /> Validated Performance
                </span>
                <div className="text-red-400 font-bold text-sm">98.0% Fusion Accuracy</div>
                <div className="text-gray-200 font-mono text-[11px] mt-0.5">25.40 ms Pipeline Latency</div>
                <div className="text-gray-400 text-[11px] mt-1">1,260 samples/sec (Batch=32)</div>
              </div>

            </div>

            {/* Official Abstract Quote Box */}
            <div className="bg-[#0c0c0c] p-4 rounded-sm border-l-2 border-red-600 text-xs text-gray-300 space-y-2">
              <span className="text-red-400 font-mono font-bold uppercase text-[10px] tracking-wider block">Official IPO Abstract:</span>
              <p className="leading-relaxed italic text-gray-300">
                &ldquo;The present invention relates to a computer-implemented system and method for real-time multilingual communication. 
                The system comprises an input interface (100), a speech recognition and translation module (110), a multimodal emotion recognition engine (120), 
                a fusion core (130), an adaptive translation policy engine (140), a privacy-preserving embedding layer (150), a predictive misunderstanding 
                detection module (160), an emotion-preserving speech synthesis module (170), and an expression-aligned visual rendering module (180). 
                The system receives speech and visual inputs, extracts emotion features from multiple modalities, generates a unified emotion embedding, 
                and adapts translation behavior based on the detected emotional context while preserving emotional characteristics and forecasting 
                potential misunderstandings in real time.&rdquo;
              </p>
            </div>

          </div>
        </section>

        {/* ARCHITECTURAL DEEP-DIVE: THE 7 CORE MODULES */}
        <section id="architecture" className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">System Topology</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-red-500" />
                The 7 Core System Modules &amp; Pipeline Data Flow
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-500 hidden sm:inline">Strictly Sub-30ms Real-Time SLA</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Module 1 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 1 (110)</span>
                <span className="text-gray-500 font-mono text-[10px]">Wav2Vec2 / NMT</span>
              </div>
              <h3 className="font-bold text-white text-sm">Speech Recognition &amp; Bidirectional Translation</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Converts continuous Hindi, English, and code-mixed Hinglish speech signals into tokenized transcripts. Executes neural machine translation with domain lexicon preservation and bidirectional grammar alignment.
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                Bidirectional Hindi &harr; English + Hinglish colloquialism normalization
              </div>
            </div>

            {/* Module 2 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 2 (120)</span>
                <span className="text-gray-500 font-mono text-[10px]">Tri-Modal Encoders</span>
              </div>
              <h3 className="font-bold text-white text-sm">Multimodal Emotion Recognition Engine</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Houses three specialized encoders: Speech Encoder 120A (CNN + BiLSTM, ~2.1M params), Facial Encoder 120B (YOLOv10n multi-person face detector, ~0.5M params), and Prosodic Encoder 120C (pitch, energy, speaking rate).
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                7 Emotion Classes: Joy, Sadness, Anger, Fear, Disgust, Surprise, Neutral
              </div>
            </div>

            {/* Module 3 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 3 (130)</span>
                <span className="text-gray-500 font-mono text-[10px]">98.0% Accuracy</span>
              </div>
              <h3 className="font-bold text-white text-sm">Dynamic Cross-Attention Fusion Core</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Transforms heterogeneous vectors (512-d Speech + 512-d Face + 256-d Prosody) into a unified 128-d latent manifold via multi-head cross-attention. Dynamically weights modalities instead of static late concatenation.
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                +56.0% accuracy improvement over audio-only baseline (42.0% &rarr; 98.0%)
              </div>
            </div>

            {/* Module 4 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 4 (140)</span>
                <span className="text-gray-500 font-mono text-[10px]">92.6% Policy Acc</span>
              </div>
              <h3 className="font-bold text-white text-sm">Adaptive Translation Policy Engine</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Dynamically routes decoded meaning through 5 distinct communicative policies based on emotional context: <strong className="text-white">FORMAL</strong>, <strong className="text-white">CASUAL</strong>, <strong className="text-white">EMPATHETIC</strong>, <strong className="text-white">SIMPLIFIED</strong>, or <strong className="text-white">CLARIFY</strong>.
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                Context-conditioned syntax, register, and empathetic vocabulary adaptation
              </div>
            </div>

            {/* Module 5 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 5 (150)</span>
                <span className="text-gray-500 font-mono text-[10px]">&epsilon;-DP Layer</span>
              </div>
              <h3 className="font-bold text-white text-sm">Privacy-Preserving Embedding Layer</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Injects calibrated Laplace/Gaussian differential privacy noise into the 128-d unified emotion embedding. Strictly prevents speaker identification and facial biometric reconstruction while preserving affective utility.
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                Tunable Privacy Budget (&epsilon; &in; [0.1, 10.0]), Default &epsilon;=1.0
              </div>
            </div>

            {/* Module 6 */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULE 6 (160)</span>
                <span className="text-gray-500 font-mono text-[10px]">0.9357 AUC-ROC</span>
              </div>
              <h3 className="font-bold text-white text-sm">Predictive Misunderstanding Detector</h3>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Analyzes 10-turn temporal conversation sequences using an LSTM risk predictor. Computes breakdown probability before communicative collapse occurs, triggering automated clarification or pacing adjustments.
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-red-400/80">
                3 Proactive Interventions: Clarification, Simplification, Pacing Adjustment
              </div>
            </div>

            {/* Module 7 (Combined 170 & 180) */}
            <div className="p-4 rounded-sm bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 transition-all space-y-2 md:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 font-mono text-[10px] font-bold border border-red-800/40">MODULES 7A &amp; 7B (170 / 180)</span>
                <span className="text-gray-500 font-mono text-[10px]">Multimodal Synthesis</span>
              </div>
              <h3 className="font-bold text-white text-sm">Emotion-Preserving Speech Synthesis &amp; Expression-Aligned Visual Avatar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-gray-400">
                <div>
                  <strong className="text-white block mb-1">Emotion-Preserving Speech Synthesis (170):</strong>
                  Controllable acoustic vocoder modulating pitch contour, formant trajectories, speaking rate, and dynamic intensity envelope to match source affective valence and arousal in the target language.
                </div>
                <div>
                  <strong className="text-white block mb-1">Expression-Aligned Visual Rendering (180):</strong>
                  Facial Action Coding System (FACS) Action Unit (AU) mapping driving a real-time photo-realistic avatar. Synchronizes lip movements, micro-expressions, and eye gaze with translated speech.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 16-FIGURE TECHNICAL DRAWINGS GALLERY WITH LIGHTBOX */}
        <section id="figures" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Technical Dossier Exhibits</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-500" />
                Comprehensive Figure Gallery (16 Exhibits)
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {(['all', 'architecture', 'models', 'benchmarks', 'analysis'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedGalleryTab(tab)}
                  className={`px-3 py-1.5 rounded-sm capitalize transition-all cursor-pointer ${
                    selectedGalleryTab === tab
                      ? 'bg-red-600 text-white font-bold shadow-md'
                      : 'bg-[#121212] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Figures Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFigures.map((fig) => (
              <div 
                key={fig.id}
                onClick={() => setActiveImage(fig)}
                className="group relative rounded-sm bg-[#0c0c0c] border border-white/10 hover:border-red-600/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col"
              >
                <div className="relative h-44 bg-black overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src={fig.src} 
                    alt={fig.title} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 rounded bg-black/80 border border-red-800/40 text-red-300 font-mono text-[9px] font-bold">
                      {fig.num}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-xs">
                    <Maximize2 className="w-4 h-4 text-red-400" />
                    <span>Expand</span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between border-t border-white/5">
                  <div>
                    <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                      {fig.badge}
                    </span>
                    <h3 className="font-semibold text-white text-xs line-clamp-2 mb-1 group-hover:text-red-300 transition-colors">
                      {fig.title}
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                    {fig.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE MULTIMODAL TRANSLATION & PROSODY SIMULATOR */}
        <section id="simulator" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Interactive Research Tool</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-red-500" />
              Multimodal Emotion-Aware Translation &amp; Prosody Simulator
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Simulate cross-attention fusion weights, affective translation policy selection, differential privacy noise injection, and predictive misunderstanding risk in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0a0a] border border-white/10 p-6 rounded-sm shadow-xl">
            
            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Preset Selector */}
              <div>
                <label htmlFor={presetSelectId} className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" /> Conversational Scenarios
                  </span>
                  <span className="text-[10px] text-gray-500">5 Validated Benchmarks</span>
                </label>
                <select
                  id={presetSelectId}
                  value={activePreset}
                  onChange={(e) => applyPreset(e.target.value as PresetKey)}
                  className="w-full bg-[#121212] border border-white/10 text-white text-xs font-mono rounded-sm px-3 py-2.5 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {Object.entries(presets).map(([key, p]) => (
                    <option key={key} value={key} className="bg-[#121212] text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="text-[11px] font-mono text-red-300/90 mt-1.5 px-2 py-1 bg-red-950/20 rounded-sm border border-red-900/40">
                  Context: {presets[activePreset].domainContext}
                </div>
              </div>

              {/* Slider 1: Speech Acoustic Arousal */}
              <div className="space-y-1.5 bg-[#0e0e0e] p-3 rounded-sm border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor={speechArousalId} className="text-gray-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-red-500" />
                    Speech Acoustic Arousal
                  </label>
                  <span className="text-red-400 font-bold">{simSpeechArousal.toFixed(2)}</span>
                </div>
                <input 
                  id={speechArousalId}
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.05"
                  value={simSpeechArousal}
                  onChange={(e) => setSimSpeechArousal(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>-1.0 (Depressed / Withdrawn)</span>
                  <span>0.0 (Neutral)</span>
                  <span>+1.0 (High Arousal / Agitated)</span>
                </div>
              </div>

              {/* Slider 2: YOLOv10 Facial Valence */}
              <div className="space-y-1.5 bg-[#0e0e0e] p-3 rounded-sm border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor={faceValenceId} className="text-gray-300 flex items-center gap-1.5">
                    <ScanFace className="w-3.5 h-3.5 text-red-500" />
                    YOLOv10 Facial Valence
                  </label>
                  <span className="text-red-400 font-bold">{simFaceValence.toFixed(2)}</span>
                </div>
                <input 
                  id={faceValenceId}
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.05"
                  value={simFaceValence}
                  onChange={(e) => setSimFaceValence(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>-1.0 (Distress / Frown)</span>
                  <span>0.0 (Neutral)</span>
                  <span>+1.0 (Joy / Broad Smile)</span>
                </div>
              </div>

              {/* Slider 3: Prosodic Pitch Modulation */}
              <div className="space-y-1.5 bg-[#0e0e0e] p-3 rounded-sm border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor={pitchShiftId} className="text-gray-300 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
                    Prosodic Pitch Delta (&Delta;F0)
                  </label>
                  <span className="text-red-400 font-bold">{simPitchShift > 0 ? `+${simPitchShift}` : simPitchShift} Hz</span>
                </div>
                <input 
                  id={pitchShiftId}
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={simPitchShift}
                  onChange={(e) => setSimPitchShift(parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>-50 Hz (Subdued / Somber)</span>
                  <span>0 Hz (Baseline)</span>
                  <span>+50 Hz (Excited / Panic)</span>
                </div>
              </div>

              {/* Slider 4: Differential Privacy Budget (Epsilon) */}
              <div className="space-y-1.5 bg-[#0e0e0e] p-3 rounded-sm border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor={epsilonId} className="text-gray-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-500" />
                    Privacy Budget (&epsilon;)
                  </label>
                  <span className="text-red-400 font-bold">&epsilon; = {simPrivacyEpsilon.toFixed(1)}</span>
                </div>
                <input 
                  id={epsilonId}
                  type="range"
                  min="0.1"
                  max="10.0"
                  step="0.1"
                  value={simPrivacyEpsilon}
                  onChange={(e) => setSimPrivacyEpsilon(parseFloat(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0.1 (Max Noise / Anonymity)</span>
                  <span>1.0 (Default)</span>
                  <span>10.0 (High Utility)</span>
                </div>
              </div>

              {/* Slider 5: Conversation Turn Depth */}
              <div className="space-y-1.5 bg-[#0e0e0e] p-3 rounded-sm border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label htmlFor={turnsId} className="text-gray-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                    Temporal Turns Analyzed
                  </label>
                  <span className="text-red-400 font-bold">{simConversationTurns} / 10 turns</span>
                </div>
                <input 
                  id={turnsId}
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={simConversationTurns}
                  onChange={(e) => setSimConversationTurns(parseInt(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>Turn 1 (Initial Exchange)</span>
                  <span>Turn 5</span>
                  <span>Turn 10 (Long Context)</span>
                </div>
              </div>

            </div>

            {/* Right Live Simulation Output Dashboard (7 cols) */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              
              {/* Dynamic Modality Attention Weight Bars */}
              <div className="bg-[#0e0e0e] p-4 rounded-sm border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-500" /> Dynamic Cross-Modal Attention Weights
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Sum = 1.000</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Speech Channel Attention (W_s)</span>
                      <span className="text-red-300">{(attnSpeech * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-sm overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-red-800 to-red-500 h-full transition-all duration-300" style={{ width: `${attnSpeech * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>YOLOv10 Facial Channel Attention (W_f)</span>
                      <span className="text-red-300">{(attnFace * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-sm overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-red-700 to-red-400 h-full transition-all duration-300" style={{ width: `${attnFace * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span>Prosodic Channel Attention (W_p)</span>
                      <span className="text-red-300">{(attnProsody * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-sm overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-red-900 to-red-600 h-full transition-all duration-300" style={{ width: `${attnProsody * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-gray-400 italic pt-1 border-t border-white/5">
                  &ldquo;Dynamic attention proves the system does NOT employ fixed fusion weights &mdash; focus automatically redistributes toward the most salient modality.&rdquo;
                </div>
              </div>

              {/* Status Gauges Grid: Policy, Risk, Privacy, Latency */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                
                {/* Active Translation Policy */}
                <div className="p-3 bg-[#0e0e0e] rounded-sm border border-white/5 text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Policy Selected</span>
                  <span className="text-sm font-bold tracking-wider text-red-400">
                    {activePolicy}
                  </span>
                  <span className="text-[9px] text-gray-400 block">92.6% Model Acc</span>
                </div>

                {/* Misunderstanding Risk */}
                <div className="p-3 bg-[#0e0e0e] rounded-sm border border-white/5 text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Breakdown Risk</span>
                  <span className={`text-sm font-bold ${
                    baseMisunderstanding >= 0.70 ? 'text-red-500' :
                    baseMisunderstanding >= 0.40 ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {(baseMisunderstanding * 100).toFixed(0)}%
                  </span>
                  <span className="text-[9px] text-gray-400 block">
                    {baseMisunderstanding >= 0.70 ? 'Intervene!' : 'Stable Flow'}
                  </span>
                </div>

                {/* Privacy Shield */}
                <div className="p-3 bg-[#0e0e0e] rounded-sm border border-white/5 text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">DP Shielding</span>
                  <span className="text-sm font-bold text-gray-200">
                    &epsilon; = {simPrivacyEpsilon.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-gray-400 block">Cos Sim: {privacyCosineSim.toFixed(2)}</span>
                </div>

                {/* Real-Time Latency */}
                <div className="p-3 bg-[#0e0e0e] rounded-sm border border-white/5 text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Pipeline Latency</span>
                  <span className="text-sm font-bold text-red-400">25.40 ms</span>
                  <span className="text-[9px] text-gray-400 block">&lt; 30ms Target &check;</span>
                </div>

              </div>

              {/* Dynamic Bilingual Transcript Preview */}
              <div className="bg-[#0e0e0e] p-4 rounded-sm border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-red-500" /> Live Adaptive Translation Output
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141414] text-red-400 border border-white/10">
                    Mode: Hindi &harr; English
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2.5 rounded border border-white/5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">
                      Input Speech Stream (Hindi Audio &amp; Video):
                    </span>
                    <p className="text-gray-200 font-sans text-sm">
                      {presets[activePreset].hindiInput}
                    </p>
                  </div>

                  <div className="bg-red-950/20 p-2.5 rounded border border-red-900/40">
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>Synthesized English Output ({activePolicy} Policy):</span>
                      <span className="text-[9px] text-gray-400">Emotion Preserved &bull; Prosody Aligned</span>
                    </span>
                    <p className="text-white font-sans text-sm font-medium">
                      {presets[activePreset].englishOutput}
                    </p>
                  </div>
                </div>

                {/* Synthesis & Avatar Modulation Directive */}
                <div className="text-[11px] font-mono text-gray-400 bg-black/40 p-2.5 rounded border border-white/5 space-y-1">
                  <div className="text-red-400 font-semibold flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3 text-red-500" /> Synthesis &amp; Avatar Modulation Directive:
                  </div>
                  <p className="text-gray-300">
                    {presets[activePreset].prosodyAdvice}
                  </p>
                </div>

                {/* Active Proactive Intervention Banner */}
                {baseMisunderstanding >= 0.60 && (
                  <div className="flex items-center gap-2 p-2 bg-red-950/40 border border-red-600/40 rounded text-red-200 text-xs font-mono">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                    <span>
                      <strong>Automated Proactive Intervention Triggered:</strong> Injecting clarification prompt and reducing speaking rate by 20% to prevent communicative collapse.
                    </span>
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* EMPIRICAL BENCHMARKS & ABLATION STUDY */}
        <section id="benchmarks" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Experimental Grounding</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Empirical Benchmarks &amp; Ablation Evaluation
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Rigorous empirical evaluation conducted on 504 test samples with CUDA GPU execution across all 5 models.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Table 1: Model Performance Summary */}
            <div className="bg-[#0c0c0c] p-5 rounded-sm border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
                <span>Model Architecture &amp; Parameter Summary</span>
                <span className="text-[10px] text-red-400">Total ~3.3M Params</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141414] text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-2 px-2.5">Subsystem Model</th>
                      <th className="py-2 px-2">Params</th>
                      <th className="py-2 px-2 text-right">Accuracy</th>
                      <th className="py-2 px-2 text-right">Val F1</th>
                      <th className="py-2 px-2 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2 px-2.5">Speech Emotion CNN+BiLSTM</td>
                      <td className="py-2 px-2">~2.1M</td>
                      <td className="py-2 px-2 text-right text-gray-400">41.96%</td>
                      <td className="py-2 px-2 text-right">0.3445</td>
                      <td className="py-2 px-2 text-right font-bold text-gray-200">20.71 ms</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">YOLOv10 + Facial CNN</td>
                      <td className="py-2 px-2">~0.5M</td>
                      <td className="py-2 px-2 text-right text-gray-200">96.20%</td>
                      <td className="py-2 px-2 text-right">0.9547</td>
                      <td className="py-2 px-2 text-right font-bold text-gray-200">0.67 ms</td>
                    </tr>
                    <tr className="bg-red-950/20 font-semibold text-white">
                      <td className="py-2 px-2.5 text-red-300">Transformer Cross-Attention Fusion</td>
                      <td className="py-2 px-2">~0.4M</td>
                      <td className="py-2 px-2 text-right text-red-400 font-bold">98.00%</td>
                      <td className="py-2 px-2 text-right text-red-400">0.9782</td>
                      <td className="py-2 px-2 text-right text-red-400">1.73 ms</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">Adaptive Translation Policy Engine</td>
                      <td className="py-2 px-2">~0.04M</td>
                      <td className="py-2 px-2 text-right text-gray-200">92.60%</td>
                      <td className="py-2 px-2 text-right">0.6171</td>
                      <td className="py-2 px-2 text-right">0.68 ms</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">Misunderstanding Risk Detector</td>
                      <td className="py-2 px-2">~0.3M</td>
                      <td className="py-2 px-2 text-right text-gray-200">100.00%</td>
                      <td className="py-2 px-2 text-right">1.0000</td>
                      <td className="py-2 px-2 text-right">1.61 ms</td>
                    </tr>
                    <tr className="border-t border-red-800/40 font-bold text-red-300 bg-[#121212]">
                      <td className="py-2 px-2.5">Complete End-to-End Pipeline</td>
                      <td className="py-2 px-2">~3.3M</td>
                      <td className="py-2 px-2 text-right text-red-400">97.50%</td>
                      <td className="py-2 px-2 text-right">0.9750</td>
                      <td className="py-2 px-2 text-right text-red-400 font-mono">25.40 ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Ablation Study */}
            <div className="bg-[#0c0c0c] p-5 rounded-sm border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center justify-between">
                <span>Systematic Ablation Study</span>
                <span className="text-[10px] text-red-400">+56.0% Max Gain</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141414] text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-2 px-2.5">Configuration</th>
                      <th className="py-2 px-2 text-right">Accuracy</th>
                      <th className="py-2 px-2 text-right">&Delta; vs Speech</th>
                      <th className="py-2 px-2">Architectural Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2 px-2.5 font-medium">Speech Only (Baseline)</td>
                      <td className="py-2 px-2 text-right text-gray-400">42.0%</td>
                      <td className="py-2 px-2 text-right text-gray-500">&mdash;</td>
                      <td className="py-2 px-2 text-gray-400 text-[11px]">Audio MFCC + spectral features</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-medium">YOLOv10 Facial Only</td>
                      <td className="py-2 px-2 text-right text-gray-200">96.2%</td>
                      <td className="py-2 px-2 text-right text-gray-300">+54.2%</td>
                      <td className="py-2 px-2 text-gray-400 text-[11px]">Facial bounding box + AU landmark CNN</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-medium">Late Fusion (Averaging)</td>
                      <td className="py-2 px-2 text-right text-gray-300">71.0%</td>
                      <td className="py-2 px-2 text-right text-gray-400">+29.0%</td>
                      <td className="py-2 px-2 text-gray-400 text-[11px]">Simple arithmetic prediction average</td>
                    </tr>
                    <tr className="bg-red-950/20 font-semibold text-white">
                      <td className="py-2 px-2.5 text-red-300">Transformer Cross-Attention</td>
                      <td className="py-2 px-2 text-right text-red-400 font-bold">98.0%</td>
                      <td className="py-2 px-2 text-right text-red-400 font-bold">+56.0%</td>
                      <td className="py-2 px-2 text-red-200 text-[11px]">Cross-modal Query-Key-Value attention</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-medium">Fusion + Adaptive Policy</td>
                      <td className="py-2 px-2 text-right text-gray-200">97.5%</td>
                      <td className="py-2 px-2 text-right text-gray-300">+55.5%</td>
                      <td className="py-2 px-2 text-gray-400 text-[11px]">Coupled translation policy routing</td>
                    </tr>
                    <tr className="border-t border-red-800/40 font-bold text-red-300 bg-[#121212]">
                      <td className="py-2 px-2.5">Full System (All 7 Modules)</td>
                      <td className="py-2 px-2 text-right text-red-400">97.5%</td>
                      <td className="py-2 px-2 text-right text-red-400">+55.5%</td>
                      <td className="py-2 px-2 text-white text-[11px]">Complete pipeline with DP &amp; risk engine</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Differential Privacy & Latency Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#0c0c0c] p-4 rounded-sm border border-white/10 space-y-2">
              <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" /> Differential Privacy Calibration (&epsilon;)
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Empirical evaluation across &epsilon; &in; [0.1, 10.0] proves biometric facial reconstructions and speaker identification can be completely blocked (cosine sim: 0.02 at &epsilon;=0.1) while retaining downstream emotion classification fidelity.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center">
                <div className="bg-[#141414] p-2 rounded border border-white/5">
                  <span className="text-gray-500 block">&epsilon;=0.1</span>
                  <span className="text-gray-200 font-bold">Max Privacy</span>
                  <span className="text-gray-400 block mt-0.5">Distortion ~75</span>
                </div>
                <div className="bg-red-950/30 p-2 rounded border border-red-800/40">
                  <span className="text-red-400 block">&epsilon;=1.0 (Default)</span>
                  <span className="text-white font-bold">Strong Balance</span>
                  <span className="text-gray-300 block mt-0.5">Distortion ~8.0</span>
                </div>
                <div className="bg-[#141414] p-2 rounded border border-white/5">
                  <span className="text-gray-500 block">&epsilon;=10.0</span>
                  <span className="text-gray-200 font-bold">High Utility</span>
                  <span className="text-gray-400 block mt-0.5">Distortion ~1.3</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0c0c] p-4 rounded-sm border border-white/10 space-y-2">
              <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-500" /> Real-Time Latency SLA Compliance
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                The total latency of <strong>25.40 ms</strong> remains well below the conversational human-interaction threshold of 30 ms. The fastest module is YOLOv10 Face CNN (0.67 ms) and slowest is Speech CNN (20.71 ms).
              </p>
              <div className="flex items-center gap-1 pt-3">
                <div className="h-3 rounded-l bg-red-700" style={{ width: '81.5%' }} title="Speech CNN: 20.71 ms (81.5%)" />
                <div className="h-3 bg-red-500" style={{ width: '2.6%' }} title="YOLOv10 Face: 0.67 ms (2.6%)" />
                <div className="h-3 bg-red-600" style={{ width: '6.8%' }} title="Fusion: 1.73 ms (6.8%)" />
                <div className="h-3 bg-red-800" style={{ width: '2.7%' }} title="Policy: 0.68 ms (2.7%)" />
                <div className="h-3 rounded-r bg-red-900" style={{ width: '6.4%' }} title="Risk: 1.61 ms (6.4%)" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                <span>0 ms</span>
                <span className="text-red-400 font-bold">25.40 ms (Completed)</span>
                <span className="text-gray-400">30.00 ms (Max SLA Threshold)</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRIOR ART COMPARATIVE ANALYSIS TABLE (11 CITATIONS) */}
        <section id="prior-art" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Novelty &amp; Non-Obviousness</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" />
              Prior Art Survey &amp; Technical Differentiation (11 Citations)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Comprehensive benchmarking against 7 granted/published international patents and 4 landmark academic publications.
            </p>
          </div>

          <div className="overflow-x-auto bg-[#0c0c0c] rounded-sm border border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141414] text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Patent / Publication Reference</th>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Core Contribution</th>
                  <th className="py-2.5 px-3 text-red-400">Identified Technical Limitation / Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                
                {/* 1 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">1</td>
                  <td className="py-2 px-3 font-semibold text-white">US 10,672,388</td>
                  <td className="py-2 px-3 text-gray-400">2020</td>
                  <td className="py-2 px-3">Emotion-aware machine translation system adjusting tone via text sentiment</td>
                  <td className="py-2 px-3 text-red-400">Only uses text modality; zero speech or facial cues; no real-time adaptation</td>
                </tr>

                {/* 2 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">2</td>
                  <td className="py-2 px-3 font-semibold text-white">US 11,024,291</td>
                  <td className="py-2 px-3 text-gray-400">2021</td>
                  <td className="py-2 px-3">Multimodal emotion recognition using deep audio-video fusion</td>
                  <td className="py-2 px-3 text-red-400">Fusion limited to late concatenation; no cross-attention; not coupled to translation</td>
                </tr>

                {/* 3 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">3</td>
                  <td className="py-2 px-3 font-semibold text-white">US 10,891,943</td>
                  <td className="py-2 px-3 text-gray-400">2021</td>
                  <td className="py-2 px-3">Adaptive speech translation with acoustic prosody transfer</td>
                  <td className="py-2 px-3 text-red-400">Lacks emotion-conditioned policy selection; no privacy layer; single language pair</td>
                </tr>

                {/* 4 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">4</td>
                  <td className="py-2 px-3 font-semibold text-white">US 11,354,522</td>
                  <td className="py-2 px-3 text-gray-400">2022</td>
                  <td className="py-2 px-3">Privacy-preserving speech processing with voice DP anonymization</td>
                  <td className="py-2 px-3 text-red-400">Limited to voice biometrics; does not address emotion preservation under privacy constraints</td>
                </tr>

                {/* 5 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">5</td>
                  <td className="py-2 px-3 font-semibold text-white">US 11,568,870</td>
                  <td className="py-2 px-3 text-gray-400">2023</td>
                  <td className="py-2 px-3">Real-time misunderstanding detection in multilingual dialogue</td>
                  <td className="py-2 px-3 text-red-400">No multimodal input; no predictive capability; purely post-hoc detection</td>
                </tr>

                {/* 6 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">6</td>
                  <td className="py-2 px-3 font-semibold text-white">EP 3,896,587</td>
                  <td className="py-2 px-3 text-gray-400">2021</td>
                  <td className="py-2 px-3">Cross-lingual affective speech synthesis across language pairs</td>
                  <td className="py-2 px-3 text-red-400">No adaptive translation policy; no visual avatar rendering; no privacy mechanism</td>
                </tr>

                {/* 7 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 text-gray-500 font-bold">7</td>
                  <td className="py-2 px-3 font-semibold text-white">CN 113,420,567</td>
                  <td className="py-2 px-3 text-gray-400">2021</td>
                  <td className="py-2 px-3">Transformer cross-attention for sentiment from text + audio</td>
                  <td className="py-2 px-3 text-red-400">Not applied to translation pipeline; no real-time sub-30ms operation; no policy action</td>
                </tr>

                {/* Academic Landmark 1 */}
                <tr className="hover:bg-white/5 transition-colors bg-[#100a0a]/30">
                  <td className="py-2 px-3 text-red-400 font-bold">8</td>
                  <td className="py-2 px-3 font-semibold text-white">Poria et al. (ACL)</td>
                  <td className="py-2 px-3 text-gray-400">2020</td>
                  <td className="py-2 px-3">Tensor fusion for multimodal sentiment analysis</td>
                  <td className="py-2 px-3 text-red-400">No translation integration; zero privacy preservation guarantees</td>
                </tr>

                {/* Academic Landmark 2 */}
                <tr className="hover:bg-white/5 transition-colors bg-[#100a0a]/30">
                  <td className="py-2 px-3 text-red-400 font-bold">9</td>
                  <td className="py-2 px-3 font-semibold text-white">Jia et al. (ICASSP)</td>
                  <td className="py-2 px-3 text-gray-400">2019</td>
                  <td className="py-2 px-3">Translatotron: Direct speech-to-speech without text intermediate</td>
                  <td className="py-2 px-3 text-red-400">No emotion preservation; no adaptive policies or conversational risk modeling</td>
                </tr>

                {/* Academic Landmark 3 */}
                <tr className="hover:bg-white/5 transition-colors bg-[#100a0a]/30">
                  <td className="py-2 px-3 text-red-400 font-bold">10</td>
                  <td className="py-2 px-3 font-semibold text-white">Li et al. (EMNLP)</td>
                  <td className="py-2 px-3 text-gray-400">2022</td>
                  <td className="py-2 px-3">Emotion tags appended to Neural Machine Translation input</td>
                  <td className="py-2 px-3 text-red-400">Binary emotion only; no multimodal audio-visual detection</td>
                </tr>

                {/* Academic Landmark 4 */}
                <tr className="hover:bg-white/5 transition-colors bg-[#100a0a]/30">
                  <td className="py-2 px-3 text-red-400 font-bold">11</td>
                  <td className="py-2 px-3 font-semibold text-white">Abadi et al. (CCS)</td>
                  <td className="py-2 px-3 text-gray-400">2016</td>
                  <td className="py-2 px-3">DP-SGD training for deep learning privacy</td>
                  <td className="py-2 px-3 text-red-400">Applied strictly to training gradients; not to real-time inference embeddings</td>
                </tr>

                {/* Present Invention Row */}
                <tr className="bg-red-950/30 border-t-2 border-red-600 font-bold text-red-300">
                  <td className="py-3 px-3 text-red-400">&starf;</td>
                  <td className="py-3 px-3 text-white text-sm">Present Patent (202641033897)</td>
                  <td className="py-3 px-3 text-red-400">2026</td>
                  <td className="py-3 px-3 text-white">
                    First unified system coupling YOLOv10 multi-person face + CNN-BiLSTM speech + Transformer fusion (98%) + 5 adaptive policies + &epsilon;-DP layer + predictive misunderstanding LSTM + avatar synthesis.
                  </td>
                  <td className="py-3 px-3 text-emerald-400">
                    &check; Fully Solves All Prior Gaps (Sub-30ms Real-Time Benchmark: 25.40 ms)
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        {/* 10 VERBATIM LEGAL CLAIMS FROM INDIAN PATENT OFFICE GAZETTE */}
        <section id="claims" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Statutory Legal Protection</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" />
              The 10 Verbatim Legal Claims (IPO Gazette Publication)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Exact claim structure filed and published in The Patent Office Journal No. 13/2026 under the Indian Patents Act, 1970.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            
            {/* Independent Claim 1 */}
            <div className="p-4 rounded-sm bg-[#0c0c0c] border-2 border-red-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                  CLAIM 1 &bull; INDEPENDENT SYSTEM CLAIM
                </span>
                <span className="text-[10px] text-red-400 font-semibold">Broad Apparatus Protection</span>
              </div>
              <p className="text-gray-200 leading-relaxed pt-1">
                <strong>1. A computer-implemented system for real-time multilingual communication, the system comprising:</strong><br />
                an input interface (100) configured to receive speech and visual data;<br />
                a speech recognition and translation module (110) configured to convert input speech into text and translate the text between a source language and a target language;<br />
                a multimodal emotion recognition engine (120) comprising a speech encoder (120A), a facial encoder (120B), and a prosodic encoder (120C), configured to generate modality-specific emotion features;<br />
                a fusion core (130) configured to combine the modality-specific emotion features to generate a unified emotion embedding;<br />
                an adaptive translation policy engine (140) configured to determine a translation policy based on the unified emotion embedding and contextual parameters;<br />
                a privacy-preserving embedding layer (150) configured to process the unified emotion embedding;<br />
                a predictive misunderstanding detection module (160) configured to analyze conversational inputs and generate a risk score;<br />
                an emotion-preserving speech synthesis module (170) configured to generate translated speech based on the translation policy and emotion embedding; and<br />
                an expression-aligned visual rendering module (180) configured to generate a visual representation corresponding to the emotion embedding;<br />
                wherein the system is configured to process the received input in real time to generate translated output while preserving emotional context.
              </p>
            </div>

            {/* Dependent Claims 2 to 9 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 2 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>2. The system as claimed in claim 1,</strong> wherein the multimodal emotion recognition engine (120) is configured to extract emotion features from speech signals, facial data, and prosodic characteristics including pitch, energy, and temporal features.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 3 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>3. The system as claimed in claim 1,</strong> wherein the fusion core (130) is configured to dynamically combine the modality-specific emotion features to generate the unified emotion embedding based on contextual relevance of each modality.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 4 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>4. The system as claimed in claim 1,</strong> wherein the adaptive translation policy engine (140) is configured to select a translation policy from a plurality of policies including formal, casual, empathetic, simplified, and clarification-based translation.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 5 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>5. The system as claimed in claim 1,</strong> wherein the emotion-preserving speech synthesis module (170) is configured to generate speech output by controlling prosodic parameters including pitch, speech rate, and intensity based on the unified emotion embedding.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 6 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>6. The system as claimed in claim 1,</strong> wherein the expression-aligned visual rendering module (180) is configured to generate facial expressions corresponding to the unified emotion embedding using predefined facial action mappings.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 7 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>7. The system as claimed in claim 1,</strong> wherein the privacy-preserving embedding layer (150) is configured to apply a noise-based mechanism to the unified emotion embedding to protect sensitive information while maintaining utility for downstream processing.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 8 &bull; DEPENDENT ON CLAIM 1</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>8. The system as claimed in claim 1,</strong> wherein the predictive misunderstanding detection module (160) is configured to analyze a sequence of conversational inputs and generate a risk score indicative of a potential communication breakdown.
                </p>
              </div>

              <div className="p-3 bg-[#0c0c0c] border border-white/10 rounded-sm space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">CLAIM 9 &bull; DEPENDENT ON CLAIM 8</span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <strong>9. The system as claimed in claim 8,</strong> wherein the system is further configured to initiate at least one corrective action based on the generated risk score, the corrective action comprising clarification, simplification, or adjustment of communication pace.
                </p>
              </div>

            </div>

            {/* Independent Claim 10 */}
            <div className="p-4 rounded-sm bg-[#0c0c0c] border-2 border-red-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                  CLAIM 10 &bull; INDEPENDENT METHOD CLAIM
                </span>
                <span className="text-[10px] text-red-400 font-semibold">Comprehensive Process Protection</span>
              </div>
              <p className="text-gray-200 leading-relaxed pt-1">
                <strong>10. A computer-implemented method for real-time multilingual communication, the method comprising:</strong><br />
                receiving speech and visual input through an input interface (100);<br />
                converting the speech input into text and translating the text between a source language and a target language using a speech recognition and translation module (110);<br />
                extracting emotion features from speech, facial, and prosodic inputs using a multimodal emotion recognition engine (120);<br />
                combining the extracted emotion features to generate a unified emotion embedding using a fusion core (130);<br />
                determining a translation policy based on the unified emotion embedding using an adaptive translation policy engine (140);<br />
                processing the unified emotion embedding using a privacy-preserving embedding layer (150);<br />
                analyzing conversational inputs to generate a risk score using a predictive misunderstanding detection module (160); and<br />
                generating translated speech and corresponding visual output using an emotion-preserving speech synthesis module (170) and an expression-aligned visual rendering module (180), respectively,<br />
                wherein the method enables real-time translation while preserving emotional context.
              </p>
            </div>

          </div>
        </section>

        {/* BIBTEX CITATION SECTION */}
        <section id="citation" className="space-y-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <span className="text-red-400 font-mono text-xs uppercase tracking-widest block">Scholarly Attribution</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Copy className="w-5 h-5 text-red-500" />
                BibTeX &amp; Patent Citation
              </h2>
            </div>

            <button
              type="button"
              onClick={copyBibtex}
              className="px-3.5 py-1.5 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-700/60 hover:border-red-500 text-red-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              {copiedBibtex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied BibTeX!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-red-400" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0c0c0c] p-4 rounded-sm border border-white/10 overflow-x-auto text-xs font-mono text-gray-300">
            <pre className="text-gray-300 selection:bg-red-900 selection:text-white leading-relaxed">
{`@patent{manasi2026multimodalcommunication,
  author    = {Nupur Manasi and Mrinali Charhate and Rayban Pranav Mahesh and Ashish Anil Sikaria},
  title     = {A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication},
  number    = {202641033897},
  type      = {Indian Patent Application},
  holder    = {Vellore Institute of Technology},
  day       = {20},
  month     = {March},
  year      = {2026},
  journal   = {The Patent Office Journal No. 13/2026},
  url       = {https://ipindiaservices.gov.in}
}`}
            </pre>
          </div>
        </section>

        {/* BOTTOM OFFICIAL PDF BANNER */}
        <section className="bg-gradient-to-r from-[#100a0a] via-[#161010] to-[#100a0a] border border-red-900/40 p-6 rounded-sm text-center space-y-3">
          <Award className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-mono">
            Verify Directly with the Indian Patent Office (IPO)
          </h3>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            Review the official publication published in Patent Office Journal No. 13/2026 for Application 202641033897.
          </p>
          <div className="pt-2">
            <a 
              href="/patent-assets/multimodal-hindi-english/Official_Gazette_Patent_202641033897.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-sm shadow-xl transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Open Official PDF in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </main>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0c0c0c] border border-red-800/60 rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#121212]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-300 font-mono text-xs font-bold border border-red-800/40">
                    {activeImage.badge || 'Exhibit'}
                  </span>
                  <h4 className="font-bold text-white text-sm truncate max-w-md sm:max-w-xl">
                    {activeImage.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="p-1 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Body */}
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-black">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title} 
                  className="max-h-[68vh] w-auto max-w-full object-contain mx-auto"
                />
              </div>

              {/* Modal Caption Footer */}
              <div className="p-4 bg-[#0e0e0e] border-t border-white/10 text-xs text-gray-300 font-mono leading-relaxed">
                <span className="text-red-400 font-bold block mb-1">Dossier Annotation:</span>
                <p>{activeImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
