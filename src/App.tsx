/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import PublicationsSection from './components/PublicationsSection';
import PatentsSection from './components/PatentsSection';
import Projects from './components/Projects';
import SkillsSection from './components/SkillsSection';
import EducationCertifications from './components/EducationCertifications';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
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
  }, []);

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
