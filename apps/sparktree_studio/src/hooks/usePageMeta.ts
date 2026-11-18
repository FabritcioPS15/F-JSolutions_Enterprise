'use client';

import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; // e.g., 'article'
  schemaId?: string; // unique id to manage JSON-LD script tag
  jsonLd?: Record<string, any>;
}

function upsertMeta(selector: string, create: () => HTMLMetaElement | HTMLLinkElement) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

export function usePageMeta({ title, description, url, image, type = 'website', schemaId, jsonLd }: MetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Description
    if (description) {
      const metaDesc = upsertMeta('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      }) as HTMLMetaElement;
      metaDesc.setAttribute('content', description);
    }

    // Canonical
    if (url) {
      const linkCanon = upsertMeta('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      }) as HTMLLinkElement;
      linkCanon.setAttribute('href', url);
    }

    // Open Graph
    const ogTitle = upsertMeta('meta[property="og:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    }) as HTMLMetaElement;
    ogTitle.setAttribute('content', title);

    const ogType = upsertMeta('meta[property="og:type"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:type');
      return m;
    }) as HTMLMetaElement;
    ogType.setAttribute('content', type);

    if (url) {
      const ogUrl = upsertMeta('meta[property="og:url"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:url');
        return m;
      }) as HTMLMetaElement;
      ogUrl.setAttribute('content', url);
    }

    if (image) {
      const ogImage = upsertMeta('meta[property="og:image"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:image');
        return m;
      }) as HTMLMetaElement;
      ogImage.setAttribute('content', image);
    }

    if (description) {
      const ogDesc = upsertMeta('meta[property="og:description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:description');
        return m;
      }) as HTMLMetaElement;
      ogDesc.setAttribute('content', description);
    }

    // Twitter
    const twCard = upsertMeta('meta[name="twitter:card"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:card');
      return m;
    }) as HTMLMetaElement;
    twCard.setAttribute('content', image ? 'summary_large_image' : 'summary');

    const twTitle = upsertMeta('meta[name="twitter:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'twitter:title');
      return m;
    }) as HTMLMetaElement;
    twTitle.setAttribute('content', title);

    if (description) {
      const twDesc = upsertMeta('meta[name="twitter:description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'twitter:description');
        return m;
      }) as HTMLMetaElement;
      twDesc.setAttribute('content', description);
    }

    if (image) {
      const twImage = upsertMeta('meta[name="twitter:image"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'twitter:image');
        return m;
      }) as HTMLMetaElement;
      twImage.setAttribute('content', image);
    }

    // JSON-LD
    let scriptId: string | undefined;
    if (jsonLd) {
      scriptId = schemaId || `ld-json-${btoa(title).slice(0, 8)}`;
      let script = document.head.querySelector(`#${scriptId}`) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = scriptId;
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(jsonLd);
    }

    return () => {
      document.title = prevTitle;
      // note: meta tags are not reverted to avoid flicker on SPA navigation
      // JSON-LD cleanup if we added one with explicit id
      if (schemaId || jsonLd) {
        const id = schemaId || (scriptId as string);
        const s = document.getElementById(id);
        if (s) document.head.removeChild(s);
      }
    };
  }, [title, description, url, image, type]);
}
