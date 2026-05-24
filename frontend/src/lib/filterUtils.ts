import type { FilterState } from '@/components/FilterBar/FilterBar';

export const VALID_CLASSES = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
export const VALID_SUBJECTS = ['all', 'Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 'Sanskrit', 'Physics', 'Biology', 'CS/IP', 'Accountancy', 'General', 'EVS'];
export const VALID_TYPES = ['all', 'pdf', 'document', 'link', 'format'];

export const DEFAULT_FILTERS: FilterState = { class: 'all', subject: 'all', type: 'all', search: '' };

export function sanitizeString(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, 200);
}

export function filtersToSearchParams(filters: FilterState): URLSearchParams {
    const params = new URLSearchParams();
    if (filters.class !== 'all') params.set('class', filters.class);
    if (filters.subject !== 'all') params.set('subject', filters.subject);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.search) params.set('q', filters.search);
    return params;
}

export function searchParamsToFilters(params: URLSearchParams): FilterState {
    const cls = params.get('class') || '';
    const subject = params.get('subject') || '';
    const type = params.get('type') || '';
    const search = params.get('q') || '';

    return {
        class: VALID_CLASSES.includes(cls) ? cls : 'all',
        subject: VALID_SUBJECTS.includes(subject) ? subject : 'all',
        type: VALID_TYPES.includes(type) ? type : 'all',
        search: sanitizeString(search),
    };
}


