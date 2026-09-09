import React, { useState, useId } from 'react';
import { 
  ArrowLeft, Award, CheckCircle2, AlertTriangle, Eye, Cpu, Sliders, Maximize2, X,
  Users, Building, Calendar, Layers, Activity, Zap, Copy, Check, ExternalLink,
  ShieldCheck, Brain, LineChart, FileText, Database, GitBranch,
  Search, ShieldAlert, Sparkles, Stethoscope, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatentSEO } from '../hooks/usePatentSEO';
import { getPatentBySlug } from '../data/patentMetadata';

interface AlzheimersPatentPageProps {
  onBack: () => void;
}

interface ModalImage {
  src: string;
  title: string;
  caption: string;
  badge?: string;
}

export default function AlzheimersPatentPage({ onBack }: AlzheimersPatentPageProps) {
  // Dynamic SEO meta tags, Google Scholar citation tags, OpenGraph & Schema.org JSON-LD
  usePatentSEO(getPatentBySlug('alzheimers-mri')!);

  // Lightbox modal state
  const [activeImage, setActiveImage] = useState<ModalImage | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'all' | 'architecture' | 'samples' | 'benchmarks'>('all');

  // Simulator IDs for accessibility
  const presetSelectId = useId();
  const ageId = useId();
  const mmseId = useId();
  const cdrId = useId();
  const apoeId = useId();
  const atrophyId = useId();
  const mtaId = useId();

  // Preset clinical scenarios
  type PresetKey = 'healthy_aging' | 'early_mci' | 'mild_ad' | 'moderate_ad' | 'discordant_borderline';

  const [activePreset, setActivePreset] = useState<PresetKey>('early_mci');
  const [simAge, setSimAge] = useState<number>(72);
  const [simMmse, setSimMmse] = useState<number>(26); // 0 to 30
  const [simCdr, setSimCdr] = useState<number>(0.5); // 0, 0.5, 1.0, 2.0
  const [simApoe, setSimApoe] = useState<'negative' | 'heterozygous' | 'homozygous'>('heterozygous');
  const [simAtrophy, setSimAtrophy] = useState<number>(18); // Hippocampal Volume Loss % (0 - 60)
  const [simMta, setSimMta] = useState<number>(1); // Medial Temporal Atrophy scale (0 - 4)

  const presets: Record<PresetKey, {
    name: string;
    clinicalContext: string;
    age: number;
    mmse: number;
    cdr: number;
    apoe: 'negative' | 'heterozygous' | 'homozygous';
    atrophy: number;
    mta: number;
    description: string;
  }> = {
    healthy_aging: {
      name: 'Healthy Cognitive Aging (Control)',
      clinicalContext: 'Asymptomatic Senior Checkup (Normal Cognition)',
      age: 68,
      mmse: 29,
      cdr: 0.0,
      apoe: 'negative',
      atrophy: 3,
      mta: 0,
      description: 'Preserved cortical thickness, minimal ventriculomegaly, intact hippocampal volume. Staging classifies as Non-Demented with high concordance.'
    },
    early_mci: {
      name: 'Amnestic MCI / Very Mild Impairment',
      clinicalContext: 'Memory Clinic Consultation (Subjective Cognitive Decline)',
      age: 72,
      mmse: 26,
      cdr: 0.5,
      apoe: 'heterozygous',
      atrophy: 18,
      mta: 1,
      description: 'Subtle entorhinal volume reduction and minimal sulcal widening. Requires sensitivity in distinguishing normal aging from prodromal neurodegeneration.'
    },
    mild_ad: {
      name: 'Clinically Manifest Mild Alzheimer’s',
      clinicalContext: 'Geriatric Neurology Evaluation (Definite Impairment)',
      age: 76,
      mmse: 20,
      cdr: 1.0,
      apoe: 'heterozygous',
      atrophy: 34,
      mta: 2,
      description: 'Marked medial temporal atrophy, widened Sylvian fissures, and prominent hippocampal shrinkage. Staging indicates Mildly Demented.'
    },
    moderate_ad: {
      name: 'Advanced Moderate Dementia Stage',
      clinicalContext: 'Tertiary Care Neurodegenerative Center (Severe Functional Loss)',
      age: 81,
      mmse: 12,
      cdr: 2.0,
      apoe: 'homozygous',
      atrophy: 52,
      mta: 4,
      description: 'Profound diffuse cerebral atrophy, severe ventricular enlargement, and extensive bilateral hippocampal loss. Classified Moderately Demented (F1: 0.997).'
    },
    discordant_borderline: {
      name: 'Discordant Clinical-Biomarker Outlier',
      clinicalContext: 'Atypical Neuroimaging / Biomarker Discordance Case',
      age: 64,
      mmse: 28,
      cdr: 0.0,
      apoe: 'negative',
      atrophy: 32, // Structural atrophy discrepancy
      mta: 2,
      description: 'High cognitive reserve preserves MMSE (28) despite prominent structural MRI atrophy. The Clinical Consistency Validation Engine detects discordance (CCS < 60) and raises an alert.'
    }
  };

  const handleApplyPreset = (key: PresetKey) => {
    setActivePreset(key);
    const p = presets[key];
    setSimAge(p.age);
    setSimMmse(p.mmse);
    setSimCdr(p.cdr);
    setSimApoe(p.apoe);
    setSimAtrophy(p.atrophy);
    setSimMta(p.mta);
  };

  // Compute live NeuroTwin-X outputs
  // 1. Structural MRI Severity Probability Distribution
  const computeStaging = () => {
    // Composite severity score driven by hippocampal atrophy and MTA score
    const structuralScore = (simAtrophy / 60) * 0.7 + (simMta / 4) * 0.3;
    
    // Compute unnormalized scores for 4 classes
    // Non-Demented (0), Very Mild (1), Mild (2), Moderate (3)
    let p0 = Math.max(0.01, 1.0 - structuralScore * 2.5);
    let p1 = Math.max(0.01, 1.0 - Math.abs(structuralScore - 0.32) * 3.2);
    let p2 = Math.max(0.01, 1.0 - Math.abs(structuralScore - 0.65) * 3.0);
    let p3 = Math.max(0.01, (structuralScore - 0.45) * 2.8);

    if (structuralScore < 0.15) { p0 = 0.88; p1 = 0.09; p2 = 0.02; p3 = 0.01; }
    else if (structuralScore > 0.8) { p0 = 0.005; p1 = 0.025; p2 = 0.07; p3 = 0.90; }

    const sum = p0 + p1 + p2 + p3;
    const normP0 = p0 / sum;
    const normP1 = p1 / sum;
    const normP2 = p2 / sum;
    const normP3 = p3 / sum;

    const probs = [
      { stage: 'Non-Demented', prob: normP0, id: 0 },
      { stage: 'Very Mildly Demented', prob: normP1, id: 1 },
      { stage: 'Mildly Demented', prob: normP2, id: 2 },
      { stage: 'Moderately Demented', prob: normP3, id: 3 }
    ];

    probs.sort((a, b) => b.prob - a.prob);
    const dominant = probs[0];

    // Uncertainty and Confidence
    // Shannon entropy normalized across 4 classes
    const entropy = -(normP0 * Math.log2(normP0 + 1e-9) + normP1 * Math.log2(normP1 + 1e-9) + normP2 * Math.log2(normP2 + 1e-9) + normP3 * Math.log2(normP3 + 1e-9)) / 2.0;
    const confidencePct = Math.min(99.4, Math.max(51.0, dominant.prob * 100));

    // Reliability Band
    let reliability: 'High' | 'Medium' | 'Low' = 'High';
    if (confidencePct < 70) reliability = 'Low';
    else if (confidencePct < 85) reliability = 'Medium';

    const escalationProtocol = confidencePct < 75;

    // 2. Clinical Consistency Scoring (Claim 4)
    // Compare dominant MRI stage with expected MMSE and CDR profile
    // Expected ranges:
    // Non-Demented: MMSE >= 28, CDR 0.0
    // Very Mild: MMSE 24-27, CDR 0.5
    // Mild: MMSE 18-23, CDR 1.0
    // Moderate: MMSE < 18, CDR >= 2.0
    let mmseConcordance = 0;
    if (dominant.id === 0 && simMmse >= 27) mmseConcordance = 1;
    else if (dominant.id === 1 && simMmse >= 23 && simMmse <= 28) mmseConcordance = 1;
    else if (dominant.id === 2 && simMmse >= 16 && simMmse <= 24) mmseConcordance = 1;
    else if (dominant.id === 3 && simMmse <= 18) mmseConcordance = 1;

    let cdrConcordance = 0;
    if (dominant.id === 0 && simCdr === 0.0) cdrConcordance = 1;
    else if (dominant.id === 1 && simCdr === 0.5) cdrConcordance = 1;
    else if (dominant.id === 2 && simCdr === 1.0) cdrConcordance = 1;
    else if (dominant.id === 3 && simCdr >= 2.0) cdrConcordance = 1;

    let apoeConcordance = 1;
    if (dominant.id >= 2 && simApoe === 'negative') apoeConcordance = 0.5;
    if (dominant.id === 0 && simApoe === 'homozygous') apoeConcordance = 0.5;

    let ageConcordance = 1;
    if (dominant.id >= 2 && simAge < 60) ageConcordance = 0.6;

    // Weighted Clinical Consistency Score (normalized 0 to 100)
    const rawCcs = (mmseConcordance * 35) + (cdrConcordance * 35) + (apoeConcordance * 15) + (ageConcordance * 15);
    const ccs = Math.round(rawCcs);
    const discordanceAlert = ccs < 60;

    // 3. Adaptive Explainability Selection (Claim 5)
    let selectedXai = 'Gradient-Weighted Spatial Attribution (Grad-CAM)';
    let xaiCode = 'Grad-CAM';
    let xaiRationale = 'High-confidence prediction (≥85%): Standard gradient activation mapping isolates salient anatomical atrophy foci.';
    if (confidencePct < 70) {
      selectedXai = 'Layer-Wise Composite Attribution (Integrated Gradients)';
      xaiCode = 'Composite';
      xaiRationale = 'Low-confidence prediction (<70%): Multi-layer path integration aggregates cross-strata features to diagnose boundary ambiguity.';
    } else if (confidencePct < 85) {
      selectedXai = 'Score-Based Activation Attribution (Score-CAM)';
      xaiCode = 'Score-CAM';
      xaiRationale = 'Moderate-confidence prediction (70%–85%): Perturbation-driven score attribution eliminates noisy gradient artefacts.';
    }

    // 4. Disease Progression Forecasting (Claim 6 & Claim 10)
    // 6-Month Horizon stage transition risk score
    const apoeMultiplier = simApoe === 'homozygous' ? 1.45 : simApoe === 'heterozygous' ? 1.2 : 1.0;
    const baseTransitionRisk = dominant.id === 0 ? 0.08 : dominant.id === 1 ? 0.28 : dominant.id === 2 ? 0.42 : 0.05;
    const transitionRiskPct = Math.min(94.0, Math.round(baseTransitionRisk * apoeMultiplier * (1 + (simAge - 65) * 0.015) * 100));

    // Next stage probabilities at 6 months
    let futureP0 = normP0;
    let futureP1 = normP1;
    let futureP2 = normP2;
    let futureP3 = normP3;

    if (dominant.id === 0) {
      futureP0 = Math.max(0.70, normP0 - (transitionRiskPct / 100) * 0.3);
      futureP1 = normP1 + (transitionRiskPct / 100) * 0.25;
      futureP2 = normP2 + 0.04;
      futureP3 = 0.01;
    } else if (dominant.id === 1) {
      futureP0 = Math.max(0.05, normP0 - 0.05);
      futureP1 = Math.max(0.40, normP1 - (transitionRiskPct / 100) * 0.4);
      futureP2 = normP2 + (transitionRiskPct / 100) * 0.35;
      futureP3 = normP3 + 0.08;
    } else if (dominant.id === 2) {
      futureP0 = 0.01;
      futureP1 = Math.max(0.04, normP1 - 0.05);
      futureP2 = Math.max(0.45, normP2 - (transitionRiskPct / 100) * 0.4);
      futureP3 = normP3 + (transitionRiskPct / 100) * 0.4;
    } else {
      futureP0 = 0.001;
      futureP1 = 0.01;
      futureP2 = 0.04;
      futureP3 = 0.949;
    }

    const futureSum = futureP0 + futureP1 + futureP2 + futureP3;

    return {
      distribution: {
        nonDemented: Math.round(normP0 * 100),
        veryMild: Math.round(normP1 * 100),
        mild: Math.round(normP2 * 100),
        moderate: Math.round(normP3 * 100)
      },
      dominantStage: dominant.stage,
      dominantId: dominant.id,
      confidence: confidencePct.toFixed(1),
      entropy: entropy.toFixed(3),
      reliability,
      escalationProtocol,
      ccs,
      discordanceAlert,
      concordanceDetails: {
        mmse: mmseConcordance === 1,
        cdr: cdrConcordance === 1,
        apoe: apoeConcordance >= 0.8,
        age: ageConcordance >= 0.8
      },
      selectedXai,
      xaiCode,
      xaiRationale,
      transitionRiskPct,
      futureDistribution: {
        nonDemented: Math.round((futureP0 / futureSum) * 100),
        veryMild: Math.round((futureP1 / futureSum) * 100),
        mild: Math.round((futureP2 / futureSum) * 100),
        moderate: Math.round((futureP3 / futureSum) * 100)
      }
    };
  };

  const simResult = computeStaging();

  // Gallery items for lightbox
  const galleryItems = [
    {
      id: 'arch',
      category: 'architecture',
      title: 'Figure 7.1: NeuroTwin-X Modular Clinical Architecture',
      caption: 'Seven-layer modular clinical pipeline: (1) MRI Acquisition & DICOM Ingestion, (2) Deep Neuroimaging Feature Encoder, (3) Severity Staging Engine, (4) Uncertainty, Consistency & Progression Engines, (5) Adaptive Explainability Manager, (6) Patient-Specific Predictive NeuroTwin, and (7) Clinician Decision Interface.',
      src: '/patent-assets/alzheimers-mri/fig_7_1_neurotwin_clinical_architecture.jpg',
      badge: 'Core Architecture'
    },
    {
      id: 'pipeline',
      category: 'architecture',
      title: 'Figure 7.2: End-to-End Clinical Processing Pipeline',
      caption: 'Detailed data flow diagram illustrating ingestion of DICOM volumetric data from hospital PACS, spatial resampling to 224x224x3 tensors, two-phase domain adapted feature encoding, cross-validation with clinical biomarkers, and report generation.',
      src: '/patent-assets/alzheimers-mri/fig_7_2_end_to_end_clinical_pipeline.jpg',
      badge: 'System Pipeline'
    },
    {
      id: 'flowchart',
      category: 'architecture',
      title: 'System-Level Operating Flowchart (Section 6.1)',
      caption: 'Comprehensive execution logic showing conditional branch escalation when prediction confidence drops below clinical threshold, discordance alert handling, and patient state synchronization.',
      src: '/patent-assets/alzheimers-mri/pipeline_operating_flowchart.jpg',
      badge: 'Operating Workflow'
    },
    {
      id: 'dataset',
      category: 'benchmarks',
      title: 'Figure 7.3: Validation Benchmark Class Distribution',
      caption: 'Balanced distribution across all four clinical Alzheimer’s severity stages over the 44,000-image evaluation benchmark (Non-Demented, Very Mildly Demented, Mildly Demented, Moderately Demented).',
      src: '/patent-assets/alzheimers-mri/fig_7_3_validation_dataset_class_distribution.png',
      badge: 'Dataset Distribution'
    },
    {
      id: 'mri_non',
      category: 'samples',
      title: 'Figure 7.4a: Representative Non-Demented MRI Slices',
      caption: 'Normal brain morphology with intact cortical thickness, narrow sulci, preserved ventricular boundaries, and robust bilateral hippocampal volume.',
      src: '/patent-assets/alzheimers-mri/fig_7_4a_non_demented_mri_samples.jpg',
      badge: 'Non-Demented'
    },
    {
      id: 'mri_very_mild',
      category: 'samples',
      title: 'Figure 7.4b: Representative Very Mildly Demented MRI Slices',
      caption: 'Subtle early-stage structural manifestations showing early entorhinal cortical thinning and minimal lateral ventricular horn dilation. Early prodromal biomarker signature.',
      src: '/patent-assets/alzheimers-mri/fig_7_4b_very_mildly_demented_mri_samples.jpg',
      badge: 'Very Mildly Demented'
    },
    {
      id: 'mri_mild',
      category: 'samples',
      title: 'Figure 7.4c: Representative Mildly Demented MRI Slices',
      caption: 'Moderate cortical atrophy with widened cortical sulci, expanded Sylvian fissures, and distinct bilateral medial temporal lobe atrophy (MTA Grade 2–3).',
      src: '/patent-assets/alzheimers-mri/fig_7_4c_mildly_demented_mri_samples.jpg',
      badge: 'Mildly Demented'
    },
    {
      id: 'mri_moderate',
      category: 'samples',
      title: 'Figure 7.4d: Representative Moderately Demented MRI Slices',
      caption: 'Advanced neurodegeneration exhibiting severe ventricular enlargement (hydrocephalus ex vacuo), profound hippocampal shrinkage, and widespread cortical thinning.',
      src: '/patent-assets/alzheimers-mri/fig_7_4d_moderately_demented_mri_samples.jpg',
      badge: 'Moderately Demented'
    },
    {
      id: 'xai_maps',
      category: 'architecture',
      title: 'Figure 7.6: Adaptive Explainability Attribution Maps',
      caption: 'Gradient-weighted spatial attribution heatmaps overlaid on structural brain MRI slices, highlighting specific diagnostic attention localized to the hippocampal formation and medial temporal lobe.',
      src: '/patent-assets/alzheimers-mri/fig_7_6_adaptive_explainability_maps.jpg',
      badge: 'Adaptive Explainability'
    },
    {
      id: 'loss_curve',
      category: 'benchmarks',
      title: 'Figure 8.1a: Two-Phase Training & Validation Loss',
      caption: 'Convergence trajectory demonstrating rapid stabilization in Phase 1 (frozen encoder, classification head training) followed by substantial loss reduction in Phase 2 (selective domain adaptation with frozen normalization layers).',
      src: '/patent-assets/alzheimers-mri/fig_8_1a_training_validation_loss.png',
      badge: 'Loss Curves'
    },
    {
      id: 'acc_curve',
      category: 'benchmarks',
      title: 'Figure 8.1b: Training & Validation Accuracy Curves',
      caption: 'Validation accuracy across epochs reaching final validated test accuracy of 78.82% on the 6,601 holdout test partition.',
      src: '/patent-assets/alzheimers-mri/fig_8_1b_training_validation_accuracy.png',
      badge: 'Accuracy Curves'
    },
    {
      id: 'per_class_bar',
      category: 'benchmarks',
      title: 'Figure 8.3: Per-Class Staging Performance Metrics',
      caption: 'Precision, recall, and F1-score breakdown across the four classes. Moderately Demented achieves near-perfect F1 (0.997), while Very Mildly Demented demonstrates 0.601 F1.',
      src: '/patent-assets/alzheimers-mri/fig_8_3_per_class_staging_performance.png',
      badge: 'Per-Class Metrics'
    },
    {
      id: 'confusion_matrix',
      category: 'benchmarks',
      title: 'Figure 8.4: 4x4 Confusion Matrix (6,601 Test Scans)',
      caption: 'Empirical classification matrix demonstrating strong diagonal dominance. Most frequent clinical ambiguity occurs along the Non-Demented vs. Very Mild boundary, which the Clinical Consistency Validation Engine specifically addresses.',
      src: '/patent-assets/alzheimers-mri/fig_8_4_confusion_matrix_6601_images.png',
      badge: 'Confusion Matrix'
    },
    {
      id: 'roc_auc',
      category: 'benchmarks',
      title: 'Figure 8.5: Multi-Class ROC-AUC Curves (One-vs-Rest)',
      caption: 'Receiver operating characteristic curves confirming AUC > 0.90 across all four severity classes, with Moderately Demented achieving AUC ~ 1.00.',
      src: '/patent-assets/alzheimers-mri/fig_8_5_roc_auc_curves_multiclass.png',
      badge: 'ROC-AUC Curves'
    },
    {
      id: 'pr_curves',
      category: 'benchmarks',
      title: 'Figure 8.6: Precision-Recall Curves per Severity Class',
      caption: 'Precision-recall trade-off curves per clinical stage, highlighting high area under precision-recall curve for moderate and mild cases.',
      src: '/patent-assets/alzheimers-mri/fig_8_6_precision_recall_curves.png',
      badge: 'PR Curves'
    }
  ];

  const filteredGallery = selectedGalleryTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedGalleryTab);

  const bibtexCode = `@patent{IN202641103606A1,
  title     = {System for MRI-Based Alzheimer’s Severity Grading, Clinical Consistency Validation, Progression Forecasting, and Method Thereof},
  author    = {Jaikrishnan, Jaishree and Mahesh, Rayban Pranav},
  assignee  = {Vellore Institute of Technology},
  number    = {IN202641103606 A1},
  type      = {Patent Application},
  country   = {India},
  journal   = {The Patent Office Journal No. 36/2026},
  filing    = {2026-08-27},
  published = {2026-09-04},
  url       = {http://localhost:3000/patent-assets/alzheimers-mri/Official_Gazette_Patent_202641103606.pdf}
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
              <span className="text-red-400 font-bold">IN202641103606 A1</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* ONLY ONE PDF BUTTON: Official Document */}
            <a
              href="/patent-assets/alzheimers-mri/Official_Gazette_Patent_202641103606.pdf"
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
              PATENT #14 · INDIAN PATENT PUBLISHED
            </span>
            <span className="px-2.5 py-1 bg-[#121212] border border-white/10 text-gray-300 rounded-xs">
              App No: <strong className="text-white">202641103606</strong>
            </span>
            <span className="px-2.5 py-1 bg-[#121212] border border-white/10 text-gray-300 rounded-xs">
              Journal: <strong className="text-white">36/2026</strong>
            </span>
            <span className="px-2.5 py-1 bg-red-950/30 border border-red-900/40 text-red-400 font-semibold rounded-xs">
              AI in Healthcare · Neuroimaging CDSS
            </span>
          </div>

          {/* Title & Platform Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug mb-3 relative z-10">
            System for MRI-Based Alzheimer’s Severity Grading, Clinical Consistency Validation, Progression Forecasting, and Method Thereof
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-mono mb-6 relative z-10 max-w-5xl leading-relaxed">
            <span className="text-red-400 font-semibold">NeuroTwin-X:</span> A modular patient-specific predictive NeuroTwin platform for automated four-stage Alzheimer’s disease severity grading, clinical consistency validation, disease progression forecasting, and adaptive explainable neuroimaging with integrated clinical decision interface.
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/10 relative z-10 text-xs font-mono">
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-400" /> Filing Date
              </span>
              <span className="text-white font-bold">27 August 2026</span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-400" /> Published Date
              </span>
              <span className="text-red-400 font-bold">04 September 2026</span>
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
              <span className="text-gray-200 font-medium">G06Q 30/0202</span>
            </div>
            <div className="bg-[#070707] p-3 rounded-xs border border-white/5 col-span-2">
              <span className="text-gray-500 text-[10px] uppercase block mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-red-400" /> Inventors
              </span>
              <div className="text-gray-200 font-medium space-y-1">
                <div>Dr. Jaishree Jaikrishnan</div>
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
              Validated Test Accuracy
            </div>
            <div className="text-2xl font-bold text-white">78.82%</div>
            <div className="text-gray-500 text-[10px] mt-1">6,601 holdout test scans</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
              Cohen’s Kappa (κ)
            </div>
            <div className="text-2xl font-bold text-red-400">0.715</div>
            <div className="text-gray-500 text-[10px] mt-1">Substantial clinical concordance</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-red-400" />
              Moderate AD F1-Score
            </div>
            <div className="text-2xl font-bold text-white">0.997</div>
            <div className="text-gray-500 text-[10px] mt-1">Near-perfect severe detection</div>
          </div>
          <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm">
            <div className="text-gray-400 text-[11px] mb-1 flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5 text-red-400" />
              Multi-Class ROC-AUC
            </div>
            <div className="text-2xl font-bold text-white">&gt; 0.90</div>
            <div className="text-gray-500 text-[10px] mt-1">All 4 stages (Macro-OVR)</div>
          </div>
        </section>

        {/* Interactive Simulator Section */}
        <section id="simulator" className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
                <Sliders className="w-4 h-4 text-red-500" />
                Live Clinical Decision Support Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                NeuroTwin-X Staging &amp; Progression Simulator
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
                Simulate the end-to-end clinical workflow: adjust patient biomarkers, MRI anatomical atrophy metrics, and evaluate automated severity staging, uncertainty escalation, Clinical Consistency Score (CCS), adaptive XAI method selection, and 6-month disease trajectory forecasting.
              </p>
            </div>

            {/* Presets Selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <label htmlFor={presetSelectId} className="text-gray-400">Clinical Preset:</label>
              <select
                id={presetSelectId}
                value={activePreset}
                onChange={(e) => handleApplyPreset(e.target.value as PresetKey)}
                className="bg-[#121212] border border-red-900/60 text-white px-3 py-1.5 rounded-sm focus:outline-none focus:border-red-500 text-xs font-mono"
              >
                <option value="healthy_aging">Healthy Aging (Control)</option>
                <option value="early_mci">Amnestic MCI (Very Mild)</option>
                <option value="mild_ad">Mild Alzheimer’s (Definite)</option>
                <option value="moderate_ad">Moderate AD (Advanced)</option>
                <option value="discordant_borderline">Discordant Case (CCS Alert)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#070707] border border-white/5 rounded-xs text-xs font-mono text-gray-300">
            <span className="text-red-400 font-bold">{presets[activePreset].name}: </span>
            {presets[activePreset].description}
          </div>

          {/* Simulator Grid: Inputs vs Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Clinical & Imaging Controls */}
            <div className="lg:col-span-5 space-y-5 bg-[#070707] border border-white/10 p-5 rounded-xs">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-red-500" />
                Patient Biomarkers &amp; Imaging Inputs
              </h3>

              {/* Patient Age */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={ageId} className="text-gray-300">Patient Age (Years):</label>
                  <span className="text-white font-bold">{simAge} yrs</span>
                </div>
                <input
                  id={ageId}
                  type="range"
                  min="55"
                  max="90"
                  step="1"
                  value={simAge}
                  onChange={(e) => setSimAge(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* MMSE Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={mmseId} className="text-gray-300">Mini-Mental State Exam (MMSE):</label>
                  <span className="text-white font-bold">{simMmse} / 30</span>
                </div>
                <input
                  id={mmseId}
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={simMmse}
                  onChange={(e) => setSimMmse(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>Severe (&lt;17)</span>
                  <span>Mild (18–23)</span>
                  <span>MCI (24–27)</span>
                  <span>Normal (28–30)</span>
                </div>
              </div>

              {/* CDR Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={cdrId} className="text-gray-300">Clinical Dementia Rating (CDR):</label>
                  <span className="text-white font-bold">{simCdr.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[0.0, 0.5, 1.0, 2.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSimCdr(val)}
                      className={`py-1.5 px-2 rounded-xs border text-center transition-all cursor-pointer ${
                        simCdr === val 
                          ? 'bg-red-950/80 border-red-600 text-white font-bold' 
                          : 'bg-[#121212] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      CDR {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* APOE Genotype */}
              <div className="space-y-1.5">
                <label htmlFor={apoeId} className="text-xs font-mono text-gray-300 block">APOE Genotype Status:</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['negative', 'heterozygous', 'homozygous'] as const).map((apoe) => (
                    <button
                      key={apoe}
                      type="button"
                      onClick={() => setSimApoe(apoe)}
                      className={`py-1.5 px-2 rounded-xs border text-center capitalize transition-all cursor-pointer ${
                        simApoe === apoe 
                          ? 'bg-red-950/80 border-red-600 text-white font-bold' 
                          : 'bg-[#121212] border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {apoe === 'negative' ? 'ε3/ε3 Neg' : apoe === 'heterozygous' ? 'ε4 Hetero' : 'ε4/ε4 Homo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hippocampal Atrophy % */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={atrophyId} className="text-gray-300">Hippocampal Volume Loss (%):</label>
                  <span className="text-red-400 font-bold">{simAtrophy}%</span>
                </div>
                <input
                  id={atrophyId}
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={simAtrophy}
                  onChange={(e) => setSimAtrophy(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Medial Temporal Atrophy (MTA Scale 0 to 4) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <label htmlFor={mtaId} className="text-gray-300">Scheltens MTA Scale (0 to 4):</label>
                  <span className="text-white font-bold">Grade {simMta}</span>
                </div>
                <input
                  id={mtaId}
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simMta}
                  onChange={(e) => setSimMta(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>0: Normal</span>
                  <span>1: Minimal</span>
                  <span>2: Moderate</span>
                  <span>3: Pronounced</span>
                  <span>4: Severe</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Model Inference Outputs */}
            <div className="lg:col-span-7 space-y-5 bg-[#070707] border border-white/10 p-5 rounded-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Live NeuroTwin-X Diagnostic Engine Outputs
                </h3>
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-300 text-[10px] font-mono rounded-xs">
                  Inference Latency: ~142ms
                </span>
              </div>

              {/* 1. MRI Staging Probability Distribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300 font-semibold">1. Severity Staging SoftMax Distribution:</span>
                  <span className="text-red-400 font-bold">
                    Assigned: {simResult.dominantStage} ({simResult.confidence}%)
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-400">Non-Demented</span>
                      <span className="text-white font-bold">{simResult.distribution.nonDemented}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                      <div 
                        className="h-full bg-red-800 transition-all duration-300"
                        style={{ width: `${simResult.distribution.nonDemented}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-400">Very Mildly Demented</span>
                      <span className="text-white font-bold">{simResult.distribution.veryMild}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                      <div 
                        className="h-full bg-red-700 transition-all duration-300"
                        style={{ width: `${simResult.distribution.veryMild}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-400">Mildly Demented</span>
                      <span className="text-white font-bold">{simResult.distribution.mild}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${simResult.distribution.mild}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-gray-400">Moderately Demented</span>
                      <span className="text-white font-bold">{simResult.distribution.moderate}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#141414] rounded-xs overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${simResult.distribution.moderate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Uncertainty & Escalation Protocol */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                <div className="bg-[#121212] p-3 rounded-xs border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase block mb-1">Prediction Reliability</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">{simResult.reliability} Band</span>
                    <span className="text-gray-400 text-[10px]">(Entropy: {simResult.entropy})</span>
                  </div>
                </div>

                <div className="bg-[#121212] p-3 rounded-xs border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase block mb-1">Escalation Flag</span>
                  {simResult.escalationProtocol ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      Triggered (&lt;75% conf)
                    </span>
                  ) : (
                    <span className="text-gray-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                      Nominal Confidence
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Clinical Consistency Validation Score (Claim 4) */}
              <div className="p-3 bg-[#121212] border border-white/5 rounded-xs space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    Clinical Consistency Score (CCS):
                  </span>
                  <span className={`text-base font-black ${simResult.ccs >= 60 ? 'text-white' : 'text-red-400'}`}>
                    {simResult.ccs} / 100
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#1a1a1a] rounded-xs overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${simResult.ccs >= 60 ? 'bg-red-500' : 'bg-red-700'}`}
                    style={{ width: `${simResult.ccs}%` }}
                  />
                </div>

                {simResult.discordanceAlert && (
                  <div className="p-2 bg-red-950/60 border border-red-700/60 rounded-xs text-[11px] text-red-300 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Discordance Alert Raised (CCS &lt; 60):</strong> Significant divergence between MRI-derived structural stage and cognitive biomarkers. Mandates multidisciplinary clinical audit before PACS archive.
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Adaptive Explainability Method Selected (Claim 5) */}
              <div className="p-3 bg-[#121212] border border-white/5 rounded-xs space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-[10px] uppercase">Adaptive Explainability Technique</span>
                  <span className="px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-300 text-[10px] font-bold rounded-xs">
                    {simResult.xaiCode}
                  </span>
                </div>
                <div className="text-white font-bold text-xs">{simResult.selectedXai}</div>
                <p className="text-gray-400 text-[11px]">{simResult.xaiRationale}</p>
              </div>

              {/* 5. 6-Month Progression Forecast (Claim 6 & Claim 10) */}
              <div className="p-3 bg-[#121212] border border-white/5 rounded-xs space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-red-400" />
                    6-Month NeuroTwin Progression Risk:
                  </span>
                  <span className="text-red-400 font-black text-sm">{simResult.transitionRiskPct}% Risk</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Forecast Future State Probs (6 mo):</span>
                  <span>
                    Non: {simResult.futureDistribution.nonDemented}% · 
                    V.Mild: {simResult.futureDistribution.veryMild}% · 
                    Mild: {simResult.futureDistribution.mild}% · 
                    Mod: {simResult.futureDistribution.moderate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Section: The 7 Modular Layers */}
        <section id="architecture" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-red-500" />
              Comprehensive Technical Anatomy
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The Seven Layered Clinical Modules of NeuroTwin-X
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              NeuroTwin-X replaces ad-hoc classification black-boxes with a modular, clinically auditable architecture that interfaces directly with hospital PACS, HIS, edge inference nodes, and radiologist review workstations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {/* Module 1 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 1
                </span>
                <span className="text-gray-500 text-[10px]">DICOM Ingestion</span>
              </div>
              <h3 className="text-sm font-bold text-white">MRI Acquisition &amp; Preprocessing</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Connects directly to PACS via DICOM protocols. Performs spatial skull-stripping, voxel intensity standardization (Z-score normalization), and resamples structural volumetric brain MRI scans into uniform 224×224×3 tensor representations.
              </p>
            </div>

            {/* Module 2 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 2
                </span>
                <span className="text-gray-500 text-[10px]">Domain Adaptation</span>
              </div>
              <h3 className="text-sm font-bold text-white">Deep Neuroimaging Feature Encoder</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Two-phase domain adaptation protocol: Phase 1 trains the 256-unit classification head while freezing the backbone; Phase 2 selectively unfreezes upper encoder layers while strictly freezing normalization layers to preserve feature stability.
              </p>
            </div>

            {/* Module 3 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 3
                </span>
                <span className="text-gray-500 text-[10px]">Four-Stage Classifier</span>
              </div>
              <h3 className="text-sm font-bold text-white">Disease Severity Staging Engine</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Maps deep neuroimaging representations through Global Average Pooling, ReLU dense projection, Batch Normalization, and 0.4 Dropout to output a calibrated 4-class SoftMax probability distribution across Alzheimer’s stages.
              </p>
            </div>

            {/* Module 4A */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 4A
                </span>
                <span className="text-gray-500 text-[10px]">Reliability Analysis</span>
              </div>
              <h3 className="text-sm font-bold text-white">Prediction Uncertainty Estimator</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Computes Shannon entropy and Monte Carlo variance across inference cycles. Automatically tags predictions into High (&ge;85%), Medium (70–85%), or Low (&lt;70%) reliability bands and raises an escalation flag for clinical review.
              </p>
            </div>

            {/* Module 4B */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 4B
                </span>
                <span className="text-gray-500 text-[10px]">Biomarker Cross-Check</span>
              </div>
              <h3 className="text-sm font-bold text-white">Clinical Consistency Validation Engine</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Cross-validates MRI predictions against structured clinical parameters: MMSE, CDR, patient age, and APOE genotype. Computes a weighted Clinical Consistency Score (0–100) and issues a discordance alert when score drops below 60.
              </p>
            </div>

            {/* Module 4C */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 4C
                </span>
                <span className="text-gray-500 text-[10px]">Temporal Markov Model</span>
              </div>
              <h3 className="text-sm font-bold text-white">Disease Progression Forecasting Engine</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Applies a learned transition probability matrix conditioned on patient age, APOE ε4 allele dosage, and historical scan timelines to predict 6-month and 12-month future severity stage distributions and scalar progression risk.
              </p>
            </div>

            {/* Module 5 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 5
                </span>
                <span className="text-gray-500 text-[10px]">Confidence-Driven XAI</span>
              </div>
              <h3 className="text-sm font-bold text-white">Adaptive Explainability Manager</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Dynamically selects attribution mode based on prediction confidence: Grad-CAM for high confidence (&ge;85%), perturbation Score-CAM for moderate confidence (70–85%), and composite path-integrated gradients for low confidence (&lt;70%).
              </p>
            </div>

            {/* Module 6 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 6
                </span>
                <span className="text-gray-500 text-[10px]">Longitudinal Store</span>
              </div>
              <h3 className="text-sm font-bold text-white">Patient-Specific Predictive NeuroTwin</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Maintains a structured, longitudinal computational patient profile storing historical MRI scan outcomes, volumetric atrophy trajectories, therapeutic responses, confidence trends, and prospective transition forecasts over years of follow-up.
              </p>
            </div>

            {/* Module 7 */}
            <div className="bg-[#0a0a0a] border border-red-900/30 p-5 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-950/50 border border-red-700/50 text-red-400 text-[10px] font-bold rounded-xs">
                  MODULE 7
                </span>
                <span className="text-gray-500 text-[10px]">Hospital Integration</span>
              </div>
              <h3 className="text-sm font-bold text-white">Clinician Decision Interface &amp; HIS Node</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Consolidates multi-module outputs into an interactive radiologist dashboard, interfacing with hospital-edge inference nodes for local, privacy-compliant processing, and cloud-synchronization for multicenter federated analysis.
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
                Explore official patent figures, architecture schematics, MRI sample slices, and empirical benchmark visualizations. Click any figure to expand in high definition.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {[
                { key: 'all', label: 'All Figures (15)' },
                { key: 'architecture', label: 'Architecture & XAI' },
                { key: 'samples', label: 'MRI Slices' },
                { key: 'benchmarks', label: 'Empirical Results' },
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

        {/* Empirical Benchmarks & Clinical Validation Results */}
        <section id="benchmarks" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <LineChart className="w-4 h-4 text-red-500" />
              Empirical Performance Validation
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Clinical Staging Benchmarks on 44,000-Image Dataset
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Rigorous empirical evaluation conducted on a balanced 44,000-image MRI benchmark with a 6,601 holdout test set using Python 3.11 and TensorFlow 2.x.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Table 1: Overall Performance Metrics */}
            <div className="lg:col-span-6 bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                Comprehensive Validation Metrics (Section 8.2)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                      <th className="pb-2">Clinical Metric</th>
                      <th className="pb-2 text-right">Value</th>
                      <th className="pb-2 text-right">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 font-bold text-white">Test Accuracy</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">78.82%</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Four-stage multi-class</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-white">Cohen’s Kappa (κ)</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.715</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Substantial Agreement</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Macro F1-Score</td>
                      <td className="py-2.5 text-right font-bold text-white">0.7891</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Unweighted average</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Weighted F1-Score</td>
                      <td className="py-2.5 text-right font-bold text-white">0.7821</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Class-support weighted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Macro Precision</td>
                      <td className="py-2.5 text-right font-bold text-white">0.8036</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Reliable staging calls</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Macro Recall</td>
                      <td className="py-2.5 text-right font-bold text-white">0.7908</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">High sensitivity</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">One-vs-Rest ROC-AUC</td>
                      <td className="py-2.5 text-right font-bold text-red-400">&gt; 0.90</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">All four classes</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Holdout Test Set Size</td>
                      <td className="py-2.5 text-right text-white">6,601 Scans</td>
                      <td className="py-2.5 text-right text-gray-400 text-[10px]">Independent holdout</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Per-Class Breakdown (Section 8.3) */}
            <div className="lg:col-span-6 bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-red-500" />
                Per-Class Staging Performance (Section 8.3)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                      <th className="pb-2">Alzheimer’s Stage</th>
                      <th className="pb-2 text-right">Precision</th>
                      <th className="pb-2 text-right">Recall</th>
                      <th className="pb-2 text-right">F1-Score</th>
                      <th className="pb-2 text-right">Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Non-Demented</td>
                      <td className="py-2.5 text-right">0.6749</td>
                      <td className="py-2.5 text-right">0.8709</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.7605</td>
                      <td className="py-2.5 text-right text-gray-400">1,921</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Very Mildly Demented</td>
                      <td className="py-2.5 text-right">0.7312</td>
                      <td className="py-2.5 text-right">0.5101</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.6010</td>
                      <td className="py-2.5 text-right text-gray-400">1,680</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Mildly Demented</td>
                      <td className="py-2.5 text-right">0.8131</td>
                      <td className="py-2.5 text-right">0.7833</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.7980</td>
                      <td className="py-2.5 text-right text-gray-400">1,500</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-white">Moderately Demented</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.9953</td>
                      <td className="py-2.5 text-right text-red-400 font-bold">0.9987</td>
                      <td className="py-2.5 text-right text-red-400 font-black">0.9970</td>
                      <td className="py-2.5 text-right text-gray-400">1,500</td>
                    </tr>
                    <tr className="bg-[#121212] font-bold text-white">
                      <td className="py-2.5 pl-2">Macro Average</td>
                      <td className="py-2.5 text-right">0.8036</td>
                      <td className="py-2.5 text-right">0.7908</td>
                      <td className="py-2.5 text-right text-red-400">0.7891</td>
                      <td className="py-2.5 text-right pr-2">6,601</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                <strong className="text-white">Clinical Insight:</strong> The early boundary between Non-Demented and Very Mildly Demented represents the primary classification challenge due to subtle morphological overlap. This directly motivates Module 4B (Clinical Consistency Validation Engine) to cross-validate boundary cases against MMSE and CDR biomarkers before reporting.
              </p>
            </div>
          </div>

          {/* Comparative Benchmark Table (Section 8.7) */}
          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              Comparative Benchmark Against Prior Clinical AI Systems (Section 8.7)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                    <th className="pb-2">Clinical System</th>
                    <th className="pb-2">Feature Encoder</th>
                    <th className="pb-2 text-center">Stages</th>
                    <th className="pb-2 text-center">Accuracy</th>
                    <th className="pb-2 text-center">Consistency Engine</th>
                    <th className="pb-2 text-center">Progression Model</th>
                    <th className="pb-2 text-center">Adaptive XAI</th>
                    <th className="pb-2 text-center">Uncertainty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-2.5 font-medium text-white">Farooq et al. (2017)</td>
                    <td className="py-2.5 text-gray-400">AlexNet</td>
                    <td className="py-2.5 text-center">4</td>
                    <td className="py-2.5 text-center text-gray-300">74.2%</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-white">Ebrahimi-Ghahnavieh (2020)</td>
                    <td className="py-2.5 text-gray-400">VGG19</td>
                    <td className="py-2.5 text-center">4</td>
                    <td className="py-2.5 text-center text-gray-300">72.8%</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-white">Liu et al. (2022)</td>
                    <td className="py-2.5 text-gray-400">ResNet-50</td>
                    <td className="py-2.5 text-center">4</td>
                    <td className="py-2.5 text-center text-gray-300">76.1%</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                    <td className="py-2.5 text-center text-gray-400">Fixed only</td>
                    <td className="py-2.5 text-center text-gray-500">None</td>
                  </tr>
                  <tr className="bg-red-950/30 font-bold border-l-2 border-red-500">
                    <td className="py-3 pl-3 text-red-300 font-bold">NeuroTwin-X (This Patent)</td>
                    <td className="py-3 text-white">Two-Phase Adapted Encoder</td>
                    <td className="py-3 text-center text-white">4</td>
                    <td className="py-3 text-center text-red-400 font-black text-sm">78.82%</td>
                    <td className="py-3 text-center text-red-300 font-bold">CCS Engine (✓)</td>
                    <td className="py-3 text-center text-red-300 font-bold">Markov Forecast (✓)</td>
                    <td className="py-3 text-center text-red-300 font-bold">Dynamic XAI (✓)</td>
                    <td className="py-3 text-center text-red-300 font-bold">Entropy/MC (✓)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
              NeuroTwin-X is the only documented clinical neurology architecture that integrates superior staging accuracy (78.82%), automated clinical biomarker cross-validation, 6-month probabilistic progression forecasting, dynamic confidence-responsive spatial explainability, and uncertainty escalation protocols within an interoperable PACS workflow.
            </p>
          </div>
        </section>

        {/* Prior Art & Patent Literature Survey (Section 3.1) */}
        <section id="prior-art" className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-1">
              <Search className="w-4 h-4 text-red-500" />
              Prior Art &amp; Patent Landscape Survey
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Prior Art Analysis &amp; Technical Differentiators (Section 3.1)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Survey of granted patents and seminal publications in computer-aided neuroimaging staging, establishing novel inventive steps over existing healthcare systems.
            </p>
          </div>

          <div className="bg-[#0a0a0a] border border-red-900/30 rounded-sm p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                    <th className="pb-2 w-10">#</th>
                    <th className="pb-2 w-48">Patent / Reference</th>
                    <th className="pb-2">Disclosed Concept</th>
                    <th className="pb-2">Relevance</th>
                    <th className="pb-2 text-red-400">Critical Technical Deficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 text-[11px]">
                  <tr>
                    <td className="py-3 text-gray-500">1</td>
                    <td className="py-3 font-semibold text-white">US 10,853,449 (2020)<br/><span className="text-gray-500 text-[10px]">IBM Watson Health</span></td>
                    <td className="py-3 text-gray-400">AI-based medical image classification for neurological disease using DNNs</td>
                    <td className="py-3">Deep feature extraction for brain disease</td>
                    <td className="py-3 text-red-300">Binary classification only; no 4-stage severity grading; no clinical consistency validation; no progression forecasting.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">2</td>
                    <td className="py-3 font-semibold text-white">US 10,679,347 (2020)<br/><span className="text-gray-500 text-[10px]">GE Healthcare</span></td>
                    <td className="py-3 text-gray-400">Automated MRI analysis using CNNs for anomaly detection</td>
                    <td className="py-3">Pretrained feature extraction on MRI</td>
                    <td className="py-3 text-red-300">No Alzheimer’s-specific four-stage severity staging; no explainability; no patient-specific longitudinal predictive model.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">3</td>
                    <td className="py-3 font-semibold text-white">US 9,940,421 (2018)<br/><span className="text-gray-500 text-[10px]">Siemens Healthineers</span></td>
                    <td className="py-3 text-gray-400">Computer-aided diagnosis for Alzheimer’s based on PET/MRI fusion</td>
                    <td className="py-3">Multimodal neuroimaging for AD</td>
                    <td className="py-3 text-red-300">Strictly PET-dependent; inapplicable in structural MRI-only clinical settings; no consistency cross-check; no progression simulator.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">4</td>
                    <td className="py-3 font-semibold text-white">Selvaraju et al. (2017)<br/><span className="text-gray-500 text-[10px]">ICCV (Grad-CAM)</span></td>
                    <td className="py-3 text-gray-400">Gradient-weighted class activation mapping for CNN interpretability</td>
                    <td className="py-3">Spatial attribution technique</td>
                    <td className="py-3 text-red-300">General visual attribution; not adapted for multi-stage AD MRI; lacks confidence-driven adaptive method switching.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">5</td>
                    <td className="py-3 font-semibold text-white">Farooq et al. (2017)<br/><span className="text-gray-500 text-[10px]">IEEE EMBC</span></td>
                    <td className="py-3 text-gray-400">Four-class Alzheimer’s MRI classification using AlexNet</td>
                    <td className="py-3">Four-class staging task</td>
                    <td className="py-3 text-red-300">Single-model pipeline; lower accuracy (74.2%); lacks clinical consistency validation, uncertainty estimation, and forecasting.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">6</td>
                    <td className="py-3 font-semibold text-white">Wang et al. (2023)<br/><span className="text-gray-500 text-[10px]">npj Digital Medicine</span></td>
                    <td className="py-3 text-gray-400">Multimodal deep learning for dementia progression using MRI + EEG</td>
                    <td className="py-3">Longitudinal modeling</td>
                    <td className="py-3 text-red-300">Does not produce a patient-specific NeuroTwin entity; lacks confidence-driven adaptive explainability and uncertainty flags.</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500">7</td>
                    <td className="py-3 font-semibold text-white">Liu et al. (2022)<br/><span className="text-gray-500 text-[10px]">Frontiers in Neuroscience</span></td>
                    <td className="py-3 text-gray-400">Explainable deep learning for AD classification</td>
                    <td className="py-3">Explainable AI for AD</td>
                    <td className="py-3 text-red-300">Static single-attribution method; lacks clinical consistency validation engine, progression forecasting, and PACS integration.</td>
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
              Granted Legal Claims (IN202641103606 A1)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
              Verbatim legal claims as officially published by the Intellectual Property Office, India in Patent Gazette Journal No. 36/2026.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Independent Claim 1 */}
            <div className="bg-[#0a0a0a] border border-red-700/60 rounded-sm p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                <span className="px-2.5 py-1 bg-red-950/80 border border-red-600 text-red-300 text-xs font-bold rounded-xs">
                  CLAIM 1 · INDEPENDENT SYSTEM CLAIM
                </span>
                <span className="text-gray-400 text-[11px]">Primary Statutory Protection</span>
              </div>
              <p className="text-gray-200 leading-relaxed text-[11px] whitespace-pre-line">
{`A system (100) for processing structural brain magnetic resonance imaging (MRI) data and maintaining patient-specific longitudinal neuroimaging state information, comprising:
a computing device (102) having at least one processor (104) and a memory (106) operatively coupled to the at least one processor (104), the memory (106) storing executable instructions;
a longitudinal patient data store (108) accessible to the at least one processor (104);
a magnetic resonance imaging (MRI) acquisition and preprocessing module (110) configured to receive previously acquired structural brain MRI data from an imaging source and transform the structural brain MRI data into standardized neuroimaging input data through image conversion, intensity normalization, and spatial resampling;
a deep neuroimaging feature encoder (112) configured to process the standardized neuroimaging input data and generate a hierarchical neuroimaging feature representation, wherein the deep neuroimaging feature encoder (112) is domain-adapted through a two-phase domain-adaptation protocol that comprises:
  - a first training phase in which encoder layers of the deep neuroimaging feature encoder (112) remain frozen while a classification head coupled to the encoder layers is trained using feature representations generated by the frozen encoder layers; and
  - a second training phase in which upper encoder layers of the deep neuroimaging feature encoder (112) are selectively unfrozen and adapted to structural brain MRI data while normalization layers remain frozen;
a disease severity staging engine (114) configured to map the hierarchical neuroimaging feature representation to a severity probability distribution across plurality of predetermined severity states and generate an MRI-derived severity-state output;
a prediction uncertainty estimator (116) configured to determine prediction confidence information from the severity probability distribution, compare the prediction confidence information with a confidence threshold stored in the memory (106), and generate an escalation flag responsive to the prediction confidence information failing to satisfy the confidence threshold;
a clinical consistency validation engine (118) configured to receive the MRI-derived severity-state output and one or more structured patient-specific clinical parameters, determine concordance between the MRI-derived severity-state output and the one or more structured patient-specific clinical parameters, generate a clinical consistency score representing the determined concordance, and generate a discordance alert responsive to the clinical consistency score failing to satisfy a consistency threshold stored in the memory (106);
a patient-specific predictive NeuroTwin (120), maintained in the longitudinal patient data store (108), configured to maintain historical MRI analysis outcomes, a longitudinal severity-state history, prediction confidence information, clinical-consistency records, treatment-response records, predicted future severity states, and severity-transition risk information;
a severity-state transition estimation engine (122) configured to process a current MRI-derived severity-state output together with longitudinal information retrieved from the patient-specific predictive NeuroTwin (120), generate a future severity-state probability distribution and severity-transition risk information, and store a predicted future severity state in the patient-specific predictive NeuroTwin (120);
an adaptive explainability manager (124) configured to receive the prediction confidence information from the prediction uncertainty estimator (116), dynamically select a spatial attribution technique from plurality of distinct spatial attribution techniques according to the prediction confidence information, and generate spatial attribution information corresponding to the MRI-derived severity-state output using the selected spatial attribution technique; and
a clinician decision interface (126) configured to consolidate the MRI-derived severity-state output, the prediction confidence information, the spatial attribution information, the clinical consistency score, and the predicted future severity state into a structured decision-support record for clinician review.`}
              </p>
            </div>

            {/* Dependent Claims 2 to 10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              {/* Claim 2 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 2 · Uncertainty Indicators</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the prediction uncertainty estimator (116) is configured to derive prediction confidence information from at least one of entropy of the severity probability distribution, variance obtained through Monte Carlo sampling, and disagreement among outputs generated by plurality of inference models.
                </p>
              </div>

              {/* Claim 3 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 3 · DICOM Ingestion &amp; Severity States</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the MRI acquisition and preprocessing module (110) receives DICOM-formatted structural brain MRI through a PACS interface (132), performs DICOM-to-tensor conversion, and wherein the plurality of predetermined severity states comprises Non-Demented, Very Mildly Demented, Mildly Demented, and Moderately Demented.
                </p>
              </div>

              {/* Claim 4 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 4 · Clinical Consistency Validation Engine</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein structured clinical parameters comprise patient age, MMSE score, CDR score, prior MRI stage, clinical history flags, and APOE genotype; wherein concordance values receive reliability weights, are aggregated and normalized from 0 to 100, raising a discordance alert if CCS &lt; 60.
                </p>
              </div>

              {/* Claim 5 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 5 · Adaptive Explainability Selection Rules</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the adaptive explainability manager (124) selects: gradient-weighted spatial attribution (Grad-CAM) when confidence &ge; 85%; score-based activation attribution (Score-CAM) when confidence is 70% to &lt;85%; and layer-wise composite attribution when confidence &lt; 70%.
                </p>
              </div>

              {/* Claim 6 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 6 · Disease Transition Estimation Engine</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the transition estimation engine (122) retrieves historical staging timelines, applies a probabilistic stage-transition model comprising a learned transition probability matrix conditioned on patient age and biomarkers, and generates severity-transition risk scores for future horizons.
                </p>
              </div>

              {/* Claim 7 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 7 · Hospital Interoperability Architecture</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, comprising a communication interface (128) exchanging data over network (130) with a PACS interface (132), a Hospital Information System (HIS) (134), a hospital-edge processing node (136) for local inference, and a cloud synchronization service (138).
                </p>
              </div>

              {/* Claim 8 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 8 · Interchangeable Encoder Interface</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the deep neuroimaging feature encoder (112) communicates hierarchical representations through a structured feature interface accommodating deep convolutional or attention-based encoders interchangeably.
                </p>
              </div>

              {/* Claim 9 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5">
                <span className="text-red-400 font-bold">Claim 9 · EfficientNetB0 Architecture Specification</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 1, wherein the standardized input has dimensions 224×224×3, encoder comprises an ImageNet-pretrained EfficientNetB0 backbone, Global Average Pooling, a dense layer with 256 units and ReLU activation, Batch Normalization, Dropout of 0.4, and SoftMax output across severity states.
                </p>
              </div>

              {/* Claim 10 */}
              <div className="bg-[#0a0a0a] border border-red-900/30 p-4 rounded-sm space-y-1.5 col-span-1 md:col-span-2">
                <span className="text-red-400 font-bold">Claim 10 · Six-Month Progression Horizon Specification</span>
                <p className="text-gray-300 leading-relaxed">
                  The system (100) as claimed in claim 6, wherein the selected future time horizon is six months, and wherein the probabilities corresponding to the respective future severity states comprise probabilities corresponding to Non-Demented, Very Mildly Demented, Mildly Demented, and Moderately Demented severity states.
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
