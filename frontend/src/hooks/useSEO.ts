import { useEffect, useRef } from 'react';
import siteData from '@/data/site.json';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface SEOConfig {
    title: string;
    description: string;
    canonicalPath?: string;
    ogImage?: string;
    noIndex?: boolean;
    jsonLd?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const SITE_URL = siteData.siteUrl;
const DEFAULT_TITLE = 'Sajhi Shiksha — Free Study Materials for KVS Students';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.png`;
const DEFAULT_KEYWORDS =
    'KVS, Kendriya Vidyalaya, study materials, question papers, class 1-5, class 6-12, education, free resources, India';

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function setMeta(name: string, content: string, attr = 'name'): void {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function removeMeta(name: string, attr = 'name'): void {
    const el = document.querySelector(`meta[${attr}="${name}"]`);
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

function setLink(rel: string, href: string): void {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function removeLink(rel: string): void {
    const el = document.querySelector(`link[rel="${rel}"]`);
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

let jsonLdEl: HTMLScriptElement | null = null;

/* ------------------------------------------------------------------ */
/*  useSEO hook                                                         */
/* ------------------------------------------------------------------ */

export function useSEO({
    title,
    description,
    canonicalPath,
    ogImage,
    noIndex,
    jsonLd,
}: SEOConfig): void {
    const prevTitleRef = useRef<string>(document.title);

    useEffect(() => {
        const fullTitle = title === DEFAULT_TITLE ? title : `${title} — Sajhi Shiksha`;
        prevTitleRef.current = document.title;
        document.title = fullTitle;

        setMeta('description', description);
        setMeta('keywords', DEFAULT_KEYWORDS);
        setMeta('author', 'Sajhi Shiksha');
        setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
        setMeta('language', 'en');

        const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
        setLink('canonical', canonical);

        setMeta('og:type', 'website', 'property');
        setMeta('og:url', canonical, 'property');
        setMeta('og:title', fullTitle, 'property');
        setMeta('og:description', description, 'property');
        setMeta('og:image', ogImage || DEFAULT_OG_IMAGE, 'property');
        setMeta('og:image:width', '1200', 'property');
        setMeta('og:image:height', '630', 'property');
        setMeta('og:site_name', 'Sajhi Shiksha', 'property');
        setMeta('og:locale', 'en_US', 'property');

        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', fullTitle);
        setMeta('twitter:description', description);
        setMeta('twitter:image', ogImage || DEFAULT_OG_IMAGE);

        if (jsonLd) {
            if (!jsonLdEl) {
                jsonLdEl = document.createElement('script');
                jsonLdEl.setAttribute('type', 'application/ld+json');
                document.head.appendChild(jsonLdEl);
            }
            jsonLdEl.textContent = JSON.stringify(jsonLd);
        } else if (jsonLdEl) {
            jsonLdEl.textContent = '';
        }

        return () => {
            /*  Reset to previous title */
            document.title = prevTitleRef.current;

            /*  Remove dynamic meta tags */
            removeMeta('description');
            removeMeta('keywords');
            removeMeta('author');
            removeMeta('robots');
            removeMeta('language');
            removeMeta('og:type', 'property');
            removeMeta('og:url', 'property');
            removeMeta('og:title', 'property');
            removeMeta('og:description', 'property');
            removeMeta('og:image', 'property');
            removeMeta('og:image:width', 'property');
            removeMeta('og:image:height', 'property');
            removeMeta('og:site_name', 'property');
            removeMeta('og:locale', 'property');
            removeMeta('twitter:card');
            removeMeta('twitter:title');
            removeMeta('twitter:description');
            removeMeta('twitter:image');

            /*  Remove canonical */
            removeLink('canonical');

            /*  Clear JSON-LD */
            if (jsonLdEl) {
                jsonLdEl.textContent = '';
            }
        };
    }, [title, description, canonicalPath, ogImage, noIndex, jsonLd]);
}

/* ------------------------------------------------------------------ */
/*  Static helper objects                                               */
/* ------------------------------------------------------------------ */

export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sajhi Shiksha',
    url: SITE_URL,
    description: 'Free educational resources for KVS students',
    sameAs: [] as string[],
};

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sajhi Shiksha',
    url: SITE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
};

export const educationalOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Sajhi Shiksha',
    description: 'Free educational resource-sharing platform for KVS students and teachers',
    url: SITE_URL,
    audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        audienceType: 'KVS students Classes 1-12',
    },
};
