import { Award, MapPin, Calendar, ExternalLink } from 'lucide-react';

const publications = [
  {
    id: '01',
    title: 'The Alignment Paradox: Emotional Flattening and Social Safety Risks in Proactive AI Agents',
    authors: 'Pranav Mahesh Rayban, Ajitesh Sharma, Aarya Ashish Nagvekar, Jaishree Jaikrishnan (Corresponding Author)',
    venue: 'IEEE 50th Annual Computers, Software, and Applications Conference (COMPSAC 2026)',
    location: 'Madrid, Spain',
    date: 'July 2026',
    status: 'Accepted / Published Conference Paper',
    statusBadge: 'IEEE COMPSAC 2026',
    statusColor: 'text-red-500 border-red-800/50 bg-red-950/30',
    doi: '10.1109/COMPSAC69091.2026.00478',
    link: 'https://doi.org/10.1109/COMPSAC69091.2026.00478',
    isAccepted: true,
    tags: ['Proactive AI Agents', 'AI Alignment', 'Social Safety', 'Emotional Flattening', 'Trustworthy AI']
  },
  {
    id: '02',
    title: 'LipSyncAuthenticityNet: An Explainable Multi-Modal Convolutional Neural Network for Forensic Lip-Sync Manipulation Detection',
    authors: 'Pranav Mahesh Rayban, Ajitesh Sharma, Mohanasundaram R, Jaishree Jaikrishnan (Corresponding Author)',
    venue: '15th International Conference on Image Processing Theory, Tools and Applications (IPTA 2026)',
    location: 'Kolkata, India',
    date: 'December 16–19, 2026',
    status: 'Accepted Conference Paper',
    statusBadge: 'IEEE IPTA 2026 (#69052)',
    statusColor: 'text-red-500 border-red-800/50 bg-red-950/30',
    recordId: 'IEEE Conference Record #69052',
    link: 'https://orcid.org/0009-0005-6897-6725',
    isAccepted: true,
    tags: ['Deepfake Detection', 'Forensic Lip-Sync', 'Multimodal CNN', 'XAI', 'Computer Vision']
  },
  {
    id: '03',
    title: 'Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep Learning-Based Feature Fusion',
    authors: 'Pranav Mahesh Rayban, Ajitesh Sharma, Aarya Ashish Nagvekar, Jaishree Jaikrishnan (Corresponding Author)',
    venue: 'Signal, Image and Video Processing (Springer Journal)',
    location: 'International',
    date: 'March 2026',
    status: 'Preprint · Under Review',
    statusBadge: 'Under Review (SIVP)',
    statusColor: 'text-orange-400 border-orange-800/50 bg-orange-950/30',
    doi: '10.21203/rs.3.rs-9103447/v1',
    link: 'https://doi.org/10.21203/rs.3.rs-9103447/v1',
    isAccepted: false,
    tags: ['Spatial-Spectral Fusion', 'Audio-Visual Sync', 'Forensic Analysis', 'Preprint']
  }
];

export default function PublicationsSection() {
  return (
    <section id="publications" className="mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Peer-Reviewed &amp; Research Contributions</span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">Research Publications</h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span className="px-2.5 py-1 bg-[#111] border border-white/10 rounded text-red-400">
            IEEE COMPSAC · IPTA · Springer
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {publications.map((pub) => (
          <div 
            key={pub.id}
            className="bg-[#0a0a0a] border border-white/10 hover:border-red-600/50 p-5 sm:p-6 md:p-8 rounded-sm transition-all relative group"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left Column: ID and main content */}
              <div className="flex gap-4 sm:gap-6 items-start">
                <span className="font-bebas text-4xl sm:text-5xl text-red-600 leading-none group-hover:text-red-500 transition-colors shrink-0">
                  {pub.id}
                </span>

                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 border rounded ${pub.statusColor}`}>
                      {pub.statusBadge}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {pub.status}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug group-hover:text-red-400 transition-colors">
                    {pub.title}
                  </h3>

                  <p className="text-xs text-gray-400 font-mono leading-relaxed">
                    <strong className="text-gray-300">Authors:</strong> {pub.authors}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <Award className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <strong>Venue:</strong> {pub.venue}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      {pub.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      {pub.date}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                    {pub.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-[#141414] border border-white/5 text-[10px] text-gray-400 font-mono rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Action Button */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                {pub.doi && (
                  <span className="text-[10px] font-mono text-gray-500 hidden lg:block">
                    DOI: {pub.doi}
                  </span>
                )}
                {pub.recordId && (
                  <span className="text-[10px] font-mono text-gray-500 hidden lg:block">
                    {pub.recordId}
                  </span>
                )}
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-[#141414] hover:bg-red-700 text-gray-200 hover:text-white border border-white/10 hover:border-red-600 text-xs font-mono font-bold uppercase rounded flex items-center justify-center gap-2 transition-all"
                >
                  <span>{pub.doi ? 'Access Paper' : 'View Record'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
