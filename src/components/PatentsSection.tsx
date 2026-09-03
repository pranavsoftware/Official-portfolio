import { useState } from 'react';
import { Award, Search, Filter, ExternalLink, ChevronDown, ChevronUp, Users, Building, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Patent {
  id: string;
  num: string;
  title: string;
  filed: string;
  published: string;
  applicant: string;
  inventors: string;
  category: string;
  domain: string;
}

export const patents: Patent[] = [
  {
    id: '01',
    num: '202541103106',
    title: 'Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal',
    filed: '26 October 2025',
    published: '28 November 2025',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Padma Priya R; Rayban Pranav Mahesh; Divyam Goel; Tanisha Bagga',
    category: 'Computer Vision & Audio ML',
    domain: 'Multimodal Crowd Chaos Detection & Safety Management'
  },
  {
    id: '02',
    num: '202641059395',
    title: 'Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation',
    filed: '10 May 2026',
    published: '22 May 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Jaishree Jaikrishnan; Rayban Pranav Mahesh; Ajitesh Sharma; Vyom Sen',
    category: 'Biomedical AI',
    domain: 'Geospatial ML & Phytochemical Prediction'
  },
  {
    id: '03',
    num: '202541131828',
    title: 'System for Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep-Learning Based Feature Fusion',
    filed: '25 December 2025',
    published: '02 January 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Jaishree Jaikrishnan; Rayban Pranav Mahesh; Aarya Ashish Nagvekar; Ajitesh Sharma',
    category: 'Deepfake Forensics',
    domain: 'Lip-Sync Forensics & Spatial-Spectral Fusion'
  },
  {
    id: '04',
    num: '202641054502',
    title: 'AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security',
    filed: '29 April 2026',
    published: '15 May 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Nupur Manasi; Karishma Rahaman; Marmik Pradip Kaila; Rayban Pranav Mahesh',
    category: 'Security & Forensics',
    domain: 'Multi-Layer Spoofing Detection & Network Defense'
  },
  {
    id: '05',
    num: '202641027867',
    title: 'A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication',
    filed: '20 March 2026',
    published: '27 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Nupur Manasi; Mrinali Charhate; Rayban Pranav Mahesh; Ashish Anil Sikaria',
    category: 'Multimodal AI',
    domain: 'Cross-Lingual Emotion Synchronization & Bilingual NLP'
  },
  {
    id: '06',
    num: '202641068108',
    title: 'Multi-Party Expense Settlement System with Graph-Based Optimization',
    filed: '30 May 2026',
    published: 'Filed / Published: 30 May 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Santhi K; Rayban Pranav Mahesh',
    category: 'Algorithms & Systems',
    domain: 'Graph Theory & Transaction Flow Optimization'
  },
  {
    id: '07',
    num: '202641062186',
    title: 'A System for Trust-Based Autonomous Dataset Validation and Integrity Assurance in Artificial Intelligence',
    filed: '15 May 2026',
    published: '29 May 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Santhi K; Rayban Pranav Mahesh',
    category: 'Trustworthy AI',
    domain: 'Autonomous Dataset Validation & AI Integrity Assurance'
  },
  {
    id: '08',
    num: '202641097130',
    title: 'System and Method for Runtime Behavioral Verification and Permission Enforcement in Autonomous Artificial Intelligence Agents',
    filed: '11 August 2026',
    published: '14 August 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Santhi K; Rayban Pranav Mahesh',
    category: 'Trustworthy AI',
    domain: 'Runtime Verification & Autonomous Agent Governance'
  },
  {
    id: '09',
    num: '202641027783',
    title: 'Multi-Domain Feature Fusion Based Deep Learning System for Audio Deepfake Detection',
    filed: '09 March 2026',
    published: '20 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Mohanasundaram R; Rayban Pranav Mahesh; Ajitesh Sharma; Hansaj Patidar',
    category: 'Deepfake Forensics',
    domain: 'Audio Deepfake Forensics & Multi-Domain Fusion'
  },
  {
    id: '10',
    num: '202641027808',
    title: 'Location-Filtered Service Platform with Bidirectional Rating and Image Verification',
    filed: '09 March 2026',
    published: '20 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Mohanasundaram R; Rayban Pranav Mahesh; Harsh Anand; Rishabh Vyas; Suraj Jha',
    category: 'Computer Vision & Systems',
    domain: 'Geospatial Filtering & Bidirectional Visual Verification'
  },
  {
    id: '11',
    num: '202641027867',
    title: 'Multi-Modal Behavioral Biometrics and Ensemble Learning Framework for Bot Detection in Online Transaction Systems',
    filed: '10 March 2026',
    published: '20 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Anusha N; Sawant Jiya Pradeep; Dwarakadhish Vinod Patil; Rayban Pranav Mahesh; Kunal Shivraj Bhosale',
    category: 'Security & Forensics',
    domain: 'Behavioral Biometrics & Transaction Bot Detection'
  },
  {
    id: '12',
    num: '202641027870',
    title: 'System and Method for Density-Adaptive Geo-Block Generation with Non-Competitive Business Synergy Scoring and Bundle Recommendation',
    filed: '10 March 2026',
    published: '20 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Monash P; Samyak Nitesh Chhajed; Rayban Pranav Mahesh; Madhav Juneja',
    category: 'Algorithms & Systems',
    domain: 'Density-Adaptive Geo-Blocks & Synergy Bundling'
  },
  {
    id: '13',
    num: '202641027891',
    title: 'Emotion-Adaptive Artificial Intelligence Interaction System with Multimodal Fusion and Temporal Dynamics Modeling',
    filed: '10 March 2026',
    published: '20 March 2026',
    applicant: 'Vellore Institute of Technology',
    inventors: 'Dr. Pushpa Gothwal; Rayban Pranav Mahesh; Tanisha Bagga; Udbhav Makkar; Divyam Goel; Pranjal Bajwa',
    category: 'Multimodal AI',
    domain: 'Affective Computing & Temporal Fusion Modeling'
  }
];

const categories = [
  'All',
  'Deepfake Forensics',
  'Security & Forensics',
  'Multimodal AI',
  'Trustworthy AI',
  'Biomedical AI',
  'Computer Vision & Audio ML',
  'Algorithms & Systems'
];

const INITIAL_VISIBLE_COUNT = 4;

export default function PatentsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredPatents = patents.filter(p => {
    const matchesCategory = selectedCategory === 'All' || 
      p.category === selectedCategory || 
      (selectedCategory === 'Computer Vision & Audio ML' && (p.category.includes('Computer Vision') || p.category.includes('Audio ML')));
      
    const query = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(query) ||
                          p.num.includes(query) ||
                          p.domain.toLowerCase().includes(query) ||
                          p.inventors.toLowerCase().includes(query) ||
                          p.applicant.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const isFiltering = selectedCategory !== 'All' || searchQuery.trim().length > 0;
  const displayedPatents = (showAll || isFiltering) 
    ? filteredPatents 
    : filteredPatents.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <section id="patents" className="mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em]">Intellectual Property</span>
            <span className="px-2 py-0.5 bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-[9px] rounded font-bold">
              13 OFFICIAL INDIAN PATENTS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest">
            Indian Patent Applications &amp; Inventions
          </h2>
        </div>
        <p className="text-xs text-gray-400 font-mono max-w-sm">
          Inventor of 13 official Indian Patent applications filed through Vellore Institute of Technology across Deepfake Forensics, Multimodal AI, Zero-Trust Security, and Trustworthy AI.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-8 bg-[#0a0a0a] p-3 sm:p-4 border border-white/5 rounded-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <Filter className="w-3.5 h-3.5 text-gray-500 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 sm:px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-red-700 text-white font-bold' 
                  : 'bg-[#141414] text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-auto min-w-0 sm:min-w-[280px]">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, patent no, inventor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-red-600 font-mono"
          />
        </div>
      </div>

      {/* Grid of Patents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <AnimatePresence>
          {displayedPatents.map((patent, index) => (
            <motion.div
              key={patent.id + '-' + patent.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 p-5 sm:p-6 rounded-sm flex flex-col justify-between transition-all group relative"
            >
              <div>
                {/* Header line with badge and patent no */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bebas text-3xl sm:text-4xl text-red-600 leading-none group-hover:text-red-500 transition-colors">
                      {patent.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141414] border border-white/10 text-gray-300 rounded">
                      {patent.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/30 border border-red-900/40 text-red-400 rounded">
                      App No: <code className="text-white font-bold">{patent.num}</code>
                    </span>
                  </div>
                  <Award className="w-4 h-4 text-red-600/60 group-hover:text-red-500 transition-colors shrink-0" />
                </div>

                {/* Patent Title */}
                <h3 className="font-bold text-sm sm:text-base text-white leading-snug mb-3 group-hover:text-red-300 transition-colors">
                  {patent.title}
                </h3>

                {/* Domain & Focus */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-0.5">Research Domain:</span>
                  <p className="text-xs font-mono text-gray-300 bg-[#060606] px-2.5 py-1.5 rounded border border-white/5">
                    {patent.domain}
                  </p>
                </div>

                {/* Inventors & Applicant Breakdown */}
                <div className="space-y-2 mb-5 text-[11px] font-mono">
                  <div className="flex items-start gap-2 text-gray-400">
                    <Users className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider block">Inventors:</span>
                      <span className="text-gray-200 leading-relaxed">{patent.inventors}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 pt-1">
                    <Building className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Applicant:</span>
                      <span className="text-gray-300 font-medium">{patent.applicant}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Filing & Publication Dates */}
              <div className="pt-3.5 border-t border-white/5 grid grid-cols-2 gap-2 font-mono text-[10px] bg-[#070707] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-3 sm:px-6 rounded-b-sm border-x-0">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    Filed
                  </span>
                  <span className="text-gray-300 font-medium">{patent.filed}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Published</span>
                  <span className="text-red-400 font-bold">{patent.published}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show All Toggle Button */}
      {!isFiltering && filteredPatents.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group px-6 py-3 bg-[#0a0a0a] hover:bg-red-950/30 border border-red-900/60 hover:border-red-500 active:scale-95 text-gray-300 hover:text-white text-xs font-mono font-bold uppercase tracking-[0.2em] rounded-sm flex items-center gap-2.5 transition-all duration-200 shadow-md cursor-pointer"
          >
            <span>{showAll ? 'Show Fewer Patents' : `View All 13 Patents (${filteredPatents.length - INITIAL_VISIBLE_COUNT} More)`}</span>
            {showAll ? (
              <ChevronUp className="w-4 h-4 text-red-500 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-8 p-4 bg-[#0a0a0a] border border-white/5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-gray-400">
        <span>Showing {displayedPatents.length} of {filteredPatents.length} verified Indian Patent applications (Applicant: Vellore Institute of Technology)</span>
        <a 
          href="https://orcid.org/0009-0005-6897-6725" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-500 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Verify on ORCID Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
