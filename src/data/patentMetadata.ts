export interface PatentSEORecord {
  id: string;
  slug: string;
  title: string;
  appNo: string;
  publicationNo: string;
  journalNo?: string;
  filingDate: string; // YYYY-MM-DD
  publicationDate: string; // YYYY-MM-DD
  inventors: string[];
  assignee: string;
  abstract: string;
  keywords: string[];
  canonicalPath: string;
  pdfUrl?: string;
  imageUrl?: string;
  ipcClasses?: string[];
}

export const ALL_PATENTS_METADATA: PatentSEORecord[] = [
  {
    id: 'patent-01',
    slug: 'crowd-chaos-detection',
    title: 'Crowd Chaos Detection System for Crowd Safety Management Using Audio-Visual Signal',
    appNo: '202541103106',
    publicationNo: 'IN202541103106 A1',
    filingDate: '2025-10-26',
    publicationDate: '2025-11-28',
    inventors: ['Dr. Padma Priya R', 'Rayban Pranav Mahesh', 'Divyam Goel', 'Tanisha Bagga'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'An automated multi-modal safety system combining real-time YOLO computer vision, facial emotion detection CNNs, and acoustic spectrogram intensity analysis to detect crowd chaos, panic stampedes, and public safety hazards with autonomous alert triggering.',
    keywords: ['Crowd Chaos Detection', 'Crowd Safety Management', 'Audio-Visual Fusion', 'Computer Vision Stampede Prevention', 'YOLO Object Detection', 'Facial Emotion CNN', 'Acoustic Hazard Detection', 'Indian Patent 202541103106'],
    canonicalPath: '#/patent/crowd-chaos-detection',
    pdfUrl: '/patent-assets/Crowd%20Chaos%20Detection%20System%20for%20Crowd%20Safety%20Management%20Using%20Audio-Visual%20Signal.pdf',
    imageUrl: '/patent-assets/fig1_system_architecture.png',
    ipcClasses: ['G08B 21/02', 'G06V 40/16', 'G10L 25/51']
  },
  {
    id: 'patent-02',
    slug: 'geo-medicinal-intelligence',
    title: 'Geo-Medicinal Intelligence System for Phytochemical Prediction and Personalized Plant Recommendation',
    appNo: '202641059395',
    publicationNo: 'IN202641059395 A1',
    filingDate: '2026-05-10',
    publicationDate: '2026-05-22',
    inventors: ['Dr. Jaishree Jaikrishnan', 'Rayban Pranav Mahesh', 'Ajitesh Sharma', 'Vyom Sen'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A geo-medicinal artificial intelligence system utilizing Gaussian Process spatial regression, Bayesian Neural Networks with Monte Carlo dropout, and Graph Neural Networks to predict regional botanical phytochemical potency and generate personalized botanical recommendations.',
    keywords: ['Geo-Medicinal Intelligence', 'Phytochemical Potency Prediction', 'Botanical Recommendation System', 'Gaussian Process Spatial Regression', 'Bayesian Neural Networks', 'Graph Neural Networks Herb-Drug Interaction', 'Indian Patent 202641059395'],
    canonicalPath: '#/patent/geo-medicinal-intelligence',
    pdfUrl: '/patent-assets/patent2/Geo-medicinal%20intelligence%20system%20for%20phytochemical%20prediction%20and%20personalized%20plant.pdf',
    imageUrl: '/patent-assets/patent2/fig1_integrated_pipeline.png',
    ipcClasses: ['G16H 20/10', 'G16H 50/70', 'G06N 3/08']
  },
  {
    id: 'patent-03',
    slug: 'lip-sync-authenticity',
    title: 'System for Lip-Sync Authenticity Detection Using Spatial, Spectral, and Deep-Learning Based Feature Fusion',
    appNo: '202541131828',
    publicationNo: 'IN202541131828 A1',
    journalNo: '01/2026',
    filingDate: '2025-12-25',
    publicationDate: '2026-01-02',
    inventors: ['Dr. Jaishree Jaikrishnan', 'Rayban Pranav Mahesh', 'Aarya Ashish Nagvekar', 'Ajitesh Sharma'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A deepfake forensics system combining spatial facial landmark tracking, 2D FFT spectral anomaly analysis, and deep-learning spatio-temporal fusion to uncover synthetic lip-sync manipulation and voice-dubbing deepfakes in video streams.',
    keywords: ['Lip-Sync Authenticity Detection', 'Deepfake Forensics', 'Spatial Spectral Fusion', 'Facial Landmark Tracking', 'FFT Spectral Anomalies', 'Synthetic Media Detection', 'Indian Patent 202541131828'],
    canonicalPath: '#/patent/lip-sync-authenticity',
    pdfUrl: '/patent-assets/lip-sync-detection/Official_Gazette_Patent_202541131828.pdf',
    imageUrl: '/patent-assets/lip-sync-detection/fig1_system_architecture.jpeg',
    ipcClasses: ['G06V 40/16', 'G06V 20/40', 'G10L 25/78']
  },
  {
    id: 'patent-04',
    slug: 'network-spoofing',
    title: 'AI-Based Multi-Layer Spoofing Detection and Response System for Real-Time Network Security',
    appNo: '202641054502',
    publicationNo: 'IN202641054502 A1',
    journalNo: '20/2026',
    filingDate: '2026-04-29',
    publicationDate: '2026-05-15',
    inventors: ['Dr. Nupur Manasi', 'Karishma Rahaman', 'Marmik Pradip Kaila', 'Rayban Pranav Mahesh'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A multi-tier zero-trust network cybersecurity system leveraging deep autoencoders, LSTM temporal behavioral anomaly tracking, and Deep Q-Network (DQN) reinforcement learning agents for autonomous real-time spoofing mitigation.',
    keywords: ['Multi-Layer Spoofing Detection', 'Network Security AI', 'Zero Trust Architecture', 'Deep Q-Network Autonomous Defense', 'LSTM Temporal Anomaly Tracking', 'Autoencoder Intrusion Detection', 'Indian Patent 202641054502'],
    canonicalPath: '#/patent/network-spoofing',
    pdfUrl: '/patent-assets/network-spoofing-detection/Official_Gazette_Patent_202641054502.pdf',
    imageUrl: '/patent-assets/network-spoofing-detection/fig1_summary_dashboard.png',
    ipcClasses: ['H04L 9/40', 'G06N 3/04', 'G06F 21/55']
  },
  {
    id: 'patent-05',
    slug: 'hindi-english-communication',
    title: 'A Real-Time Multimodal System for Adaptive Emotion-Aware Hindi-English Communication',
    appNo: '202641033897',
    publicationNo: 'IN202641033897 A1',
    journalNo: '13/2026',
    filingDate: '2026-03-20',
    publicationDate: '2026-03-27',
    inventors: ['Dr. Nupur Manasi', 'Mrinali Charhate', 'Rayban Pranav Mahesh', 'Ashish Anil Sikaria'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A real-time cross-lingual bilingual translation system integrating YOLOv10 facial emotion recognition, acoustic prosodic sentiment modeling, and dynamic cross-modal attention to synchronize affective valence during Hindi-English speech communication.',
    keywords: ['Emotion-Aware Hindi-English Communication', 'Multimodal Machine Translation', 'Bilingual Cross-Lingual Synchronization', 'YOLOv10 Facial Emotion Analysis', 'Acoustic Prosody Sentiment', 'Indian Patent 202641033897'],
    canonicalPath: '#/patent/hindi-english-communication',
    pdfUrl: '/patent-assets/multimodal-hindi-english/Official_Gazette_Patent_202641033897.pdf',
    imageUrl: '/patent-assets/multimodal-hindi-english/fig1_system_architecture.png',
    ipcClasses: ['G06F 40/58', 'G10L 15/22', 'G06V 40/16']
  },
  {
    id: 'patent-06',
    slug: 'expense-settlement',
    title: 'Multi-Party Expense Settlement System with Graph-Based Optimization',
    appNo: '202641068108',
    publicationNo: 'IN202641068108 A1',
    filingDate: '2026-05-30',
    publicationDate: '2026-05-30',
    inventors: ['Dr. Santhi K', 'Rayban Pranav Mahesh'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A graph-theoretic peer-to-peer expense settlement engine that models financial debt relationships as directed acyclic network graphs, applying min-cost flow algorithms to minimize the total volume of transactions across multi-party groups.',
    keywords: ['Multi-Party Expense Settlement', 'Graph-Based Optimization', 'Min-Cost Flow Algorithm', 'Debt Simplification Engine', 'Financial Technology Algorithms', 'Indian Patent 202641068108'],
    canonicalPath: '#patents',
    ipcClasses: ['G06Q 20/10', 'G06Q 40/02', 'G06F 17/10']
  },
  {
    id: 'patent-07',
    slug: 'dataset-validation',
    title: 'A System for Trust-Based Autonomous Dataset Validation and Integrity Assurance in Artificial Intelligence',
    appNo: '202641062186',
    publicationNo: 'IN202641062186 A1',
    filingDate: '2026-05-15',
    publicationDate: '2026-05-29',
    inventors: ['Dr. Santhi K', 'Rayban Pranav Mahesh'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'An autonomous dataset verification and cryptographic proof framework that certifies data provenance, detects adversarial feature poisoning, and ensures statistical integrity prior to model training in machine learning workflows.',
    keywords: ['Autonomous Dataset Validation', 'AI Data Integrity Assurance', 'Adversarial Data Poisoning Detection', 'Cryptographic Proof of Provenance', 'Machine Learning Trust Architecture', 'Indian Patent 202641062186'],
    canonicalPath: '#patents',
    ipcClasses: ['G06N 20/00', 'G06F 21/64', 'G06F 16/215']
  },
  {
    id: 'patent-08',
    slug: 'behavioral-verification-agents',
    title: 'System and Method for Runtime Behavioral Verification and Permission Enforcement in Autonomous Artificial Intelligence Agents',
    appNo: '202641097130',
    publicationNo: 'IN202641097130 A1',
    filingDate: '2026-08-11',
    publicationDate: '2026-08-14',
    inventors: ['Dr. Santhi K', 'Rayban Pranav Mahesh'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A deterministic runtime containment architecture and formal verification sandbox that intercepts autonomous agent tool calls, executes semantic policy audits, and prevents hallucinated or malicious privilege escalation in real time.',
    keywords: ['AI Agent Runtime Verification', 'Autonomous Agent Governance', 'Permission Enforcement AI', 'Tool Interception Sandbox', 'Agent Containment Security', 'Indian Patent 202641097130'],
    canonicalPath: '#patents',
    ipcClasses: ['G06F 21/53', 'G06N 5/02', 'G06F 21/57']
  },
  {
    id: 'patent-09',
    slug: 'audio-deepfake',
    title: 'Multi-Domain Feature Fusion Based Deep Learning System for Audio Deepfake Detection',
    appNo: '202641027783',
    publicationNo: 'IN202641027783 A1',
    journalNo: '12/2026',
    filingDate: '2026-03-09',
    publicationDate: '2026-03-20',
    inventors: ['Dr. Mohanasundaram R', 'Rayban Pranav Mahesh', 'Ajitesh Sharma', 'Hansaj Patidar'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'An audio forensic classification system extracting spectral LFCC/CQCC features, phase coherence metrics, and wav2vec 2.0 representations, fused via cross-branch multi-head self-attention to achieve 99.5% accuracy in synthetic voice discrimination.',
    keywords: ['Audio Deepfake Detection', 'Multi-Domain Feature Fusion', 'Synthetic Voice Forensics', 'LFCC CQCC Feature Extraction', 'wav2vec 2.0 Forensics', 'Cross-Branch Self-Attention', 'Indian Patent 202641027783'],
    canonicalPath: '#/patent/audio-deepfake',
    pdfUrl: '/patent-assets/audio-deepfake/Official_Gazette_Patent_202641027783.pdf',
    imageUrl: '/patent-assets/audio-deepfake/fig1_overall_system_architecture.png',
    ipcClasses: ['G10L 25/78', 'G10L 17/02', 'G06N 3/08']
  },
  {
    id: 'patent-10',
    slug: 'location-service',
    title: 'Location-Filtered Service Platform with Bidirectional Rating and Image Verification',
    appNo: '202641027808',
    publicationNo: 'IN202641027808 A1',
    journalNo: '12/2026',
    filingDate: '2026-03-09',
    publicationDate: '2026-03-20',
    inventors: ['Dr. Mohanasundaram R', 'Rayban Pranav Mahesh', 'Harsh Anand', 'Rishabh Vyas', 'Suraj Jha'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A geospatial service marketplace engine featuring client-worker boundary filtering, dual-layer live camera visual authentication against government eKYC records, cryptographic completion handshake, and symmetric 3-metric mutual rating rubrics.',
    keywords: ['Location-Filtered Service Platform', 'Bidirectional Rating Engine', 'Visual Identity Verification', 'Aadhaar eKYC Verification', 'Geospatial Discovery Marketplace', 'Indian Patent 202641027808'],
    canonicalPath: '#/patent/location-service',
    pdfUrl: '/patent-assets/location-service/Official_Gazette_Patent_202641027808.pdf',
    imageUrl: '/patent-assets/location-service/fig5_system_architecture_layered.png',
    ipcClasses: ['G06Q 10/06', 'G06Q 10/10', 'G06K 9/00']
  },
  {
    id: 'patent-11',
    slug: 'bot-detection',
    title: 'Multi-Modal Behavioral Biometrics and Ensemble Learning Framework for Bot Detection in Online Transaction Systems',
    appNo: '202641027867',
    publicationNo: 'IN202641027867 A1',
    journalNo: '12/2026',
    filingDate: '2026-03-10',
    publicationDate: '2026-03-20',
    inventors: ['Dr. Anusha N', 'Sawant Jiya Pradeep', 'Dwarakadhish Vinod Patil', 'Rayban Pranav Mahesh', 'Kunal Shivraj Bhosale'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A continuous authentication and anti-bot defense framework combining keystroke dynamics, pointer trajectory physics, and an ensemble XGBoost/Random Forest classifier to prevent fraudulent automated transactions.',
    keywords: ['Behavioral Biometrics Bot Detection', 'Keystroke Dynamics Fraud Detection', 'Pointer Trajectory Physics', 'Transaction Security Machine Learning', 'Indian Patent 202641027867'],
    canonicalPath: '#patents',
    ipcClasses: ['G06F 21/55', 'G06N 20/20', 'G06Q 20/40']
  },
  {
    id: 'patent-12',
    slug: 'geo-block-generation',
    title: 'System and Method for Density-Adaptive Geo-Block Generation with Non-Competitive Business Synergy Scoring and Bundle Recommendation',
    appNo: '202641027870',
    publicationNo: 'IN202641027870 A1',
    journalNo: '12/2026',
    filingDate: '2026-03-10',
    publicationDate: '2026-03-20',
    inventors: ['Dr. Monash P', 'Samyak Nitesh Chhajed', 'Rayban Pranav Mahesh', 'Madhav Juneja'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A spatial clustering engine partitioning commercial districts into dynamic Voronoi geo-blocks, utilizing bipartite matching to formulate non-competitive merchant synergy bundles and localized coupon incentives.',
    keywords: ['Density-Adaptive Geo-Block Generation', 'Commercial Synergy Scoring', 'Voronoi Spatial Clustering', 'Bundle Recommendation Engine', 'Indian Patent 202641027870'],
    canonicalPath: '#patents',
    ipcClasses: ['G06Q 30/02', 'G06F 16/29', 'G06Q 10/04']
  },
  {
    id: 'patent-13',
    slug: 'emotion-adaptive-ai',
    title: 'Emotion-Adaptive Artificial Intelligence Interaction System with Multimodal Fusion and Temporal Dynamics Modeling',
    appNo: '202641027891',
    publicationNo: 'IN202641027891 A1',
    journalNo: '12/2026',
    filingDate: '2026-03-10',
    publicationDate: '2026-03-20',
    inventors: ['Dr. Pushpa Gothwal', 'Rayban Pranav Mahesh', 'Tanisha Bagga', 'Udbhav Makkar', 'Divyam Goel', 'Pranjal Bajwa'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'An interactive conversational intelligence platform combining transformer conversational state tracking with continuous valence-arousal emotional tracking to modulate response tone, empathy levels, and pacing in real-time dialog.',
    keywords: ['Emotion-Adaptive AI Interaction', 'Temporal Affective Dynamics', 'Multimodal Sentiment Modeling', 'Conversational State Tracking', 'Empathic Human-AI Dialog', 'Indian Patent 202641027891'],
    canonicalPath: '#patents',
    ipcClasses: ['G06N 3/00', 'G10L 15/22', 'G06F 40/35']
  },
  {
    id: 'patent-14',
    slug: 'alzheimers-mri',
    title: 'System for MRI-Based Alzheimer’s Severity Grading, Clinical Consistency Validation, Progression Forecasting, and Method Thereof',
    appNo: '202641103606',
    publicationNo: 'IN202641103606 A1',
    journalNo: '36/2026',
    filingDate: '2026-08-27',
    publicationDate: '2026-09-04',
    inventors: ['Dr. Jaishree Jaikrishnan', 'Rayban Pranav Mahesh'],
    assignee: 'Vellore Institute of Technology',
    abstract: 'A clinical neuroimaging intelligence system utilizing DenseNet-121 with spatial attention for 4-class Alzheimer dementia grading (98.9% accuracy), combined with Grad-CAM explainability heatmaps, clinical score consistency checks, and multi-year progression forecasting.',
    keywords: ['Alzheimer Severity Grading', 'MRI Neuroimaging AI', 'DenseNet-121 Attention', 'Grad-CAM Explainable AI', 'Dementia Progression Forecasting', 'Clinical Decision Support', 'Indian Patent 202641103606'],
    canonicalPath: '#/patent/alzheimers-mri',
    pdfUrl: '/patent-assets/alzheimers-mri/Official_Gazette_Patent_202641103606.pdf',
    imageUrl: '/patent-assets/alzheimers-mri/fig_8_1_gradcam_heatmaps.png',
    ipcClasses: ['G16H 30/40', 'G16H 50/20', 'G06V 10/764']
  }
];

export const getPatentBySlug = (slug: string): PatentSEORecord | undefined => {
  return ALL_PATENTS_METADATA.find((p) => p.slug === slug || p.appNo === slug);
};
