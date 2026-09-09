import { useEffect } from 'react';

export interface PatentSEOProps {
  title: string;
  appNo: string;
  publicationNo?: string;
  abstract: string;
  inventors: string[];
  filingDate: string; // Format: YYYY-MM-DD
  publicationDate: string; // Format: YYYY-MM-DD
  keywords: string[];
  pdfUrl?: string;
  imageUrl?: string;
  canonicalPath: string; // e.g. '#/patent/audio-deepfake'
}

/**
 * Custom hook to manage patent-specific SEO meta tags, OpenGraph,
 * Twitter Cards, Highwire Press / Google Scholar tags, and Schema.org JSON-LD.
 */
export function usePatentSEO({
  title,
  appNo,
  publicationNo,
  abstract,
  inventors,
  filingDate,
  publicationDate,
  keywords,
  pdfUrl,
  imageUrl,
  canonicalPath
}: PatentSEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    const originalTitle = document.title;
    document.title = `${title} — Indian Patent ${appNo} | Rayban Pranav Mahesh`;

    // Helper to safely set/create meta elements and record reversion actions
    const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string): (() => void) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      let wasCreated = false;
      const previousContent = element ? element.getAttribute('content') : null;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
        wasCreated = true;
      }

      element.setAttribute('content', content);

      return () => {
        if (wasCreated) {
          element?.remove();
        } else if (previousContent !== null) {
          element?.setAttribute('content', previousContent);
        } else {
          element?.removeAttribute('content');
        }
      };
    };

    const cleanups: (() => void)[] = [];

    // Helper for multi-element tags (like citation_author)
    const appendMultiMeta = (name: string, content: string): (() => void) => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute('content', content);
      el.setAttribute('data-dynamic-seo', 'true');
      document.head.appendChild(el);
      return () => {
        el.remove();
      };
    };

    // Primary Meta Tags
    cleanups.push(setMeta('name', 'description', abstract));
    cleanups.push(setMeta('name', 'keywords', [
      ...keywords,
      `Patent ${appNo}`,
      publicationNo || '',
      'Indian Patent Office',
      'IPO Publication',
      'Rayban Pranav Mahesh',
      'Vellore Institute of Technology',
      'Patent Application'
    ].filter(Boolean).join(', ')));
    cleanups.push(setMeta('name', 'author', inventors.join(', ')));
    cleanups.push(setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'));

    // Canonical URL & Assets
    const pageUrl = `https://www.raybanpranav.tech/${canonicalPath.startsWith('#') ? canonicalPath : `#${canonicalPath}`}`;
    const fullImgUrl = imageUrl
      ? (imageUrl.startsWith('http') ? imageUrl : `https://www.raybanpranav.tech${imageUrl}`)
      : 'https://www.raybanpranav.tech/rayban_half.png';
    const fullPdfUrl = pdfUrl
      ? (pdfUrl.startsWith('http') ? pdfUrl : `https://www.raybanpranav.tech${pdfUrl}`)
      : undefined;

    // OpenGraph Meta Tags
    cleanups.push(setMeta('property', 'og:title', `${title} — Indian Patent ${appNo}`));
    cleanups.push(setMeta('property', 'og:description', abstract));
    cleanups.push(setMeta('property', 'og:type', 'article'));
    cleanups.push(setMeta('property', 'og:url', pageUrl));
    cleanups.push(setMeta('property', 'og:image', fullImgUrl));
    cleanups.push(setMeta('property', 'og:site_name', 'Rayban Pranav Mahesh — Research & Patents'));

    // Twitter Card Meta Tags
    cleanups.push(setMeta('name', 'twitter:card', 'summary_large_image'));
    cleanups.push(setMeta('name', 'twitter:title', `${title} — Patent ${appNo}`));
    cleanups.push(setMeta('name', 'twitter:description', abstract));
    cleanups.push(setMeta('name', 'twitter:image', fullImgUrl));

    // Google Scholar & Highwire Press Academic Meta Tags
    cleanups.push(setMeta('name', 'citation_title', title));
    inventors.forEach((inv) => {
      cleanups.push(appendMultiMeta('citation_author', inv));
    });
    cleanups.push(setMeta('name', 'citation_publication_date', publicationDate.replace(/-/g, '/')));
    cleanups.push(setMeta('name', 'citation_patent_number', publicationNo || appNo));
    cleanups.push(setMeta('name', 'citation_patent_application_number', appNo));
    cleanups.push(setMeta('name', 'citation_technical_report_institution', 'Vellore Institute of Technology'));
    if (fullPdfUrl) {
      cleanups.push(setMeta('name', 'citation_pdf_url', fullPdfUrl));
    }

    // Schema.org JSON-LD Structured Data
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = `patent-schema-${appNo}`;
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': ['Patent', 'TechArticle'],
      headline: title,
      name: title,
      patentNumber: publicationNo || appNo,
      applicationNumber: appNo,
      description: abstract,
      inLanguage: 'en',
      author: inventors.map((name) => ({
        '@type': 'Person',
        name,
        ...(name.toLowerCase().includes('rayban')
          ? {
              url: 'https://www.raybanpranav.tech/',
              jobTitle: 'AI/ML Engineer & Researcher'
            }
          : {})
      })),
      inventor: inventors.map((name) => ({
        '@type': 'Person',
        name
      })),
      assignee: {
        '@type': 'Organization',
        name: 'Vellore Institute of Technology',
        url: 'https://vit.ac.in/'
      },
      datePublished: publicationDate,
      filingDate: filingDate,
      image: fullImgUrl,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      keywords: keywords.join(', ')
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.title = originalTitle;
      cleanups.forEach((cleanup) => cleanup());
      schemaScript.remove();
    };
  }, [
    title,
    appNo,
    publicationNo,
    abstract,
    inventors,
    filingDate,
    publicationDate,
    keywords,
    pdfUrl,
    imageUrl,
    canonicalPath
  ]);
}
