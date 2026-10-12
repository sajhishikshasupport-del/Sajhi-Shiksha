/**
 * Registry of finalized career page content.
 *
 * Every file here is the *verbatim* content authored by the Career Counselling
 * Agent (Drive `career-pages/<id>.json`, copied into `src/data/career-pages/`).
 * Nothing in this module rewrites or summarises that content.
 *
 * The dynamic route `/career-counselling/$slug` looks a slug up in this map.
 *
 * Hindi pages (REQ-1012-16) live alongside the English ones as
 * `<id>.hi.json`, same shape, authored by the Career Counselling Agent. When a
 * page is requested in Hindi but has no Hindi file yet, the English content is
 * returned as a fallback.
 */
import type { CareerPageContent } from './types';
import type { CareerLang } from './useCareerLang';

import class10StreamSelectionGuide from '@/data/career-pages/class10-stream-selection-guide.json';
import entranceExamCalendar from '@/data/career-pages/entrance-exam-calendar-2026-27.json';
import scholarshipsAndEducationFinance from '@/data/career-pages/scholarships-and-education-finance.json';
import topCollegesAndInstitutes from '@/data/career-pages/top-colleges-and-institutes.json';
import careerCounsellingWorkshops from '@/data/career-pages/career-counselling-workshops.json';
import pcmEngineeringGuide from '@/data/career-pages/pcm-engineering-guide.json';
import pcbMedicalGuide from '@/data/career-pages/pcb-medical-guide.json';
import commerceGuide from '@/data/career-pages/commerce-guide.json';
import artsHumanitiesGuide from '@/data/career-pages/arts-humanities-guide.json';
import parentsCorner from '@/data/career-pages/parents-corner.json';

import class10StreamSelectionGuideHi from '@/data/career-pages/class10-stream-selection-guide.hi.json';
import entranceExamCalendarHi from '@/data/career-pages/entrance-exam-calendar-2026-27.hi.json';
import scholarshipsAndEducationFinanceHi from '@/data/career-pages/scholarships-and-education-finance.hi.json';
import topCollegesAndInstitutesHi from '@/data/career-pages/top-colleges-and-institutes.hi.json';
import careerCounsellingWorkshopsHi from '@/data/career-pages/career-counselling-workshops.hi.json';
import pcmEngineeringGuideHi from '@/data/career-pages/pcm-engineering-guide.hi.json';
import pcbMedicalGuideHi from '@/data/career-pages/pcb-medical-guide.hi.json';
import commerceGuideHi from '@/data/career-pages/commerce-guide.hi.json';
import artsHumanitiesGuideHi from '@/data/career-pages/arts-humanities-guide.hi.json';
import parentsCornerHi from '@/data/career-pages/parents-corner.hi.json';

/**
 * The four stream guides live under the `career-guides-by-stream` parent item
 * in the manifest (they are not top-level manifest items themselves). They are
 * exposed at `/career-counselling/<guide-id>` and listed together at
 * `/career-counselling/career-guides-by-stream`.
 */
export const STREAM_GUIDE_IDS: readonly string[] = [
    'pcm-engineering-guide',
    'pcb-medical-guide',
    'commerce-guide',
    'arts-humanities-guide',
];

/** Manifest id that groups the stream guides (renders a listing page). */
export const CAREER_GUIDES_PARENT_ID = 'career-guides-by-stream';

/** slug -> English page content. Indexing may return undefined for an unknown slug. */
export const careerPages: Record<string, CareerPageContent> = {
    'class10-stream-selection-guide': class10StreamSelectionGuide as unknown as CareerPageContent,
    'entrance-exam-calendar-2026-27': entranceExamCalendar as unknown as CareerPageContent,
    'scholarships-and-education-finance': scholarshipsAndEducationFinance as unknown as CareerPageContent,
    'top-colleges-and-institutes': topCollegesAndInstitutes as unknown as CareerPageContent,
    'career-counselling-workshops': careerCounsellingWorkshops as unknown as CareerPageContent,
    'pcm-engineering-guide': pcmEngineeringGuide as unknown as CareerPageContent,
    'pcb-medical-guide': pcbMedicalGuide as unknown as CareerPageContent,
    'commerce-guide': commerceGuide as unknown as CareerPageContent,
    'arts-humanities-guide': artsHumanitiesGuide as unknown as CareerPageContent,
    'parents-corner': parentsCorner as unknown as CareerPageContent,
};

/**
 * slug -> Hindi page content. Only slugs that actually have a `<id>.hi.json`
 * file appear here; `getCareerPageHi` returns undefined for the rest so callers
 * can fall back to the English manifest entry.
 */
export const careerPagesHi: Record<string, CareerPageContent> = {
    'class10-stream-selection-guide': class10StreamSelectionGuideHi as unknown as CareerPageContent,
    'entrance-exam-calendar-2026-27': entranceExamCalendarHi as unknown as CareerPageContent,
    'scholarships-and-education-finance': scholarshipsAndEducationFinanceHi as unknown as CareerPageContent,
    'top-colleges-and-institutes': topCollegesAndInstitutesHi as unknown as CareerPageContent,
    'career-counselling-workshops': careerCounsellingWorkshopsHi as unknown as CareerPageContent,
    'pcm-engineering-guide': pcmEngineeringGuideHi as unknown as CareerPageContent,
    'pcb-medical-guide': pcbMedicalGuideHi as unknown as CareerPageContent,
    'commerce-guide': commerceGuideHi as unknown as CareerPageContent,
    'arts-humanities-guide': artsHumanitiesGuideHi as unknown as CareerPageContent,
    'parents-corner': parentsCornerHi as unknown as CareerPageContent,
};

/** Look up a page's Hindi content by slug; undefined when there is no Hindi file. */
export function getCareerPageHi(slug: string): CareerPageContent | undefined {
    return careerPagesHi[slug];
}

/**
 * Look up a page's content by slug in the requested language.
 * Hindi falls back to the English content when no Hindi file exists.
 */
export function getCareerPage(slug: string, lang: CareerLang = 'en'): CareerPageContent | undefined {
    if (lang === 'hi') return careerPagesHi[slug] ?? careerPages[slug];
    return careerPages[slug];
}

/** The four stream guides, in the order declared by the manifest, for a language. */
export function getStreamGuides(
    lang: CareerLang = 'en',
): Array<{ id: string; content: CareerPageContent }> {
    const out: Array<{ id: string; content: CareerPageContent }> = [];
    for (const id of STREAM_GUIDE_IDS) {
        const content = getCareerPage(id, lang);
        if (content) out.push({ id, content });
    }
    return out;
}
