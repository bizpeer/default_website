import { SEOSettings, defaultSEOSettings } from '../types/SEOTypes';

export function getSEOSettings(): SEOSettings {
  const savedBrandKo = localStorage.getItem('site_brand_name_ko') || '공식 자사몰';
  const savedBrandEn = localStorage.getItem('site_brand_name_en') || 'OFFICIAL STORE';

  const dynamicDefault: SEOSettings = {
    ...defaultSEOSettings,
    metaTitle: `${savedBrandKo} (${savedBrandEn}) | 공식 스킨케어 온라인몰`,
    ogTitle: `${savedBrandKo} (${savedBrandEn}) | 맑은 피부의 시작`,
    author: `주식회사 ${savedBrandKo}`,
  };

  const saved = localStorage.getItem('site_seo_settings');
  if (saved) {
    try {
      return {
        ...dynamicDefault,
        ...JSON.parse(saved),
      };
    } catch (e) {
      return dynamicDefault;
    }
  }
  return dynamicDefault;
}

export function saveSEOSettings(settings: SEOSettings): void {
  localStorage.setItem('site_seo_settings', JSON.stringify(settings));
  applySEOTagsToHead(settings);
}

/**
 * Dynamically inject / update HTML document <head> meta tags based on SEO Management config
 */
export function applySEOTagsToHead(settings: SEOSettings = getSEOSettings()): void {
  if (typeof document === 'undefined') return;

  const savedBrandKo = localStorage.getItem('site_brand_name_ko') || '공식 자사몰';
  const savedBrandEn = localStorage.getItem('site_brand_name_en') || 'OFFICIAL STORE';
  const siteFullName = `${savedBrandKo} (${savedBrandEn})`;

  // 1. Page Title
  if (settings.metaTitle) {
    document.title = settings.metaTitle;
  }

  const setMetaTag = (selector: string, attribute: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content || '');
  };

  // 2. Core Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', settings.metaDescription);
  setMetaTag('meta[name="keywords"]', 'name', 'keywords', settings.metaKeywords);
  setMetaTag('meta[name="author"]', 'name', 'author', settings.author || `주식회사 ${savedBrandKo}`);
  setMetaTag('meta[name="robots"]', 'name', 'robots', settings.robotsIndex);

  // 3. Open Graph Tags (KakaoTalk / Naver / SNS Link Preview)
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', siteFullName);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', settings.ogTitle || settings.metaTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', settings.ogDescription || settings.metaDescription);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', settings.ogImageUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', settings.ogType || 'website');

  // 4. Verification Keys
  if (settings.googleSiteVerification) {
    setMetaTag('meta[name="google-site-verification"]', 'name', 'google-site-verification', settings.googleSiteVerification);
  }
  if (settings.naverSiteVerification) {
    setMetaTag('meta[name="naver-site-verification"]', 'name', 'naver-site-verification', settings.naverSiteVerification);
  }

  // 5. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (settings.canonicalUrl) {
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', settings.canonicalUrl);
  }

  // 6. JSON-LD Schema.org Structured Data
  if (settings.enableStructuredData) {
    let scriptEl = document.getElementById('json-ld-structured-data');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'json-ld-structured-data';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.metaTitle,
      description: settings.metaDescription,
      url: settings.canonicalUrl || window.location.origin,
      logo: settings.ogImageUrl,
    };
    scriptEl.textContent = JSON.stringify(schemaData);
  }
}
