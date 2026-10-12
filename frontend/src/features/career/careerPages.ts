/**
 * Registry of finalized career page content.
 *
 * Every file here is the *verbatim* content authored by the Career Counselling
 * Agent (Drive `career-pages/<id>.json`, copied into `src/data/career-pages/`).
 * Nothing in this module rewrites or summarises that content.
 *
 * The dynamic route `/career-counselling/$slug` looks a slug up in this map.
 */
import type { CareerPageContent } from './types';

import class10StreamSelectionGuide from '@/data/career-pages/class10-stream-selection-guide.json';
import entranceExamCalendar from '@/data/career-pages/entrance-exam-calendar-2026-27.json';
import scholarshipsAndEducationFinance from '@/data/career-pages/scholarships-and-education-finance.json';
import topCollegesAndInstitutes from '@/data/career-pages/top-colleges-and-institutes.json';
import careerCounsellingWorkshops from '@/data/career-pages/career-counselling-workshops.json';
import pcmEngineeringGuide from '@/data/career-pages/pcm-engineering-guide.json';
import pcbMedicalGuide from '@/data/career-pages/pcb-medical-guide.json';
import commerceGuide from '@/data/career-pages/commerce-guide.json';
import artsHumanitiesGuide from '@/data/career-pages/arts-humanities-guide.json';

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

/** slug -> page content. Indexing may return undefined for an unknown slug. */
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
};

/** Look up a page's content by slug. */
export function getCareerPage(slug: string): CareerPageContent | undefined {
    return careerPages[slug];
}

/** The four stream guides, in the order declared by the manifest. */
export function getStreamGuides(): Array<{ id: string; content: CareerPageContent }> {
    const out: Array<{ id: string; content: CareerPageContent }> = [];
    for (const id of STREAM_GUIDE_IDS) {
        const content = getCareerPage(id);
        if (content) out.push({ id, content });
    }
    return out;
}
