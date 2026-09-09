/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import PublicationsSection from './components/PublicationsSection';
import PatentsSection from './components/PatentsSection';
import Projects from './components/Projects';
import SkillsSection from './components/SkillsSection';
import EducationCertifications from './components/EducationCertifications';
import Footer from './components/Footer';
import CrowdChaosPatentPage from './components/CrowdChaosPatentPage';
import GeoMedicinalPatentPage from './components/GeoMedicinalPatentPage';
import LipSyncPatentPage from './components/LipSyncPatentPage';
import NetworkSpoofingPatentPage from './components/NetworkSpoofingPatentPage';
import HindiEnglishPatentPage from './components/HindiEnglishPatentPage';
import AudioDeepfakePatentPage from './components/AudioDeepfakePatentPage';
import LocationServicePatentPage from './components/LocationServicePatentPage';
import AlzheimersPatentPage from './components/AlzheimersPatentPage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'patent-chaos' | 'patent-geomed' | 'patent-lipsync' | 'patent-spoofing' | 'patent-hindi-english' | 'patent-audio-deepfake' | 'patent-location-service' | 'patent-alzheimers'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash.includes('patent/crowd-chaos') || 
        hash.includes('patent-crowd-chaos') || 
        hash.includes('202541103106') ||
        path.includes('crowd-chaos-detection')
      ) {
        return 'patent-chaos';
      }
      if (
        hash.includes('patent/geo-medicinal') || 
        hash.includes('patent-geomed') || 
        hash.includes('202641059395') ||
        path.includes('geo-medicinal')
      ) {
        return 'patent-geomed';
      }
      if (
        hash.includes('patent/lip-sync') || 
        hash.includes('patent-lipsync') || 
        hash.includes('202541131828') ||
        path.includes('lip-sync')
      ) {
        return 'patent-lipsync';
      }
      if (
        hash.includes('patent/network-spoofing') || 
        hash.includes('patent-spoofing') || 
        hash.includes('202641054502') ||
        path.includes('network-spoofing') ||
        path.includes('spoofing-detection')
      ) {
        return 'patent-spoofing';
      }
      if (
        hash.includes('patent/hindi-english') || 
        hash.includes('patent-hindi-english') || 
        hash.includes('202641033897') ||
        path.includes('hindi-english') ||
        path.includes('multimodal-hindi-english')
      ) {
        return 'patent-hindi-english';
      }
      if (
        hash.includes('patent/audio-deepfake') || 
        hash.includes('patent-audio-deepfake') || 
        hash.includes('202641027783') ||
        path.includes('audio-deepfake')
      ) {
        return 'patent-audio-deepfake';
      }
      if (
        hash.includes('patent/location-service') || 
        hash.includes('patent-location-service') || 
        hash.includes('202641027808') ||
        path.includes('location-service') ||
        path.includes('location-filtered-service')
      ) {
        return 'patent-location-service';
      }
      if (
        hash.includes('patent/alzheimers') || 
        hash.includes('patent-alzheimers') || 
        hash.includes('202641103606') ||
        path.includes('alzheimers')
      ) {
        return 'patent-alzheimers';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash.includes('patent/crowd-chaos') || 
        hash.includes('patent-crowd-chaos') || 
        hash.includes('202541103106') ||
        path.includes('crowd-chaos-detection')
      ) {
        setCurrentRoute('patent-chaos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/geo-medicinal') || 
        hash.includes('patent-geomed') || 
        hash.includes('202641059395') ||
        path.includes('geo-medicinal')
      ) {
        setCurrentRoute('patent-geomed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/lip-sync') || 
        hash.includes('patent-lipsync') || 
        hash.includes('202541131828') ||
        path.includes('lip-sync')
      ) {
        setCurrentRoute('patent-lipsync');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/network-spoofing') || 
        hash.includes('patent-spoofing') || 
        hash.includes('202641054502') ||
        path.includes('network-spoofing') ||
        path.includes('spoofing-detection')
      ) {
        setCurrentRoute('patent-spoofing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/hindi-english') || 
        hash.includes('patent-hindi-english') || 
        hash.includes('202641033897') ||
        path.includes('hindi-english') ||
        path.includes('multimodal-hindi-english')
      ) {
        setCurrentRoute('patent-hindi-english');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/audio-deepfake') || 
        hash.includes('patent-audio-deepfake') || 
        hash.includes('202641027783') ||
        path.includes('audio-deepfake')
      ) {
        setCurrentRoute('patent-audio-deepfake');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/location-service') || 
        hash.includes('patent-location-service') || 
        hash.includes('202641027808') ||
        path.includes('location-service') ||
        path.includes('location-filtered-service')
      ) {
        setCurrentRoute('patent-location-service');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash.includes('patent/alzheimers') || 
        hash.includes('patent-alzheimers') || 
        hash.includes('202641103606') ||
        path.includes('alzheimers')
      ) {
        setCurrentRoute('patent-alzheimers');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        hash === '#overview' ||
        hash === '#prior-art' ||
        hash === '#architecture' ||
        hash === '#figures' ||
        hash === '#visual-pipeline' ||
        hash === '#audio-pipeline' ||
        hash === '#risk-engine' ||
        hash === '#empirical-results' ||
        hash === '#claims' ||
        hash === '#citations' ||
        hash === '#citation' ||
        hash === '#gp-potency' ||
        hash === '#bayesian-dosage' ||
        hash === '#gnn-interactions' ||
        hash === '#recommendation-engine' ||
        hash === '#spectral-cnn' ||
        hash === '#spatial-pipeline' ||
        hash === '#spectral-pipeline' ||
        hash === '#attention-cnn' ||
        hash === '#lasci-engine' ||
        hash === '#simulator' ||
        hash === '#benchmarks' ||
        hash === '#metrics' ||
        hash === '#results'
      ) {
        // Keep active patent route
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    let title = 'Rayban Pranav Mahesh — AI/ML Engineer, Researcher & Inventor';
    if (currentRoute === 'patent-chaos') {
      title = 'Patent 202541103106 | Crowd Chaos Detection System — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-geomed') {
      title = 'Patent 202641059395 | Geo-Medicinal Intelligence System — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-lipsync') {
      title = 'Patent 202541131828 | Lip-Sync Authenticity Detection — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-spoofing') {
      title = 'Patent 202641054502 | Multi-Layer Network Spoofing Detection & Response — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-hindi-english') {
      title = 'Patent 202641033897 | Multimodal Emotion-Aware Hindi-English Communication — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-audio-deepfake') {
      title = 'Patent 202641027783 | Multi-Domain Feature Fusion Audio Deepfake Detection — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-location-service') {
      title = 'Patent 202641027808 | Location-Filtered Service Platform with Bidirectional Rating & Image Verification — Rayban Pranav Mahesh';
    } else if (currentRoute === 'patent-alzheimers') {
      title = 'Patent 202641103606 | MRI-Based Alzheimer’s Severity Grading & Progression Forecasting — Rayban Pranav Mahesh';
    }
    document.title = title;

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.hash,
      });
    }
  }, [currentRoute]);

  useEffect(() => {
    if (currentRoute !== 'home') return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1 && !href.startsWith('#/')) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Update URL hash smoothly without jump
          history.pushState(null, '', href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [currentRoute]);

  const handleBackToHome = () => {
    setCurrentRoute('home');
    window.location.hash = '#patents';
    setTimeout(() => {
      const patentsEl = document.getElementById('patents');
      if (patentsEl) {
        patentsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  if (currentRoute === 'patent-chaos') {
    return <CrowdChaosPatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-geomed') {
    return <GeoMedicinalPatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-lipsync') {
    return <LipSyncPatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-spoofing') {
    return <NetworkSpoofingPatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-hindi-english') {
    return <HindiEnglishPatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-audio-deepfake') {
    return <AudioDeepfakePatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-location-service') {
    return <LocationServicePatentPage onBack={handleBackToHome} />;
  }

  if (currentRoute === 'patent-alzheimers') {
    return <AlzheimersPatentPage onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-red-900 selection:text-white pb-10 antialiased overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-4 sm:pb-10">
        <Navbar />
        <Hero />
        <ExperienceSection />
        <PublicationsSection />
        <PatentsSection />
        <Projects />
        <SkillsSection />
        <EducationCertifications />
        <Footer />
      </div>
    </div>
  );
}
