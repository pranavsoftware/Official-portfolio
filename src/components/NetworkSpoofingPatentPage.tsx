import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, ShieldAlert, 
  ShieldCheck, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ScanFace, Info, Radio, Network, Terminal, Lock, RefreshCw, Filter, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NetworkSpoofingPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function NetworkSpoofingPatentPage({ onBack }: NetworkSpoofingPatentPageProps) {
  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'architecture' | 'models' | 'benchmarks' | 'analysis'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const packetRateId = useId();
  const flowAsymmetryId = useId();
  const bilstmDevId = useId();
  const autoencoderMseId = useId();
  const isolationForestId = useId();
  const threatProbId = useId();
  const dqnThresholdId = useId();

  // Preset scenarios
  type PresetKey = 'normal_traffic' | 'arp_poisoning' | 'ddos_syn_flood' | 'dns_spoofing' | 'mac_clone';

  const [activePreset, setActivePreset] = useState<PresetKey>('arp_poisoning');
  const [simPacketRate, setSimPacketRate] = useState<number>(4500); // pkts/sec
  const [simFlowAsymmetry, setSimFlowAsymmetry] = useState<number>(0.84); // 0.0 - 1.0
  const [simBilstmDeviation, setSimBilstmDeviation] = useState<number>(0.92); // 0.0 - 1.0
  const [simAutoencoderMse, setSimAutoencoderMse] = useState<number>(0.078); // 0.001 - 0.120
  const [simIsolationForest, setSimIsolationForest] = useState<number>(0.88); // 0.0 - 1.0
  const [simThreatProbability, setSimThreatProbability] = useState<number>(0.86); // 0.0 - 1.0
  const [simDqnThreshold, setSimDqnThreshold] = useState<number>(0.65); // 0.40 - 0.85

  const presets: Record<PresetKey, {
    name: string;
    attackType: string;
    packetRate: number;
    flowAsymmetry: number;
    bilstmDev: number;
    aeMse: number;
    isoForest: number;
    threatProb: number;
    dqnThresh: number;
    description: string;
    action: string;
  }> = {
    arp_poisoning: {
      name: 'ARP Cache Poisoning & Gateway Hijack',
      attackType: 'ARP Spoofing',
      packetRate: 1850,
      flowAsymmetry: 0.72,
      bilstmDev: 0.94,
      aeMse: 0.082,
      isoForest: 0.89,
      threatProb: 0.87,
      dqnThresh: 0.65,
      description: 'Host continuously broadcasts falsified gratuitous ARP replies binding the default gateway IP to attacker MAC address.',
      action: 'ISOLATE_SWITCH_PORT & PURGE_ARP_CACHE'
    },
    ddos_syn_flood: {
      name: 'High-Volume Spoofed DDoS SYN Storm',
      attackType: 'DDoS (IP Spoofed)',
      packetRate: 14200,
      flowAsymmetry: 0.96,
      bilstmDev: 0.98,
      aeMse: 0.105,
      isoForest: 0.95,
      threatProb: 0.96,
      dqnThresh: 0.60,
      description: 'Massive blast of TCP SYN packets originating from randomized pseudorandom spoofed IP addresses exhausting connection table.',
      action: 'TRIGGER_UPSTREAM_BGP_FLOWSPEC & DROP_QUEUE'
    },
    normal_traffic: {
      name: 'Legitimate Enterprise Workload (Baseline)',
      attackType: 'Normal Traffic',
      packetRate: 620,
      flowAsymmetry: 0.12,
      bilstmDev: 0.08,
      aeMse: 0.009,
      isoForest: 0.11,
      threatProb: 0.05,
      dqnThresh: 0.65,
      description: 'Standard mixed TCP/UDP business productivity traffic adhering tightly to learned device baseline profiles.',
      action: 'ALLOW_FORWARDING (VERIFIED_CLEAN)'
    },
    dns_spoofing: {
      name: 'Stealthy DNS Forgery & Cache Poisoning',
      attackType: 'DNS Spoofing',
      packetRate: 1200,
      flowAsymmetry: 0.58,
      bilstmDev: 0.76,
      aeMse: 0.064,
      isoForest: 0.78,
      threatProb: 0.79,
      dqnThresh: 0.65,
      description: 'Adversary injects fraudulent DNS responses targeting corporate resolver cache with forged authoritative nameserver records.',
      action: 'FORCE_DNSSEC_VALIDATION & QUARANTINE_IP'
    },
    mac_clone: {
      name: 'Rogue AP & MAC Address Clone Attack',
      attackType: 'MAC Spoofing',
      packetRate: 850,
      flowAsymmetry: 0.44,
      bilstmDev: 0.88,
      aeMse: 0.071,
      isoForest: 0.85,
      threatProb: 0.72,
      dqnThresh: 0.65,
      description: 'Attacker clones an authorized corporate laptop MAC address and generates deauthentication frames to intercept traffic.',
      action: 'DEAUTH_ROGUE_FRAME & BLOCK_RADIO_BSSID'
    }
  };

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimPacketRate(p.packetRate);
    setSimFlowAsymmetry(p.flowAsymmetry);
    setSimBilstmDeviation(p.bilstmDev);
    setSimAutoencoderMse(p.aeMse);
    setSimIsolationForest(p.isoForest);
    setSimThreatProbability(p.threatProb);
    setSimDqnThreshold(p.dqnThresh);
  };

  // Normalized Multi-Layer Spoofing Detection Index (MLSDI) Calculation:
  // Weights: BiLSTM (0.25) + Normalized AE MSE (0.25) + Isolation Forest (0.20) + Threat LSTM (0.30)
  const normAeScore = Math.min(1.0, simAutoencoderMse / 0.10);
  const mlsdiScore = (
    0.25 * simBilstmDeviation +
    0.25 * normAeScore +
    0.20 * simIsolationForest +
    0.30 * simThreatProbability
  );

  const isAttack = mlsdiScore >= simDqnThreshold;
  const isElevated = mlsdiScore >= simDqnThreshold * 0.75 && !isAttack;

  const getActiveResponseAction = () => {
    if (isAttack) {
      if (simPacketRate > 8000) return 'TRIGGER_BGP_FLOWSPEC_BLACKHOLE';
      if (simBilstmDeviation > 0.90 && simIsolationForest > 0.85) return 'INSTANT_PORT_SECURITY_ISOLATION';
      if (simThreatProbability > 0.80) return 'DYNAMIC_IPTABLES_FIREWALL_BLOCK';
      return 'AUTOMATED_PACKET_DROP_&_SDN_REROUTE';
    }
    if (isElevated) {
      return 'ENABLE_DEEP_PACKET_INSPECTION_PROBE';
    }
    return 'STATEFUL_FORWARDING_PERMITTED';
  };

  const copyBibtex = () => {
    const bibtex = `@patent{manasi2026networkspoofing,
  author    = {Nupur Manasi and Karishma Rahaman and Marmik Pradip Kaila and Rayban Pranav Mahesh},
  title     = {An AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security},
  number    = {202641054502},
  type      = {Indian Patent Application},
  holder    = {Vellore Institute of Technology},
  day       = {29},
  month     = {April},
  year      = {2026},
  journal   = {The Patent Office Journal No. 20/2026},
  url       = {https://ipindiaservices.gov.in}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  // Figure definitions with high-res assets
  const figures = [
    {
      id: 'fig1',
      num: 'Figure 1',
      title: 'Complete AI-Based Spoofing Detection System Summary Dashboard',
      category: 'architecture',
      src: '/patent-assets/network-spoofing-detection/fig1_summary_dashboard.png',
      caption: 'High-level operational dashboard demonstrating end-to-end multi-layer detection throughput, attack vectors, and model performance metrics.',
      badge: 'Core Architecture'
    },
    {
      id: 'fig2',
      num: 'Figure 2',
      title: 'Secure Spoofing Detection Platform - System Architecture & Verification Engine',
      category: 'architecture',
      src: '/patent-assets/network-spoofing-detection/fig2_system_architecture.png',
      caption: 'Detailed platform diagram displaying Verification Engine, AI Detection Module, Authentication Service, Database, and external carrier/STIR-SHAKEN gateways.',
      badge: 'Platform Flow'
    },
    {
      id: 'fig3',
      num: 'Figure 3',
      title: 'Distribution Analysis of Key Network Features',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig3_feature_distribution.png',
      caption: 'Comparative histograms illustrating feature distributions between normal enterprise network traffic and active multi-layer spoofing attack traffic.',
      badge: 'Feature Analysis'
    },
    {
      id: 'fig4',
      num: 'Figure 4',
      title: 'Cross-Feature Correlation Matrix Heatmap',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig4_correlation_heatmap.jpeg',
      caption: 'Comprehensive correlation heatmap revealing cross-dimensional dependencies across 50+ network-level, device-level, and behavioral features.',
      badge: 'Correlation Matrix'
    },
    {
      id: 'fig5',
      num: 'Figure 5',
      title: 'BiLSTM Behavioral Pattern Learning Model Training History',
      category: 'models',
      src: '/patent-assets/network-spoofing-detection/fig5_lstm_training_history.png',
      caption: 'Loss convergence and accuracy improvement trajectories for the Bidirectional LSTM network across 50 training epochs.',
      badge: 'BiLSTM Training'
    },
    {
      id: 'fig6',
      num: 'Figure 6',
      title: 'Behavioral Pattern Learning Model Confusion Matrix',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig6_behavioral_confusion_matrix.png',
      caption: 'Test confusion matrix for Feature #1 (BiLSTM), demonstrating 97.2% overall accuracy and 95.4% true positive recall on temporal event sequences.',
      badge: 'Confusion Matrix'
    },
    {
      id: 'fig7',
      num: 'Figure 7',
      title: 'Deep Autoencoder Reconstruction Loss Convergence',
      category: 'models',
      src: '/patent-assets/network-spoofing-detection/fig7_autoencoder_training_loss.png',
      caption: 'Mean Squared Error (MSE) loss minimization trajectory for the 50->32->16->8 latent dimensional compression and reconstruction layers.',
      badge: 'Autoencoder'
    },
    {
      id: 'fig8',
      num: 'Figure 8',
      title: 'Anomaly Score Density Distribution (Normal vs. Attack)',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig8_anomaly_score_distribution.png',
      caption: 'Empirical probability density showing pronounced bimodal separation between benign network baseline patterns and spoofing anomalies.',
      badge: 'Anomaly Separation'
    },
    {
      id: 'fig9',
      num: 'Figure 9',
      title: 'Hybrid Anomaly Detection Confusion Matrix (AE + Isolation Forest)',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig9_anomaly_confusion_matrix.png',
      caption: 'Confusion matrix for Feature #2 showing 96.5% detection accuracy and strong resilience against zero-day payload mutations.',
      badge: 'Anomaly Matrix'
    },
    {
      id: 'fig10',
      num: 'Figure 10',
      title: 'Predictive Threat Intelligence Training Curves',
      category: 'models',
      src: '/patent-assets/network-spoofing-detection/fig10_threat_predictor_training.png',
      caption: 'Accuracy and categorical cross-entropy loss convergence for the 30-step LSTM sequence predictor.',
      badge: 'Threat LSTM'
    },
    {
      id: 'fig11',
      num: 'Figure 11',
      title: 'Temporal Threat Evolution Heatmap',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig11_temporal_threat_heatmap.png',
      caption: 'Time-series predictive heatmap forecasting escalation probabilities across IP, MAC, ARP, DNS, and DDoS attack categories over time.',
      badge: 'Threat Heatmap'
    },
    {
      id: 'fig12',
      num: 'Figure 12',
      title: 'Predictive Threat Intelligence Model Confusion Matrix',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig12_threat_confusion_matrix.png',
      caption: 'Validation confusion matrix demonstrating 95.8% precision in forecasting impending spoofing campaigns before full payload delivery.',
      badge: 'Predictor Matrix'
    },
    {
      id: 'fig13',
      num: 'Figure 13',
      title: 'Deep Q-Network (DQN) Reinforcement Learning Reward History',
      category: 'models',
      src: '/patent-assets/network-spoofing-detection/fig13_dqn_reward_history.png',
      caption: 'Cumulative policy reward convergence curve showing DQN learning optimal dynamic sensitivity thresholds without human intervention.',
      badge: 'DQN Reward'
    },
    {
      id: 'fig14',
      num: 'Figure 14',
      title: 'Feature Importance & Multi-Layer Model Contribution Analysis',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig14_feature_importance.png',
      caption: 'Gini impurity and SHAP-based feature importance ranking demonstrating balanced weighting across all 5 sub-engines in the ensemble.',
      badge: 'Feature Importance'
    },
    {
      id: 'fig15',
      num: 'Figure 15',
      title: 'Experimental Dataset Attack Type Distribution (100,000 Samples)',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig15_attack_type_distribution.png',
      caption: 'Class distribution chart showing 85,000 normal traffic flows and 15,000 balanced attack samples across IP, MAC, ARP, DNS, and DDoS vectors.',
      badge: 'Dataset Split'
    },
    {
      id: 'fig16',
      num: 'Figure 16',
      title: 'Principal Component Analysis (PCA) Dimensionality Reduction',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig16_pca_visualization.png',
      caption: '2D PCA projection of 50-dimensional feature space demonstrating distinct spatial clustering between legitimate flows and spoofed frames.',
      badge: 'PCA Projection'
    },
    {
      id: 'fig17',
      num: 'Figure 17',
      title: 't-SNE Non-Linear Manifold Clustering of Spoofing Attack Profiles',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig17_tsne_clusters.jpeg',
      caption: 'High-dimensional t-SNE embedding showing discrete topological clusters corresponding to ARP, DNS, MAC, and IP spoofing signatures.',
      badge: 't-SNE Clustering'
    },
    {
      id: 'fig18',
      num: 'Figure 18',
      title: 'Temporal Diurnal Network Traffic Patterns',
      category: 'analysis',
      src: '/patent-assets/network-spoofing-detection/fig18_temporal_patterns.png',
      caption: 'Diurnal traffic volume rhythms across 24-hour cycles utilized by the behavioral baseline learner to suppress benign off-peak false alarms.',
      badge: 'Temporal Baseline'
    },
    {
      id: 'fig19',
      num: 'Figure 19',
      title: 'Learned Normal Device Behavioral Fingerprint Profiles',
      category: 'models',
      src: '/patent-assets/network-spoofing-detection/fig19_normal_behavior_patterns.png',
      caption: 'Multi-parametric baseline representations learned for verified endpoints including packet inter-arrival distributions and port entropy.',
      badge: 'Device Fingerprint'
    },
    {
      id: 'fig20',
      num: 'Figure 20',
      title: 'Real-Time Detection & Sub-100ms Automated Response Timeline',
      category: 'architecture',
      src: '/patent-assets/network-spoofing-detection/fig20_realtime_detection_timeline.png',
      caption: 'Sequential event timeline illustrating frame ingestion (0-15ms), feature fusion (15-45ms), classification (45-70ms), and policy execution (<90ms).',
      badge: 'Response Timeline'
    },
    {
      id: 'fig21',
      num: 'Figure 21',
      title: 'False Positive Pattern Diagnostics & Adaptive Suppression',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig21_false_positive_analysis.png',
      caption: 'Detailed false alarm classification analysis illustrating how multi-layer cross-validation drives false positive rates down to 1.1%.',
      badge: 'FPR Diagnostics'
    },
    {
      id: 'fig22',
      num: 'Figure 22',
      title: 'Comprehensive Performance Benchmark Across All 5 Engine Models',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig22_model_performance_comparison.png',
      caption: 'Comparative bar chart evaluating Accuracy, Precision, Recall, F1-Score, and AUC across BiLSTM, Autoencoder, Threat LSTM, DQN, and Ensemble.',
      badge: 'Model Comparison'
    },
    {
      id: 'fig23',
      num: 'Figure 23',
      title: 'Multi-Model Receiver Operating Characteristic (ROC) Curves',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig23_roc_curves.png',
      caption: 'ROC curves displaying exceptional discriminative power: Final Ensemble AUC-ROC of 0.993 and individual model AUCs exceeding 0.968.',
      badge: 'ROC Curves'
    },
    {
      id: 'fig24',
      num: 'Figure 24',
      title: 'Balanced F1-Score Metric Evaluation Across Detection Layers',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig24_f1_score_comparison.jpeg',
      caption: 'Precision-recall balance analysis demonstrating robust F1 performance (98.7% for Ensemble) under severe class imbalance.',
      badge: 'F1 Comparison'
    },
    {
      id: 'fig25',
      num: 'Figure 25',
      title: 'Final Multi-Layer Ensemble Confusion Matrix (98.7% Test Accuracy)',
      category: 'benchmarks',
      src: '/patent-assets/network-spoofing-detection/fig25_ensemble_confusion_matrix.png',
      caption: 'Overall system confusion matrix on 15,000 test events showing 99.1% true positive recall and only 1.1% false alarms.',
      badge: 'Ensemble Matrix'
    }
  ];

  const filteredFigures = figures.filter(fig => {
    if (selectedGalleryTab === 'all') return true;
    return fig.category === selectedGalleryTab;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-red-900 selection:text-white">

      {/* TOP HEADER & STICKY BREADCRUMB */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-sm bg-[#0a0a0a] hover:bg-red-950/40 border border-white/10 hover:border-red-500/50 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-red-400" />
              <span>Back to Portfolio</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>/</span>
              <span>PATENT DOSSIER</span>
              <span>/</span>
              <span className="text-red-400 font-bold">202641054502</span>
            </div>
          </div>

          {/* Action Buttons: ONLY Official Document in New Tab */}
          <div className="flex items-center gap-2">
            <a 
              href="/patent-assets/network-spoofing-detection/Official_Gazette_Patent_202641054502.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/70 hover:bg-red-900 border border-red-500/80 hover:border-red-400 text-white text-xs font-mono font-bold rounded-sm shadow-md transition-all cursor-pointer"
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
            <a href="#overview" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Overview</a>
            <a href="#architecture" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Architecture</a>
            <a href="#figures" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Figures (25)</a>
            <a href="#simulator" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Defense Simulator</a>
            <a href="#metrics" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Benchmarks</a>
            <a href="#prior-art" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Prior Art</a>
            <a href="#claims" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">Claims (9)</a>
            <a href="#citation" className="px-2 py-1 rounded hover:text-red-400 hover:bg-white/5 transition-colors">BibTeX</a>
          </nav>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">

        {/* HERO DOSSIER CARD */}
        <section id="overview" className="relative rounded-sm bg-gradient-to-b from-[#0a0a0a] to-[#080808] border border-red-500/20 p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Subtle Cyber Grid Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 space-y-6">
            
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-red-600/15 border border-red-500/30 text-red-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Network className="w-3 h-3" /> Patent #04 • Security &amp; Forensics
              </span>
              <span className="px-2.5 py-1 rounded bg-[#121212] border border-white/10 text-gray-300 font-mono text-[11px]">
                App No: <strong className="text-white font-mono">202641054502</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#121212] border border-white/10 text-gray-300 font-mono text-[11px]">
                Publication: <strong className="text-red-400 font-mono">IN202641054502 A</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Published (Journal No: 20/2026)
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-400 font-mono text-[11px]">
                Indian Patent Office (IPO)
              </span>
            </div>

            {/* Patent Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security
              </h1>
              <p className="text-sm sm:text-base text-gray-400 font-mono">
                Research Domain: <span className="text-red-300 font-medium">Multi-Layer Spoofing Detection &amp; Network Defense</span>
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Ensemble Accuracy</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-red-400">98.7%</span>
                <span className="text-[10px] font-mono text-emerald-400 block">+13.7% vs Legacy IDS</span>
              </div>
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">False Positive Rate</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">1.1%</span>
                <span className="text-[10px] font-mono text-gray-400 block">vs 15-25% in legacy</span>
              </div>
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Detection Latency</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-red-300">&lt; 100 ms</span>
                <span className="text-[10px] font-mono text-gray-400 block">Wire-speed inline</span>
              </div>
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Detection Layers</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-red-400">5 Layers</span>
                <span className="text-[10px] font-mono text-gray-400 block">BiLSTM, AE, IF, LSTM, DQN</span>
              </div>
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Attack Coverage</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-red-400">5 Types</span>
                <span className="text-[10px] font-mono text-gray-400 block">IP, MAC, ARP, DNS, DDoS</span>
              </div>
              <div className="bg-[#090e18] border border-white/10 p-3 rounded-sm">
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Throughput Scale</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-red-300">100k+</span>
                <span className="text-[10px] font-mono text-gray-400 block">Events per second</span>
              </div>
            </div>

            {/* Metadata Detail Row */}
            <div className="border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-gray-300">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Inventors:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-[#121212] border border-white/10 rounded text-gray-200">Dr. Nupur Manasi</span>
                  <span className="px-2 py-0.5 bg-[#121212] border border-white/10 rounded text-gray-200">Karishma Rahaman</span>
                  <span className="px-2 py-0.5 bg-[#121212] border border-white/10 rounded text-gray-200">Marmik Pradip Kaila</span>
                  <span className="px-2 py-0.5 bg-red-950/60 border border-red-500/60 rounded text-red-300 font-bold shadow-sm">
                    Rayban Pranav Mahesh
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Building className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Assignee / Applicant:</span>
                </div>
                <p className="text-white font-medium">Vellore Institute of Technology (VIT)</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Timeline:</span>
                </div>
                <p className="text-gray-300">
                  Filed: <strong className="text-white">29 April 2026</strong> • Published: <strong className="text-red-300">15 May 2026</strong>
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SYSTEM ARCHITECTURE & 5-FEATURE ENGINE BREAKDOWN */}
        <section id="architecture" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-red-400" />
              <span>Multi-Layer System Architecture &amp; Core Innovations</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Overcoming the vulnerability of single-layer, static-threshold Intrusion Detection Systems via sequential multi-model artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Layer 1: Data Ingestion */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm hover:border-red-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-800">LAYER 1</span>
                  <Radio className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-2">Data Ingestion &amp; Feature Vector</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Streams network packets across endpoints and constructs 50+ dimensional feature vectors:
                </p>
                <ul className="text-[11px] font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Network-level: IP, Port, TCP/UDP flag, flow duration</li>
                  <li>Device-level: MAC binding, OS signature, trust metric</li>
                  <li>Behavioral: Time-of-day, burst volume, entropy</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-red-400">
                Tensor input: 20 × 50 features
              </div>
            </div>

            {/* Layer 2: BiLSTM Behavioral Learning */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm hover:border-red-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800">FEATURE #1</span>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-2">Behavioral Pattern Learning</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Bidirectional LSTM network (64 units per direction, 0.3 dropout) processing sequences of 20 consecutive events to track temporal baseline transitions.
                </p>
                <ul className="text-[11px] font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Detects subtle deviation from normal device profile</li>
                  <li>Sigmoid-activated dense output layer</li>
                  <li>97.2% classification accuracy</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-blue-400">
                Metric: S_BiLSTM ∈ [0, 1]
              </div>
            </div>

            {/* Layer 3: Anomaly Detection (AE + IF) */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm hover:border-red-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-purple-800">FEATURE #2</span>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-2">Dual Anomaly Detection</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Hybrid unsupervised architecture combining Deep Autoencoder reconstruction with Isolation Forest recursive partitioning.
                </p>
                <ul className="text-[11px] font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Autoencoder: 50 → 32 → 16 → 8 (latent space)</li>
                  <li>MSE reconstruction error captures payload shifts</li>
                  <li>Isolation Forest isolates statistical outliers</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-red-400">
                Zero-day spoofing resilience
              </div>
            </div>

            {/* Layer 4: Predictive Threat Intelligence */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm hover:border-red-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800">FEATURE #3</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-2">Predictive Threat Intelligence</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Sequence-to-sequence LSTM predictor analyzing 30 past time steps to forecast upcoming attack probabilities before full execution.
                </p>
                <ul className="text-[11px] font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Predicts categorical attack type (5 classes)</li>
                  <li>Enables proactive defensive pre-staging</li>
                  <li>95.8% prediction accuracy</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-amber-400">
                Pre-emptive threat defense
              </div>
            </div>

            {/* Layer 5: Adaptive Policy (DQN) */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm hover:border-red-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800">FEATURE #4 &amp; #5</span>
                  <Sliders className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm text-white mb-2">Adaptive DQN &amp; Ensemble</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Deep Q-Network reinforcement learner dynamically tuning detection thresholds paired with a 100-tree Random Forest correlation engine.
                </p>
                <ul className="text-[11px] font-mono text-gray-300 space-y-1 list-disc list-inside">
                  <li>Reward function: +1 hit, -1 FP, -2 missed attack</li>
                  <li>Cross-layer confidence-weighted voting</li>
                  <li>98.7% final ensemble accuracy, 1.1% FPR</li>
                </ul>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-emerald-400">
                Self-learning threshold tuning
              </div>
            </div>

          </div>
        </section>

        {/* INTERACTIVE FIGURES LIGHTBOX GALLERY */}
        <section id="figures" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-red-400" />
                <span>Patent Figures &amp; Empirical Visual Evidence (25 Figures)</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
                Extracted directly from the research specification and official Indian Patent Office publication. Click any diagram to inspect high-resolution details.
              </p>
            </div>

            {/* Gallery Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#090e18] p-1 rounded border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('all')}
                className={`px-2.5 py-1 rounded transition-colors ${selectedGalleryTab === 'all' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                All (26)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('architecture')}
                className={`px-2.5 py-1 rounded transition-colors ${selectedGalleryTab === 'architecture' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Architecture
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('models')}
                className={`px-2.5 py-1 rounded transition-colors ${selectedGalleryTab === 'models' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Models
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('benchmarks')}
                className={`px-2.5 py-1 rounded transition-colors ${selectedGalleryTab === 'benchmarks' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Benchmarks
              </button>
              <button
                type="button"
                onClick={() => setSelectedGalleryTab('analysis')}
                className={`px-2.5 py-1 rounded transition-colors ${selectedGalleryTab === 'analysis' ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
              >
                Analysis
              </button>
            </div>
          </div>

          {/* Figures Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFigures.map((fig) => (
              <div 
                key={fig.id}
                onClick={() => setActiveImage(fig)}
                className="bg-[#0c0c0c] border border-white/10 hover:border-red-500/60 rounded-sm overflow-hidden group cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-cyan-500/10"
              >
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400">{fig.num}</span>
                    {fig.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">
                        {fig.badge}
                      </span>
                    )}
                  </div>
                  <Maximize2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
                </div>

                <div className="relative aspect-[16/10] bg-[#04060a] overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src={fig.src} 
                    alt={fig.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 bg-[#080d1a]">
                  <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors line-clamp-1 mb-1">
                    {fig.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {fig.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE TELEMETRY & LIVE MULTI-LAYER DEFENSE SIMULATOR */}
        <section id="simulator" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-red-400" />
              <span>Interactive Multi-Layer Spoofing Defense &amp; Policy Simulator</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Adjust multi-layer input telemetry or select attack scenarios to witness real-time composite score aggregation, DQN threshold decisioning, and automated mitigation rule generation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#080d1a] border border-red-500/20 rounded-sm p-5 sm:p-6">
            
            {/* Controls Column (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Preset Selector */}
              <div>
                <label htmlFor={presetSelectId} className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                  Preset Attack &amp; Baseline Scenarios:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(presets) as PresetKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyPreset(key)}
                      className={`text-left p-2.5 rounded-sm border text-xs font-mono transition-all cursor-pointer ${
                        activePreset === key 
                          ? 'bg-red-950/60 border-red-500 text-white shadow-md' 
                          : 'bg-[#0b1220] border-white/10 text-gray-300 hover:border-red-500/40 hover:text-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{presets[key].name}</span>
                        {key === 'normal_traffic' ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">BENIGN</span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300">ATTACK</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{presets[key].attackType}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                
                {/* 1. Packet Rate */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={packetRateId} className="text-gray-300">Packet Ingestion Rate:</label>
                    <span className="text-red-400 font-bold">{simPacketRate.toLocaleString()} pkts/sec</span>
                  </div>
                  <input
                    id={packetRateId}
                    type="range"
                    min="100"
                    max="20000"
                    step="100"
                    value={simPacketRate}
                    onChange={(e) => setSimPacketRate(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>100 (Idle Baseline)</span>
                    <span>10,000 (Saturated)</span>
                    <span>20,000 (DDoS Flood)</span>
                  </div>
                </div>

                {/* 2. BiLSTM Temporal Deviation */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={bilstmDevId} className="text-gray-300">BiLSTM Behavioral Sequence Deviation (S_BiLSTM):</label>
                    <span className="text-blue-400 font-bold">{simBilstmDeviation.toFixed(2)}</span>
                  </div>
                  <input
                    id={bilstmDevId}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={simBilstmDeviation}
                    onChange={(e) => setSimBilstmDeviation(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>0.00 (Consistent Baseline)</span>
                    <span>0.50 (Drifting)</span>
                    <span>1.00 (Abrupt Impersonation)</span>
                  </div>
                </div>

                {/* 3. Autoencoder Reconstruction MSE */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={autoencoderMseId} className="text-gray-300">Autoencoder Latent Reconstruction MSE (L_AE):</label>
                    <span className="text-red-400 font-bold">{simAutoencoderMse.toFixed(4)}</span>
                  </div>
                  <input
                    id={autoencoderMseId}
                    type="range"
                    min="0.001"
                    max="0.120"
                    step="0.001"
                    value={simAutoencoderMse}
                    onChange={(e) => setSimAutoencoderMse(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>0.001 (Perfect Recon)</span>
                    <span>0.050 (Moderate Error)</span>
                    <span>0.120 (Extreme Zero-Day Error)</span>
                  </div>
                </div>

                {/* 4. Isolation Forest Outlier Score */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={isolationForestId} className="text-gray-300">Isolation Forest Statistical Outlier (S_IF):</label>
                    <span className="text-amber-400 font-bold">{simIsolationForest.toFixed(2)}</span>
                  </div>
                  <input
                    id={isolationForestId}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={simIsolationForest}
                    onChange={(e) => setSimIsolationForest(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>0.00 (In-Distribution)</span>
                    <span>0.50 (Ambiguous)</span>
                    <span>1.00 (Shortest Tree Path Outlier)</span>
                  </div>
                </div>

                {/* 5. Threat Progression Probability */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={threatProbId} className="text-gray-300">LSTM Predictive Threat Probability (P_threat):</label>
                    <span className="text-red-400 font-bold">{simThreatProbability.toFixed(2)}</span>
                  </div>
                  <input
                    id={threatProbId}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={simThreatProbability}
                    onChange={(e) => setSimThreatProbability(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>0.00 (No Attack Trend)</span>
                    <span>0.50 (Pre-attack Recon)</span>
                    <span>1.00 (Active Coordinated Campaign)</span>
                  </div>
                </div>

                {/* 6. DQN Adaptive Sensitivity Threshold */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <label htmlFor={dqnThresholdId} className="text-gray-300">DQN Dynamic Sensitivity Threshold (τ_DQN):</label>
                    <span className="text-emerald-400 font-bold">{simDqnThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    id={dqnThresholdId}
                    type="range"
                    min="0.40"
                    max="0.85"
                    step="0.01"
                    value={simDqnThreshold}
                    onChange={(e) => setSimDqnThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#080808] rounded"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>0.40 (High Sensitivity Mode)</span>
                    <span>0.65 (Balanced Standard)</span>
                    <span>0.85 (Permissive High-Volume)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Results Column (5 cols) */}
            <div className="lg:col-span-5 bg-[#04070e] border border-white/10 rounded-sm p-5 flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <span className="text-xs font-mono text-gray-400 uppercase font-bold">Inference Telemetry</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    Latency: 18.4 ms (Target &lt; 100ms)
                  </span>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-sm border text-center mb-4 ${
                  isAttack 
                    ? 'bg-red-950/50 border-red-600 text-red-200' 
                    : isElevated 
                      ? 'bg-amber-950/50 border-amber-600 text-amber-200' 
                      : 'bg-emerald-950/50 border-emerald-600 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {isAttack ? (
                      <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
                    ) : isElevated ? (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    )}
                    <span className="text-base font-extrabold font-mono uppercase tracking-wide">
                      {isAttack ? 'SPOOFING ATTACK CONFIRMED' : isElevated ? 'ELEVATED SUSPICIOUS FLOW' : 'LEGITIMATE BENIGN TRAFFIC'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-300 mt-1">
                    {isAttack 
                      ? `Threat vector confirmed: ${presets[activePreset].attackType}. Multi-layer correlation exceeded threshold.`
                      : isElevated
                        ? 'Anomalous drift detected. Diverting to deep payload inspection buffer.'
                        : 'Traffic profile conforms tightly to device behavioral baseline.'}
                  </p>
                </div>

                {/* Multi-Layer Score Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Multi-Layer Spoofing Index (MLSDI):</span>
                    <span className={`font-bold ${isAttack ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {mlsdiScore.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full bg-[#121212] h-3 rounded overflow-hidden relative border border-white/10">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isAttack ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-red-600 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, mlsdiScore * 100)}%` }}
                    />
                    {/* Threshold marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
                      style={{ left: `${simDqnThreshold * 100}%` }}
                      title={`DQN Threshold: ${simDqnThreshold.toFixed(2)}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>Clean (0.0)</span>
                    <span className="text-white font-bold">DQN Cutoff: {simDqnThreshold.toFixed(2)}</span>
                    <span>Attack (1.0)</span>
                  </div>
                </div>

                {/* Sub-engine Breakdown */}
                <div className="space-y-1.5 text-xs font-mono bg-[#090e18] p-3 rounded border border-white/5 mb-4">
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Sub-Model Score Weights:</div>
                  <div className="flex justify-between text-gray-300">
                    <span>BiLSTM Temporal Deviation (25%):</span>
                    <span className="text-blue-400 font-bold">{(simBilstmDeviation * 0.25).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Autoencoder Latent MSE (25%):</span>
                    <span className="text-red-400 font-bold">{(normAeScore * 0.25).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Isolation Forest Outlier (20%):</span>
                    <span className="text-amber-400 font-bold">{(simIsolationForest * 0.20).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>LSTM Threat Predictor (30%):</span>
                    <span className="text-red-400 font-bold">{(simThreatProbability * 0.30).toFixed(3)}</span>
                  </div>
                </div>

                {/* Automated Real-Time Action */}
                <div className="border border-white/10 rounded p-3 bg-[#090f1e]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                    Automated Defense Action Triggered:
                  </span>
                  <div className="flex items-center gap-2">
                    <Lock className={`w-4 h-4 ${isAttack ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <code className={`text-xs font-mono font-bold ${isAttack ? 'text-red-300' : isElevated ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {getActiveResponseAction()}
                    </code>
                  </div>
                </div>

              </div>

              <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-white/5">
                Evaluated against 100,000 real-world benchmark flows with sub-100ms enforcement.
              </div>

            </div>

          </div>
        </section>

        {/* EMPIRICAL BENCHMARK METRICS & ATTACK SPECIFIC PERFORMANCE */}
        <section id="metrics" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-red-400" />
              <span>Empirical Benchmark Results &amp; Attack-Specific Detection Rates</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Validation executed on a 100,000-sample enterprise traffic dataset (85% normal baseline, 15% active multi-vector attack traffic).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Table 1: Model Component Metrics */}
            <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-4">
              <h3 className="text-sm font-bold text-white mb-3 font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400" />
                <span>Component Model vs. Ensemble Performance Metrics</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-2">Model Component</th>
                      <th className="pb-2">Accuracy</th>
                      <th className="pb-2">Precision</th>
                      <th className="pb-2">Recall</th>
                      <th className="pb-2">F1-Score</th>
                      <th className="pb-2">AUC-ROC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2 text-white font-medium">Behavioral BiLSTM</td>
                      <td className="py-2 text-red-400">97.2%</td>
                      <td className="py-2">96.8%</td>
                      <td className="py-2">95.4%</td>
                      <td className="py-2">96.1%</td>
                      <td className="py-2 text-gray-400">0.987</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-medium">Anomaly Detector (AE + IF)</td>
                      <td className="py-2 text-red-400">96.5%</td>
                      <td className="py-2">95.2%</td>
                      <td className="py-2">97.1%</td>
                      <td className="py-2">96.1%</td>
                      <td className="py-2 text-gray-400">0.982</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-medium">Threat Predictor (LSTM)</td>
                      <td className="py-2 text-red-400">95.8%</td>
                      <td className="py-2">94.6%</td>
                      <td className="py-2">96.3%</td>
                      <td className="py-2">95.4%</td>
                      <td className="py-2 text-gray-400">0.975</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-medium">DQN Policy Network</td>
                      <td className="py-2 text-red-400">94.2%</td>
                      <td className="py-2">93.1%</td>
                      <td className="py-2">95.8%</td>
                      <td className="py-2">94.4%</td>
                      <td className="py-2 text-gray-400">0.968</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-medium">Correlation Engine (RF)</td>
                      <td className="py-2 text-red-400 font-bold">98.9%</td>
                      <td className="py-2">98.5%</td>
                      <td className="py-2">99.2%</td>
                      <td className="py-2 font-bold">98.8%</td>
                      <td className="py-2 text-red-300 font-bold">0.995</td>
                    </tr>
                    <tr className="bg-red-950/30 font-bold">
                      <td className="py-2.5 text-red-300">Final Ensemble (This Invention)</td>
                      <td className="py-2.5 text-emerald-400 text-sm">98.7%</td>
                      <td className="py-2.5 text-white">98.3%</td>
                      <td className="py-2.5 text-emerald-400">99.1%</td>
                      <td className="py-2.5 text-white">98.7%</td>
                      <td className="py-2.5 text-red-300">0.993</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Attack-Specific Detection Rates */}
            <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-4">
              <h3 className="text-sm font-bold text-white mb-3 font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Attack-Specific Detection &amp; False Alarm Rates</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="pb-2">Attack Vector Category</th>
                      <th className="pb-2">Detection Rate</th>
                      <th className="pb-2">False Positive Rate</th>
                      <th className="pb-2">Primary Detection Layer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5 text-red-400" />
                        <span>IP Spoofing</span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">99.2%</td>
                      <td className="py-2.5 text-red-300">0.8%</td>
                      <td className="py-2.5 text-gray-400">Autoencoder + BiLSTM</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-blue-400" />
                        <span>MAC Spoofing</span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">98.5%</td>
                      <td className="py-2.5 text-red-300">1.2%</td>
                      <td className="py-2.5 text-gray-400">Isolation Forest Outlier</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-red-400" />
                        <span>ARP Spoofing</span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">98.8%</td>
                      <td className="py-2.5 text-red-300">1.0%</td>
                      <td className="py-2.5 text-gray-400">BiLSTM Temporal Sequence</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        <span>DNS Spoofing</span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">97.9%</td>
                      <td className="py-2.5 text-red-300">1.5%</td>
                      <td className="py-2.5 text-gray-400">Predictive Threat LSTM</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-red-400" />
                        <span>DDoS (Distributed Spoofing)</span>
                      </td>
                      <td className="py-2.5 text-emerald-400 font-bold">99.5%</td>
                      <td className="py-2.5 text-red-300">0.5%</td>
                      <td className="py-2.5 text-gray-400">Multi-Layer Ensemble</td>
                    </tr>
                    <tr className="bg-white/5 font-bold">
                      <td className="py-2 text-white">System Weighted Mean</td>
                      <td className="py-2 text-emerald-400 text-sm">98.7%</td>
                      <td className="py-2 text-red-300 font-bold">1.1%</td>
                      <td className="py-2 text-white">Sub-100ms Mitigation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* PRIOR ART COMPARISON TABLE (10 CITATIONS) */}
        <section id="prior-art" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-red-400" />
              <span>Prior Art &amp; Patent Landscape Comparison (10 Citations)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Evaluation of existing commercial patents and academic literature against the proposed five-feature architecture.
            </p>
          </div>

          <div className="bg-[#0c0c0c] border border-white/10 rounded-sm p-4 overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-2">Ref / Patent No.</th>
                  <th className="pb-2">Assignee / Authors</th>
                  <th className="pb-2">Year</th>
                  <th className="pb-2">Architecture / Approach</th>
                  <th className="pb-2">Accuracy</th>
                  <th className="pb-2">FPR</th>
                  <th className="pb-2">Key Critical Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">US10,855,700</td>
                  <td className="py-2.5">Cisco Systems</td>
                  <td className="py-2.5 text-gray-400">2020</td>
                  <td className="py-2.5">ML-based network intrusion detection</td>
                  <td className="py-2.5">92-94%</td>
                  <td className="py-2.5 text-red-400">12.4%</td>
                  <td className="py-2.5 text-gray-400">Single model; no temporal behavioral learning</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">US11,102,226</td>
                  <td className="py-2.5">Palo Alto Networks</td>
                  <td className="py-2.5 text-gray-400">2021</td>
                  <td className="py-2.5">Deep learning network anomaly detection</td>
                  <td className="py-2.5">94.1%</td>
                  <td className="py-2.5 text-red-400">8.2%</td>
                  <td className="py-2.5 text-gray-400">Static thresholds; cannot adapt to evolving attack drifts</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">US10,601,853</td>
                  <td className="py-2.5">IBM Corp.</td>
                  <td className="py-2.5 text-gray-400">2020</td>
                  <td className="py-2.5">Real-time threat detection using AI</td>
                  <td className="py-2.5">91.8%</td>
                  <td className="py-2.5 text-red-400">14.6%</td>
                  <td className="py-2.5 text-gray-400">Lacks multi-layer cross-validation; high false alarm rates</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">US11,245,715</td>
                  <td className="py-2.5">Microsoft Corp.</td>
                  <td className="py-2.5 text-gray-400">2022</td>
                  <td className="py-2.5">Autoencoder network anomaly detector</td>
                  <td className="py-2.5">93.5%</td>
                  <td className="py-2.5 text-red-400">7.9%</td>
                  <td className="py-2.5 text-gray-400">No reinforcement learning; limited to single attack vector</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">CN112738089A</td>
                  <td className="py-2.5">Huawei Technologies</td>
                  <td className="py-2.5 text-gray-400">2021</td>
                  <td className="py-2.5">Network spoofing detection method</td>
                  <td className="py-2.5">88.2%</td>
                  <td className="py-2.5 text-red-400">16.8%</td>
                  <td className="py-2.5 text-gray-400">Rigid rule-based heuristics; non-adaptive to encrypted spoofing</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">EP3885954A1</td>
                  <td className="py-2.5">Siemens AG</td>
                  <td className="py-2.5 text-gray-400">2021</td>
                  <td className="py-2.5">DQN-based policy optimization</td>
                  <td className="py-2.5">N/A</td>
                  <td className="py-2.5 text-gray-400">N/A</td>
                  <td className="py-2.5 text-gray-400">Isolated policy controller; no behavioral sequence integration</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">IEEE Access</td>
                  <td className="py-2.5">Zhang et al.</td>
                  <td className="py-2.5 text-gray-400">2023</td>
                  <td className="py-2.5">LSTM network intrusion detection</td>
                  <td className="py-2.5">94.8%</td>
                  <td className="py-2.5 text-amber-400">6.1%</td>
                  <td className="py-2.5 text-gray-400">Standalone model; lacks ensemble fusion with anomaly engines</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">ACM CCS</td>
                  <td className="py-2.5">Chen et al.</td>
                  <td className="py-2.5 text-gray-400">2022</td>
                  <td className="py-2.5">Deep reinforcement learning security</td>
                  <td className="py-2.5">N/A</td>
                  <td className="py-2.5 text-gray-400">N/A</td>
                  <td className="py-2.5 text-gray-400">Theoretical simulation; lacks real-time packet-rate deployment</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">NDSS</td>
                  <td className="py-2.5">Kumar et al.</td>
                  <td className="py-2.5 text-gray-400">2023</td>
                  <td className="py-2.5">Autoencoder anomaly survey</td>
                  <td className="py-2.5">N/A</td>
                  <td className="py-2.5 text-gray-400">N/A</td>
                  <td className="py-2.5 text-gray-400">Survey paper only; no end-to-end automated response architecture</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-red-300 font-bold">IEEE S&amp;P</td>
                  <td className="py-2.5">Patel et al.</td>
                  <td className="py-2.5 text-gray-400">2024</td>
                  <td className="py-2.5">Multi-layer security correlation</td>
                  <td className="py-2.5">95.6%</td>
                  <td className="py-2.5 text-amber-400">4.8%</td>
                  <td className="py-2.5 text-gray-400">Restricted to 3 static layers; lacks predictive threat engine</td>
                </tr>
                <tr className="bg-red-950/40 font-bold">
                  <td className="py-3 text-red-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-red-400" />
                    <span>This Invention</span>
                  </td>
                  <td className="py-3 text-white">VIT (Manasi, Mahesh, et al.)</td>
                  <td className="py-3 text-red-400">2026</td>
                  <td className="py-3 text-white">5-Feature AI Fusion (BiLSTM + AE + IF + LSTM + DQN)</td>
                  <td className="py-3 text-emerald-400 text-sm">98.7%</td>
                  <td className="py-3 text-emerald-400 text-sm">1.1%</td>
                  <td className="py-3 text-red-300">Real-time adaptive threshold tuning; sub-100ms automated response</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* VERBATIM LEGAL CLAIMS (CLAIMS 1 TO 9) */}
        <section id="claims" className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              <span>Verbatim Official Patent Claims (Claims 1 to 9)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono mt-1">
              Transcribed verbatim from the official publication of Indian Patent Application 202641054502 in The Patent Office Journal No. 20/2026.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            
            {/* Claim 1 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-400 font-bold uppercase">Claim 1 (Independent System Claim)</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px]">Principal Claim</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                An AI-based multi-layer spoofing detection and response system for real-time network security, comprising:
              </p>
              <ul className="mt-2 space-y-1.5 pl-4 text-gray-300 list-disc">
                <li><strong>(i)</strong> a data ingestion module configured to receive network traffic data associated with a plurality of devices and to extract a feature vector comprising network-level features, device-level features, and behavioral features;</li>
                <li><strong>(ii)</strong> a behavioral pattern learning engine comprising a bidirectional long short-term memory (BiLSTM) network configured to process temporal sequences of consecutive network events for each device and to generate a behavioral deviation score indicative of spoofing activity;</li>
                <li><strong>(iii)</strong> a real-time anomaly detection engine with an autoencoder model configured to generate a reconstruction error from the feature vector, and an isolation forest model configured to generate a statistical outlier score for the feature vector;</li>
                <li><strong>(iv)</strong> a predictive threat intelligence engine comprising a long short-term memory (LSTM) predictor configured to estimate a probability of an upcoming attack and an attack category based on historical temporal sequences;</li>
                <li><strong>(v)</strong> an adaptive policy network comprising a deep Q-network (DQN) configured to select at least one detection-threshold adjustment and/or response action based on current network state metrics; and</li>
                <li><strong>(vi)</strong> a multi-layer correlation engine configured to aggregate outputs from the BiLSTM network, the anomaly detection engine, the predictive threat intelligence engine, and the DQN, to produce a spoofing decision and to trigger a response in real time.</li>
              </ul>
            </div>

            {/* Claim 2 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 2 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The system as claimed in claim 1, wherein the network-level features comprise one or more of source IP address, destination IP address, source port, destination port, protocol type, packet size, flow statistics, connection duration, and timing attributes.
              </p>
            </div>

            {/* Claim 3 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 3 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The system as claimed in claim 1, wherein the BiLSTM network processes sequences of twenty consecutive network events represented as a tensor of size 20 × N, where N is at least fifty features, and outputs the behavioral deviation score using a sigmoid-activated dense layer.
              </p>
            </div>

            {/* Claim 4 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 4 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The system as claimed in claim 1, wherein the autoencoder model comprises an encoder performing dimensionality reduction from at least fifty dimensions to a latent representation of eight dimensions via intermediate layers, and a decoder configured to reconstruct the feature vector, and wherein the reconstruction error is computed using mean squared error.
              </p>
            </div>

            {/* Claim 5 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-400 font-bold uppercase">Claim 5 (Independent Method Claim)</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px]">Method Claim</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                The method for real-time spoofing detection in a network, as claimed in claim 1, comprising:
              </p>
              <ul className="mt-2 space-y-1.5 pl-4 text-gray-300 list-disc">
                <li><strong>(i)</strong> ingesting network traffic data and extracting a feature vector comprising network-level features, device-level features, and behavioral features;</li>
                <li><strong>(ii)</strong> generating a behavioral deviation score by processing sequences of consecutive network events using a bidirectional LSTM network;</li>
                <li><strong>(iii)</strong> generating an anomaly score by computing an autoencoder reconstruction error and an isolation forest outlier score for the feature vector;</li>
                <li><strong>(iv)</strong> predicting an upcoming attack probability and attack category using an LSTM predictor based on historical sequences;</li>
                <li><strong>(v)</strong> selecting, using a deep Q-network, at least one detection-threshold adjustment and/or response action based on current network state metrics;</li>
                <li><strong>(vi)</strong> correlating outputs and using a multi-layer correlation engine to generate a spoofing decision; and</li>
                <li><strong>(vii)</strong> executing a real-time response action based on the spoofing decision.</li>
              </ul>
            </div>

            {/* Claim 6 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 6 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The method as claimed in claim 5, wherein the bidirectional LSTM processes sequences of twenty consecutive network events each having at least fifty features.
              </p>
            </div>

            {/* Claim 7 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 7 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The method as claimed in claim 5, wherein the autoencoder reduces a feature dimension from about fifty to a latent space of eight dimensions and computes reconstruction error using mean squared error.
              </p>
            </div>

            {/* Claim 8 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 8 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The system as claimed in claim 1, wherein the multi-layer correlation engine comprises a random forest classifier having about one hundred estimators and configured to receive concatenated outputs from the BiLSTM network, the autoencoder model, the isolation forest model, and the LSTM predictor.
              </p>
            </div>

            {/* Claim 9 */}
            <div className="bg-[#0c0c0c] border border-white/10 p-4 rounded-sm">
              <span className="text-red-400 font-bold uppercase block mb-1">Claim 9 (Dependent Claim)</span>
              <p className="text-gray-300 leading-relaxed">
                The system as claimed in claim 1, wherein the multi-layer correlation engine applies confidence-weighted voting by assigning weights to model outputs based on reliability measures computed from cross-layer validation.
              </p>
            </div>

          </div>
        </section>

        {/* BIBTEX CITATION */}
        <section id="citation" className="space-y-4">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Copy className="w-4 h-4 text-red-400" />
              <span>BibTeX Academic Citation</span>
            </h2>
            <button
              type="button"
              onClick={copyBibtex}
              className="px-3 py-1 bg-[#121927] hover:bg-red-950 border border-white/10 hover:border-red-500 text-xs font-mono text-red-300 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBibtex ? 'Copied to Clipboard!' : 'Copy BibTeX'}</span>
            </button>
          </div>

          <div className="bg-[#050810] border border-white/10 p-4 rounded-sm overflow-x-auto">
            <pre className="text-xs font-mono text-red-300/90 leading-relaxed">
{`@patent{manasi2026networkspoofing,
  author    = {Nupur Manasi and Karishma Rahaman and Marmik Pradip Kaila and Rayban Pranav Mahesh},
  title     = {An AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security},
  number    = {202641054502},
  type      = {Indian Patent Application},
  holder    = {Vellore Institute of Technology},
  day       = {29},
  month     = {April},
  year      = {2026},
  journal   = {The Patent Office Journal No. 20/2026},
  url       = {https://ipindiaservices.gov.in}
}`}
            </pre>
          </div>
        </section>

        {/* BOTTOM NAV / BACK BUTTON */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 bg-[#0a0a0a] hover:bg-red-950/40 border border-white/15 hover:border-red-500/60 text-gray-200 hover:text-white font-mono text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-red-400 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio Main Page</span>
          </button>

          <div className="flex items-center gap-3">
            <a 
              href="/patent-assets/network-spoofing-detection/Official_Gazette_Patent_202641054502.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-red-950/80 hover:bg-red-900 border border-red-500 hover:border-red-400 text-white font-mono text-xs font-bold rounded-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4 text-red-300" />
              <span>Open Official PDF</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-300" />
            </a>
          </div>
        </div>

      </main>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] bg-[#090e18] border border-red-500/30 rounded-sm overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-3 sm:p-4 bg-[#0d1424] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-red-400">{activeImage.badge || 'Figure'}</span>
                    <span>•</span>
                    <span>{activeImage.title}</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image View */}
              <div className="p-4 overflow-auto flex items-center justify-center bg-[#04060c]">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title}
                  className="max-h-[65vh] w-auto object-contain rounded"
                />
              </div>

              {/* Caption Footer */}
              <div className="p-3 sm:p-4 bg-[#080c16] border-t border-white/10 text-xs text-gray-300 font-mono leading-relaxed">
                {activeImage.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
