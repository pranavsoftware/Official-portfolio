import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ShieldCheck, Brain, LineChart, FileText, Database, GitBranch,
  Search, ShieldAlert, Sparkles, MapPin, Camera, Star, Lock, Smartphone, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LocationServicePatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function LocationServicePatentPage({ onBack }: LocationServicePatentPageProps) {
  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'flowcharts' | 'architecture' | 'benchmarks'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const citySelectId = useId();
  const distanceId = useId();
  const matchConfId = useId();
  const verifyCodeId = useId();

  // Preset job matching scenarios
  type PresetKey = 'mumbai_plumbing' | 'bengaluru_electrical' | 'delhi_masonry' | 'distance_outlier' | 'impersonation_fraud';

  const [activePreset, setActivePreset] = useState<PresetKey>('mumbai_plumbing');
  const [simWorkerCity, setSimWorkerCity] = useState<string>('Mumbai');
  const [simJobCity, setSimJobCity] = useState<string>('Mumbai');
  const [simDistanceKm, setSimDistanceKm] = useState<number>(3.2); // km
  const [simMatchConfidence, setSimMatchConfidence] = useState<number>(94.7); // % (Working Ex 3 = 94.7%)
  const [simEnteredCode, setSimEnteredCode] = useState<string>('7829'); // 4-digit code (Working Ex 3 = 7829)
  const [simClientPunctuality, setSimClientPunctuality] = useState<number>(5);
  const [simClientQuality, setSimClientQuality] = useState<number>(5);
  const [simClientProf, setSimClientProf] = useState<number>(4);
  const [simWorkerBehavior, setSimWorkerBehavior] = useState<number>(5);
  const [simWorkerPaymentFairness, setSimWorkerPaymentFairness] = useState<number>(5);
  const [simWorkerCommunication, setSimWorkerCommunication] = useState<number>(5);

  const presets: Record<PresetKey, {
    name: string;
    jobTitle: string;
    workerCity: string;
    jobCity: string;
    distance: number;
    matchConf: number;
    clientCode: string;
    description: string;
  }> = {
    mumbai_plumbing: {
      name: 'Working Example 3: Mumbai Pipe Repair (Bona Fide Execution)',
      jobTitle: 'Bathroom Pipe Repair (3-day job, ₹800/day)',
      workerCity: 'Mumbai',
      jobCity: 'Mumbai',
      distance: 3.2,
      matchConf: 94.7,
      clientCode: '7829',
      description: 'Official Working Example 3 from patent specification. Same city default filter passed, 94.7% on-site visual match, code 7829 validates instant completion.'
    },
    bengaluru_electrical: {
      name: 'Bengaluru Commercial Rewiring (High Reliability Match)',
      jobTitle: 'Commercial Wiring & Circuit Installation (5-day job, ₹1200/day)',
      workerCity: 'Bengaluru',
      jobCity: 'Bengaluru',
      distance: 5.8,
      matchConf: 96.2,
      clientCode: '4193',
      description: 'Verified electrician discovered within Bengaluru city limits. High confidence biometric cross-verification and instant digital escrow release.'
    },
    delhi_masonry: {
      name: 'Delhi NCR Construction Reinforcement (Proximity Match)',
      jobTitle: 'Structural Brick Masonry (2-day job, ₹900/day)',
      workerCity: 'New Delhi',
      jobCity: 'New Delhi',
      distance: 8.4,
      matchConf: 92.5,
      clientCode: '8832',
      description: 'Localized blue-collar matching with voice assistant enabled (Hindi). Prompt job start after camera check-in confirmed.'
    },
    distance_outlier: {
      name: 'Out-of-Bounds Location Query (City Filter Barrier)',
      jobTitle: 'Carpentry & Furniture Assembly (Mumbai listing, worker in Pune)',
      workerCity: 'Pune',
      jobCity: 'Mumbai',
      distance: 148.0,
      matchConf: 91.0,
      clientCode: '5510',
      description: 'Default city-level filter restricts listings to worker city. System flags out-of-boundary distance to protect workers from unfeasible commutes.'
    },
    impersonation_fraud: {
      name: 'On-Site Impersonation / Proxy Worker Attempt (Security Breach)',
      jobTitle: 'Plumbing Repair (Unregistered substitute arrives at job site)',
      workerCity: 'Mumbai',
      jobCity: 'Mumbai',
      distance: 4.1,
      matchConf: 38.4,
      clientCode: '7829',
      description: 'Client captures live photo of unauthorized substitute. Face match confidence falls below threshold (38.4%), triggering profile flagging under Claim 5.'
    }
  };

  const handleApplyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimWorkerCity(p.workerCity);
    setSimJobCity(p.jobCity);
    setSimDistanceKm(p.distance);
    setSimMatchConfidence(p.matchConf);
    setSimEnteredCode(p.clientCode);
    if (key === 'impersonation_fraud') {
      setSimClientPunctuality(1);
      setSimClientQuality(1);
      setSimClientProf(1);
    } else {
      setSimClientPunctuality(5);
      setSimClientQuality(5);
      setSimClientProf(4);
      setSimWorkerBehavior(5);
      setSimWorkerPaymentFairness(5);
      setSimWorkerCommunication(5);
    }
  };

  // Live Reactive Calculations
  const isCityMatch = simWorkerCity.toLowerCase() === simJobCity.toLowerCase();
  const isDistanceEligible = isCityMatch && simDistanceKm <= 25.0;
  const isIdentityVerified = simMatchConfidence >= 75.0; // 75% threshold
  const isCodeCorrect = simEnteredCode.trim() === '7829' || simEnteredCode.trim() === presets[activePreset].clientCode;
  const isJobCompleted = isIdentityVerified && isCodeCorrect && isDistanceEligible;

  // Mutual Reputation Calculations
  const clientRatingAvg = ((simClientPunctuality + simClientQuality + simClientProf) / 3).toFixed(1);
  const workerRatingAvg = ((simWorkerBehavior + simWorkerPaymentFairness + simWorkerCommunication) / 3).toFixed(1);

  // Gallery items
  const galleryItems: {
    id: string;
    title: string;
    caption: string;
    src: string;
    category: 'flowcharts' | 'architecture' | 'benchmarks';
    badge: string;
  }[] = [
    {
      id: 'fig1',
      title: 'FIG. 1: User Registration & Authentication Flowchart (Method 100)',
      caption: 'Flowchart depicting the dual-path registration process (Worker vs Client), Aadhaar eKYC upload, Optical Character Recognition (OCR), phone OTP verification, bcrypt credential hashing, and JWT/RBAC token generation (Steps 102 to 128).',
      src: '/patent-assets/location-service/fig1_user_registration_authentication_flowchart.png',
      category: 'flowcharts',
      badge: 'Official Flowchart 1'
    },
    {
      id: 'fig2',
      title: 'FIG. 2: Job Posting & Location-Filtered Discovery Flowchart (Method 200)',
      caption: 'Parallel workflows for client job specification input, GPS coordinate assignment, and worker job discovery governed by default city-level boundary filtering and multi-parameter refinement (Steps 202 to 230).',
      src: '/patent-assets/location-service/fig2_job_posting_discovery_flowchart.png',
      category: 'flowcharts',
      badge: 'Official Flowchart 2'
    },
    {
      id: 'fig3',
      title: 'FIG. 3: Job Assignment & Dual-Layer Verification Flowchart (Method 300)',
      caption: 'Dual-layer authentication workflow: client reviews worker profile, assigns job, worker arrives on site, client captures live camera photo, and system cross-verifies against stored registration identity document with profile flagging upon failure (Steps 302 to 326).',
      src: '/patent-assets/location-service/fig3_job_assignment_identity_verification_flowchart.png',
      category: 'flowcharts',
      badge: 'Official Flowchart 3'
    },
    {
      id: 'fig4',
      title: 'FIG. 4: Job Completion, Code Handshake & Bidirectional Review (Method 400)',
      caption: 'Task execution lifecycle: worker submits photo completion proof, client releases 4-digit verification code (e.g., 7829), platform validates code, releases digital UPI payment, and prompts symmetric 3-metric mutual ratings (Steps 402 to 430).',
      src: '/patent-assets/location-service/fig4_job_completion_bidirectional_review_flowchart.png',
      category: 'flowcharts',
      badge: 'Official Flowchart 4'
    },
    {
      id: 'fig5',
      title: 'Figure 5: Three-Tier Modular System Architecture (WorkEase Platform)',
      caption: 'Comprehensive 3-tier enterprise architecture showing Presentation Layer (React/PWA), Application Microservices (Express/Node.js, RBAC, ML OCR, Visual Verification, Geocoding, Voice Assistant), and Data Persistence (MongoDB NoSQL & Object Storage).',
      src: '/patent-assets/location-service/fig5_system_architecture_layered.png',
      category: 'architecture',
      badge: 'System Architecture'
    },
    {
      id: 'fig6',
      title: 'Figure 6: Apache JMeter Load & Concurrency Benchmark (Table [0102])',
      caption: 'Empirical load testing results under 1,000 concurrent users at 4 loops with 2-second delay across GET /api/jobs (847 ms, 312.4 req/s), POST /login (923 ms), POST /apply (1124 ms), and GET /profile (756 ms) with error rates below 0.15%.',
      src: '/patent-assets/location-service/fig6_jmeter_concurrency_load_benchmark.png',
      category: 'benchmarks',
      badge: 'JMeter Load Test'
    },
    {
      id: 'fig7',
      title: 'Figure 7: Dual-Layer Identity Verification & Cross-Verification Pipeline',
      caption: 'Two-tier trust pipeline: Layer 1 executes Aadhaar eKYC document parsing with OCR during onboarding; Layer 2 executes on-arrival client camera capture and deep facial feature embedding cross-verification with 94.7% confidence.',
      src: '/patent-assets/location-service/fig7_dual_factor_identity_verification_pipeline.png',
      category: 'architecture',
      badge: 'Identity Pipeline'
    },
    {
      id: 'fig8',
      title: 'Figure 8: Bidirectional 3-Metric Mutual Rating Rubric (Claim 6)',
      caption: 'Symmetric accountability matrix: Client rates worker across Punctuality, Work Quality, and Professionalism; Worker rates client across Behavior & Respect, Fairness in Payment, and Communication.',
      src: '/patent-assets/location-service/fig8_bidirectional_rating_matrix.png',
      category: 'architecture',
      badge: 'Rating Rubric'
    },
    {
      id: 'jmeter_table',
      title: 'Official Apache JMeter Performance Table from Patent Specification',
      caption: 'High-resolution scan of Page 26 of the Complete Specification documenting concurrent user metrics, throughput, response times, and standard deviation across API endpoints.',
      src: '/patent-assets/location-service/official_jmeter_table_page.png',
      category: 'benchmarks',
      badge: 'Spec Page 26'
    },
    {
      id: 'search_report',
      title: 'Official Patentability Search Report (RNK-CAP0653)',
      caption: 'First page of the formal Patentability Search Report evaluating novelty, inventive step under Section 2(1)(ja), and subject matter exclusions under Section 3 of the Indian Patents Act, 1970.',
      src: '/patent-assets/location-service/patentability_search_report_first_page.png',
      category: 'architecture',
      badge: 'Search Report'
    }
  ];

  const filteredGallery = selectedGalleryTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedGalleryTab);

  const bibtexCode = `@patent{IN202641027808A1,
  title        = {Location-Filtered Service Platform with Bidirectional Rating and Image Verification},
  author       = {Mohanasundaram, R. and Mahesh, Rayban Pranav and Anand, Harsh and Vyas, Rishabh and Jha, Suraj},
  assignee     = {Vellore Institute of Technology},
  nationality  = {Indian},
  number       = {202641027808},
  type         = {Patent Application},
  dayfile      = {09},
  monthfile    = {03},
  yearfile     = {2026},
  day          = {20},
  month        = {03},
  year         = {2026},
  note         = {The Patent Office Journal No. 12/2026, Part 1, IPC: G06Q 10/06, G06Q 10/10, G06Q 10/00, G06K 9/00}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexCode);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-red-900 selection:text-white pb-16">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0a0a0a] border border-red-900/40 rounded-sm p-4 shadow-2xl cursor-default"
            >
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-950/60 text-red-400 border border-red-800/40 rounded">
                    {activeImage.badge || 'FIGURE EXHIBIT'}
                  </span>
                  <h3 className="text-sm font-mono font-bold text-white truncate max-w-xl">
                    {activeImage.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center bg-[#070707] rounded border border-white/5 p-2 max-h-[75vh] overflow-hidden">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="object-contain max-h-[70vh] w-auto rounded"
                />
              </div>
              <p className="mt-3 text-xs text-gray-400 font-mono leading-relaxed">
                {activeImage.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header / Breadcrumb Bar */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Back to All Patents</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold bg-red-950/50 text-red-400 border border-red-800/50 rounded">
              INDIAN PATENT APP NO: 202641027808
            </span>
            {/* Single Official Document Action Button */}
            <a
              href="/patent-assets/location-service/Official_Gazette_Patent_202641027808.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 hover:border-red-500 text-white text-xs font-mono font-bold rounded transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>Official PDF</span>
              <ExternalLink className="w-3 h-3 text-red-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Hero Section */}
        <section className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-red-950/40 text-red-400 border border-red-800/40 rounded">
              PATENT #10
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#121212] text-gray-300 border border-white/10 rounded flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-red-500" />
              Computer Vision &amp; Systems
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono text-gray-400 bg-[#121212] border border-white/10 rounded">
              IPC: G06Q 10/06, G06Q 10/10, G06Q 10/00, G06K 9/00
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
            Location-Filtered Service Platform with Bidirectional Rating and Image Verification
          </h1>

          <p className="text-sm sm:text-base text-gray-400 font-mono max-w-4xl leading-relaxed mb-6">
            A comprehensive digital employment architecture for daily-wage and blue-collar workers featuring dual-layer identity authentication (onboarding Aadhaar eKYC OCR + client on-site camera cross-verification), default city-level geolocation filtering, verification code handshake, and symmetric 3-metric bidirectional rating.
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-sm font-mono text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-500" />
                Filing Date
              </span>
              <span className="text-gray-200 font-semibold">09 March 2026</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-500" />
                Publication Date
              </span>
              <span className="text-red-400 font-bold">20 March 2026 (Journal 12/2026)</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-red-500" />
                Applicant / Assignee
              </span>
              <span className="text-gray-200 font-semibold">Vellore Institute of Technology</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-500" />
                Application Status
              </span>
              <span className="text-red-400 font-bold">Official Publication Complete</span>
            </div>
          </div>

          {/* Inventors Bar with Rayban Highlight */}
          <div className="mt-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-sm">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-red-500" />
              Inventors &amp; Research Team
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#121212] border border-white/10 text-gray-300 text-xs font-mono rounded">
                Dr. Mohanasundaram R
              </span>
              {/* Highlighted Inventor Badge */}
              <span className="px-3 py-1 bg-red-950/50 border border-red-700/60 text-red-300 text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Rayban Pranav Mahesh (Inventor)
              </span>
              <span className="px-3 py-1 bg-[#121212] border border-white/10 text-gray-300 text-xs font-mono rounded">
                Harsh Anand
              </span>
              <span className="px-3 py-1 bg-[#121212] border border-white/10 text-gray-300 text-xs font-mono rounded">
                Rishabh Vyas
              </span>
              <span className="px-3 py-1 bg-[#121212] border border-white/10 text-gray-300 text-xs font-mono rounded">
                Suraj Jha
              </span>
            </div>
          </div>
        </section>

        {/* Technical Architecture Overview */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-red-500" />
            <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              System Architecture &amp; Inventive Tenets
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-6 max-w-3xl">
            Overcoming critical trust, safety, locality, and digital literacy deficits in informal labor markets through a unified 3-tier enterprise architecture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm hover:border-red-900/40 transition-colors">
              <div className="w-8 h-8 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 font-mono font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-bold font-mono text-white mb-2">Dual-Path Onboarding &amp; eKYC</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Role-specific onboarding (Worker vs Client) with machine learning Optical Character Recognition (OCR) extracting Name, DOB, Address, and Aadhaar ID, backed by SMS OTP verification and bcrypt credential encryption.
              </p>
            </div>

            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm hover:border-red-900/40 transition-colors">
              <div className="w-8 h-8 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 font-mono font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-bold font-mono text-white mb-2">Default City Geofencing</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Jobs automatically filtered to the worker's home city by default to eliminate unrealistic commutes, with MongoDB geospatial indexing enabling refined multi-parameter search (wage range, duration, skill tags).
              </p>
            </div>

            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm hover:border-red-900/40 transition-colors">
              <div className="w-8 h-8 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 font-mono font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-bold font-mono text-white mb-2">On-Site Visual Cross-Verification</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Client camera captures live photo upon worker arrival. System cross-verifies visual features against stored Aadhaar reference image, achieving 94.7% confidence score before transitioning job to "in progress".
              </p>
            </div>

            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm hover:border-red-900/40 transition-colors">
              <div className="w-8 h-8 rounded bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 font-mono font-bold text-xs mb-3">
                04
              </div>
              <h3 className="text-sm font-bold font-mono text-white mb-2">Code Handshake &amp; Mutual Rating</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Completion proof photo triggers a unique 4-digit client verification code (e.g., 7829), followed by instant UPI payout and symmetric 3-metric bidirectional ratings protecting both workers and employers.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Forensic & Verification Simulator */}
        <section className="mb-14 p-6 bg-[#080808] border border-red-900/30 rounded-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-red-500" />
                <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
                  Interactive Geospatial &amp; Dual-Layer Verification Simulator
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Simulate location filtering, on-site live facial cross-verification, 4-digit security code handshake, and bidirectional rating dynamics.
              </p>
            </div>

            {/* Scenario Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor={presetSelectId} className="text-[11px] font-mono text-gray-400">
                Preset Scenario:
              </label>
              <select
                id={presetSelectId}
                value={activePreset}
                onChange={(e) => handleApplyPreset(e.target.value as PresetKey)}
                className="bg-[#121212] border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-red-400 focus:outline-none focus:border-red-500"
              >
                <option value="mumbai_plumbing">Working Example 3: Mumbai Pipe Repair (Bona Fide)</option>
                <option value="bengaluru_electrical">Bengaluru Rewiring (High Reliability)</option>
                <option value="delhi_masonry">Delhi Construction (Proximity Match)</option>
                <option value="distance_outlier">Out-of-Bounds (City Boundary Barrier)</option>
                <option value="impersonation_fraud">On-Site Proxy Worker (Biometric Breach)</option>
              </select>
            </div>
          </div>

          {/* Scenario Description Banner */}
          <div className="mb-6 p-3 bg-[#0e0e0e] border-l-2 border-red-500 text-xs font-mono text-gray-300 rounded-r">
            <span className="text-red-400 font-bold block mb-0.5">{presets[activePreset].name}</span>
            <span className="text-gray-400">{presets[activePreset].description}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Geospatial & Onboarding Controls */}
            <div className="p-4 bg-[#0c0c0c] border border-white/5 rounded-sm space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                <MapPin className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-mono font-bold uppercase text-white">
                  1. Location &amp; Distance Filter
                </h3>
              </div>

              <div>
                <label htmlFor={citySelectId} className="block text-[11px] font-mono text-gray-400 mb-1">
                  Worker Home City / Job Location:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 block">Worker Base:</span>
                    <select
                      id={citySelectId}
                      value={simWorkerCity}
                      onChange={(e) => setSimWorkerCity(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded p-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Mumbai">Mumbai (400001)</option>
                      <option value="Bengaluru">Bengaluru (560001)</option>
                      <option value="New Delhi">New Delhi (110001)</option>
                      <option value="Pune">Pune (411001)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 block">Job Location:</span>
                    <select
                      value={simJobCity}
                      onChange={(e) => setSimJobCity(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded p-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Mumbai">Mumbai (400001)</option>
                      <option value="Bengaluru">Bengaluru (560001)</option>
                      <option value="New Delhi">New Delhi (110001)</option>
                      <option value="Pune">Pune (411001)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                  <label htmlFor={distanceId}>Job Proximity Distance:</label>
                  <span className="text-red-400 font-bold">{simDistanceKm.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  id={distanceId}
                  min="0.5"
                  max="150"
                  step="0.5"
                  value={simDistanceKm}
                  onChange={(e) => setSimDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                  <span>0.5 km (Walkable)</span>
                  <span>25 km (City Bound)</span>
                  <span>150 km (Intercity)</span>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-2.5 rounded border text-[11px] font-mono ${
                isDistanceEligible 
                  ? 'bg-green-950/30 border-green-800/40 text-green-300' 
                  : 'bg-red-950/40 border-red-800/50 text-red-300'
              }`}>
                {isDistanceEligible ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    Passed: Matches worker default city &amp; within proximity limit.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    Blocked: Outside city boundary ({simWorkerCity} vs {simJobCity}).
                  </span>
                )}
              </div>
            </div>

            {/* Column 2: On-Site Visual Cross-Verification */}
            <div className="p-4 bg-[#0c0c0c] border border-white/5 rounded-sm space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                <Camera className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-mono font-bold uppercase text-white">
                  2. On-Site Facial Cross-Match
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                  <label htmlFor={matchConfId}>Facial Match Confidence:</label>
                  <span className={`font-bold ${simMatchConfidence >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                    {simMatchConfidence.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  id={matchConfId}
                  min="20"
                  max="99"
                  step="0.1"
                  value={simMatchConfidence}
                  onChange={(e) => setSimMatchConfidence(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                  <span>20% (Mismatch)</span>
                  <span className="text-red-400 font-bold">75% (Threshold)</span>
                  <span>99% (Identical)</span>
                </div>
              </div>

              <div>
                <label htmlFor={verifyCodeId} className="block text-[11px] font-mono text-gray-400 mb-1">
                  Client 4-Digit Handshake Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id={verifyCodeId}
                    maxLength={4}
                    value={simEnteredCode}
                    onChange={(e) => setSimEnteredCode(e.target.value)}
                    placeholder="e.g. 7829"
                    className="w-full bg-[#161616] border border-white/10 rounded px-3 py-1.5 text-center font-mono text-sm tracking-widest text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setSimEnteredCode('7829')}
                    className="px-2.5 py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 whitespace-nowrap"
                  >
                    Set 7829
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-2.5 rounded border text-[11px] font-mono ${
                isIdentityVerified 
                  ? 'bg-green-950/30 border-green-800/40 text-green-300' 
                  : 'bg-red-950/40 border-red-800/50 text-red-300'
              }`}>
                {isIdentityVerified ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    Biometric Check Passed: Live photo matches stored Aadhaar card.
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    Profile Flagged: Biometric match below threshold (Step 322).
                  </span>
                )}
              </div>
            </div>

            {/* Column 3: Live Verification Status & Mutual Ratings */}
            <div className="p-4 bg-[#0c0c0c] border border-white/5 rounded-sm space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-white/5">
                <Star className="w-4 h-4 text-red-500" />
                <h3 className="text-xs font-mono font-bold uppercase text-white">
                  3. Escrow &amp; Bidirectional Ratings
                </h3>
              </div>

              {/* Overall Decision Status */}
              <div className="p-3 bg-[#121212] border border-white/10 rounded">
                <div className="text-[10px] font-mono text-gray-500 uppercase">System Decision:</div>
                <div className="flex items-center gap-2 mt-1">
                  {isJobCompleted ? (
                    <span className="px-2.5 py-1 bg-green-950/60 border border-green-700/60 text-green-400 font-mono font-bold text-xs rounded flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      JOB COMPLETED &amp; PAID (₹800 UPI)
                    </span>
                  ) : !isDistanceEligible ? (
                    <span className="px-2.5 py-1 bg-yellow-950/60 border border-yellow-700/60 text-yellow-400 font-mono font-bold text-xs rounded flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      LOCATION OUT OF BOUNDS
                    </span>
                  ) : !isIdentityVerified ? (
                    <span className="px-2.5 py-1 bg-red-950/60 border border-red-700/60 text-red-400 font-mono font-bold text-xs rounded flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      BIOMETRIC IDENTITY MISMATCH
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-blue-950/60 border border-blue-700/60 text-blue-400 font-mono font-bold text-xs rounded flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      WAITING FOR 4-DIGIT CODE
                    </span>
                  )}
                </div>
              </div>

              {/* Bidirectional Ratings Summary */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between items-center bg-[#141414] p-2 rounded">
                  <span className="text-gray-400">Client &rarr; Worker:</span>
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-red-400" />
                    {clientRatingAvg} / 5.0 (P:5, Q:5, Pr:4)
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#141414] p-2 rounded">
                  <span className="text-gray-400">Worker &rarr; Client:</span>
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-red-400" />
                    {workerRatingAvg} / 5.0 (B:5, F:5, C:5)
                  </span>
                </div>
              </div>

              <div className="p-2 bg-[#0e0e0e] rounded text-[10px] font-mono text-gray-500">
                <span>Working Example 3 Text:</span>
                <p className="italic text-gray-400 mt-0.5">
                  &ldquo;Excellent work, completed ahead of schedule.&rdquo; (Client) &bull; &ldquo;Clear instructions and prompt payment.&rdquo; (Worker)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Figures & Patent Exhibits Gallery */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LineChart className="w-4 h-4 text-red-500" />
                <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
                  Technical Figures &amp; Patent Exhibits
                </h2>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                High-resolution diagrams of Methods 100, 200, 300, 400, enterprise architecture, and official IPO documents.
              </p>
            </div>

            {/* Gallery Category Tabs */}
            <div className="flex flex-wrap gap-1 bg-[#0a0a0a] p-1 border border-white/5 rounded">
              {(['all', 'flowcharts', 'architecture', 'benchmarks'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedGalleryTab(tab)}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                    selectedGalleryTab === tab
                      ? 'bg-red-950/60 text-white border border-red-700/60 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group relative bg-[#080808] border border-white/5 hover:border-red-900/60 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-[#0c0c0c] flex items-center justify-center overflow-hidden border-b border-white/5">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-black/70 text-red-400 border border-red-800/40 rounded backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1.5 bg-red-950/80 border border-red-700 text-white text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                      Expand Exhibit
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-sans line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>Click to view in high-res</span>
                    <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Empirical Benchmarks: Apache JMeter Load Test Results */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-red-500" />
            <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              Empirical Load Testing &amp; Stress Benchmarks
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-6 max-w-3xl">
            Official Apache JMeter stress and concurrency validation under 1,000 concurrent users at 4 loops with 2-second delay (Specification Paragraph [0102]).
          </p>

          <div className="overflow-x-auto border border-white/10 rounded-sm bg-[#080808]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#121212] text-gray-400 border-b border-white/10 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-white">API Endpoint</th>
                  <th className="py-3 px-4">Concurrent Users</th>
                  <th className="py-3 px-4">Loops</th>
                  <th className="py-3 px-4">Delay</th>
                  <th className="py-3 px-4 text-right">Avg Response Time</th>
                  <th className="py-3 px-4 text-right">Throughput</th>
                  <th className="py-3 px-4 text-right">Std Dev</th>
                  <th className="py-3 px-4 text-right text-red-400">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-950/60 text-blue-400 text-[9px] rounded font-bold">GET</span>
                    /api/jobs (Search &amp; Discovery)
                  </td>
                  <td className="py-3 px-4">1,000</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">2s</td>
                  <td className="py-3 px-4 text-right font-bold text-white">847 ms</td>
                  <td className="py-3 px-4 text-right text-green-400">312.4 req/s</td>
                  <td className="py-3 px-4 text-right">156 ms</td>
                  <td className="py-3 px-4 text-right text-green-400 font-bold">0.12%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-950/60 text-red-400 text-[9px] rounded font-bold">POST</span>
                    /api/auth/login (Auth &amp; OTP)
                  </td>
                  <td className="py-3 px-4">1,000</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">2s</td>
                  <td className="py-3 px-4 text-right font-bold text-white">923 ms</td>
                  <td className="py-3 px-4 text-right text-green-400">287.6 req/s</td>
                  <td className="py-3 px-4 text-right">189 ms</td>
                  <td className="py-3 px-4 text-right text-green-400 font-bold">0.08%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-950/60 text-red-400 text-[9px] rounded font-bold">POST</span>
                    /api/jobs/apply (Job Application)
                  </td>
                  <td className="py-3 px-4">1,000</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">2s</td>
                  <td className="py-3 px-4 text-right font-bold text-white">1,124 ms</td>
                  <td className="py-3 px-4 text-right text-green-400">245.3 req/s</td>
                  <td className="py-3 px-4 text-right">234 ms</td>
                  <td className="py-3 px-4 text-right text-green-400 font-bold">0.15%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-950/60 text-blue-400 text-[9px] rounded font-bold">GET</span>
                    /api/workers/profile (Worker Profile)
                  </td>
                  <td className="py-3 px-4">1,000</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">2s</td>
                  <td className="py-3 px-4 text-right font-bold text-white">756 ms</td>
                  <td className="py-3 px-4 text-right text-green-400">334.8 req/s</td>
                  <td className="py-3 px-4 text-right">142 ms</td>
                  <td className="py-3 px-4 text-right text-green-400 font-bold">0.05%</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-950/60 text-red-400 text-[9px] rounded font-bold">POST</span>
                    /api/jobs/create (Job Creation)
                  </td>
                  <td className="py-3 px-4">1,000</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">2s</td>
                  <td className="py-3 px-4 text-right font-bold text-white">1,089 ms</td>
                  <td className="py-3 px-4 text-right text-green-400">258.7 req/s</td>
                  <td className="py-3 px-4 text-right">218 ms</td>
                  <td className="py-3 px-4 text-right text-green-400 font-bold">0.11%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-gray-400">
            <span>
              <strong>Indexing Optimization Impact:</strong> Database indexing on location coordinates and skill tags decreased complex search latency by approximately <strong>35%</strong>.
            </span>
            <span className="text-red-400 font-semibold">Error Rate: &lt; 0.20% across all endpoints</span>
          </div>
        </section>

        {/* Prior Art Analysis */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-red-500" />
            <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              Prior Art Comparison &amp; Inventive Distinctions
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-6 max-w-3xl">
            Key differences identified in the official Patentability Search Report (RNK-CAP0653) evaluating novelty and non-obviousness under Section 2(1)(ja) of the Indian Patents Act, 1970.
          </p>

          <div className="overflow-x-auto border border-white/10 rounded-sm bg-[#080808]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#121212] text-gray-400 border-b border-white/10 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-white">Document / System</th>
                  <th className="py-3 px-4">Domain Focus</th>
                  <th className="py-3 px-4">Key Overlap</th>
                  <th className="py-3 px-4 text-red-400">Critical Differences &amp; Inventive Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    US 10936857 B2
                  </td>
                  <td className="py-3 px-4">Identity Verification</td>
                  <td className="py-3 px-4">Comparing live facial image with ID photo</td>
                  <td className="py-3 px-4 text-gray-300">
                    Lacks daily-wage employment context, default city-level geofencing, on-site client camera check-in handshake, and bidirectional ratings.
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    US 20190102743 A1
                  </td>
                  <td className="py-3 px-4">Location Employment</td>
                  <td className="py-3 px-4">Proximity job matching &amp; scheduling</td>
                  <td className="py-3 px-4 text-gray-300">
                    No Aadhaar/eKYC onboarding integration, no on-arrival client-captured facial cross-verification, and lacks 4-digit code verification handshake.
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    e-Shram / MGNREGA
                  </td>
                  <td className="py-3 px-4">Government Labor Portals</td>
                  <td className="py-3 px-4">Worker database &amp; Aadhaar seed</td>
                  <td className="py-3 px-4 text-gray-300">
                    Lacks real-time job allocation, instant employer hiring, on-site live facial cross-verification, in-app digital escrow, and bidirectional ratings.
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    Urban Company / TaskRabbit
                  </td>
                  <td className="py-3 px-4">Gig Service Platforms</td>
                  <td className="py-3 px-4">On-demand service booking</td>
                  <td className="py-3 px-4 text-gray-300">
                    Geared toward standardized services rather than daily-wage informal labor; lacks client-initiated visual verification at check-in and voice assistant for illiterate workers.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Verbatim Legal Claims (Claims 1 to 10) */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-red-500" />
            <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              Official Legal Claims (Verbatim from IPO Journal No. 12/2026)
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-6 max-w-3xl">
            Verbatim statutory claim text as published by the Intellectual Property Office, India for Application No. 202641027808.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {/* Claim 1 */}
            <div className="p-4 bg-[#080808] border border-red-900/40 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/40 rounded">
                CLAIM 1 (INDEPENDENT SYSTEM CLAIM)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>1.</strong> A system for connecting daily wage workers with job opportunities, the system comprising:
                <br /><br />
                a server configured to execute instructions stored in a memory, the server comprising:
                <br />
                &bull; a user registration module configured to receive registration data from a plurality of users, wherein each user is classified as either a worker or a client, wherein for workers the registration data comprises an identity document image;
                <br />
                &bull; a database configured to store the identity document image associated with each worker;
                <br />
                &bull; a job assignment module configured to enable assignment of workers to jobs; and
                <br />
                &bull; an identity verification module configured to:
                <br />
                &nbsp;&nbsp;&ndash; receive a captured image of a worker at a job location from a client device;
                <br />
                &nbsp;&nbsp;&ndash; cross-verify the captured image with the identity document image stored during worker registration; and
                <br />
                &nbsp;&nbsp;&ndash; generate a verification confirmation upon successful cross-verification.
              </p>
            </div>

            {/* Claim 2 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 2 (DEPENDENT SYSTEM CLAIM)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>2.</strong> The system of claim 1, wherein the server further comprises an authentication module configured to perform OTP-based phone number verification for each user, encrypt user credentials, and store encrypted credentials in the database.
              </p>
            </div>

            {/* Claim 3 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 3 (DEPENDENT SYSTEM CLAIM &mdash; CITY FILTER)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>3.</strong> The system of claim 1 or 2, wherein the server further comprises a job discovery module configured to display job listings to workers, wherein the job discovery module is configured to apply a location-based filter to display jobs within a worker&apos;s city by default.
              </p>
            </div>

            {/* Claim 4 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 4 (DEPENDENT SYSTEM CLAIM &mdash; OCR)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>4.</strong> The system of any of claims 1 to 3, wherein the identity verification module is further configured to extract identity information from the identity document image using optical character recognition.
              </p>
            </div>

            {/* Claim 5 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 5 (DEPENDENT SYSTEM CLAIM &mdash; FLAGGING)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>5.</strong> The system of any of claims 1 to 4, wherein the identity verification module is further configured to flag a worker profile upon cross-verification failure.
              </p>
            </div>

            {/* Claim 6 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 6 (DEPENDENT SYSTEM CLAIM &mdash; CODE &amp; BIDIRECTIONAL RATINGS)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>6.</strong> The system of any of claims 1 to 5, wherein the server further comprises:
                <br />
                &bull; a job completion module configured to receive task completion proof from a worker, receive a verification code from a client, validate the verification code, and mark a job as completed upon successful validation; and
                <br />
                &bull; a review module configured to receive ratings and reviews from clients regarding worker performance and receive ratings and reviews from workers regarding client behaviour.
              </p>
            </div>

            {/* Claim 7 */}
            <div className="p-4 bg-[#080808] border border-red-900/40 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/40 rounded">
                CLAIM 7 (INDEPENDENT METHOD CLAIM)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>7.</strong> A computer-implemented method (100, 200, 300) for connecting daily wage workers with job opportunities using dual-layer identity verification, the method comprising:
                <br />
                &bull; receiving (106, 108), by a server, registration data from a user classified as a worker, wherein the registration data comprises an identity document image;
                <br />
                &bull; storing (114) the identity document image in a database;
                <br />
                &bull; assigning (306) the worker to a job;
                <br />
                &bull; receiving (312), from a client device, a captured image of the worker at a job location;
                <br />
                &bull; cross-verifying (314) the captured image with the identity document image stored during worker registration; and
                <br />
                &bull; generating (318) a verification confirmation upon successful cross-verification.
              </p>
            </div>

            {/* Claim 8 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 8 (DEPENDENT METHOD CLAIM)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>8.</strong> The method of claim 7, further comprising:
                <br />
                &bull; performing (110, 112) OTP-based phone number verification for the user; and
                <br />
                &bull; encrypting (114) user credentials and storing encrypted credentials in the database.
              </p>
            </div>

            {/* Claim 9 */}
            <div className="p-4 bg-[#080808] border border-white/5 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 rounded">
                CLAIM 9 (DEPENDENT METHOD CLAIM &mdash; FILTERING)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>9.</strong> The method of claim 7 or 8, further comprising:
                <br />
                &bull; displaying (222) job listings to the worker with a location-based filter (216) applied to display jobs within a worker&apos;s city by default; and
                <br />
                &bull; receiving (220) filter parameters from the worker and displaying filtered job listings based on received filter parameters.
              </p>
            </div>

            {/* Claim 10 */}
            <div className="p-4 bg-[#080808] border border-red-900/40 rounded-sm">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/40 rounded">
                CLAIM 10 (NON-TRANSITORY COMPUTER-READABLE MEDIUM)
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed">
                <strong>10.</strong> A non-transitory computer-readable medium storing instructions that, when executed by a processor, cause the processor to perform the method of any of claims 7 to 9.
              </p>
            </div>
          </div>
        </section>

        {/* BibTeX Citation */}
        <section className="mb-14 p-6 bg-[#080808] border border-white/10 rounded-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Cite This Invention (BibTeX)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCopyBibtex}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-white text-xs font-mono rounded transition-colors cursor-pointer"
            >
              {copiedBibtex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-red-400" />
                  <span>Copy BibTeX</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#040404] border border-white/5 rounded text-gray-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
            {bibtexCode}
          </pre>
        </section>
      </main>
    </div>
  );
}
