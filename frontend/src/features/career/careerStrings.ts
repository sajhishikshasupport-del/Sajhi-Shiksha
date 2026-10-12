/**
 * Chrome strings for the Career Counselling section, in English and Hindi
 * (REQ-1012-16).
 *
 * Only UI labels the site itself draws live here — the WhatsApp CTA wording,
 * the back-button label, "Coming soon", "Read the guide" and similar. The
 * authored page content is rendered verbatim from `career-pages/<id>.json` /
 * `<id>.hi.json` and is never translated in code.
 *
 * Numbers, dates and proper terms are kept in the same form as English (no
 * Devanagari digits), matching the authored Hindi pages.
 */
import careerI18n from '@/data/career-i18n.json';
import type { CareerLang } from './useCareerLang';

export interface CareerStrings {
    /** Section name — used for the back-button label and the <title> suffix. */
    sectionName: string;
    /** WhatsApp CTA heading; `{title}` becomes the page title. */
    ctaHeading: (title: string) => string;
    ctaBody: string;
    ctaButton: string;
    /** "Read the guide" link under each stream-guide card. */
    readTheGuide: string;
    /** Badge on a page whose content has not been delivered yet. */
    comingSoon: string;
    notFoundTitle: string;
    notFoundBody: string;
    backToCareer: string;
    /** Fallback title for the stream-guides listing. */
    guidesByStreamFallback: string;
    /** aria-label for the section jump chips. */
    jumpToSection: string;
    /** Section-index chrome. */
    freeVsPaidHeading: string;
    free: string;
    paid: string;
    readMore: string;
    openExplorer: string;
    /** Language toggle label + page <title>/description for the section index. */
    languageLabel: string;
    indexTitle: string;
    indexDescription: string;
}

const EN: CareerStrings = {
    sectionName: 'Career Counselling',
    ctaHeading: (title) => `Question about ${title}?`,
    ctaBody:
        'If anything on this page is unclear, or you want to talk it through for your own situation, message us on WhatsApp. We reply personally.',
    ctaButton: 'Ask on WhatsApp',
    readTheGuide: 'Read the guide',
    comingSoon: 'Coming soon',
    notFoundTitle: 'Page not found',
    notFoundBody:
        'This career counselling page does not exist. Browse the section to find what you are looking for.',
    backToCareer: 'Back to Career Counselling',
    guidesByStreamFallback: 'Career Guides by Stream',
    jumpToSection: 'Jump to section',
    freeVsPaidHeading: 'Free and paid, clearly separated',
    free: 'Free',
    paid: 'Paid',
    readMore: 'Read more',
    openExplorer: 'Open Explorer',
    languageLabel: 'Language',
    indexTitle: 'Career Counselling — Free Career Guidance for Students',
    indexDescription:
        'Free, research-backed career guidance for Indian students and parents — an interactive career explorer, stream selection, entrance exams, colleges, scholarships and more.',
};

const HI: CareerStrings = {
    sectionName: careerI18n.hi.sectionName,
    ctaHeading: (title) => `${title} के बारे में सवाल?`,
    ctaBody:
        'अगर इस पेज पर कुछ स्पष्ट नहीं है, या आप अपनी स्थिति के हिसाब से इस पर बात करना चाहते हैं, तो हमें व्हाट्सएप पर मैसेज करें। हम खुद जवाब देते हैं।',
    ctaButton: 'व्हाट्सएप पर पूछें',
    readTheGuide: 'गाइड पढ़ें',
    comingSoon: 'जल्द आ रहा है',
    notFoundTitle: 'पेज नहीं मिला',
    notFoundBody:
        'यह करियर काउंसलिंग पेज मौजूद नहीं है। जो आप ढूंढ रहे हैं, उसे पाने के लिए सेक्शन ब्राउज़ करें।',
    backToCareer: 'करियर काउंसलिंग पर वापस जाएं',
    guidesByStreamFallback: 'स्ट्रीम के अनुसार करियर गाइड',
    jumpToSection: 'सेक्शन पर जाएं',
    freeVsPaidHeading: 'फ्री और पेड, साफ़-साफ़ अलग',
    free: 'फ्री',
    paid: 'पेड',
    readMore: 'और पढ़ें',
    openExplorer: 'एक्सप्लोरर खोलें',
    languageLabel: 'भाषा',
    indexTitle: careerI18n.hi.indexTitle,
    indexDescription: careerI18n.hi.indexDescription,
};

/** The chrome strings for a language (English is the fallback). */
export function careerStrings(lang: CareerLang): CareerStrings {
    return lang === 'hi' ? HI : EN;
}
