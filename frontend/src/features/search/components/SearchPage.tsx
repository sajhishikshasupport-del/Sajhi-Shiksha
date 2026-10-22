import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { SearchIcon } from '@/components/Icons';
import { useNavigate } from '@tanstack/react-router';
import { getAllResources } from '@/lib/resourceAggregator';
import SearchInput from '@/components/SearchBar/SearchInput';
import FilterBar, { type FilterState } from '@/components/FilterBar/FilterBar';
import ResourceCard from '@/components/ResourceCard/ResourceCard';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import type { Resource } from '@/types';
import { FONT_HEADING, FONT_MONO, MAX_CONTENT_WIDTH } from '@/lib/constants';
import { filtersToSearchParams } from '@/lib/filterUtils';
import { trackEvent } from '@/hooks/useAnalytics';

interface SearchPageProps {
    initialFilters: FilterState;
    onViewResource: (id: string) => void;
    onNavigate: (route: string) => void;
}

const MAX_RECENT = 5;

// Synonym groups: terms treated as equivalent during search (helps Hinglish words + abbreviations).
const SYNONYM_GROUPS: string[][] = [
    ['maths', 'mathematics', 'math', 'ganit'],
    ['science', 'vigyan', 'evs', 'environmental studies'],
    ['english', 'angrezi'],
    ['hindi'],
    ['question paper', 'question papers', 'qp', 'pyq', 'previous year', 'previous years', 'past year', 'past years', 'past paper', 'past papers', 'question bank'],
    ['half yearly', 'half-yearly', 'mid term', 'midterm'],
    ['session ending', 'annual', 'annual exam', 'final exam', 'year end'],
    ['periodic test', 'unit test', 'monthly test'],
    ['pre board', 'pre-board', 'preboard'],
    ['sample paper', 'sample papers', 'sqp', 'sample question paper'],
    ['worksheet', 'worksheets'],
    ['lesson plan', 'lesson plans'],
    ['circular', 'circulars', 'notification', 'notifications'],
    ['admission', 'admissions'],
    ['syllabus', 'curriculum'],
    ['lab manual', 'lab activity', 'lab activities', 'maths lab'],
    ['olympiad', 'ioqm', 'prmo', 'rmo', 'imo'],
    ['answer key', 'marking scheme', 'solutions'],
    ['holiday homework', 'homework'],
    ['time table', 'timetable'],
];

const SYNONYMS: Map<string, string[]> = (() => {
    const map = new Map<string, string[]>();
    for (const group of SYNONYM_GROUPS) {
        for (const term of group) {
            const set = new Set([...(map.get(term) ?? []), ...group]);
            map.set(term, Array.from(set));
        }
    }
    return map;
})();

// A term plus its synonyms and a simple plural/singular variant.
function expandTerm(term: string): string[] {
    const t = term.toLowerCase().trim();
    if (!t) return [];
    const variants = new Set<string>([t]);
    for (const s of SYNONYMS.get(t) ?? []) variants.add(s);
    variants.add(t.endsWith('s') ? t.slice(0, -1) : t + 's');
    return Array.from(variants).filter(Boolean);
}

function termMatches(haystack: string, term: string): boolean {
    return expandTerm(term).some((v) => haystack.includes(v));
}

// Suggest likely-intended queries when a search returns nothing.
function getSuggestions(query: string): string[] {
    const base = ['Mathematics', 'Question Papers', 'Class 6', 'Circulars'];
    const q = (query || '').toLowerCase().trim();
    const out: string[] = [];
    if (q) {
        for (const [term, syns] of SYNONYMS.entries()) {
            if (q.includes(term) || term.includes(q)) {
                for (const s of syns) {
                    const pretty = s.replace(/\b\w/g, (c) => c.toUpperCase());
                    if (!out.includes(pretty)) out.push(pretty);
                }
            }
        }
    }
    for (const b of base) if (!out.includes(b)) out.push(b);
    return out.slice(0, 5);
}

