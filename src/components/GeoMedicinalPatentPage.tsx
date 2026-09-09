import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Download, Award, CheckCircle2, AlertTriangle, ShieldAlert, 
  ShieldCheck, Volume2, Eye, Cpu, Compass, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  MapPin, Pill, Network, Sparkles, Microscope, BarChart3, Database, FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeoMedicinalPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function GeoMedicinalPatentPage({ onBack }: GeoMedicinalPatentPageProps) {
  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Unique IDs for accessibility
  const conditionSelectId = useId();
  const regionSelectId = useId();
  const patientAgeId = useId();
  const patientWeightId = useId();
  const concurrentDrugId = useId();

  // Interactive Simulator State
  const [simCondition, setSimCondition] = useState<'diabetes' | 'hypertension' | 'cognitive' | 'inflammation' | 'liver'>('diabetes');
  const [simRegion, setSimRegion] = useState<'tamil_nadu' | 'western_ghats' | 'indo_gangetic' | 'eastern_highlands' | 'himalayas'>('tamil_nadu');
  const [simAge, setSimAge] = useState<number>(45);
  const [simWeight, setSimWeight] = useState<number>(75);
  const [simDrug, setSimDrug] = useState<'none' | 'metformin' | 'warfarin' | 'aspirin' | 'sitagliptin'>('metformin');

  // Condition mapping
  const conditionProfiles = {
    diabetes: {
      name: 'Type 2 Diabetes Mellitus & Metabolic Glycemia',
      targetCompounds: ['Gymnemic Acids', 'Trigonelline', 'Charantin'],
      topPlant: {
        botanical: 'Gymnema sylvestre',
        common: 'Gymnema / Gurmar',
        family: 'Apocynaceae',
        primaryCompound: 'Gymnemic Acid IV (2.42% dry wt)',
        baseDose: 400,
        unit: 'mg extract (standardized 25%)',
        frequency: '2× daily with meals',
        action: 'Regenerates pancreatic β-cells, inhibits intestinal glucose absorption',
        evidenceR2: 0.942,
      },
      secondaryPlant: {
        botanical: 'Trigonella foenum-graecum',
        common: 'Fenugreek / Methi',
        primaryCompound: '4-Hydroxyisoleucine (1.85%)',
        baseDose: 500,
        unit: 'mg seed powder',
        frequency: '1-2× daily before breakfast',
      }
    },
    hypertension: {
      name: 'Cardiovascular Hypertension & Endothelial Tone',
      targetCompounds: ['Reserpine', 'Terminalia Tannins', 'Forskolin'],
      topPlant: {
        botanical: 'Rauvolfia serpentina',
        common: 'Indian Snakeroot / Sarpagandha',
        family: 'Apocynaceae',
        primaryCompound: 'Reserpine Alkaloids (1.18% dry wt)',
        baseDose: 250,
        unit: 'mg root extract',
        frequency: '1× daily at bedtime',
        action: 'Depletes catecholamine stores via VMAT-2 inhibition, reducing peripheral resistance',
        evidenceR2: 0.915,
      },
      secondaryPlant: {
        botanical: 'Terminalia arjuna',
        common: 'Arjuna Bark',
        primaryCompound: 'Arjunic Acid & Flavonoids (3.2%)',
        baseDose: 500,
        unit: 'mg bark powder',
        frequency: '2× daily post meals',
      }
    },
    cognitive: {
      name: 'Neurocognitive Enhancement & Synaptic Plasticity',
      targetCompounds: ['Bacosides A & B', 'Withanolides', 'Asiaticoside'],
      topPlant: {
        botanical: 'Bacopa monnieri',
        common: 'Brahmi / Water Hyssop',
        family: 'Plantaginaceae',
        primaryCompound: 'Bacoside A3 (2.85% dry wt)',
        baseDose: 300,
        unit: 'mg extract (55% bacosides)',
        frequency: '2× daily with healthy lipids',
        action: 'Enhances hippocampal protein kinase activity and synaptic cholinergic transmission',
        evidenceR2: 0.938,
      },
      secondaryPlant: {
        botanical: 'Centella asiatica',
        common: 'Gotu Kola / Mandukaparni',
        primaryCompound: 'Asiaticoside Triterpenoids (2.1%)',
        baseDose: 400,
        unit: 'mg leaf extract',
        frequency: '1× daily morning',
      }
    },
    inflammation: {
      name: 'Chronic Musculoskeletal Inflammation & Osteoarthritis',
      targetCompounds: ['Curcuminoids', 'Boswellic Acids', 'Gingerols'],
      topPlant: {
        botanical: 'Curcuma longa',
        common: 'Turmeric / Haridra',
        family: 'Zingiberaceae',
        primaryCompound: 'Curcumin (4.65% dry wt)',
        baseDose: 500,
        unit: 'mg curcuminoid complex (w/ Piperine)',
        frequency: '2× daily with food',
        action: 'Suppresses NF-κB transcription, downregulates COX-2, 5-LOX, and TNF-α',
        evidenceR2: 0.965,
      },
      secondaryPlant: {
        botanical: 'Boswellia serrata',
        common: 'Indian Frankincense / Shallaki',
        primaryCompound: 'AKBA Boswellic Acid (3.4%)',
        baseDose: 400,
        unit: 'mg standardized resin extract',
        frequency: '2× daily post meals',
      }
    },
    liver: {
      name: 'Hepatoprotective Integrity & Steatosis Mitigation',
      targetCompounds: ['Andrographolide', 'Picrosides', 'Phyllanthin'],
      topPlant: {
        botanical: 'Andrographis paniculata',
        common: 'King of Bitters / Kalmegh',
        family: 'Acanthaceae',
        primaryCompound: 'Andrographolide Diterpene (3.12% dry wt)',
        baseDose: 400,
        unit: 'mg whole herb extract',
        frequency: '2× daily before meals',
        action: 'Activates Nrf2 antioxidant response element, stabilizes hepatic cytochrome P450',
        evidenceR2: 0.928,
      },
      secondaryPlant: {
        botanical: 'Phyllanthus niruri',
        common: 'Stonebreaker / Bhumi Amla',
        primaryCompound: 'Phyllanthin & Hypophyllanthin (1.4%)',
        baseDose: 500,
        unit: 'mg aqueous extract',
        frequency: '2× daily morning & evening',
      }
    }
  };

  // Regional environmental multipliers (learned from GP seasonal model across 15 regions)
  const regionData = {
    tamil_nadu: { name: 'Tamil Nadu (Coimbatore / Plains)', lat: '11.00° N', lon: '76.96° E', alt: '411m', soil: 'Red Loam (pH 6.8)', potencyMult: 1.08, localAvailability: 99 },
    western_ghats: { name: 'Western Ghats Biodiversity Zone', lat: '10.15° N', lon: '77.06° E', alt: '1250m', soil: 'Humus Rich Forest (pH 6.2)', potencyMult: 1.15, localAvailability: 96 },
    indo_gangetic: { name: 'Indo-Gangetic Alluvial Plain', lat: '26.85° N', lon: '80.94° E', alt: '123m', soil: 'Alluvial Loam (pH 7.4)', potencyMult: 0.98, localAvailability: 92 },
    eastern_highlands: { name: 'Eastern Ghats & Highlands', lat: '17.68° N', lon: '83.21° E', alt: '680m', soil: 'Laterite (pH 6.5)', potencyMult: 1.04, localAvailability: 94 },
    himalayas: { name: 'Western Himalayan Sub-Alpine', lat: '32.22° N', lon: '76.32° E', alt: '1850m', soil: 'Brown Montane (pH 5.9)', potencyMult: 1.12, localAvailability: 87 }
  };

  // Herb-Drug interaction safety rules (derived from Graph Neural Network model)
  const drugInteractions: Record<string, Record<string, { severity: 'Safe' | 'Moderate' | 'Contraindicated'; riskScore: number; note: string }>> = {
    metformin: {
      diabetes: { severity: 'Safe', riskScore: 2, note: 'Synergistic glycemic lowering; monitor for mild hypoglycemia during initial 14 days.' },
      hypertension: { severity: 'Safe', riskScore: 4, note: 'No metabolic pathway competition identified (CYP2D6 orthogonal).' },
      cognitive: { severity: 'Safe', riskScore: 3, note: 'Neuroprotective synergy with metformin AMPK phosphorylation pathway.' },
      inflammation: { severity: 'Safe', riskScore: 2, note: 'Enhanced anti-inflammatory effect with curcuminoids.' },
      liver: { severity: 'Safe', riskScore: 5, note: 'Additive hepatic AMPK activation; safe at recommended doses.' }
    },
    warfarin: {
      diabetes: { severity: 'Moderate', riskScore: 38, note: 'Fenugreek coumarins may mildly prolong prothrombin time (PT/INR); monitor weekly.' },
      hypertension: { severity: 'Contraindicated', riskScore: 84, note: 'HAZARD: Rauvolfia alkaloids alter vascular tone and amplify coagulopathy risks.' },
      cognitive: { severity: 'Moderate', riskScore: 42, note: 'Bacosides mildly modulate platelet aggregation; regular INR check advised.' },
      inflammation: { severity: 'Moderate', riskScore: 68, note: 'WARNING: High-dose Curcumin suppresses platelet thromboxane A2. INR co-monitoring required.' },
      liver: { severity: 'Safe', riskScore: 18, note: 'Andrographolide does not inhibit CYP2C9 warfarin clearance significantly.' }
    },
    aspirin: {
      diabetes: { severity: 'Safe', riskScore: 6, note: 'No adverse antiplatelet or glycemic antagonism detected.' },
      hypertension: { severity: 'Moderate', riskScore: 34, note: 'Monitor mucosal stomach irritation if taken concomitantly on empty stomach.' },
      cognitive: { severity: 'Safe', riskScore: 8, note: 'Neurovascular stability preserved without bleeding exacerbation.' },
      inflammation: { severity: 'Moderate', riskScore: 52, note: 'Caution: Dual COX-1/COX-2 suppression with high-dose curcuminoid extracts.' },
      liver: { severity: 'Safe', riskScore: 12, note: 'No hepatic cytochrome competition.' }
    },
    sitagliptin: {
      diabetes: { severity: 'Safe', riskScore: 3, note: 'Beneficial dual incretin / GLP-1 and insulin sensitivity enhancement.' },
      hypertension: { severity: 'Safe', riskScore: 2, note: 'No pharmacokinetic cross-inhibition observed.' },
      cognitive: { severity: 'Safe', riskScore: 1, note: 'Safe; orthogonal clearance mechanisms.' },
      inflammation: { severity: 'Safe', riskScore: 3, note: 'Anti-inflammatory pathway compatibility confirmed.' },
      liver: { severity: 'Safe', riskScore: 6, note: 'Minimal CYP3A4 interaction.' }
    },
    none: {
      diabetes: { severity: 'Safe', riskScore: 0, note: 'No concurrent pharmaceutical drugs. Optimal monotherapy candidate.' },
      hypertension: { severity: 'Safe', riskScore: 0, note: 'Clean metabolic profile. No competitive clearance pathways.' },
      cognitive: { severity: 'Safe', riskScore: 0, note: 'Unobstructed blood-brain barrier transport verified.' },
      inflammation: { severity: 'Safe', riskScore: 0, note: 'Standard botanical bioavailability profile applies.' },
      liver: { severity: 'Safe', riskScore: 0, note: 'Pure botanical hepatoprotective regime.' }
    }
  };

  // Live dynamic calculations
  const curCondition = conditionProfiles[simCondition];
  const curRegion = regionData[simRegion];
  const curInteraction = drugInteractions[simDrug][simCondition];

  // Bioavailability estimated from Bayesian NN formula (age, weight, BMI adjusted)
  const ageFactor = simAge > 60 ? 0.88 : simAge < 30 ? 1.05 : 1.0;
  const weightFactor = simWeight > 85 ? 0.92 : simWeight < 55 ? 1.08 : 1.0;
  const bioavailabilityEst = Math.min(99, Math.max(45, Math.round(91.5 * ageFactor * weightFactor)));
  
  // Adjusted personalized dose
  const rawDose = curCondition.topPlant.baseDose;
  const personalizedDose = Math.round((rawDose * (simWeight / 70) * (1 / (bioavailabilityEst / 100))) / 10) * 10;
  
  // Composite recommendation score (0-100)
  const potencyScore = Math.min(100, Math.round(90 * curRegion.potencyMult));
  const safetyScore = 100 - curInteraction.riskScore;
  const overallScore = Math.min(99.4, Math.round((potencyScore * 0.35 + safetyScore * 0.35 + bioavailabilityEst * 0.20 + curRegion.localAvailability * 0.10) * 10) / 10);

  const bibtexCitation = `@patent{rayban2026geomedicinal,
  title={Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation},
  author={Dr. Jaishree Jaikrishnan and Rayban Pranav Mahesh and Ajitesh Sharma and Vyom Sen},
  year={2026},
  month={May},
  number={202641059395},
  type={Patent},
  nationality={Indian},
  assignee={Vellore Institute of Technology},
  note={Published 22 May 2026}
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
    element.download = 'rayban2026geomedicinal.bib';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'prior-art', label: 'Prior Art' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'gp-potency', label: 'GP Potency' },
    { id: 'bayesian-dosage', label: 'Bayesian Dosage' },
    { id: 'gnn-interactions', label: 'GNN Interactions' },
    { id: 'recommendation-engine', label: 'Reverse Engine' },
    { id: 'spectral-cnn', label: 'Spectral CNN' },
    { id: 'simulator', label: 'Live Simulator' },
    { id: 'results', label: 'Results' },
    { id: 'claims', label: 'Claims' },
    { id: 'citations', label: 'Citations & PDFs' },
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#0d0d0d] border border-white/20 rounded-lg overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121212]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-950/60 border border-red-600/40 text-red-400 font-mono text-[10px] rounded font-bold uppercase">
                    {activeImage.badge || 'Patent Figure'}
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">{activeImage.title}</h4>
                </div>
                <button 
                  onClick={() => setActiveImage(null)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-[#070707]">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title} 
                  className="max-h-[70vh] w-auto object-contain rounded border border-white/5 shadow-lg"
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
              href="/patent-assets/patent2/Geo-medicinal%20intelligence%20system%20for%20phytochemical%20prediction%20and%20personalized%20plant.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official PDF</span>
            </a>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full text-[11px] font-mono text-gray-400 no-scrollbar">
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

          <div className="hidden lg:flex items-center gap-2">
            <a 
              href="/patent-assets/patent2/Geo-medicinal%20intelligence%20system%20for%20phytochemical%20prediction%20and%20personalized%20plant.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official IPO PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* HERO DOSSIER BANNER */}
        <section id="overview" className="scroll-mt-24 relative p-6 sm:p-10 bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-red-950/20 blur-3xl rounded-full pointer-events-none" />

          {/* Patent Header Meta */}
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-red-950/50 border border-red-700/50 text-red-400 font-mono text-[11px] rounded font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-400" />
                Official Indian Patent Application
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                App No: <strong className="text-white font-mono">202641059395</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                Publication No: <strong className="text-red-300 font-mono">IN202641059395 A1</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-white/10 text-gray-300 font-mono text-[11px] rounded">
                Journal No: <strong className="text-gray-200">21/2026</strong>
              </span>
              <span className="px-2.5 py-1 bg-red-950/30 border border-red-600/30 text-red-400 font-mono text-[11px] rounded font-semibold">
                TRL 4 (Validated in Lab)
              </span>
            </div>

            {/* Patent Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight leading-snug sm:leading-tight mb-4 max-w-5xl">
              Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-inter max-w-4xl leading-relaxed mb-8">
              A comprehensive artificial intelligence platform that unifies <strong className="text-white">Gaussian Process geospatial regression</strong>, <strong className="text-white">Bayesian neural network bioavailability modeling</strong>, <strong className="text-white">Graph Neural Network herb-drug interaction discovery</strong>, and <strong className="text-white">5-channel multi-spectral CNN vision</strong>. Formulates reverse botanical therapy to recommend precision medicinal plants and personalized dosages, replacing 36-hour laboratory HPLC assays with a 0.14-second mobile field scan.
            </p>

            {/* Patent Specification & Inventors Dossier */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 font-mono text-xs">
              
              {/* Inventors Breakdown Card (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Users className="w-3.5 h-3.5 text-red-500" />
                    Inventors &amp; Authorship
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
                    <p className="text-sm font-bold text-white mt-1">Dr. Jaishree Jaikrishnan</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Associate Professor, VIT</p>
                  </div>

                  {/* Inventor 2 */}
                  <div className="p-3 bg-red-950/20 border border-red-800/50 rounded hover:border-red-500 transition-colors relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-red-400 font-bold">02 · Lead AI/ML Researcher</span>
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
                    <p className="text-sm font-bold text-white mt-1">Ajitesh Sharma</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Student Researcher, VIT</p>
                  </div>

                  {/* Inventor 4 */}
                  <div className="p-3 bg-[#080808] border border-white/5 rounded hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold">04 · Co-Inventor</span>
                      <span className="text-[9px] text-gray-400 font-mono">Researcher</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">Vyom Sen</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Student Researcher, VIT</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Institution / Applicant: <strong className="text-gray-200">Vellore Institute of Technology (VIT)</strong></span>
                  <span className="text-gray-500">Document No: <strong className="text-gray-300">02-IPR-R003</strong></span>
                </div>
              </div>

              {/* Patent Filing & Legal Specs Card (5 Cols) */}
              <div className="lg:col-span-5 bg-[#0e0e0e] border border-white/10 rounded-sm p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    Legal Filing Timeline
                  </span>
                  <span className="text-[9px] text-red-400 font-mono">IPO Certified</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2 bg-[#080808] rounded border border-white/5">
                    <span className="text-gray-400">Date of Filing:</span>
                    <span className="text-white font-bold">10 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#080808] rounded border border-white/5">
                    <span className="text-gray-400">Publication Date:</span>
                    <span className="text-red-400 font-bold">22 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#080808] rounded border border-white/5">
                    <span className="text-gray-400">IPC Classifications:</span>
                    <span className="text-gray-200 text-[10px]">G16H 20/10, 70/40, 50/20</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#080808] rounded border border-white/5">
                    <span className="text-gray-400">Application Status:</span>
                    <span className="text-red-400 font-bold uppercase tracking-wider">Published (Sec. 11A)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <a
                    href="/patent-assets/patent2/Geo-medicinal%20intelligence%20system%20for%20phytochemical%20prediction%20and%20personalized%20plant.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-900/40 hover:bg-red-800/60 border border-red-600/40 text-red-300 font-bold text-center rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Official PDF</span>
                  </a>
                  <a
                    href="/patent-assets/patent2/Geo-Medicinal%20Intelligence%20System%20for%20Phytochemical%20Prediction%20and%20Personalized%20Plant%20Recommendation.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#161616] hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-center rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>IDF-B Spec PDF</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 font-mono text-center">
              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Screening Speed</span>
                <span className="text-lg sm:text-xl font-bold text-red-400">0.14 sec</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">257,000× faster than HPLC</span>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Interaction AUC</span>
                <span className="text-lg sm:text-xl font-bold text-white">0.996</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">GNN on 1,847 edges</span>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Dosage Personalization</span>
                <span className="text-lg sm:text-xl font-bold text-red-400">70% Less Error</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">MAE 1.84% vs 6.21% linear</span>
              </div>
              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Per-Sample Cost</span>
                <span className="text-lg sm:text-xl font-bold text-white">₹10 / scan</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">250× cost reduction</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: PRIOR ART & NOVELTY MATRIX */}
        <section id="prior-art" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">02 / Patent Literature Survey</span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
                Prior Art &amp; Patent Landscape Differentiation
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">14 International Patents &amp; 10 Research Bases Reviewed</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
            Prior solutions only solved fragmented components: either static species lookups (NAPRALERT, AyurPlant), drug-drug GNN embeddings (EP3456789), or remote sensing correlations without field deployment pipelines. No single system integrates location-aware regression, personalized bioavailability, undocumented herb-drug safety inference, reverse clinical optimization, and spectral quantification.
          </p>

          <div className="overflow-x-auto border border-white/10 rounded-sm bg-[#080808]">
            <table className="w-full text-left font-mono text-xs text-gray-300">
              <thead className="bg-[#111111] text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-3.5">Patent ID</th>
                  <th className="p-3.5">Title &amp; Assignee</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Existing Innovation Scope</th>
                  <th className="p-3.5 text-red-400">What Geo-Medicinal System Adds (Our Novelty)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">US 10,983,546</td>
                  <td className="p-3.5">ML for Phytochemical Composition · Univ. of Ag. Sci.</td>
                  <td className="p-3.5">2021</td>
                  <td className="p-3.5 text-gray-400">Predicts concentrations from static environment features</td>
                  <td className="p-3.5 text-red-300 font-bold">Adds GP uncertainty bounds + seasonal Matérn kernel adaptation</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">US 10,654,229</td>
                  <td className="p-3.5">Herb-Drug Interaction Detection · Pharmakon Inc.</td>
                  <td className="p-3.5">2020</td>
                  <td className="p-3.5 text-gray-400">Database lookup of pre-cataloged interactions</td>
                  <td className="p-3.5 text-red-300 font-bold">Infers uncataloged &amp; undocumented pairs using 64-dim GNN embeddings</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">US 11,004,567</td>
                  <td className="p-3.5">Spectral Image Analysis · BioSpectral Tech</td>
                  <td className="p-3.5">2021</td>
                  <td className="p-3.5 text-gray-400">Hyperspectral imaging for botanical taxonomy</td>
                  <td className="p-3.5 text-red-300 font-bold">5-channel CNN regressing 4 active phytochemical classes simultaneously</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">US 10,789,423</td>
                  <td className="p-3.5">Personalized Pharmacokinetic NN · MediGenix</td>
                  <td className="p-3.5">2021</td>
                  <td className="p-3.5 text-gray-400">Synthetic drug bioavailability estimation</td>
                  <td className="p-3.5 text-red-300 font-bold">Extends to herbal metabolites with Monte Carlo dropout Bayesian bounds</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">WO 2021/089456</td>
                  <td className="p-3.5">Geospatial Potency Variation · CSIR-IHBT (India)</td>
                  <td className="p-3.5">2021</td>
                  <td className="p-3.5 text-gray-400">Maps geographical variation of plant secondary metabolites</td>
                  <td className="p-3.5 text-red-300 font-bold">Direct integration with reverse multi-objective clinical dosage recommender</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-3.5 text-white font-bold">EP 3,456,789</td>
                  <td className="p-3.5">Knowledge Graph Embeddings · Roche</td>
                  <td className="p-3.5">2020</td>
                  <td className="p-3.5 text-gray-400">Drug-drug interaction graph representations</td>
                  <td className="p-3.5 text-red-300 font-bold">Hybrid herb-drug graph with metabolic pathway overlap &amp; structural MLP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: SYSTEM ARCHITECTURE (FIGURE 1 & FIGURE 7) */}
        <section id="architecture" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">03 / System Architecture &amp; Data Pipeline</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              End-to-End Five-Engine Computational Topology
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-red-400" />
                  FIGURE 1: Integrated Pipeline &amp; Central Orchestrator
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Click image to expand</span>
              </div>
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig1_integrated_pipeline.png',
                  title: 'Figure 1: Five Computational Engines & Central Orchestration',
                  caption: 'Complete integrated data flow between the 5 specialized machine learning engines and central orchestrator, translating user location, patient profile, and spectral imagery into an actionable clinical report.',
                  badge: 'Figure 1'
                })}
                className="relative group cursor-zoom-in rounded overflow-hidden border border-white/5 bg-black"
              >
                <img 
                  src="/patent-assets/patent2/fig1_integrated_pipeline.png" 
                  alt="Figure 1: Complete integrated pipeline showing data flow between five computational engines"
                  className="w-full h-auto max-h-[380px] object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-black/80 text-white rounded font-mono text-xs flex items-center gap-1.5 border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5 text-red-400" /> Full Resolution Figure
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                <strong>Figure 1 Description:</strong> Incoming telemetry (geospatial coordinates, patient metabolic indicators, clinical complaint, and optional 5-channel imagery) is processed concurrently through Engines 1–5, converging in the central multi-objective solver.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-2">
                <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold block">1. Central Orchestrator</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Asynchronous coordinator that harmonizes predictions from Python microservices, balancing spatial variance against patient contraindications.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-2">
                <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold block">2. Probabilistic Safety Barrier</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Rejects recommendations where herb-drug interaction threshold exceeds $P &gt; 0.25$ or predicted 95% bioavailability interval exceeds toxic thresholds.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-sm space-y-2">
                <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold block">3. Inverse Optimization Formulation</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Converts traditional clinical queries (&quot;What treatable herbs grow within 50 km for this diabetic patient taking Metformin?&quot;) into constrained Pareto frontiers.
                </p>
              </div>

              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig7_full_system_execution.png',
                  title: 'Figure 7: Complete Pipeline Execution Flow',
                  caption: 'Input vectors traversing through Gaussian Processes, Bayesian Inference, Graph Neural Networks, and Convolutional Image Evaluation.',
                  badge: 'Figure 7'
                })}
                className="p-3 bg-[#080808] border border-red-900/30 rounded flex items-center justify-between cursor-pointer hover:border-red-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span className="text-white font-bold">View Figure 7: Pipeline Flow Execution</span>
                </div>
                <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE FIVE CORE COMPUTATIONAL ENGINES */}
        
        {/* ENGINE 1: GP GEOPOTENCY */}
        <section id="gp-potency" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">04 / Engine 1: Spatial-Temporal Chemistry</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Location-Aware Potency Prediction (Gaussian Process + ARIMA)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4 font-inter text-sm text-gray-300 leading-relaxed">
              <p>
                Phytochemical concentrations fluctuate dramatically across soils, elevations, and seasons. Engine 1 eliminates static monographs by modeling compound synthesis as a non-linear Gaussian Process:
              </p>

              <div className="p-4 bg-[#080808] border border-white/10 rounded font-mono text-xs text-red-400 space-y-1">
                <p className="font-bold text-white">Mathematical Formulation:</p>
                <p className="text-red-300">y_concentration(x) = GP(x_geo, K_seasonal) + ε_arima(t)</p>
                <p className="text-gray-400 text-[11px] mt-2">
                  x_geo = [lat, lon, altitude, temp, rainfall, soil_pH, N, P, K, harvest_month]
                </p>
                <p className="text-gray-400 text-[11px]">
                  K_seasonal = K_RBF(x, x&apos;) × K_periodic(t, t&apos;)
                </p>
              </div>

              <p className="text-xs font-mono text-gray-400">
                Unlike deterministic neural networks, the GP kernel outputs both expected compound percentage $\mu(x)$ and variance $\sigma^2(x)$, yielding formal 95% confidence intervals ($\pm 0.45\%$ Alkaloids, $\pm 0.68\%$ Flavonoids) for sparse Indian regions.
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-2">
                <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                  <span className="text-gray-500 text-[10px] block">Alkaloid RMSE</span>
                  <span className="text-base font-bold text-red-400">0.619%</span>
                  <span className="text-[10px] text-gray-400 block">Across 15 Indian regions</span>
                </div>
                <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded">
                  <span className="text-gray-500 text-[10px] block">Flavonoid R²</span>
                  <span className="text-base font-bold text-white">+0.18 over Linear</span>
                  <span className="text-[10px] text-gray-400 block">Outperforms RF in variance</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Figure 2 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig2_gaussian_process_potency.png',
                  title: 'Figure 2: Gaussian Process Regional Predictions',
                  caption: 'Gaussian Process predictions of alkaloid concentration across 15 Indian regions. Color gradient indicates predicted potency; contour lines show confidence intervals.',
                  badge: 'Figure 2'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 2: Geo-Potency Map</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig2_gaussian_process_potency.png" 
                  alt="Figure 2: Gaussian Process predictions of alkaloid concentration" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">15 Indian regional contour mappings.</p>
              </div>

              {/* Figure 9 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig9_predicted_vs_actual.png',
                  title: 'Figure 9: Predicted vs. Actual Phytochemical Concentrations',
                  caption: 'Validation plot with 95% confidence intervals confirming tight alignment against HPLC test datasets.',
                  badge: 'Figure 9'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 9: Parity &amp; CI Plot</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig9_predicted_vs_actual.png" 
                  alt="Figure 9: Predicted vs actual phytochemical concentrations" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">Predicted vs Actual with 95% error bands.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ENGINE 2: BAYESIAN DOSAGE */}
        <section id="bayesian-dosage" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">05 / Engine 2: Precision Pharmacokinetics</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Personalized Bioavailability &amp; Bayesian Dosage Calculator
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 lg:order-1">
              {/* Figure 3 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig3_bayesian_bioavailability.png',
                  title: 'Figure 3: Bayesian Neural Network Bioavailability Distributions',
                  caption: 'Posterior distribution estimation across patient cohorts. Left panel shows bioavailability vs. age; right panel shows effective dose ranges.',
                  badge: 'Figure 3'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 3: Posterior Distributions</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig3_bayesian_bioavailability.png" 
                  alt="Figure 3: Bayesian neural network predictions" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">Patient cohort bioavailability posterior.</p>
              </div>

              {/* Figure 10 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig10_bayesian_age_cohort.png',
                  title: 'Figure 10: Bioavailability vs. Linear Baseline Comparison',
                  caption: 'Bayesian NN (MAE 1.84%, R² 0.915) outperforming static pharmacokinetic tables (MAE 6.34%) by 70% error reduction.',
                  badge: 'Figure 10'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 10: Cohort Error Analysis</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig10_bayesian_age_cohort.png" 
                  alt="Figure 10: Bioavailability predictions by age cohort" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">MAE 1.84% vs 6.21% linear baseline.</p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4 font-inter text-sm text-gray-300 leading-relaxed order-1 lg:order-2">
              <p>
                Standard herbal monographs assign flat population dosages (e.g. &quot;500mg twice daily&quot;), causing therapeutic failure in low-metabolism patients or toxicity in renal-impaired elders. Engine 2 parameterizes patient biology using a 12-dimensional Bayesian Neural Network:
              </p>

              <div className="p-4 bg-[#080808] border border-white/10 rounded font-mono text-xs text-red-400 space-y-1">
                <p className="font-bold text-white">Bayesian Probabilistic Conditioning:</p>
                <p className="text-red-300">P(Bioavailability_i | p, c, d) = BayesianNN(p, c, d)</p>
                <p className="text-gray-400 text-[11px] mt-2">
                  p = [age, weight, gender, BMI, kidney_eGFR, liver_enzymes]
                </p>
                <p className="text-gray-400 text-[11px]">
                  c = [MW, logP, HBA, HBD, rotatable_bonds, polar_surface_area]
                </p>
                <p className="text-gray-400 text-[11px]">
                  Inference: Monte Carlo dropout sampling yields [μ - σ, μ + σ] therapeutic window
                </p>
              </div>

              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Proposed Bayesian NN</span>
                  <span className="text-red-400 font-bold">MAE: 1.84% · R²: 0.915 · 8ms inference</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Random Forest Baseline</span>
                  <span className="text-gray-300">MAE: 1.88% · R²: 0.915 (Deterministic only)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Static Pharmacokinetic Tables</span>
                  <span className="text-red-400">MAE: 6.34% · R²: ~0.000 (Population generic)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENGINE 3: GNN HERB-DRUG INTERACTIONS */}
        <section id="gnn-interactions" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">06 / Engine 3: Molecular Knowledge Graph</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Herb-Drug Interaction Discovery &amp; Undocumented Pair Inference
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4 font-inter text-sm text-gray-300 leading-relaxed">
              <p>
                Patients routinely co-administer pharmaceuticals with botanical supplements. Manual databases (Medscape, DrugBank) only track documented case reports. Engine 3 constructs a graph topology linking 47 medicinal species and 312 pharmaceutical agents over 1,847 curated edges.
              </p>

              <div className="p-4 bg-[#080808] border border-white/10 rounded font-mono text-xs text-red-400 space-y-1">
                <p className="font-bold text-white">Embedding Inference Formula:</p>
                <p className="text-red-300">P(Interaction_h,d) = MLP(e_h, e_d, s_struct)</p>
                <p className="text-gray-400 text-[11px] mt-2">
                  e_h, e_d = 64-dimensional Graph Neural Network node embeddings
                </p>
                <p className="text-gray-400 text-[11px]">
                  s_struct = Morgan structural fingerprint similarity + CYP450 enzyme overlap
                </p>
              </div>

              <p className="text-xs font-mono text-gray-400">
                <strong>Groundbreaking Generalization:</strong> On novel, uncataloged test pairs never observed during training, Engine 3 achieves a <strong>ROC-AUC of 0.996</strong> and <strong>95.6% accuracy</strong> (127 true interactions identified with only 4 false alarms).
              </p>

              <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                <div className="p-2.5 bg-[#0d0d0d] border border-white/5 rounded">
                  <span className="text-[10px] text-gray-500 block">ROC-AUC</span>
                  <span className="text-base font-bold text-red-400">0.996</span>
                </div>
                <div className="p-2.5 bg-[#0d0d0d] border border-white/5 rounded">
                  <span className="text-[10px] text-gray-500 block">Precision</span>
                  <span className="text-base font-bold text-white">96.7%</span>
                </div>
                <div className="p-2.5 bg-[#0d0d0d] border border-white/5 rounded">
                  <span className="text-[10px] text-gray-500 block">Recall</span>
                  <span className="text-base font-bold text-white">94.1%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Figure 4 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig4_herb_drug_network.png',
                  title: 'Figure 4: Herb-Drug Interaction Knowledge Graph',
                  caption: 'Network visualization of 47 medicinal plants and 312 pharmaceutical drugs. Node color represents compound class; edge thickness signifies interaction strength.',
                  badge: 'Figure 4'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 4: Interaction Graph</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig4_herb_drug_network.png" 
                  alt="Figure 4: Network visualization of herb-drug interaction graph" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">1,847 curated &amp; inferred interaction edges.</p>
              </div>

              {/* Figure 11 */}
              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig11_roc_interaction_curves.png',
                  title: 'Figure 11: ROC-AUC Discrimination Curves',
                  caption: 'ROC curves comparing the proposed Graph+Structural model (AUC 0.996) against GNN-alone (0.754) and static tables (0.700).',
                  badge: 'Figure 11'
                })}
                className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-white">FIG 11: ROC Curves</span>
                  <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
                </div>
                <img 
                  src="/patent-assets/patent2/fig11_roc_interaction_curves.png" 
                  alt="Figure 11: ROC curves for interaction classification" 
                  className="w-full h-44 object-contain bg-black rounded"
                />
                <p className="text-[10px] font-mono text-gray-400 mt-2">AUC 0.996 with generalized novel pair handling.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ENGINE 4 & 5: RECOMMENDATION ENGINE & SPECTRAL CNN */}
        <section id="recommendation-engine" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">07 / Engines 4 &amp; 5: Clinical Decision &amp; Vision</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Reverse Botanical Recommender &amp; 5-Channel Spectral Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Engine 4 Column */}
            <div className="lg:col-span-6 bg-[#0a0a0a] border border-white/10 rounded p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  Engine 4: Multi-Objective Reverse Optimizer
                </span>
                <span className="text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded">Score: 98.4/100</span>
              </div>

              <p className="text-gray-300 font-inter text-xs leading-relaxed">
                Existing systems only answer &quot;What can Turmeric treat?&quot; (forward lookup). Engine 4 solves the inverse optimization formulation:
              </p>

              <div className="p-3 bg-[#050505] border border-white/5 rounded text-red-300 space-y-1">
                <p className="text-white font-bold">Objective Function:</p>
                <p>max_r ∑ w_i · s_i(r, condition, profile, location)</p>
                <p className="text-gray-400 text-[10px]">
                  s_1 = Potency Match (GP geo-model) · s_2 = Safety Score (1 - Risk_GNN)
                </p>
                <p className="text-gray-400 text-[10px]">
                  s_3 = Personalization Fit (Bayesian Bioavailability) · s_4 = Local Cultivar Availability
                </p>
              </div>

              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig5_multiobjective_ranking.png',
                  title: 'Figure 5: Multi-Objective Recommendation Rankings',
                  caption: 'Ranked Pareto frontier of botanical candidates for clinical conditions incorporating regional potency, patient safety, and drug interactions.',
                  badge: 'Figure 5'
                })}
                className="cursor-zoom-in group border border-white/10 rounded overflow-hidden"
              >
                <img 
                  src="/patent-assets/patent2/fig5_multiobjective_ranking.png" 
                  alt="Figure 5: Multi-objective ranking of plant recommendations" 
                  className="w-full h-36 object-contain bg-black p-2 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="text-[11px] text-gray-400 space-y-1">
                <div className="flex justify-between"><span>Integrated System Score:</span> <strong className="text-red-400">98.4 / 100</strong></div>
                <div className="flex justify-between"><span>Practitioner Baseline:</span> <strong className="text-gray-400">70.5 / 100</strong></div>
                <div className="flex justify-between"><span>Static Guidelines:</span> <strong className="text-red-400">38.1 / 100</strong></div>
              </div>
            </div>

            {/* Engine 5 Column */}
            <div id="spectral-cnn" className="lg:col-span-6 bg-[#0a0a0a] border border-white/10 rounded p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-red-400" />
                  Engine 5: 5-Channel Spectral Image CNN
                </span>
                <span className="text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded">0.14 sec scan</span>
              </div>

              <p className="text-gray-300 font-inter text-xs leading-relaxed">
                Wet-lab HPLC/GC-MS quantification requires 36 hours and costs ₹2,500/sample. Engine 5 processes non-destructive 5-channel (RGB + NIR + Thermal) mobile imagery:
              </p>

              <div className="p-3 bg-[#050505] border border-white/5 rounded text-red-300 space-y-1">
                <p className="text-white font-bold">Vision Architecture:</p>
                <p>Input (32×32×5) → Conv2D(32, 3×3) → MaxPool(2×2) → Conv2D(64)</p>
                <p>→ GlobalAvgPool → Dense(128, ReLU) → Dense(4, Linear)</p>
                <p className="text-gray-400 text-[10px]">
                  Output: [Alkaloids%, Flavonoids% (R²=0.95), Terpenoids%, Glycosides%]
                </p>
              </div>

              <div 
                onClick={() => setActiveImage({
                  src: '/patent-assets/patent2/fig6_spectral_cnn_architecture.png',
                  title: 'Figure 6: Five-Channel Spectral CNN Architecture',
                  caption: 'Convolutional neural network mapping 5 spectral bands directly into four quantitative phytochemical concentration percentages in 0.14 seconds.',
                  badge: 'Figure 6'
                })}
                className="cursor-zoom-in group border border-white/10 rounded overflow-hidden"
              >
                <img 
                  src="/patent-assets/patent2/fig6_spectral_cnn_architecture.png" 
                  alt="Figure 6: CNN architecture for 5-channel spectral image processing" 
                  className="w-full h-36 object-contain bg-black p-2 group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="text-[11px] text-gray-400 space-y-1">
                <div className="flex justify-between"><span>Flavonoid Quantification R²:</span> <strong className="text-red-400">0.950 (HPLC Grade)</strong></div>
                <div className="flex justify-between"><span>Throughput Advantage:</span> <strong className="text-red-400">257,000× faster (0.14s vs 36h)</strong></div>
                <div className="flex justify-between"><span>Cost Advantage:</span> <strong className="text-red-400">250× cheaper (₹10 vs ₹2,500)</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE GEO-MEDICINAL SIMULATOR */}
        <section id="simulator" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">08 / Live Interactive Demonstration</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Geo-Medicinal Clinical Recommendation &amp; Dosage Simulator
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0a0a] border border-white/10 rounded-sm p-6 sm:p-8 shadow-xl">
            
            {/* Input Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-5 font-mono text-xs">
              <div className="space-y-1.5">
                <label htmlFor={conditionSelectId} className="text-gray-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  1. Clinical Condition / Target
                </label>
                <select 
                  id={conditionSelectId}
                  value={simCondition}
                  onChange={(e) => setSimCondition(e.target.value as any)}
                  className="w-full p-2.5 bg-[#121212] border border-white/10 rounded text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="diabetes">Type 2 Diabetes &amp; Glycemic Control</option>
                  <option value="hypertension">Cardiovascular Hypertension</option>
                  <option value="cognitive">Cognitive Performance &amp; Memory</option>
                  <option value="inflammation">Chronic Joint Inflammation / Arthritis</option>
                  <option value="liver">Hepatoprotection &amp; Fatty Liver</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor={regionSelectId} className="text-gray-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  2. Patient Geographic Location (GP Kernel)
                </label>
                <select 
                  id={regionSelectId}
                  value={simRegion}
                  onChange={(e) => setSimRegion(e.target.value as any)}
                  className="w-full p-2.5 bg-[#121212] border border-white/10 rounded text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="tamil_nadu">Tamil Nadu (Coimbatore / Plains, 411m)</option>
                  <option value="western_ghats">Western Ghats Rainforest (1,250m)</option>
                  <option value="indo_gangetic">Indo-Gangetic Alluvium (123m)</option>
                  <option value="eastern_highlands">Eastern Ghats Laterite (680m)</option>
                  <option value="himalayas">Western Himalayas Sub-Alpine (1,850m)</option>
                </select>
                <span className="text-[10px] text-gray-500 block">
                  Location coords: {curRegion.lat}, {curRegion.lon} · Altitude: {curRegion.alt} · Soil: {curRegion.soil}
                </span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor={concurrentDrugId} className="text-gray-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-red-400" />
                  3. Concurrent Medication (GNN Safety Check)
                </label>
                <select 
                  id={concurrentDrugId}
                  value={simDrug}
                  onChange={(e) => setSimDrug(e.target.value as any)}
                  className="w-full p-2.5 bg-[#121212] border border-white/10 rounded text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="none">None (Pure Botanical Monotherapy)</option>
                  <option value="metformin">Metformin (Biguanide Antidiabetic)</option>
                  <option value="warfarin">Warfarin (Vitamin K Antagonist Anticoagulant)</option>
                  <option value="aspirin">Aspirin (Antiplatelet / NSAID)</option>
                  <option value="sitagliptin">Sitagliptin (DPP-4 Inhibitor)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label htmlFor={patientAgeId} className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Patient Age</label>
                    <span className="text-white font-bold">{simAge} yrs</span>
                  </div>
                  <input 
                    id={patientAgeId}
                    type="range" 
                    min="18" 
                    max="85" 
                    value={simAge}
                    onChange={(e) => setSimAge(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label htmlFor={patientWeightId} className="text-gray-400 uppercase tracking-wider font-bold text-[10px]">Weight</label>
                    <span className="text-white font-bold">{simWeight} kg</span>
                  </div>
                  <input 
                    id={patientWeightId}
                    type="range" 
                    min="45" 
                    max="115" 
                    value={simWeight}
                    onChange={(e) => setSimWeight(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded text-[11px] text-gray-400 space-y-1">
                <span className="text-red-400 font-bold block">Engine Execution Telemetry:</span>
                <div>GP Potency Factor: <strong>{(curRegion.potencyMult * 100).toFixed(0)}% of baseline</strong></div>
                <div>Bayesian Bioavailability Est: <strong>{bioavailabilityEst}%</strong></div>
                <div>GNN Interaction Risk: <strong>{curInteraction.riskScore}/100 ({curInteraction.severity})</strong></div>
              </div>
            </div>

            {/* Generated Decision Report (7 Cols) */}
            <div className="lg:col-span-7 bg-[#070707] border border-white/10 rounded-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-red-400 text-[10px] font-mono uppercase tracking-widest block font-bold">
                    Engine 4 Optimization Result
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Rank #1: {curCondition.topPlant.botanical} ({curCondition.topPlant.common})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-red-400 font-mono">{overallScore}</span>
                  <span className="text-[10px] text-gray-400 font-mono block">/ 100 Score</span>
                </div>
              </div>

              {/* Herb-Drug Safety Banner */}
              <div className={`p-3 rounded border text-xs font-mono flex items-start gap-2.5 ${
                curInteraction.severity === 'Safe' 
                  ? 'bg-red-950/30 border-red-700/50 text-red-300' 
                  : curInteraction.severity === 'Moderate' 
                  ? 'bg-amber-950/30 border-amber-700/50 text-amber-300' 
                  : 'bg-red-950/40 border-red-700/60 text-red-300'
              }`}>
                {curInteraction.severity === 'Safe' ? <ShieldCheck className="w-4 h-4 shrink-0 text-red-400 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />}
                <div>
                  <span className="font-bold uppercase tracking-wider block">GNN Interaction Status: {curInteraction.severity}</span>
                  <p className="text-[11px] mt-0.5 opacity-90">{curInteraction.note}</p>
                </div>
              </div>

              {/* Personalized Dosage Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#111111] border border-white/5 rounded">
                  <span className="text-gray-500 text-[10px] block">Personalized Dose</span>
                  <span className="text-base font-bold text-red-400">{personalizedDose} mg</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{curCondition.topPlant.frequency}</span>
                </div>
                <div className="p-3 bg-[#111111] border border-white/5 rounded">
                  <span className="text-gray-500 text-[10px] block">Key Metabolite</span>
                  <span className="text-xs font-bold text-white">{curCondition.topPlant.primaryCompound}</span>
                  <span className="text-[10px] text-red-400 block mt-0.5">R² {curCondition.topPlant.evidenceR2}</span>
                </div>
                <div className="p-3 bg-[#111111] border border-white/5 rounded">
                  <span className="text-gray-500 text-[10px] block">Local Cultivar</span>
                  <span className="text-xs font-bold text-white">{curRegion.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{curRegion.localAvailability}% availability</span>
                </div>
              </div>

              {/* Mechanism of Action */}
              <div className="p-3 bg-[#0d0d0d] border border-white/5 rounded text-xs space-y-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">Pharmacological Mechanism:</span>
                <p className="text-gray-300 leading-relaxed text-[12px]">{curCondition.topPlant.action}</p>
              </div>

              {/* Alternative Recommendation */}
              <div className="p-3 bg-[#111111] border border-white/5 rounded text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Alternative Rank #2:</span>
                  <span className="text-gray-200 font-bold">{curCondition.secondaryPlant.botanical} ({curCondition.secondaryPlant.common})</span>
                  <p className="text-[10px] text-gray-400">{curCondition.secondaryPlant.baseDose} {curCondition.secondaryPlant.unit} · {curCondition.secondaryPlant.frequency}</p>
                </div>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-gray-300 text-xs">
                  Score: 94.1
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 6: EMPIRICAL RESULTS & EXPERIMENTAL VALIDATION */}
        <section id="results" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">09 / Benchmark Verification</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Empirical Validation Across 1,474 Literature Records
            </h2>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
            Trained and validated over an internal calibrated corpus of 1,474 literature observations covering 15 Indian botanical species across 15 ecologically diverse Indian biogeographical zones with 5-fold spatial holdout cross-validation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Figure 8 */}
            <div 
              onClick={() => setActiveImage({
                src: '/patent-assets/patent2/fig8_dataset_distribution.png',
                title: 'Figure 8: 1,474 Record NAPRALERT Calibration Dataset',
                caption: 'Distribution of 1,474 records across 15 plants and 15 Indian regions. Scatter plots show alkaloid concentration vs. latitude and altitude coding.',
                badge: 'Figure 8'
              })}
              className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-white">FIG 8: Dataset Spread</span>
                <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
              </div>
              <img 
                src="/patent-assets/patent2/fig8_dataset_distribution.png" 
                alt="Figure 8: Dataset distribution" 
                className="w-full h-36 object-contain bg-black rounded"
              />
              <p className="text-[10px] font-mono text-gray-400 mt-2">15 Indian plants × 15 regions.</p>
            </div>

            {/* Figure 14 */}
            <div 
              onClick={() => setActiveImage({
                src: '/patent-assets/patent2/fig14_heatmap_comparison.png',
                title: 'Figure 14: Engine Comparison Heatmap',
                caption: 'Side-by-side performance ranking of the proposed 5-engine platform against conventional baselines across all 5 technical novelties.',
                badge: 'Figure 14'
              })}
              className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-white">FIG 14: Metric Heatmap</span>
                <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
              </div>
              <img 
                src="/patent-assets/patent2/fig14_heatmap_comparison.png" 
                alt="Figure 14: Heatmap comparison" 
                className="w-full h-36 object-contain bg-black rounded"
              />
              <p className="text-[10px] font-mono text-gray-400 mt-2">Ranked advantage across novelties.</p>
            </div>

            {/* Figure 15 */}
            <div 
              onClick={() => setActiveImage({
                src: '/patent-assets/patent2/fig15_validation_dashboard.png',
                title: 'Figure 15: Validation Metrics Dashboard',
                caption: 'Comprehensive dashboard showing statistical significance tests, confidence bounds, and deployment readiness indicators.',
                badge: 'Figure 15'
              })}
              className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-white">FIG 15: Metric Dashboard</span>
                <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
              </div>
              <img 
                src="/patent-assets/patent2/fig15_validation_dashboard.png" 
                alt="Figure 15: Validation dashboard" 
                className="w-full h-36 object-contain bg-black rounded"
              />
              <p className="text-[10px] font-mono text-gray-400 mt-2">Statistical confidence indicators.</p>
            </div>

            {/* Figure 16 */}
            <div 
              onClick={() => setActiveImage({
                src: '/patent-assets/patent2/fig16_data_generation_process.jpg',
                title: 'Figure 16: Data Calibration & Synthesis Flow',
                caption: 'Systematic workflow synthesizing peer-reviewed chromatography literature into a standardized spatial matrix.',
                badge: 'Figure 16'
              })}
              className="bg-[#0a0a0a] border border-white/10 rounded p-3 cursor-zoom-in hover:border-red-500 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-white">FIG 16: Synthesis Flow</span>
                <Maximize2 className="w-3 h-3 text-gray-400 group-hover:text-red-400" />
              </div>
              <img 
                src="/patent-assets/patent2/fig16_data_generation_process.jpg" 
                alt="Figure 16: Data generation process" 
                className="w-full h-36 object-contain bg-black rounded"
              />
              <p className="text-[10px] font-mono text-gray-400 mt-2">Literature calibration pipeline.</p>
            </div>
          </div>
        </section>

        {/* SECTION 7: PATENT CLAIMS & LEGAL SCOPE */}
        <section id="claims" className="scroll-mt-24 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-red-500 font-mono text-[11px] uppercase tracking-[0.25em]">10 / Intellectual Property Protection</span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider mt-1 text-white">
              Official Patent Claims (Indian Patent App 202641059395)
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Claim 1 */}
            <div className="p-5 bg-[#0a0a0a] border border-red-800/40 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold uppercase tracking-wider">Independent Claim 1: Method Claim</span>
                <span className="px-2 py-0.5 bg-emerald-950 border border-red-600/40 text-red-400 text-[10px] rounded">Primary System</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                A method for operating a geo-medicinal intelligence system, the method comprising: receiving user input including a geographic location, a patient profile, and a clinical condition; predicting geographic potency of phytochemical compounds using a geographic potency prediction module applying Gaussian Process Regression with a radial basis function kernel and computing predicted concentrations with confidence intervals; estimating personalized dosage using a personalized dosage estimation module feeding patient profile features and compound descriptors into a Bayesian Neural Network with Monte Carlo dropout sampling to compute patient-specific bioavailability; predicting herb-drug interactions using an herb-drug interaction prediction module training a Graph Neural Network on a knowledge graph to compute interaction probabilities; and generating plant recommendations using a smart recommendation engine applying multi-objective constraint optimization across potency, safety, bioavailability, and availability.
              </p>
            </div>

            {/* Dependent Claims 2-6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded space-y-1.5">
                <span className="text-red-400 font-bold block">Claim 2: Geographic Potency Prediction</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  The method of Claim 1, wherein the Gaussian Process applies a seasonal kernel combining radial basis function and periodic components to model temporal autocorrelation across dry and wet seasons.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded space-y-1.5">
                <span className="text-red-400 font-bold block">Claim 3: Bayesian Neural Network Dosage</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  The method of Claim 1, wherein the Bayesian Neural Network processes twelve patient indicators and six molecular descriptors to output a full posterior bioavailability probability distribution.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded space-y-1.5">
                <span className="text-red-400 font-bold block">Claim 4: GNN Interaction Discovery</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  The method of Claim 1, wherein the Graph Neural Network embeds 47 plant nodes and 312 drug nodes in a 64-dimensional space, predicting novel undocumented interactions without prior literature presence.
                </p>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded space-y-1.5">
                <span className="text-red-400 font-bold block">Claim 5: 5-Channel Spectral CNN</span>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  The method of Claim 1, further comprising capturing 5-channel spectral imagery and regressing alkaloid, flavonoid, terpenoid, and glycoside concentrations in 0.14 seconds via deep convolutional layers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CITATION & DUAL PDF ACCESS */}
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
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
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
                href="/patent-assets/patent2/Geo-medicinal%20intelligence%20system%20for%20phytochemical%20prediction%20and%20personalized%20plant.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold rounded shadow transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Official IPO Publication PDF</span>
              </a>

              <a
                href="/patent-assets/patent2/Geo-Medicinal%20Intelligence%20System%20for%20Phytochemical%20Prediction%20and%20Personalized%20Plant%20Recommendation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#181818] hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono rounded transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>IDF-B Spec PDF</span>
              </a>
            </div>
          </div>

          {/* Inventor Names Reference Badges */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#0d0d0d] border border-white/5 rounded">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mr-1">Inventors:</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Dr. Jaishree Jaikrishnan</span>
            <span className="px-2.5 py-1 bg-red-950/40 border border-red-700/50 text-red-300 font-bold rounded text-xs font-mono">Rayban Pranav Mahesh</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Ajitesh Sharma</span>
            <span className="px-2.5 py-1 bg-[#161616] border border-white/10 text-gray-200 rounded text-xs font-mono">Vyom Sen</span>
          </div>

          {/* Formatted Citation Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#070707] border border-white/5 rounded space-y-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">IEEE Citation Format</span>
              <p className="text-gray-200 leading-relaxed text-[11px]">
                Dr. Jaishree Jaikrishnan, Rayban Pranav Mahesh, Ajitesh Sharma, and Vyom Sen, &quot;Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation,&quot; Indian Patent Application 202641059395, filed May 10, 2026, published May 22, 2026. Assignee: Vellore Institute of Technology.
              </p>
            </div>

            <div className="p-4 bg-[#070707] border border-white/5 rounded space-y-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">APA Citation Format</span>
              <p className="text-gray-200 leading-relaxed text-[11px]">
                Dr. Jaishree Jaikrishnan, Rayban Pranav Mahesh, Ajitesh Sharma, &amp; Vyom Sen (2026). <em>Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation</em> (Indian Patent Application No. 202641059395). Vellore Institute of Technology. Published May 22, 2026.
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
            <span>Official Assignee: Vellore Institute of Technology (VIT) · Patent App No: 202641059395 · Publication: IN202641059395 A1</span>
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
