import { Cpu, Cloud, Code2, Layers, Sparkles, BookOpen } from 'lucide-react';

const skillCategories = [
  {
    title: 'AI & Machine Learning',
    icon: Cpu,
    skills: [
      'TensorFlow', 'PyTorch', 'Deep Learning', 'Convolutional Neural Networks (CNNs)',
      'Computer Vision', 'Natural Language Processing (NLP)', 'Generative AI & LLMs',
      'Retrieval-Augmented Generation (RAG)', 'Grad-CAM', 'SHAP Explainability',
      'Federated Learning (FedAvg)', 'Transfer Learning', 'Google Gemini AI'
    ]
  },
  {
    title: 'Cloud, MLOps & DevOps',
    icon: Cloud,
    skills: [
      'Docker', 'Kubernetes', 'CI/CD Pipelines', 'GitHub Actions', 'Git',
      'Google Cloud Platform (GCP)', 'Amazon Web Services (AWS)', 'Oracle Cloud Infrastructure',
      'MongoDB Atlas', 'Model Versioning & Reproducibility', 'Zero-Trust Architecture'
    ]
  },
  {
    title: 'Programming Languages',
    icon: Code2,
    skills: [
      'Python', 'Java', 'C', 'C++', 'SQL', 'TypeScript', 'JavaScript', 'HTML5 / CSS3'
    ]
  },
  {
    title: 'Frameworks & Systems',
    icon: Layers,
    skills: [
      'FastAPI', 'Flask', 'React', 'React Native', 'Node.js', 'Express.js', 'Firebase'
    ]
  }
];

const researchDomains = [
  'Deep Learning', 'Computer Vision', 'Generative AI', 'Multimodal AI',
  'Explainable AI (XAI)', 'Trustworthy AI', 'Deepfake Detection', 'Digital Forensics',
  'Cybersecurity', 'Behavioral Biometrics', 'Fraud & Spoofing Detection',
  'Biomedical AI', 'AI Safety & Human-AI Interaction', 'MLOps & Reliable AI Systems'
];

export default function SkillsSection() {
  return (
    <section id="skills" className="mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-red-500 font-mono text-[10px] uppercase tracking-[0.25em] block mb-1">Core Competencies &amp; Stack</span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest">Technical Skills &amp; Research Domains</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span>Applied Deep Learning &amp; MLOps</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Categorized Skills & Research Domains */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Skill Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {skillCategories.map((cat) => (
              <div 
                key={cat.title} 
                className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 rounded-sm hover:border-red-600/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full border border-red-600/30 bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">{cat.title}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {cat.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 bg-[#121212] border border-white/10 text-[10px] font-mono text-gray-300 rounded hover:border-red-500/50 hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Research Domains Box */}
          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 md:p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Sparkles className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">14 Research Interests &amp; Domains</h3>
                <p className="text-[10px] font-mono text-gray-400">Core areas of academic investigation and patented innovations</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {researchDomains.map((domain) => (
                <span 
                  key={domain}
                  className="px-2.5 sm:px-3 py-1.5 bg-[#141414] border border-red-900/30 hover:border-red-600/60 text-xs font-mono text-gray-300 hover:text-white rounded-sm transition-all cursor-default flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quote Block & Methodology */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Red Quote Block */}
          <div className="bg-[#900000] p-6 sm:p-8 md:p-10 rounded-sm flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <span className="font-bebas text-6xl sm:text-7xl text-[#500000] leading-none opacity-60 block mb-2">“</span>
              <p className="text-lg sm:text-xl md:text-2xl font-medium leading-snug mb-6 tracking-wide">
                Trustworthy AI is not solely about benchmark scores; it demands cryptographic provenance, explainability, and safety across human-AI systems.
              </p>
              <p className="font-signature text-3xl sm:text-4xl text-white transform -rotate-2">
                Rayban Pranav Mahesh
              </p>
            </div>

            <div className="mt-8 sm:mt-12 border-t border-white/20 pt-4 sm:pt-6 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
              <span>Deep Learning · VIT '27</span>
              <span className="text-xl font-light">+</span>
            </div>
          </div>

          {/* Research Philosophy card */}
          <div className="bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 rounded-sm font-mono text-xs">
            <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase tracking-widest text-[10px]">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Research Philosophy</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Bridging the gap between theoretical deep learning architectures and production-grade MLOps pipelines with reproducible zero-trust validation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
