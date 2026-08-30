import { useState } from 'react';
import { Award, Search, Filter, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Patent {
  id: string;
  num: string;
  title: string;
  published: string;
  category: string;
  domain: string;
}

const patents: Patent[] = [
  {
    id: '01',
    num: '202641027891',
    title: 'Emotion-Adaptive Artificial Intelligence Interaction System with Multimodal Fusion and Temporal Dynamics Modeling',
    published: 'Mar 20, 2026',
    category: 'Multimodal AI',
    domain: 'Affective Computing & Temporal Fusion'
  },
  {
    id: '02',
    num: '202641059395',
    title: 'Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation',
    published: 'May 10, 2026',
    category: 'Biomedical AI',
    domain: 'Geospatial ML & Phytochemistry'
  },
  {
    id: '03',
    num: '202641054502',
    title: 'AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security',
    published: 'Apr 29, 2026',
    category: 'Security & Forensics',
    domain: 'Zero-Trust Network Forensics & Spoofing'
  },
  {
    id: '04',
    num: '202641068108',
    title: 'Multi-Party Expense Settlement System with Graph-Based Optimization',
    published: 'May 06, 2026',
    category: 'Algorithms & Systems',
    domain: 'Graph Theory & Transaction Optimization'
  },
  {
    id: '05',
    num: '202641062186',
    title: 'Trust-Aware Autonomous Foundational Dataset Construction and Integrity Validation System',
    published: 'May 15, 2026',
    category: 'Trustworthy AI',
    domain: 'Data Provenance & Autonomous Validation'
  },
  {
    id: '06',
    num: '202641027783',
    title: 'Multi-Domain Feature Fusion Based Deep Learning System for Audio Deepfake Detection',
    published: 'May 15, 2026',
    category: 'Deepfake Forensics',
    domain: 'Spectral-Temporal Audio Forensics'
  },
  {
    id: '07',
    num: '202641027867',
    title: 'Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication',
    published: 'May 15, 2026',
    category: 'Multimodal AI',
    domain: 'Bilingual NLP & Cross-Lingual Emotion'
  },
  {
    id: '08',
    num: '202641027808',
    title: 'Location-Filtered Service Platform with Bidirectional Rating and Image Verification',
    published: 'Mar 09, 2026',
    category: 'Computer Vision',
    domain: 'Geospatial Filtering & Visual Verification'
  },
  {
    id: '09',
    num: '202641027867',
    title: 'Multi-Modal Behavioral Biometrics and Ensemble Learning Framework for Bot Detection',
    published: 'Mar 10, 2026',
    category: 'Security & Forensics',
    domain: 'Behavioral Biometrics & Ensemble AI'
  },
  {
    id: '10',
    num: '202641027870',
    title: 'System and Method for Density-Adaptive Geo-Block Generation with Non-Competitive Business Synergy Scoring',
    published: 'Mar 10, 2026',
    category: 'Algorithms & Systems',
    domain: 'Spatial Optimization & Synergy Modeling'
  },
  {
    id: '11',
    num: '202541131828',
    title: 'System for Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep-Learning Based Feature Fusion',
    published: 'Mar 09, 2026',
    category: 'Deepfake Forensics',
    domain: 'Lip-Sync Forensics & Spatial-Spectral Fusion'
  },
  {
    id: '12',
    num: '202541103106',
    title: 'Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal',
    published: 'Nov 09, 2025',
    category: 'Computer Vision',
    domain: 'Multimodal Safety & Audio-Visual ML'
  },
  {
    id: '13',
    num: '202641027867',
    title: 'A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication',
    published: 'Mar 09, 2026',
    category: 'Multimodal AI',
    domain: 'Real-Time Speech-to-Text & Emotion Sync'
  }
];

const categories = ['All', 'Deepfake Forensics', 'Security & Forensics', 'Multimodal AI', 'Trustworthy AI', 'Biomedical AI', 'Computer Vision', 'Algorithms & Systems'];

const INITIAL_VISIBLE_COUNT = 3;

export default function PatentsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredPatents = patents.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.num.includes(searchQuery) ||
                          p.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isFiltering = selectedCategory !== 'All' || searchQuery.trim().length > 0;
  // If actively searching or filtering, show all matches; otherwise respect showAll toggle
  const displayedPatents = (showAll || isFiltering) 
    ? filteredPatents 
    : filteredPatents.slice(0, INITIAL_VISIBLE_COUNT);

  const hasMore = !isFiltering && filteredPatents.length > INITIAL_VISIBLE_COUNT;

  return (
    <section id="patents" className="mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em]">Intellectual Property</span>
            <span className="px-2 py-0.5 bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-[9px] rounded font-bold">13 APPLICATIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest">
            Indian Patent Applications &amp; Inventions
          </h2>
        </div>
        <p className="text-xs text-gray-400 font-mono max-w-sm">
          Patents spanning AI architectures, cybersecurity forensics, multimodal intelligence, and biometric anomaly detection.
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
              className={`px-2.5 sm:px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all ${
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
        <div className="relative w-full lg:w-auto min-w-0 sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patents or numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-red-600 font-mono"
          />
        </div>
      </div>

      {/* Grid of Patents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {displayedPatents.map((patent, index) => (
            <motion.div
              key={patent.id + '-' + patent.num}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 p-5 sm:p-6 rounded-sm flex flex-col justify-between transition-all group relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-3xl text-red-600 leading-none group-hover:text-red-500 transition-colors">
                      {patent.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141414] border border-white/10 text-gray-300 rounded">
                      {patent.category}
                    </span>
                  </div>
                  <Award className="w-4 h-4 text-red-600/60 group-hover:text-red-500 transition-colors shrink-0" />
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-white leading-snug mb-4 group-hover:text-red-300 transition-colors">
                  {patent.title}
                </h3>

                <div className="space-y-1.5 text-[11px] font-mono text-gray-400 mb-6">
                  <p className="text-gray-500">
                    <strong className="text-gray-400">Domain:</strong> {patent.domain}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                <div>
                  <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Patent App No.</span>
                  <code className="text-red-400 font-bold tracking-wider">{patent.num}</code>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Published</span>
                  <span className="text-gray-300">{patent.published}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More / Show Less Toggle Button */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="group px-6 py-3 bg-[#0a0a0a] hover:bg-red-950/30 border border-red-900/60 hover:border-red-500 active:scale-95 text-gray-300 hover:text-white text-xs font-mono font-bold uppercase tracking-[0.2em] rounded-sm flex items-center gap-2.5 transition-all duration-200 shadow-md cursor-pointer"
          >
            <span>View All 13 Patents ({patents.length - INITIAL_VISIBLE_COUNT} More)</span>
            <ChevronDown className="w-4 h-4 text-red-500 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {showAll && !isFiltering && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(false)}
            className="group px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] border border-white/10 hover:border-white/30 active:scale-95 text-gray-400 hover:text-white text-xs font-mono uppercase tracking-[0.2em] rounded-sm flex items-center gap-2.5 transition-all duration-200 cursor-pointer"
          >
            <span>Show Fewer Patents</span>
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-8 p-4 bg-[#0a0a0a] border border-white/5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-gray-400">
        <span>Showing {displayedPatents.length} of {filteredPatents.length} official Indian Patent applications</span>
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