function getRecentSearches(): string[] {
    try {
        const stored = localStorage.getItem('recentSearches');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(query: string): void {
    if (!query.trim()) return;
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, MAX_RECENT);
    try {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
        // Storage full or unavailable
    }
}

function scoreResource(resource: Resource, query: string): number {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const title = resource.title.toLowerCase();
    const description = resource.description.toLowerCase();
    const category = resource.category.toLowerCase();
    const subject = (resource.subject ?? '').toLowerCase();
    let score = 0;

    for (const term of terms) {
        if (termMatches(title, term)) score += 5;
        if (termMatches(description, term)) score += 3;
        if (termMatches(category, term)) score += 1;
        if (termMatches(subject, term)) score += 1;
    }

    return score;
}

export default function SearchPage({
    initialFilters,
    onViewResource,
    onNavigate,
}: SearchPageProps) {
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const hasSearched = initialFilters.search !== '' || initialFilters.class !== 'all' || initialFilters.subject !== 'all' || initialFilters.type !== 'all';

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    const allResources = useMemo(() => getAllResources(), []);

    const results = useMemo(() => {
        if (!hasSearched) return { items: [] as Resource[], relaxed: false };

        let filtered = allResources;
        let relaxed = false;

        if (filters.search) {
            const terms = filters.search.toLowerCase().split(/\s+/).filter(Boolean);
            const haystackOf = (r: Resource) =>
                `${r.title} ${r.description} ${r.category} ${r.subject ?? ''}`.toLowerCase();

            // First try a strict match (every term must match, synonyms included).
            const strict = filtered.filter((r) => {
                const haystack = haystackOf(r);
                return terms.every((term) => termMatches(haystack, term));
            });

            if (strict.length > 0) {
                filtered = strict;
            } else {
                // Softer match (any term) so a typo or an extra word doesn't dead-end.
                relaxed = true;
                filtered = filtered.filter((r) => {
                    const haystack = haystackOf(r);
                    return terms.some((term) => termMatches(haystack, term));
                });
            }

            filtered = filtered
                .map((r) => ({ resource: r, score: scoreResource(r, filters.search) }))
                .filter(({ score }) => score > 0)
                .sort((a, b) => b.score - a.score)
                .map(({ resource }) => resource);
        }

        if (filters.class !== 'all') {
            filtered = filtered.filter((r) => r.class === parseInt(filters.class, 10));
        }
        if (filters.subject !== 'all') {
            filtered = filtered.filter((r) => r.subject === filters.subject);
        }
        if (filters.type !== 'all') {
            filtered = filtered.filter((r) => r.type === filters.type);
        }

        return { items: filtered, relaxed };
    }, [allResources, filters, hasSearched]);

    const syncFiltersToUrl = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        const params = filtersToSearchParams(newFilters);
        navigate({
            to: '/search',
            search: Object.fromEntries(params),
            replace: true,
        });
    }, [navigate]);

    const handleSearch = useCallback((value: string) => {
        const newFilters = { ...filters, search: value };
        syncFiltersToUrl(newFilters);
        if (value.trim()) {
            saveRecentSearch(value.trim());
            trackEvent('search', { search_term: value.trim() });
        }
    }, [filters, syncFiltersToUrl]);

    useEffect(() => {
        if (!hasSearched || !filters.search) return;
        trackEvent('search_results', { search_term: filters.search, result_count: results.items.length });
    }, [hasSearched, filters.search, results.items.length]);

    const handleFilterChange = useCallback((newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
        const resolved = typeof newFilters === 'function' ? newFilters(filters) : newFilters;
        if (resolved.class !== filters.class) {
            trackEvent('filter_use', { filter_name: 'class', filter_value: resolved.class });
        }
        if (resolved.subject !== filters.subject) {
            trackEvent('filter_use', { filter_name: 'subject', filter_value: resolved.subject });
        }
        if (resolved.type !== filters.type) {
            trackEvent('filter_use', { filter_name: 'type', filter_value: resolved.type });
        }
        syncFiltersToUrl(resolved);
    }, [filters, syncFiltersToUrl]);

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };


    const recentSearches = getRecentSearches();

    return (
        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Breadcrumb
                items={[{ label: 'Search' }]}
                onNavigate={onNavigate}
            />

            <Typography
                sx={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    mb: 3,
                }}
            >
                Search Resources
            </Typography>

            <Box sx={{ mb: 3 }}>
                <SearchInput
                    value={filters.search}
                    onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
                    onSearch={handleSearch}
                    autoFocus
                />
            </Box>

            {!hasSearched && recentSearches.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: FONT_MONO,
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                            mb: 1,
                        }}
                    >
                        Recent Searches
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {recentSearches.map((search) => (
                            <Chip
                                key={search}
                                label={search}
                                onClick={() => handleSearch(search)}
                                clickable
                                sx={{
                                    border: `2px solid var(--color-border)`,
                                    boxShadow: `2px 2px 0px var(--color-shadow)`,
                                    fontFamily: FONT_MONO,
                                    fontWeight: 600,
                                    bgcolor: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {hasSearched && (
                <>
                    <FilterBar filters={filters} onFilterChange={handleFilterChange} />

                    <Box sx={{ mt: 3, mb: 2 }}>
                        {filters.search ? (
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {results.items.length} result{results.items.length !== 1 ? 's' : ''} for "{filters.search}"
                            </Typography>
                        ) : (
                            <Typography
                                sx={{
                                    fontFamily: FONT_MONO,
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {results.items.length} resource{results.items.length !== 1 ? 's' : ''}
                            </Typography>
                        )}
                    </Box>

                    {results.relaxed && results.items.length > 0 && (
                        <Typography
                            sx={{
                                fontFamily: FONT_MONO,
                                fontSize: '0.8rem',
                                color: 'var(--color-text-secondary)',
                                mb: 2,
                            }}
                        >
                            Exact match nahi mila — nazdeeki results dikha rahe hain. Spelling ya kam shabd try karein.
                        </Typography>
                    )}
                </>
            )}

            {!hasSearched ? (
                <Box
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid var(--color-border)`,
                        boxShadow: `4px 4px 0px var(--color-shadow)`,
                    }}
                >
                    <SearchIcon sx={{ fontSize: 48, color: 'var(--color-text-secondary)', mb: 2 }} />
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        Search for study materials
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Type keywords like "mathematics", "class 3", or "question papers"
                    </Typography>
                </Box>
            ) : results.items.length === 0 ? (
                <Box
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        bgcolor: 'var(--color-bg)',
                        border: `3px solid var(--color-border)`,
                        boxShadow: `4px 4px 0px var(--color-shadow)`,
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <SearchIcon sx={{ fontSize: 64, color: 'var(--color-text-secondary)', mb: 2 }} />
                    <Typography
                        sx={{
                            fontFamily: FONT_HEADING,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            mb: 1,
                        }}
                    >
                        No results found
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', mb: 3 }}>
                        Try different keywords or remove some filters
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', mb: 1 }}>
                        Try one of these:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                        {getSuggestions(filters.search).map((term) => (
                            <Chip
                                key={term}
                                label={term}
                                onClick={() => handleSearch(term)}
                                clickable
                                sx={{
                                    border: `2px solid var(--color-border)`,
                                    boxShadow: `2px 2px 0px var(--color-shadow)`,
                                    fontFamily: FONT_MONO,
                                    fontWeight: 600,
                                    bgcolor: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                }}
                            />
                        ))}
                    </Box>
                    <Typography sx={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', mb: 1 }}>
                        Ya browse karein:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Class 6-12 Maths', q: 'mathematics' },
                            { label: 'Question Papers', q: 'question paper' },
                            { label: 'Circulars / Formats', q: 'circular' },
                        ].map((item) => (
                            <Chip
                                key={item.label}
                                label={item.label}
                                onClick={() => handleSearch(item.q)}
                                clickable
                                sx={{
                                    border: `2px solid var(--color-border)`,
                                    boxShadow: `2px 2px 0px var(--color-shadow)`,
                                    fontFamily: FONT_MONO,
                                    fontWeight: 600,
                                    bgcolor: 'var(--color-yellow)',
                                    color: '#1A1A1A',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {results.items.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            viewMode="grid"
                            onView={onViewResource}
                            onDownload={handleDownload}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
